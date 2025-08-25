import { GameForm } from "@/components/admin/game-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth/admin"

export default async function NewGamePage() {
  await requireAdmin()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Game</CardTitle>
          </CardHeader>
          <CardContent>
            <GameForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
