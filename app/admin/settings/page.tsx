import { AdminSettings } from "@/components/admin/admin-settings"
import { requireAdmin } from "@/lib/auth/admin"

export default async function AdminSettingsPage() {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your board game marketplace</p>
        </div>

        <AdminSettings />
      </div>
    </div>
  )
}
