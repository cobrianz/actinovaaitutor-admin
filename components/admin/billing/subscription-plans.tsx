"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Edit, Plus, Trash2 } from "lucide-react"
import { PlanModal } from "@/components/admin/modals/plan-modal"
import { toast } from "sonner"

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchPlans = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const response = await fetch("/api/billing/plans")
      const data = await response.json()
      if (data.plans) {
        setPlans(data.plans)
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPlans()
  }, [])

  // Refresh when modal closes (in case of updates)
  const handleModalClose = () => {
    setIsModalOpen(false)
    fetchPlans(true)
  }

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedPlan(null)
    setIsModalOpen(true)
  }
  const handleDelete = async (plan: any) => {
    if (!confirm(`Are you sure you want to delete the ${plan.name} plan?`)) return

    try {
      const response = await fetch(`/api/billing/plans?id=${plan.id || plan._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Plan deleted successfully")
        fetchPlans(true)
      } else {
        toast.error("Failed to delete plan")
      }
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast.error("Error deleting plan")
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-foreground-muted">Loading plans...</div>
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
            <p className="text-sm text-foreground-muted">Manage pricing tiers and features</p>
          </div>
          <Button onClick={handleAdd} className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:max-w-6xl">
          {plans.map((plan) => (
            <Card key={plan.id} className="glass-card border-accent/20 relative overflow-hidden flex flex-col">
              {plan.name === "Premium" && (
                <div className="absolute top-4 right-4">
                  <Badge className="gradient-primary text-white">Popular</Badge>
                </div>
              )}
              {plan.name === "Enterprise" && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-600 text-white">Best Value</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    ${plan.price.toLocaleString()}
                  </span>
                  {plan.price > 0 && <span className="text-foreground-muted">/{plan.billing}</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-2 flex-1">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground-muted">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                  <div className="text-sm text-foreground-muted mb-3">
                    <span className="font-semibold text-foreground">{plan.subscribers}</span> subscribers
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan)}
                      className="text-destructive bg-transparent hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PlanModal isOpen={isModalOpen} onClose={handleModalClose} plan={selectedPlan} />
    </>
  )
}
