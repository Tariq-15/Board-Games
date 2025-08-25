"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { GameService } from "@/lib/services/GameService"
import type { Game } from "@/Model/Game"

interface SearchWithSuggestionsProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchWithSuggestions({
  placeholder = "Search games...",
  className = "",
  onSearch,
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Handle search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const gameService = new GameService()
        const results = await gameService.searchGames(query)
        setSuggestions(results.slice(0, 5)) // Show top 5 suggestions
      } catch (error) {
        console.error("Search error:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)

    setRecentSearches(newRecentSearches)
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))

    // Perform search
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/games?search=${encodeURIComponent(searchQuery)}`)
    }

    setIsOpen(false)
    setQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleGameClick = (game: Game) => {
    router.push(`/games/${game.id}`)
    setIsOpen(false)
    setQuery("")
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    handleSearch(search)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && <div className="p-4 text-center text-muted-foreground">Searching...</div>}

            {/* Game Suggestions */}
            {!isLoading && suggestions.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b">GAMES</div>
                {suggestions.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => handleGameClick(game)}
                  >
                    <div className="w-12 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={game.image_url || "/placeholder.svg?height=32&width=48"}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium truncate">{game.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {game.category_name}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{game.min_players}-{game.max_players} players</span>
                        <span>•</span>
                        <span>{game.playing_time} min</span>
                        <span>•</span>
                        <span>{game.average_rating || 'N/A'}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">⭐ {game.average_rating || 'N/A'}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!isLoading && query.length < 2 && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">RECENT SEARCHES</span>
                  <Button variant="ghost" size="sm" className="text-xs h-auto p-1" onClick={clearRecentSearches}>
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">{search}</span>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= 2 && suggestions.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p>No games found for "{query}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && query.length < 2 && recentSearches.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">Start typing to search for games</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
