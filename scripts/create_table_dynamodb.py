"""
Script para crear la tabla de DynamoDB
Ejecuta este script para crear la tabla necesaria en DynamoDB
"""

import boto3

def create_campaigns_table():
    """Crea la tabla de campañas en DynamoDB"""
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    
    table = dynamodb.create_table(
        TableName='campaigns',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'  # Partition key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'
            }
        ],
        BillingMode='PAY_PER_REQUEST'  # On-demand pricing
    )
    
    # Esperar a que la tabla se cree
    table.wait_until_exists()
    
    print(f"Tabla '{table.table_name}' creada exitosamente!")
    print(f"Estado: {table.table_status}")
    return table

if __name__ == '__main__':
    create_campaigns_table()
