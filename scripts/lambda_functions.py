"""
AWS Lambda Functions for Campaign Manager Pro
This file contains the Lambda functions you can deploy to AWS.

Required configuration:
- Python 3.11 or higher
- boto3 (AWS SDK for Python)
- Environment variables: DYNAMODB_TABLE_NAME, S3_BUCKET_NAME

For use with DynamoDB, make sure you have a table with:
- Partition key: id (String)
"""

import json
import boto3
import os
from decimal import Decimal
from datetime import datetime
from typing import Dict, Any

# Configuration
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('DYNAMODB_TABLE_NAME', 'campaigns')
table = dynamodb.Table(table_name)
s3_client = boto3.client('s3')
bucket_name = os.environ.get('S3_BUCKET_NAME', 'campaign-assets')

def calculate_gross_margin(investment: float, cost: float, hidden_cost: float) -> float:
    """Calculate gross margin: investment - cost - hidden_cost"""
    return investment - cost - hidden_cost


def calculate_margin_percentage(margin: float, investment: float) -> float:
    """Calculate margin percentage: (margin / investment) * 100"""
    if investment == 0:
        return 0
    return (margin / investment) * 100


def decimal_default(obj):
    """Helper to serialize Decimal to JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Main handler that routes requests based on HTTP method and path
    """
    http_method = event['httpMethod']
    path = event['path']
    
    try:
        # POST /campaigns - Create campaign
        if http_method == 'POST' and path == '/campaigns':
            return create_campaign_handler(event, context)
        
        # GET /campaigns - List all campaigns
        elif http_method == 'GET' and path == '/campaigns':
            return get_campaigns_handler(event, context)
        
        # GET /campaigns/{id} - Get a campaign
        elif http_method == 'GET' and '/campaigns/' in path:
            return get_campaign_handler(event, context)
        
        # PUT /campaigns/{id} - Update campaign
        elif http_method == 'PUT' and '/campaigns/' in path:
            return update_campaign_handler(event, context)
        
        # DELETE /campaigns/{id} - Delete campaign
        elif http_method == 'DELETE' and '/campaigns/' in path:
            return delete_campaign_handler(event, context)
        
        # POST /uploads - Upload campaign assets to S3
        elif http_method == 'POST' and path == '/uploads':
            return upload_file_handler(event, context)
        
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Route not found'})
            }
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }


def create_campaign(event: Dict[str, Any]) -> Dict[str, Any]:
    """POST /campaigns - Create a new campaign"""
    body = json.loads(event['body'])
    
    # Validations
    required_fields = ['name', 'customer', 'brandAdvertiser', 'organizationPublisher',
                      'market', 'salesPerson', 'month', 'investment', 'cost',
                      'startDate', 'endDate', 'status']
    for field in required_fields:
        if field not in body:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Required field: {field}'})
            }
    
    if body['investment'] <= 0:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Investment must be greater than 0'})
        }
    
    # Create campaign
    campaign_id = str(int(datetime.now().timestamp() * 1000))
    hidden_cost = body.get('hiddenCost', 0)
    gross_margin = calculate_gross_margin(body['investment'], body['cost'], hidden_cost)
    margin_percentage = calculate_margin_percentage(gross_margin, body['investment'])
    now = datetime.now().isoformat()
    
    # Process lines if provided
    lines = []
    if 'lines' in body and body['lines']:
        for idx, line in enumerate(body['lines']):
            line_investment = line['units'] * line['unitCost']
            line_margin = calculate_margin_percentage(line_investment - body['cost'], line_investment)
            lines.append({
                'id': f"{campaign_id}-line-{idx}",
                'publisher': line.get('publisher', ''),
                'market': line.get('market', body['market']),
                'format': line.get('format', 'Video'),
                'units': line['units'],
                'unitCost': Decimal(str(line['unitCost'])),
                'investment': Decimal(str(line_investment)),
                'margin': Decimal(str(line_margin))
            })
    
    campaign = {
        'id': campaign_id,
        'name': body['name'],
        'customer': body['customer'],
        'brandAdvertiser': body['brandAdvertiser'],
        'campaignMotto': body.get('campaignMotto', ''),
        'organizationPublisher': body['organizationPublisher'],
        'market': body['market'],
        'salesPerson': body['salesPerson'],
        'month': body['month'],
        'investment': Decimal(str(body['investment'])),
        'hiddenCost': Decimal(str(hidden_cost)),
        'cost': Decimal(str(body['cost'])),
        'grossMargin': Decimal(str(gross_margin)),
        'grossMarginPercentage': Decimal(str(margin_percentage)),
        'lines': lines,
        'startDate': body['startDate'],
        'endDate': body['endDate'],
        'status': body['status'],
        'createdAt': now,
        'updatedAt': now
    }
    
    table.put_item(Item=campaign)
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(campaign, default=decimal_default)
    }


def get_all_campaigns(event: Dict[str, Any]) -> Dict[str, Any]:
    """GET /campaigns - Get all campaigns"""
    response = table.scan()
    campaigns = response.get('Items', [])
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(campaigns, default=decimal_default)
    }


