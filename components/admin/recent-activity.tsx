import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: "1",
    user: "John Doe",
    action: "added a new game",
    target: "Wingspan",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: "Jane Smith",
    action: "reviewed",
    target: "Azul",
    time: "4 hours ago",
  },
  {
    id: "3",
    user: "Admin",
    action: "moderated review for",
    target: "Pandemic",
    time: "6 hours ago",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={activity.user} />
              <AvatarFallback>{activity.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
