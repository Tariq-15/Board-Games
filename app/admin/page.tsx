import { AdminStats } from "@/components/admin/admin-stats"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminAuthWrapper } from "@/components/admin/admin-auth-wrapper"

export default function AdminDashboard() {
  return (
    <AdminAuthWrapper>
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
    </AdminAuthWrapper>
  )
}
