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

## Project Structure

\`\`\`
campaign-manager-pro/
├── app/
│   ├── api/
│   │   └── campaigns/
│   │       ├── route.ts           # GET, POST /campaigns
│   │       └── [id]/
│   │           └── route.ts       # GET, PUT, DELETE /campaigns/{id}
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── campaign-form.tsx          # Campaign form
│   ├── campaign-table.tsx         # Campaign list
│   └── campaign-details.tsx       # Campaign details view
├── lib/
│   ├── types.ts                   # TypeScript types
│   └── db.ts                      # Data layer
└── README.md
\`\`\`

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

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click

### Deploy to Netlify

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Deploy the `out` folder to Netlify

### Environment Variables

For production with a real database, add:
\`\`\`
DATABASE_URL=your_database_url
\`\`\`

## Database Integration

The application currently uses in-memory storage. To integrate a database:

1. Choose your database (PostgreSQL, MySQL, MongoDB, etc.)
2. Update `lib/db.ts` with database client
3. Add environment variables
4. Deploy

Popular options:
- **Vercel Postgres** - Integrated with Vercel
- **Supabase** - PostgreSQL with authentication
- **PlanetScale** - MySQL serverless
- **MongoDB Atlas** - NoSQL database

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your portfolio or commercial purposes.

## Contact

For questions or support, please open an issue on GitHub.
