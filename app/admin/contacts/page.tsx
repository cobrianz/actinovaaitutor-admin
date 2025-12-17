import { ContactsManagement } from "@/components/admin/contacts/contacts-management"
import { ContactsAnalytics } from "@/components/admin/contacts/contacts-analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacts Management - Actinova Admin",
  description: "Manage contact submissions and support requests",
}

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Contacts Management</h1>
          <p className="text-foreground-muted mt-1">View and respond to contact submissions</p>
        </div>
      </div>

      <ContactsAnalytics />
      <ContactsManagement />
    </div>
  )
}
