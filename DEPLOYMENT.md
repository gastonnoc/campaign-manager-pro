# Campaign Manager Pro - AWS Deployment Guide

Complete guide for deploying the Campaign Manager Pro application to AWS.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ and npm installed
- Python 3.11+ installed
- Git installed

## Architecture Overview

\`\`\`
┌─────────────────┐
│   CloudFront    │ ← Frontend Distribution
└────────┬────────┘
         │
┌────────▼────────┐
│   S3 Bucket     │ ← Static Frontend (Next.js build)
└─────────────────┘

┌─────────────────┐
│  API Gateway    │ ← RESTful API Endpoints
└────────┬────────┘
         │
    ┌────┴─────┬─────────┬─────────┬─────────┐
    │          │         │         │         │
┌───▼───┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
│Create │  │List │  │Get  │  │Update│  │Delete│
│Lambda │  │Lambda│  │Lambda│  │Lambda│  │Lambda│
└───┬───┘  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
    │         │        │        │        │
    └─────────┴────────┴────────┴────────┘
                       │
              ┌────────▼────────┐
              │   DynamoDB      │ ← Campaign Data Storage
              └─────────────────┘

              ┌─────────────────┐
              │   S3 Bucket     │ ← Campaign Assets (logos, PDFs)
              └─────────────────┘
\`\`\`

## Step-by-Step Deployment

### Step 1: Deploy Infrastructure with CloudFormation

\`\`\`bash
# Navigate to infrastructure folder
cd infrastructure

# Create the CloudFormation stack
aws cloudformation create-stack \
  --stack-name campaign-manager-pro-dev \
  --template-body file://cloudformation-template.yaml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=dev \
               ParameterKey=ProjectName,ParameterValue=campaign-manager-pro \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# Wait for stack creation (takes 5-10 minutes)
aws cloudformation wait stack-create-complete \
  --stack-name campaign-manager-pro-dev \
  --region us-east-1

# Get the outputs
aws cloudformation describe-stacks \
  --stack-name campaign-manager-pro-dev \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'
\`\`\`

Save the outputs (API URL, bucket names, etc.) - you'll need them later.

### Step 2: Initialize DynamoDB Table

\`\`\`bash
# Navigate to scripts folder
cd scripts

# Install Python dependencies
pip install -r requirements.txt

# Create the table structure (if not using CloudFormation's auto-creation)
python create_table_dynamodb.py

# Optional: Seed with sample data
python seed_sample_data.py
\`\`\`

### Step 3: Deploy Lambda Functions

\`\`\`bash
# Still in scripts folder
cd scripts

# Create deployment package
pip install -r requirements.txt -t ./package
cp lambda_functions.py ./package/
cd package
zip -r ../lambda-deployment.zip .
cd ..

# Deploy to each Lambda function
aws lambda update-function-code \
  --function-name campaign-manager-pro-create-dev \
  --zip-file fileb://lambda-deployment.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name campaign-manager-pro-list-dev \
  --zip-file fileb://lambda-deployment.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name campaign-manager-pro-get-dev \
  --zip-file fileb://lambda-deployment.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name campaign-manager-pro-update-dev \
  --zip-file fileb://lambda-deployment.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name campaign-manager-pro-delete-dev \
  --zip-file fileb://lambda-deployment.zip \
  --region us-east-1

aws lambda update-function-code \
  --function-name campaign-manager-pro-upload-dev \
  --zip-file fileb://lambda-deployment.zip \
  --region us-east-1
\`\`\`

### Step 4: Configure Environment Variables

\`\`\`bash
# Set environment variables for each Lambda function
FUNCTIONS=(
  "campaign-manager-pro-create-dev"
  "campaign-manager-pro-list-dev"
  "campaign-manager-pro-get-dev"
  "campaign-manager-pro-update-dev"
  "campaign-manager-pro-delete-dev"
  "campaign-manager-pro-upload-dev"
)

TABLE_NAME="campaign-manager-pro-campaigns-dev"
BUCKET_NAME="campaign-manager-pro-assets-dev"

for FUNC in "${FUNCTIONS[@]}"; do
  aws lambda update-function-configuration \
    --function-name $FUNC \
    --environment "Variables={DYNAMODB_TABLE_NAME=$TABLE_NAME,S3_BUCKET_NAME=$BUCKET_NAME,ENVIRONMENT=dev}" \
    --region us-east-1
done
\`\`\`

### Step 5: Test API Endpoints

\`\`\`bash
# Get your API Gateway URL from CloudFormation outputs
API_URL="https://xxxxx.execute-api.us-east-1.amazonaws.com/dev"

# Test: List campaigns (should return empty array initially)
curl -X GET "$API_URL/campaigns"

# Test: Create a campaign
curl -X POST "$API_URL/campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nintendo_supermario_Wetransfer_Jan_Brazil",
    "customer": "Africa - Brazil - Omnicom",
    "brandAdvertiser": "Nintendo",
    "campaignMotto": "SuperMario",
    "organizationPublisher": "Wetransfer",
    "market": "Brazil",
    "salesPerson": "Carla Rodriguez",
    "month": "Jan",
    "investment": 10236.82,
    "cost": 4677.40,
    "hiddenCost": -1536.86,
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "status": "Active",
    "lines": []
  }'

# Test: Get all campaigns (should return the created campaign)
curl -X GET "$API_URL/campaigns"
\`\`\`

### Step 6: Build and Deploy Frontend

\`\`\`bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create .env.local with API URL
echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.local

# Build Next.js application
npm run build

# Export static files
npx next export -o out

# Deploy to S3
FRONTEND_BUCKET="campaign-manager-pro-frontend-dev"
aws s3 sync out/ s3://$FRONTEND_BUCKET --delete

# Invalidate CloudFront cache (if using CloudFront)
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name campaign-manager-pro-dev \
  --region us-east-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomain`].OutputValue' \
  --output text | cut -d'.' -f1)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
