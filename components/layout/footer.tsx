import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">BoardGameHub</h3>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for discovering and exploring board games.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-foreground">
                  All Games
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin" className="gap-2">
              <Shield className="w-4 h-4" />
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
