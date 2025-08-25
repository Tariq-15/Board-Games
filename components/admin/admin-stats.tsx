import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, MessageSquare, Star } from "lucide-react"
import { GameService } from "@/lib/services/GameService"

export async function AdminStats() {
  const gameService = new GameService()
  const stats = await gameService.getAdminStats()

  const statCards = [
    {
      title: "Total Games",
      value: stats.totalGames.toLocaleString(),
      change: `+${stats.gamesThisMonth}`,
      changeLabel: "this month",
      icon: Gamepad2,
      color: "text-blue-600",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      change: `+${stats.reviewsThisMonth}`,
      changeLabel: "this month",
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toString(),
      change: "4.0+",
      changeLabel: "target",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span> {stat.changeLabel}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
