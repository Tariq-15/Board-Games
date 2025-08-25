import { Button } from "@/components/ui/button"
import { Gamepad2, Users, Settings } from "lucide-react"
import Link from "next/link"

const navItems = [
  { name: "Games", href: "/admin/games", icon: Gamepad2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminNavigation() {
  return (
    <div className="flex flex-wrap gap-2">
      {navItems.map((item) => (
        <Button key={item.name} variant="outline" asChild>
          <Link href={item.href} className="gap-2">
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        </Button>
      ))}
    </div>
  )
}
