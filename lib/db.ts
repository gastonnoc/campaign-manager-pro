import type { Campaign, CreateCampaignInput, UpdateCampaignInput, CampaignLine } from "./types"

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Nintendo_supermario_Wetransfer_lan_Brazil",
    customer: "Africa - Brazil - Omnicom",
    brandAdvertiser: "Nintendo",
    campaignMotto: "SuperMario",
    organizationPublisher: "Wetransfer",
    market: "Brazil",
    salesPerson: "Carla Rodriguez",
    month: "Jan",
    investment: 10236.82,
    hiddenCost: 1536.86,
    cost: 4677.4,
    grossMargin: 4022.56,
    grossMarginPercentage: 39.3,
    lines: [
      {
        id: "1",
        publisher: "We Transfer",
        market: "Brazil",
        format: "Video",
        units: 66820,
        unitCost: 0.15,
        investment: 10236.82,
        margin: 39.3,
        usmcEstimate: 6700.87,
        clientNetRate: 0.11,
      },
    ],
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function calculateMargin(budget: number, units: number): number {
  if (units === 0) return 0
  return budget / units
}

export function calculateGrossMargin(investment: number, cost: number, hiddenCost: number): number {
  return investment - cost - hiddenCost
}

export function calculateGrossMarginPercentage(grossMargin: number, investment: number): number {
  if (investment === 0) return 0
  return (grossMargin / investment) * 100
}

export function calculateLineMetrics(
  line: Omit<CampaignLine, "id" | "investment" | "margin" | "usmcEstimate" | "clientNetRate">,
) {
  const investment = line.units * line.unitCost
  const margin = 39.3
  const usmcEstimate = investment * (margin / 100)
  const clientNetRate = line.unitCost * 0.73

  return {
    investment,
    margin,
    usmcEstimate,
    clientNetRate,
  }
}

export async function getAllCampaigns(): Promise<Campaign[]> {
  return campaigns
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const campaign = campaigns.find((c) => c.id === id)
  return campaign || null
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const grossMargin = calculateGrossMargin(input.investment, input.cost, input.hiddenCost)
  const grossMarginPercentage = calculateGrossMarginPercentage(grossMargin, input.investment)

  const lines: CampaignLine[] = input.lines.map((line, index) => {
    const metrics = calculateLineMetrics(line)
    return {
      ...line,
      id: `${Date.now()}-${index}`,
      ...metrics,
    }
  })

  const newCampaign: Campaign = {
    ...input,
    id: Date.now().toString(),
    grossMargin,
    grossMarginPercentage,
    lines,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  campaigns.push(newCampaign)
  return newCampaign
}

export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<Campaign | null> {
  const index = campaigns.findIndex((c) => c.id === id)
  if (index === -1) return null

  const updatedCampaign = {
    ...campaigns[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }

  if (input.investment !== undefined || input.cost !== undefined || input.hiddenCost !== undefined) {
    updatedCampaign.grossMargin = calculateGrossMargin(
      updatedCampaign.investment,
      updatedCampaign.cost,
      updatedCampaign.hiddenCost,
    )
    updatedCampaign.grossMarginPercentage = calculateGrossMarginPercentage(
      updatedCampaign.grossMargin,
      updatedCampaign.investment,
    )
  }

  if (input.lines) {
    updatedCampaign.lines = input.lines.map((line, idx) => {
      const metrics = calculateLineMetrics(line)
      return {
        ...line,
        id: updatedCampaign.lines[idx]?.id || `${Date.now()}-${idx}`,
        ...metrics,
      }
    })
  }

  campaigns[index] = updatedCampaign
  return updatedCampaign
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const index = campaigns.findIndex((c) => c.id === id)
  if (index === -1) return false
  campaigns.splice(index, 1)
  return true
}
