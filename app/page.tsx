"use client"

import { useState, useEffect } from "react"
import type { Campaign, CreateCampaignInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CampaignTable } from "@/components/campaign-table"
import { CampaignForm } from "@/components/campaign-form"
import { CampaignDetails } from "@/components/campaign-details"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns")
      if (!response.ok) throw new Error("Error loading campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      })
    }
  }

  const handleCreateCampaign = async (data: CreateCampaignInput) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error creating campaign")
      }

      await fetchCampaigns()
      setIsFormOpen(false)
      setSelectedCampaign(null)
      toast({
        title: "Success",
        description: "Campaign created successfully",
      })
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error creating campaign",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCampaign = async (data: CreateCampaignInput) => {
    if (!selectedCampaign) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/campaigns/${selectedCampaign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error updating campaign")
      }

      await fetchCampaigns()
      setIsFormOpen(false)
      setSelectedCampaign(null)
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      })
    } catch (error) {
      console.error("Error updating campaign:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error updating campaign",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return
    try {
      const response = await fetch(`/api/campaigns/${campaignToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error deleting campaign")
      }

      await fetchCampaigns()
      setIsDeleteDialogOpen(false)
      setCampaignToDelete(null)
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error deleting campaign",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsFormOpen(true)
  }

  const handleView = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsDetailsOpen(true)
  }

  const handleDelete = (id: string) => {
    setCampaignToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleNewCampaign = () => {
    setSelectedCampaign(null)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-balance">Campaign Manager Pro</h1>
                <p className="text-sm text-muted-foreground">Manage your advertising campaigns efficiently</p>
              </div>
            </div>
            <Button onClick={handleNewCampaign} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Campaign
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Active Campaigns</h2>
          <p className="text-muted-foreground">Total campaigns: {campaigns.length}</p>
        </div>

        <CampaignTable campaigns={campaigns} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCampaign ? "Edit Campaign" : "New Campaign"}</DialogTitle>
            <DialogDescription>
              {selectedCampaign ? "Update the campaign details" : "Complete the form to create a new campaign"}
            </DialogDescription>
          </DialogHeader>
          <CampaignForm
            campaign={selectedCampaign || undefined}
            onSubmit={selectedCampaign ? handleUpdateCampaign : handleCreateCampaign}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedCampaign(null)
            }}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
          </DialogHeader>
          {selectedCampaign && <CampaignDetails campaign={selectedCampaign} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The campaign will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