def get_campaign(campaign_id: str) -> Dict[str, Any]:
    """GET /campaigns/{id} - Get a campaign by ID"""
    response = table.get_item(Key={'id': campaign_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Campaign not found'})
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(response['Item'], default=decimal_default)
    }


def update_campaign(campaign_id: str, event: Dict[str, Any]) -> Dict[str, Any]:
    """PUT /campaigns/{id} - Update a campaign"""
    body = json.loads(event['body'])
    
    # Verify campaign exists
    response = table.get_item(Key={'id': campaign_id})
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Campaign not found'})
        }
    
    campaign = response['Item']
    
    # Update fields
    if 'name' in body:
        campaign['name'] = body['name']
    if 'customer' in body:
        campaign['customer'] = body['customer']
    if 'brandAdvertiser' in body:
        campaign['brandAdvertiser'] = body['brandAdvertiser']
    if 'campaignMotto' in body:
        campaign['campaignMotto'] = body['campaignMotto']
    if 'organizationPublisher' in body:
        campaign['organizationPublisher'] = body['organizationPublisher']
    if 'market' in body:
        campaign['market'] = body['market']
    if 'salesPerson' in body:
        campaign['salesPerson'] = body['salesPerson']
    if 'month' in body:
        campaign['month'] = body['month']
    if 'investment' in body:
        campaign['investment'] = Decimal(str(body['investment']))
    if 'hiddenCost' in body:
        campaign['hiddenCost'] = Decimal(str(body['hiddenCost']))
    if 'cost' in body:
        campaign['cost'] = Decimal(str(body['cost']))
    if 'lines' in body:
        lines = []
        for idx, line in enumerate(body['lines']):
            line_investment = line['units'] * line['unitCost']
            line_margin = calculate_margin_percentage(line_investment - float(campaign['cost']), line_investment)
            lines.append({
                'id': f"{campaign_id}-line-{idx}",
                'publisher': line.get('publisher', ''),
                'market': line.get('market', campaign['market']),
                'format': line.get('format', 'Video'),
                'units': line['units'],
                'unitCost': Decimal(str(line['unitCost'])),
                'investment': Decimal(str(line_investment)),
                'margin': Decimal(str(line_margin))
            })
        campaign['lines'] = lines
    if 'startDate' in body:
        campaign['startDate'] = body['startDate']
    if 'endDate' in body:
        campaign['endDate'] = body['endDate']
    if 'status' in body:
        campaign['status'] = body['status']
    
    # Recalculate margin
    gross_margin = calculate_gross_margin(
        float(campaign['investment']),
        float(campaign['cost']),
        float(campaign.get('hiddenCost', 0))
    )
    margin_percentage = calculate_margin_percentage(gross_margin, float(campaign['investment']))
    
    campaign['grossMargin'] = Decimal(str(gross_margin))
    campaign['grossMarginPercentage'] = Decimal(str(margin_percentage))
    campaign['updatedAt'] = datetime.now().isoformat()
    
    table.put_item(Item=campaign)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(campaign, default=decimal_default)
    }


def delete_campaign(campaign_id: str) -> Dict[str, Any]:
    """DELETE /campaigns/{id} - Delete a campaign"""
    # Verify it exists
    response = table.get_item(Key={'id': campaign_id})
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Campaign not found'})
        }
    
    table.delete_item(Key={'id': campaign_id})
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Campaign deleted successfully'})
    }


def upload_file_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    POST /uploads - Upload campaign assets to S3
    Handles file uploads for logos, PDFs, and other campaign materials
    """
    import base64
    
    try:
        # Parse request body
        if event.get('isBase64Encoded'):
            body = json.loads(base64.b64decode(event['body']))
        else:
            body = json.loads(event['body'])
        
        file_content = base64.b64decode(body['fileContent'])
        file_name = body['fileName']
        file_type = body.get('fileType', 'other')
        campaign_id = body.get('campaignId', 'general')
        content_type = body.get('contentType', 'application/octet-stream')
        
        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024
        if len(file_content) > max_size:
            return {
                'statusCode': 413,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'File too large. Maximum size is 10MB'})
            }
        
        # Validate file type
        allowed_types = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf', 'image/svg+xml'
        ]
        
        if content_type not in allowed_types:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid file type'})
            }
        
        # Generate S3 key
        timestamp = int(datetime.now().timestamp() * 1000)
        s3_key = f"{file_type}/{campaign_id}/{timestamp}-{file_name}"
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=s3_key,
            Body=file_content,
            ContentType=content_type,
            Metadata={
                'campaign-id': campaign_id,
                'file-type': file_type
            }
        )
        
        # Generate presigned URL (valid for 7 days)
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': s3_key},
            ExpiresIn=604800
        )
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'url': url,
                'key': s3_key,
                'size': len(file_content),
                'contentType': content_type
            })
        }
        
    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Missing required field: {str(e)}'})
        }
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Upload failed'})
        }


# Individual handlers for API Gateway routes
def create_campaign_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Handler for POST /campaigns"""
    return create_campaign(event)


def get_campaigns_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Handler for GET /campaigns"""
    return get_all_campaigns(event)


def get_campaign_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Handler for GET /campaigns/{id}"""
    campaign_id = event['pathParameters']['id']
    return get_campaign(campaign_id)


def update_campaign_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Handler for PUT /campaigns/{id}"""
    campaign_id = event['pathParameters']['id']
    return update_campaign(campaign_id, event)


def delete_campaign_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Handler for DELETE /campaigns/{id}"""
    campaign_id = event['pathParameters']['id']
    return delete_campaign(campaign_id)
