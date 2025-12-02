"use client"

import type { Campaign } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, DollarSign, Target, TrendingUp, Users, Building2 } from "lucide-react"

interface CampaignDetailsProps {
  campaign: Campaign
}

const statusLabels: Record<Campaign["status"], string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
}

export function CampaignDetails({ campaign }: CampaignDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold text-balance">{campaign.name}</h2>
            <p className="text-muted-foreground mt-1">Client: {campaign.customer}</p>
          </div>
          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
            {statusLabels[campaign.status]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaign.investment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">What the client invests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaign.cost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Payment to Publisher</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${campaign.grossMargin.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{campaign.grossMarginPercentage.toFixed(1)}% of investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden Cost</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${campaign.hiddenCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Commissions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Brand Advertiser</p>
                <p className="text-lg font-semibold">{campaign.brandAdvertiser}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campaign Motto</p>
                <p className="text-lg font-semibold">{campaign.campaignMotto || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Organization Publisher</p>
                <p className="text-lg font-semibold">{campaign.organizationPublisher}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market</p>
                <p className="text-lg font-semibold">{campaign.market}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sales Person</p>
                <p className="text-lg font-semibold">{campaign.salesPerson}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Month</p>
                <p className="text-lg font-semibold">{campaign.month}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <p className="text-lg font-semibold">{new Date(campaign.startDate).toLocaleDateString("en-US")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">End Date</p>
              <p className="text-lg font-semibold">{new Date(campaign.endDate).toLocaleDateString("en-US")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Gross Margin Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/10 p-6 rounded-lg font-mono text-sm space-y-3">
            <div>
              <p className="text-muted-foreground mb-2">Formula:</p>
              <p className="font-semibold text-lg">Gross Margin = Investment - Cost - Hidden Cost</p>
            </div>
            <div className="pt-3 border-t border-primary/20">
              <p className="text-muted-foreground mb-2">Calculation:</p>
              <p>Investment: ${campaign.investment.toLocaleString()}</p>
              <p>Cost: -${campaign.cost.toLocaleString()}</p>
              <p>Hidden Cost (Cust-H.C.): -${campaign.hiddenCost.toLocaleString()}</p>
            </div>
            <div className="pt-3 border-t border-primary/20">
              <p className="text-primary font-bold text-xl">
                Gross Margin = ${campaign.grossMargin.toFixed(2)} ({campaign.grossMarginPercentage.toFixed(1)}%)
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                What remains to US MEDIA after paying the publisher and commissions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {campaign.lines && campaign.lines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Units (Lines)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Publisher</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right"># Units</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Investment</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium">{line.publisher}</TableCell>
                      <TableCell>{line.market}</TableCell>
                      <TableCell>{line.format}</TableCell>
                      <TableCell className="text-right">{line.units.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${line.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">${line.investment.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">{line.margin.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm">{new Date(campaign.createdAt).toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="text-sm">{new Date(campaign.updatedAt).toLocaleString("en-US")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
