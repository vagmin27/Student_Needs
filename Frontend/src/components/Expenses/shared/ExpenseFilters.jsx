import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable filter toolbar component for the Expenses tracker.
 * Standardizes inputs, select boxes, datepickers, spacing, responsiveness, and style classes.
 */
export default function ExpenseFilters({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search category or amount...",
  
  filterCategory,
  onCategoryChange,
  categories = [],
  
  filterDate,
  onDateChange,
  datePlaceholder = "Filter by Date",
  
  filterStatus,
  onStatusChange,
  statuses = [],
  
  sortBy,
  onSortChange,
  sortOptions = [],
  
  className
}) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full p-6 bg-[var(--bg-secondary)]/10 border-b border-border/40", className)}>
      {onSearchChange && (
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 text-muted-foreground w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="premium-input pl-10 text-sm h-10 w-full"
          />
        </div>
      )}
      
      {onCategoryChange && (
        <select
          value={filterCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="premium-input text-sm h-10 cursor-pointer text-foreground bg-secondary w-full"
        >
          <option value="" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">
              {cat}
            </option>
          ))}
        </select>
      )}
      
      {onDateChange && (
        <div className="relative flex items-center w-full">
          <Calendar className="absolute left-3 text-muted-foreground w-4 h-4 pointer-events-none z-10" />
          <DatePicker
            selected={filterDate}
            onChange={onDateChange}
            isClearable
            placeholderText={datePlaceholder}
            className="premium-input pl-10 w-full text-sm h-10 cursor-pointer bg-secondary"
          />
        </div>
      )}
      
      {onStatusChange && (
        <select
          value={filterStatus || ""}
          onChange={(e) => onStatusChange(e.target.value)}
          className="premium-input text-sm h-10 cursor-pointer text-foreground bg-secondary w-full"
        >
          <option value="" className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">All Statuses</option>
          {statuses?.map((status) => (
            <option key={status} value={status} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">
              {status}
            </option>
          ))}
        </select>
      )}
      
      {onSortChange && (
        <select
          value={sortBy || ""}
          onChange={(e) => onSortChange(e.target.value)}
          className="premium-input text-sm h-10 cursor-pointer text-foreground bg-secondary w-full"
        >
          {sortOptions?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[var(--bg-nav-container)] text-[var(--text-primary)]">
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
