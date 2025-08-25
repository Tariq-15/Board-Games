import { AdminReviewsList } from "@/components/admin/admin-reviews-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { requireAdmin } from "@/lib/auth/admin"

interface SearchParams {
  status?: string
  page?: string
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Reviews</h1>
          <p className="text-muted-foreground">Moderate and manage user reviews</p>
        </div>
      </div>

      <div className="mb-6">
        <Select defaultValue={searchParams.status || "all"}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AdminReviewsList searchParams={searchParams} />
    </div>
  )
}
