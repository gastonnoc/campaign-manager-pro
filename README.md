# Campaign Manager Pro

Full-stack campaign management application built with Next.js and React. Perfect for managing advertising campaigns with automatic gross margin calculations.

## Features

- Complete CRUD operations for campaigns
- Automatic Gross Margin calculation (Investment - Cost - Hidden Cost)
- Real-time margin percentage display
- Campaign lines with unit tracking
- Modern, responsive UI with dark mode support
- Form validation and error handling
- Professional business-focused design

## Tech Stack

**Frontend:**
- Next.js 16 with React 19.2
- TypeScript for type safety
- Tailwind CSS v4 for styling
- shadcn/ui components (Radix UI)
- React Hook Form with Zod validation

**Backend:**
- Next.js API Routes
- In-memory data storage (ready for database integration)
- RESTful API design

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/campaign-manager-pro.git
cd campaign-manager-pro
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List all campaigns |
| GET | `/api/campaigns/{id}` | Get campaign by ID |
| POST | `/api/campaigns` | Create new campaign |
| PUT | `/api/campaigns/{id}` | Update campaign |
| DELETE | `/api/campaigns/{id}` | Delete campaign |

## Data Model

\`\`\`typescript
Campaign {
  id: string
  name: string
  customer: string
  brandAdvertiser: string
  campaignMotto: string
  organizationPublisher: string
  market: string
  salesPerson: string
  month: string
  investment: number
  cost: number
  hiddenCost: number
  grossMargin: number (calculated)
  grossMarginPercentage: number (calculated)
  lines: CampaignLine[]
  startDate: string
  endDate: string
  status: string
  createdAt: string
  updatedAt: string
}
\`\`\`

## Gross Margin Calculation

The application automatically calculates:
- **Gross Margin**: `Investment - Cost - Hidden Cost`
- **Gross Margin %**: `(Gross Margin / Investment) × 100`

## Database Integration

The application currently uses in-memory storage. We should integrate a database.

## Development

### Build for production
\`\`\`bash
npm run build
\`\`\`

### Run production build locally
\`\`\`bash
npm start
\`\`\`

### Type checking
\`\`\`bash
npm run type-check
\`\`\`

## Future Enhancements

- User authentication
- File upload for campaign assets
- Advanced filtering and search
- Export to CSV/Excel
- Real-time collaboration
- Analytics dashboard
- Multi-currency support
- Automated reports

