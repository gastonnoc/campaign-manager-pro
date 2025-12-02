# Campaign Manager Pro - API Examples

Complete examples for testing all API endpoints.

## Base URL

\`\`\`
Development: https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
Production: https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
Local: http://localhost:3000/api
\`\`\`

## Authentication

Currently no authentication required. For production, add API Key:

\`\`\`bash
curl -H "X-API-Key: your-api-key" https://api.example.com/campaigns
\`\`\`

## Endpoints

### 1. Create Campaign

**POST /campaigns**

\`\`\`bash
curl -X POST https://your-api.execute-api.us-east-1.amazonaws.com/dev/campaigns \
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
    "lines": [
      {
        "publisher": "We Transfer",
        "market": "Brazil",
        "format": "Video",
        "units": 68820,
        "unitCost": 0.15
      }
    ]
  }'
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "1704067200000",
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
  "grossMargin": 7096.28,
  "grossMarginPercentage": 69.32,
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "status": "Active",
  "lines": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
\`\`\`

### 2. List All Campaigns

**GET /campaigns**

\`\`\`bash
curl -X GET https://your-api.execute-api.us-east-1.amazonaws.com/dev/campaigns
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "1704067200000",
    "name": "Nintendo_supermario_Wetransfer_Jan_Brazil",
    "customer": "Africa - Brazil - Omnicom",
    "grossMargin": 7096.28,
    "grossMarginPercentage": 69.32,
    "status": "Active",
    ...
  },
  {
    "id": "1704153600000",
    "name": "Coca_Cola_Summer_Meta_Feb_USA",
    ...
  }
]
\`\`\`

### 3. Get Campaign by ID

**GET /campaigns/{id}**

\`\`\`bash
curl -X GET https://your-api.execute-api.us-east-1.amazonaws.com/dev/campaigns/1704067200000
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "1704067200000",
  "name": "Nintendo_supermario_Wetransfer_Jan_Brazil",
  ...complete campaign details...
}
\`\`\`

**Error Response (404 Not Found):**
\`\`\`json
{
  "error": "Campaign not found"
}
\`\`\`

### 4. Update Campaign

**PUT /campaigns/{id}**

\`\`\`bash
curl -X PUT https://your-api.execute-api.us-east-1.amazonaws.com/dev/campaigns/1704067200000 \
  -H "Content-Type: application/json" \
  -d '{
    "investment": 12000.00,
    "cost": 5000.00,
    "status": "Completed"
  }'
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "1704067200000",
  "investment": 12000.00,
  "cost": 5000.00,
  "grossMargin": 8536.86,
  "grossMarginPercentage": 71.14,
  "status": "Completed",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  ...
}
\`\`\`

### 5. Delete Campaign

**DELETE /campaigns/{id}**

\`\`\`bash
curl -X DELETE https://your-api.execute-api.us-east-1.amazonaws.com/dev/campaigns/1704067200000
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Campaign deleted successfully"
}
\`\`\`

### 6. Upload File

**POST /uploads**

\`\`\`bash
# Using base64 encoded file
curl -X POST https://your-api.execute-api.us-east-1.amazonaws.com/dev/uploads \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "nintendo-logo.png",
    "fileContent": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "contentType": "image/png",
    "campaignId": "1704067200000",
    "fileType": "logo"
  }'
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "url": "https://campaign-assets.s3.amazonaws.com/logos/1704067200000/1704067200000-nintendo-logo.png?X-Amz-...",
  "key": "logos/1704067200000/1704067200000-nintendo-logo.png",
  "size": 1024,
  "contentType": "image/png"
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Campaign name is required"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Campaign not found"
}
\`\`\`

### 413 Payload Too Large
\`\`\`json
{
  "error": "File too large. Maximum size is 10MB"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

## Testing with Postman

Import this collection:

\`\`\`json
{
  "info": {
    "name": "Campaign Manager Pro",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Campaign",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/campaigns",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Campaign\",\n  \"customer\": \"Test Customer\",\n  \"brandAdvertiser\": \"Test Brand\",\n  \"organizationPublisher\": \"Test Publisher\",\n  \"market\": \"USA\",\n  \"salesPerson\": \"John Doe\",\n  \"month\": \"Jan\",\n  \"investment\": 10000,\n  \"cost\": 5000,\n  \"hiddenCost\": -500,\n  \"startDate\": \"2024-01-01\",\n  \"endDate\": \"2024-01-31\",\n  \"status\": \"Active\"\n}"
        }
      }
    }
  ]
}
\`\`\`

## JavaScript/TypeScript Examples

### Using Fetch API

\`\`\`typescript
// Create campaign
const createCampaign = async (campaignData) => {
  const response = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Get all campaigns
const getCampaigns = async () => {
  const response = await fetch(`${API_URL}/campaigns`);
  return await response.json();
};

// Update campaign
const updateCampaign = async (id, updates) => {
  const response = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  return await response.json();
};

// Delete campaign
const deleteCampaign = async (id) => {
  await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
  });
};
\`\`\`

### Using Axios

\`\`\`typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create campaign
const createCampaign = (data) => api.post('/campaigns', data);

// Get all campaigns
const getCampaigns = () => api.get('/campaigns');

// Get campaign by ID
const getCampaign = (id) => api.get(`/campaigns/${id}`);

// Update campaign
const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);

// Delete campaign
const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);
\`\`\`

## Rate Limiting

Default limits (can be configured in API Gateway):

- Burst: 100 requests
- Rate: 50 requests/second

## CORS Configuration

Allowed origins: `*` (configure for production)
Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Content-Type, Authorization

## Pagination (Future Enhancement)

\`\`\`bash
# Example with pagination (not yet implemented)
curl -X GET "https://your-api.com/campaigns?limit=10&offset=20"
\`\`\`

## Filtering (Future Enhancement)

\`\`\`bash
# Example with filters (not yet implemented)
curl -X GET "https://your-api.com/campaigns?status=Active&market=Brazil"
