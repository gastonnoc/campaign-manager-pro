export interface CampaignLine {
  id: string
  publisher: string
  market: string
  format: string
  units: number
  unitCost: number
  investment: number
  margin: number
  usmcEstimate: number
  clientNetRate: number
}

export interface Campaign {
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
  hiddenCost: number
  cost: number
  grossMargin: number
  grossMarginPercentage: number
  lines: CampaignLine[]
  startDate: string
  endDate: string
  status: "active" | "paused" | "completed"
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignInput {
  name: string
  customer: string
  brandAdvertiser: string
  campaignMotto: string
  organizationPublisher: string
  market: string
  salesPerson: string
  month: string
  investment: number
  hiddenCost: number
  cost: number
  lines: Omit<CampaignLine, "id">[]
  startDate: string
  endDate: string
  status: "active" | "paused" | "completed"
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {}
