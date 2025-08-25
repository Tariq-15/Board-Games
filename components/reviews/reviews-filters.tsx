"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function ReviewsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [rating, setRating] = useState(searchParams.get("rating") || "all")
  const [game, setGame] = useState(searchParams.get("game") || "all")

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    if (rating && rating !== "all") params.set("rating", rating)
    else params.delete("rating")

    if (game && game !== "all") params.set("game", game)
    else params.delete("game")

    params.delete("page") // Reset to first page

    router.push(`/reviews?${params.toString()}`)
  }

  const clearFilters = () => {
    setRating("all")
    setGame("all")
    router.push("/reviews")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Rating</Label>
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Game</Label>
          <Select value={game} onValueChange={setGame}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All games" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All games</SelectItem>
              <SelectItem value="1">Wingspan</SelectItem>
              <SelectItem value="2">Azul</SelectItem>
              <SelectItem value="3">Pandemic</SelectItem>
              <SelectItem value="4">Ticket to Ride</SelectItem>
              <SelectItem value="5">Splendor</SelectItem>
              <SelectItem value="6">Catan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
