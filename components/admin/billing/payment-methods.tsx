"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Trash2, Plus, Check } from "lucide-react"

const paymentMethods = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "5555",
    expiry: "08/26",
    isDefault: false,
  },
  {
    id: "3",
    type: "PayPal",
    email: "admin@actinova.ai",
    isDefault: false,
  },
]

export function PaymentMethods() {
  return (
    <Card className="glass-card border-accent/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage payment methods for transactions</CardDescription>
          </div>
          <Button className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-4 rounded-lg glass-subtle border border-border hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                {method.isDefault && (
                  <Badge className="gradient-primary text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-medium">{method.type}</p>
                {method.last4 ? (
                  <>
                    <p className="text-sm text-foreground-muted">•••• {method.last4}</p>
                    <p className="text-xs text-foreground-muted">Expires {method.expiry}</p>
                  </>
                ) : (
                  <p className="text-sm text-foreground-muted">{method.email}</p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                {!method.isDefault && (
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Set Default
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
