"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Campaign, CreateCampaignInput, CampaignLine } from "@/lib/types"
import { calculateGrossMargin, calculateGrossMarginPercentage } from "@/lib/db"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CampaignFormProps {
  campaign?: Campaign
  onSubmit: (data: CreateCampaignInput) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CampaignForm({ campaign, onSubmit, onCancel, isLoading }: CampaignFormProps) {
  const [formData, setFormData] = useState<CreateCampaignInput>({
    name: campaign?.name || "",
    customer: campaign?.customer || "",
    brandAdvertiser: campaign?.brandAdvertiser || "",
    campaignMotto: campaign?.campaignMotto || "",
    organizationPublisher: campaign?.organizationPublisher || "",
    market: campaign?.market || "",
    salesPerson: campaign?.salesPerson || "",
    month: campaign?.month || "",
    investment: campaign?.investment || 0,
    hiddenCost: campaign?.hiddenCost || 0,
    cost: campaign?.cost || 0,
    lines: campaign?.lines || [],
    startDate: campaign?.startDate || "",
    endDate: campaign?.endDate || "",
    status: campaign?.status || "active",
  })

  const [calculatedMargin, setCalculatedMargin] = useState<number>(0)
  const [marginPercentage, setMarginPercentage] = useState<number>(0)

  useEffect(() => {
    const margin = calculateGrossMargin(formData.investment, formData.cost, formData.hiddenCost)
    const percentage = calculateGrossMarginPercentage(margin, formData.investment)
    setCalculatedMargin(margin)
    setMarginPercentage(percentage)
  }, [formData.investment, formData.cost, formData.hiddenCost])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [
        ...formData.lines,
        {
          publisher: "",
          market: formData.market,
          format: "Video",
          units: 0,
          unitCost: 0,
        },
      ],
    })
  }

  const removeLine = (index: number) => {
    setFormData({
      ...formData,
      lines: formData.lines.filter((_, i) => i !== index),
    })
  }

  const updateLine = (index: number, field: keyof Omit<CampaignLine, "id">, value: any) => {
    const newLines = [...formData.lines]
    newLines[index] = { ...newLines[index], [field]: value }
    setFormData({ ...formData, lines: newLines })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Campaign Information</CardTitle>
          <CardDescription>Basic information about the advertising campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandAdvertiser">Brand Advertiser *</Label>
              <Input
                id="brandAdvertiser"
                value={formData.brandAdvertiser}
                onChange={(e) => setFormData({ ...formData, brandAdvertiser: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaignMotto">Campaign Motto</Label>
              <Input
                id="campaignMotto"
                value={formData.campaignMotto}
                onChange={(e) => setFormData({ ...formData, campaignMotto: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationPublisher">Organization Publisher *</Label>
              <Input
                id="organizationPublisher"
                value={formData.organizationPublisher}
                onChange={(e) => setFormData({ ...formData, organizationPublisher: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market *</Label>
              <Input
                id="market"
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesPerson">Sales Person *</Label>
              <Input
                id="salesPerson"
                value={formData.salesPerson}
                onChange={(e) => setFormData({ ...formData, salesPerson: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Margin Calculation Data</CardTitle>
          <CardDescription>Financial information to calculate Gross Margin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investment">Investment ($) *</Label>
              <Input
                id="investment"
                type="number"
                min="0"
                step="0.01"
                value={formData.investment}
                onChange={(e) => setFormData({ ...formData, investment: Number.parseFloat(e.target.value) || 0 })}
                required
              />
              <p className="text-xs text-muted-foreground">What the client invests</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiddenCost">Cust-H.C. ($)</Label>
              <Input
                id="hiddenCost"
                type="number"
                step="0.01"
                value={formData.hiddenCost}
                onChange={(e) => setFormData({ ...formData, hiddenCost: Number.parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Hidden Cost (agency commissions)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($) *</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
                required
              />
              <p className="text-xs text-muted-foreground">What is paid to the Publisher</p>
            </div>
          </div>

          <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Gross Margin:</span>
              <span className="text-3xl font-bold text-primary">${calculatedMargin.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Margin Percentage:</span>
              <span className="text-2xl font-bold text-primary">{marginPercentage.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Formula: Margin = Investment - Cost - Hidden Cost</p>
            <p className="text-xs text-muted-foreground">
              What remains to US MEDIA after paying the publisher and commissions
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Units (Lines)</CardTitle>
          <CardDescription>
            Breakdown of lines by advertising format type where cost and margin are calculated individually
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.lines.map((line, index) => (
              <div key={index} className="border rounded-lg p-4 relative">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => removeLine(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                  <div className="space-y-2">
                    <Label>Publisher</Label>
                    <Input value={line.publisher} onChange={(e) => updateLine(index, "publisher", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Market</Label>
                    <Input value={line.market} onChange={(e) => updateLine(index, "market", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={line.format} onValueChange={(value) => updateLine(index, "format", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Display">Display</SelectItem>
                        <SelectItem value="Banner">Banner</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label># Units</Label>
                    <Input
                      type="number"
                      value={line.units}
                      onChange={(e) => updateLine(index, "units", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Cost ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={line.unitCost}
                      onChange={(e) => updateLine(index, "unitCost", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calculated Investment</Label>
                    <Input value={`$${(line.units * line.unitCost).toFixed(2)}`} disabled className="bg-muted" />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addLine} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Line
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates and Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "paused" | "completed") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : campaign ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
