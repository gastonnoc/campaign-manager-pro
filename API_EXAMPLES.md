# Campaign Manager Pro - API Examples

Complete examples for testing all API endpoints.

## Base URL

\`\`\`
Local Development: http://localhost:3000/api
Production: https://your-app.vercel.app/api
\`\`\`

## Endpoints

### 1. Create Campaign

**POST /api/campaigns**

\`\`\`bash
curl -X POST http://localhost:3000/api/campaigns \
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
    "status": "Active"
  }'
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "1704067200000",
  "name": "Nintendo_supermario_Wetransfer_Jan_Brazil",
  "grossMargin": 7096.28,
  "grossMarginPercentage": 69.32,
  ...
}
\`\`\`

### 2. List All Campaigns

**GET /api/campaigns**

\`\`\`bash
curl http://localhost:3000/api/campaigns
\`\`\`

**Response (200 OK):**
\`\`\`json
[
  {
    "id": "1",
    "name": "Campaign 1",
    "grossMargin": 5000.00,
    ...
  }
]
\`\`\`

### 3. Get Campaign by ID

**GET /api/campaigns/{id}**

\`\`\`bash
curl http://localhost:3000/api/campaigns/1704067200000
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "1704067200000",
  "name": "Nintendo_supermario_Wetransfer_Jan_Brazil",
  ...
}
\`\`\`

**Error (404 Not Found):**
\`\`\`json
{
  "error": "Campaign not found"
}
\`\`\`

### 4. Update Campaign

**PUT /api/campaigns/{id}**

\`\`\`bash
curl -X PUT http://localhost:3000/api/campaigns/1704067200000 \
  -H "Content-Type: application/json" \
  -d '{
    "investment": 12000.00,
    "status": "Completed"
  }'
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "1704067200000",
  "investment": 12000.00,
  "grossMargin": 8859.46,
  "status": "Completed",
  ...
}
\`\`\`

### 5. Delete Campaign

**DELETE /api/campaigns/{id}**

\`\`\`bash
curl -X DELETE http://localhost:3000/api/campaigns/1704067200000
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "message": "Campaign deleted successfully"
}
\`\`\`

## JavaScript/TypeScript Examples

### Using Fetch API

\`\`\`typescript
const API_URL = 'http://localhost:3000/api';

const createCampaign = async (data) => {
  const response = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
};

const getCampaigns = async () => {
  const response = await fetch(`${API_URL}/campaigns`);
  return await response.json();
};

const updateCampaign = async (id, data) => {
  const response = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
};

const deleteCampaign = async (id) => {
  await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
  });
};
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

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

## Testing with Postman

1. Import collection with base URL: `http://localhost:3000/api`
2. Add requests for each endpoint
3. Test all CRUD operations

## Testing with Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new collection
3. Add requests for all endpoints
4. Save for future testing