\`\`\`

### Step 7: Setup CI/CD with GitHub Actions

\`\`\`bash
# Add GitHub Secrets (in your GitHub repository settings)
# Go to: Settings > Secrets and variables > Actions

# Required secrets:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - API_GATEWAY_URL (from CloudFormation output)
# - S3_BUCKET_NAME (frontend bucket)
# - CLOUDFRONT_DISTRIBUTION_ID (from CloudFormation output)
# - CLOUDFRONT_DOMAIN (from CloudFormation output)

# Commit and push to trigger deployment
git add .
git commit -m "Deploy Campaign Manager Pro"
git push origin main
\`\`\`

## Step 8: Verify Deployment

1. **Test Frontend**: Visit your CloudFront URL
2. **Test API**: Use the API documentation at `/openapi.yaml`
3. **Create a Campaign**: Use the UI to create a test campaign
4. **Upload a File**: Test file upload functionality
5. **Check DynamoDB**: Verify data in AWS Console

## Environment Variables Reference

### Lambda Functions
- `DYNAMODB_TABLE_NAME` - DynamoDB table name
- `S3_BUCKET_NAME` - S3 bucket for assets
- `ENVIRONMENT` - Environment name (dev/staging/prod)

### Frontend (Next.js)
- `NEXT_PUBLIC_API_URL` - API Gateway endpoint URL

## Cost Estimation (AWS)

Based on moderate usage (1000 requests/day):

- **API Gateway**: ~$3.50/month
- **Lambda**: ~$5.00/month (with free tier)
- **DynamoDB**: ~$2.50/month (with free tier)
- **S3**: ~$1.00/month
- **CloudFront**: ~$5.00/month
- **Total**: ~$17/month

## Troubleshooting

### Lambda Functions Not Working

\`\`\`bash
# Check Lambda logs
aws logs tail /aws/lambda/campaign-manager-pro-create-dev --follow

# Test Lambda directly
aws lambda invoke \
  --function-name campaign-manager-pro-list-dev \
  --region us-east-1 \
  response.json

cat response.json
\`\`\`

### API Gateway 403 Errors

- Check CORS configuration in API Gateway
- Verify Lambda permissions
- Check CloudWatch logs

### DynamoDB Access Denied

- Verify IAM role has correct permissions
- Check table name in environment variables

### Frontend Not Loading

- Check S3 bucket policy (must allow public read)
- Verify CloudFront distribution is deployed
- Check API URL in environment variables

## Monitoring and Maintenance

### CloudWatch Dashboards

\`\`\`bash
# View Lambda metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=campaign-manager-pro-create-dev \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Sum
\`\`\`

### Enable X-Ray Tracing

\`\`\`bash
# Enable X-Ray for Lambda functions
aws lambda update-function-configuration \
  --function-name campaign-manager-pro-create-dev \
  --tracing-config Mode=Active
\`\`\`

## Security Best Practices

1. **API Authentication**: Add API Key or JWT authentication
2. **S3 Bucket Security**: Enable versioning and encryption
3. **DynamoDB**: Enable point-in-time recovery
4. **CloudFront**: Use HTTPS only
5. **IAM**: Use least privilege principle
6. **Secrets**: Use AWS Secrets Manager for sensitive data

## Cleanup (Delete All Resources)

\`\`\`bash
# Delete CloudFormation stack (deletes most resources)
aws cloudformation delete-stack \
  --stack-name campaign-manager-pro-dev \
  --region us-east-1

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name campaign-manager-pro-dev \
  --region us-east-1

# Empty and delete S3 buckets (if not auto-deleted)
aws s3 rm s3://campaign-manager-pro-frontend-dev --recursive
aws s3 rb s3://campaign-manager-pro-frontend-dev

aws s3 rm s3://campaign-manager-pro-assets-dev --recursive
aws s3 rb s3://campaign-manager-pro-assets-dev
\`\`\`

## Next Steps

1. Add authentication (AWS Cognito or Auth0)
2. Implement rate limiting
3. Add monitoring and alerting
4. Setup staging and production environments
5. Implement automated testing in CI/CD
6. Add caching layer (ElastiCache)
7. Implement backup strategy

## Support

For issues or questions:
- Check CloudWatch Logs
- Review API documentation in `openapi.yaml`
- Check GitHub Issues
