"use client"

import type { Campaign } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye } from "lucide-react"

interface CampaignTableProps {
  campaigns: Campaign[]
  onEdit: (campaign: Campaign) => void
  onDelete: (id: string) => void
  onView: (campaign: Campaign) => void
}

const statusLabels: Record<Campaign["status"], string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
}

const statusColors: Record<Campaign["status"], "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
}

export function CampaignTable({ campaigns, onEdit, onDelete, onView }: CampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No campaigns registered</p>
        <p className="text-sm mt-2">Create your first campaign to get started</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Market</TableHead>
            <TableHead className="text-right">Investment</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Gross Margin</TableHead>
            <TableHead className="text-right">Margin %</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{campaign.name}</TableCell>
              <TableCell className="max-w-[150px] truncate">{campaign.customer}</TableCell>
              <TableCell>{campaign.brandAdvertiser}</TableCell>
              <TableCell>{campaign.market}</TableCell>
              <TableCell className="text-right">${campaign.investment.toLocaleString()}</TableCell>
              <TableCell className="text-right">${campaign.cost.toLocaleString()}</TableCell>
              <TableCell className="text-right font-semibold text-primary">
                ${campaign.grossMargin.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-semibold text-primary">
                {campaign.grossMarginPercentage.toFixed(1)}%
              </TableCell>
              <TableCell>
                <Badge variant={statusColors[campaign.status]}>{statusLabels[campaign.status]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button size="icon" variant="ghost" onClick={() => onView(campaign)} title="View details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(campaign)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(campaign.id)} title="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
