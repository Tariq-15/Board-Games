"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface GamePaginationProps {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}

export function GamePagination({ currentPage, totalPages, searchParams }: GamePaginationProps) {
  const router = useRouter()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value)
      }
    })
    if (page > 1) {
      params.set("page", page.toString())
    }
    return `/games?${params.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = i + 1
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => router.push(createPageUrl(page))}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
