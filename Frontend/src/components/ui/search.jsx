import * as React from "react"
import { Search as SearchIcon, X } from "lucide-react"
import { PremiumInput } from "./input"

const Search = React.forwardRef(({ value, onChange, placeholder = "Search...", className, onClear, ...props }, ref) => {
  return (
    <PremiumInput
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      leftIcon={<SearchIcon className="w-4.5 h-4.5 text-[var(--text-muted)]" />}
      rightIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null
      }
      {...props}
    />
  )
})
Search.displayName = "Search"

export { Search }
