"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan?: any
}

export function PlanModal({ isOpen, onClose, plan }: PlanModalProps) {
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    if (plan) {
      setFeatures(plan.features || [])
      setIsActive(plan.status === "active")
      setIsFeatured(!!plan.featured)
    } else {
      setFeatures([])
      setIsActive(true)
      setIsFeatured(false)
    }
  }, [plan])

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const price = parseFloat((form.elements.namedItem("price") as HTMLInputElement).value)
    const billing = (form.elements.namedItem("billing") as HTMLSelectElement).value
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value

    const payload = {
      ...(plan && { _id: plan._id, id: plan.id }),
      name,
      price,
      billing,
      description,
      features,
      status: isActive ? "active" : "inactive",
      featured: isFeatured
    }

    try {
      const response = await fetch('/api/billing/plans', {
        method: plan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(plan ? "Plan updated successfully" : "Plan created successfully")
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save plan")
      }
    } catch (error) {
      console.error("Error saving plan:", error)
      toast.error("Error saving plan")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-accent/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
          <DialogDescription>
            {plan ? "Update plan details and features" : "Add a new subscription plan"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input id="name" placeholder="Pro" defaultValue={plan?.name} className="glass-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh)</Label>
              <Input id="price" type="number" placeholder="4500" defaultValue={plan?.price} className="glass-input" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billing">Billing Period</Label>
            <select
              id="billing"
              className="glass-input w-full px-3 py-2 rounded-lg"
              defaultValue={plan?.billing || "month"}
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="forever">One-time</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Plan description..."
              rows={3}
              defaultValue={plan?.description}
              className="glass-input"
            />
          </div>

          <div className="space-y-3">
            <Label>Features</Label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...features]
                      newFeatures[index] = e.target.value
                      setFeatures(newFeatures)
                    }}
                    className="glass-input flex-1"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFeature(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add new feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                className="glass-input"
              />
              <Button type="button" onClick={handleAddFeature} className="gradient-primary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg glass-subtle">
            <div>
              <Label htmlFor="active">Active Status</Label>
              <p className="text-sm text-foreground-muted">Make this plan available to users</p>
            </div>
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg glass-subtle">
            <div>
              <Label htmlFor="featured">Featured Plan</Label>
              <p className="text-sm text-foreground-muted">Highlight this plan as recommended</p>
            </div>
            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary flex-1">
              {plan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
