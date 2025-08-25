import { AdminUsersList } from "@/components/admin/admin-users-list"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { requireAdmin } from "@/lib/auth/admin"

interface SearchParams {
  status?: string
  page?: string
  search?: string
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground">View and manage user accounts</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Input placeholder="Search users..." className="max-w-sm" />
        <Select defaultValue={searchParams.status || "all"}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdminUsersList searchParams={searchParams} />
    </div>
  )
}
