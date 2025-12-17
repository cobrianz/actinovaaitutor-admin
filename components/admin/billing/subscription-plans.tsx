"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Edit, Plus, Trash2 } from "lucide-react"
import { PlanModal } from "@/components/admin/modals/plan-modal"

const plans = [
  {
    id: "1",
    name: "Free",
    price: 0,
    billing: "forever",
    features: ["5 AI-generated courses", "50 flashcards", "Basic analytics", "Community support", "Mobile app access"],
    subscribers: 1250,
    status: "active",
    color: "purple",
  },
  {
    id: "2",
    name: "Basic",
    price: 19.99,
    billing: "month",
    features: [
      "Unlimited AI courses",
      "500 flashcards",
      "Advanced analytics",
      "Email support",
      "Custom study plans",
      "Progress tracking",
    ],
    subscribers: 890,
    status: "active",
    color: "blue",
  },
  {
    id: "3",
    name: "Pro",
    price: 39.99,
    billing: "month",
    features: [
      "Everything in Basic",
      "Unlimited flashcards",
      "AI tutor chat",
      "Priority support",
      "Collaborative learning",
      "Export certificates",
      "API access",
    ],
    subscribers: 580,
    status: "active",
    color: "cyan",
  },
  {
    id: "4",
    name: "Enterprise",
    price: 99.99,
    billing: "month",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & SAML",
      "Advanced security",
      "White-label options",
      "SLA guarantee",
      "Custom training",
    ],
    subscribers: 125,
    status: "active",
    color: "green",
  },
]

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedPlan(null)
    setIsModalOpen(true)
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="glass-card border-accent/20 relative overflow-hidden">
              {plan.name === "Pro" && (
                <div className="absolute top-4 right-4">
                  <Badge className="gradient-primary text-white">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-foreground-muted">/{plan.billing}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground-muted">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-foreground-muted mb-3">
                    <span className="font-semibold text-foreground">{plan.subscribers}</span> subscribers
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} plan={selectedPlan} />
    </>
  )
}
