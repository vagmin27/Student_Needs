import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "../../lib/utils"

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages
    if (currentPage <= 4) return [...pages.slice(0, 5), "...", totalPages]
    if (currentPage >= totalPages - 3) return [1, "...", ...pages.slice(totalPages - 5)]
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
  }

  return (
    <nav className={cn("flex items-center justify-center space-x-1.5 py-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Prev
      </Button>
      
      {getVisiblePages().map((page, index) => {
        if (page === "...") {
          return (
            <span key={`dots-${index}`} className="px-3 py-1.5 text-sm text-[var(--text-muted)] select-none">
              ...
            </span>
          )
        }
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className="w-9 h-9 p-0"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </nav>
  )
}

export { Pagination }
export default Pagination
