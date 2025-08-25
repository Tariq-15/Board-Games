import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Shield, Ban, Trash2 } from "lucide-react"
import { UserService } from "@/lib/services/UserService"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminUsersListProps {
  searchParams: {
    status?: string
    page?: string
    search?: string
  }
}

export async function AdminUsersList({ searchParams }: AdminUsersListProps) {
  const userService = new UserService()
  const { users } = await userService.getAllUsers(searchParams)

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg?height=48&width=48"} alt={user.full_name} />
                  <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{user.full_name}</h3>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                    <span>Reviews: {user.review_count || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Shield className="w-4 h-4 mr-2" />
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Reviews</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-orange-600">
                      <Ban className="w-4 h-4 mr-2" />
                      {user.status === "suspended" ? "Unsuspend" : "Suspend"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
