"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const categories = [
  "Strategy",
  "Family",
  "Party",
  "Cooperative",
  "Deck Building",
  "Worker Placement",
  "Area Control",
  "Abstract",
  "Thematic",
]

export function GameFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get("category") || "all-categories")
  const [players, setPlayers] = useState(searchParams.get("players") || "any-number")
  const [playtime, setPlaytime] = useState([Number.parseInt(searchParams.get("playtime") || "60")])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    if (category) params.set("category", category)
    else params.delete("category")

    if (players) params.set("players", players)
    else params.delete("players")

    params.set("playtime", playtime[0].toString())
    params.delete("page") // Reset to first page

    router.push(`/games?${params.toString()}`)
  }

  const clearFilters = () => {
    setCategory("all-categories")
    setPlayers("any-number")
    setPlaytime([60])
    router.push("/games")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Number of Players</Label>
          <Select value={players} onValueChange={setPlayers}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Any number" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any-number">Any number</SelectItem>
              <SelectItem value="1">1 Player</SelectItem>
              <SelectItem value="2">2 Players</SelectItem>
              <SelectItem value="3">3 Players</SelectItem>
              <SelectItem value="4">4 Players</SelectItem>
              <SelectItem value="5+">5+ Players</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Max Playtime: {playtime[0]} minutes</Label>
          <Slider value={playtime} onValueChange={setPlaytime} max={180} min={15} step={15} className="mt-2" />
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
