import { AdminStats } from "@/components/admin/admin-stats"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { requireAdmin } from "@/lib/auth/admin"

export default async function AdminDashboard() {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your board game marketplace</p>
      </div>

      <AdminNavigation />

      <div className="mt-8">
        <AdminStats />
      </div>
    </div>
  )
}
