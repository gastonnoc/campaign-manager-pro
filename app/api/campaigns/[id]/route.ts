import { type NextRequest, NextResponse } from "next/server"
import { getCampaignById, updateCampaign, deleteCampaign } from "@/lib/db"
import type { UpdateCampaignInput } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const campaign = await getCampaignById(id)

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign, { status: 200 })
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "Error fetching campaign" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body: UpdateCampaignInput = await request.json()

    if (body.budget !== undefined && body.budget <= 0) {
      return NextResponse.json({ error: "Budget must be greater than 0" }, { status: 400 })
    }

    if (body.units !== undefined && body.units <= 0) {
      return NextResponse.json({ error: "Units must be greater than 0" }, { status: 400 })
    }

    const updatedCampaign = await updateCampaign(id, body)

    if (!updatedCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCampaign, { status: 200 })
  } catch (error) {
    console.error("Error updating campaign:", error)
    return NextResponse.json({ error: "Error updating campaign" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteCampaign(id)

    if (!deleted) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Campaign deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json({ error: "Error deleting campaign" }, { status: 500 })
  }
}
