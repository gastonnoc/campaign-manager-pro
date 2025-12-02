import { type NextRequest, NextResponse } from "next/server"
import { getAllCampaigns, createCampaign } from "@/lib/db"
import type { CreateCampaignInput } from "@/lib/types"

export async function GET() {
  try {
    const campaigns = await getAllCampaigns()
    return NextResponse.json(campaigns, { status: 200 })
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Error fetching campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCampaignInput = await request.json()

    if (!body.name || !body.customer || !body.brandAdvertiser) {
      return NextResponse.json({ error: "Missing required fields: name, customer, brandAdvertiser" }, { status: 400 })
    }

    if (body.investment <= 0) {
      return NextResponse.json({ error: "Investment must be greater than 0" }, { status: 400 })
    }

    if (body.cost < 0 || body.hiddenCost < 0) {
      return NextResponse.json({ error: "Cost and hiddenCost cannot be negative" }, { status: 400 })
    }

    const newCampaign = await createCampaign(body)
    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    console.error("Error creating campaign:", error)
    return NextResponse.json({ error: "Error creating campaign" }, { status: 500 })
  }
}
