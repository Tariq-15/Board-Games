"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { Game } from "@/Model/Game"

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

interface GameFormProps {
  game?: Game
  onSubmit?: (gameData: Partial<Game>) => void
}

export function GameForm({ game, onSubmit }: GameFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const gameData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      short_description: formData.get("short_description") as string,
      publisher: formData.get("publisher") as string,
      designer: formData.get("designer") as string,
      year_published: Number(formData.get("year_published")),
      min_players: Number(formData.get("min_players")),
      max_players: Number(formData.get("max_players")),
      min_age: Number(formData.get("min_age")),
      playing_time: Number(formData.get("playing_time")),
      complexity_rating: Number(formData.get("complexity_rating")),
      price: Number(formData.get("price")),
      image_url: formData.get("image_url") as string,
      thumbnail_url: formData.get("thumbnail_url") as string,
      category_id: formData.get("category_id") as string,
      is_active: formData.get("is_active") === "on",
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSubmit?.(gameData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Game Title *</Label>
              <Input id="title" name="title" defaultValue={game?.title} required />
            </div>

            <div>
              <Label htmlFor="short_description">Short Description *</Label>
              <Textarea 
                id="short_description" 
                name="short_description" 
                defaultValue={game?.short_description} 
                required 
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="description">Full Description *</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={game?.description} 
                required 
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="category_id">Category *</Label>
              <Select name="category_id" defaultValue={game?.category_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="publisher">Publisher *</Label>
              <Input id="publisher" name="publisher" defaultValue={game?.publisher} required />
            </div>

            <div>
              <Label htmlFor="designer">Designer *</Label>
              <Input id="designer" name="designer" defaultValue={game?.designer} required />
            </div>

            <div>
              <Label htmlFor="year_published">Year Published *</Label>
              <Input 
                id="year_published" 
                name="year_published" 
                type="number" 
                defaultValue={game?.year_published} 
                required 
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_players">Min Players *</Label>
                <Input 
                  id="min_players" 
                  name="min_players" 
                  type="number" 
                  defaultValue={game?.min_players} 
                  required 
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="max_players">Max Players *</Label>
                <Input 
                  id="max_players" 
                  name="max_players" 
                  type="number" 
                  defaultValue={game?.max_players} 
                  required 
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="min_age">Minimum Age *</Label>
              <Input 
                id="min_age" 
                name="min_age" 
                type="number" 
                defaultValue={game?.min_age} 
                required 
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="playing_time">Playing Time (minutes) *</Label>
              <Input 
                id="playing_time" 
                name="playing_time" 
                type="number" 
                defaultValue={game?.playing_time} 
                required 
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="complexity_rating">Complexity Rating (1-5) *</Label>
              <Input 
                id="complexity_rating" 
                name="complexity_rating" 
                type="number" 
                defaultValue={game?.complexity_rating} 
                required 
                min="1"
                max="5"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                defaultValue={game?.price} 
                required 
                min="0"
                step="0.01"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Media & Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image_url">Main Image URL *</Label>
              <Input id="image_url" name="image_url" defaultValue={game?.image_url} required />
            </div>

            <div>
              <Label htmlFor="thumbnail_url">Thumbnail URL *</Label>
              <Input id="thumbnail_url" name="thumbnail_url" defaultValue={game?.thumbnail_url} required />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="is_active" name="is_active" defaultChecked={game?.is_active} />
              <Label htmlFor="is_active">Game is active and visible to users</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
