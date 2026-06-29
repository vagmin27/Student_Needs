import React from "react";
import { Search } from "lucide-react";
import { PremiumInput } from "@/components/ui/input.jsx";
import { Select } from "@/components/ui/select.jsx";

export function ReferralFilters({
  filters = {
    search: "",
    company: "",
    role: "",
    status: "",
    stage: "",
    sortBy: ""
  },
  onFilterChange,
  companies = [],
  roles = []
}) {
  const handleChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [field]: value
      });
    }
  };

  return (
    <div className="bg-card/40 border border-border/40 p-4 rounded-[var(--radius-lg)] space-y-4 shadow-sm w-full">
      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end">
        {/* Search */}
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
            Search
          </label>
          <PremiumInput
            placeholder="Search keywords, candidate or company..."
            leftIcon={Search}
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="h-10"
          />
        </div>

        {/* Company Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
            Company
          </label>
          <Select
            value={filters.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="h-10 text-xs"
          >
            <option value="">All Companies</option>
            {companies?.map((co) => (
              <option key={co} value={co}>
                {co}
              </option>
            ))}
          </Select>
        </div>

        {/* Role Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
            Role
          </label>
          <Select
            value={filters.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="h-10 text-xs"
          >
            <option value="">All Roles</option>
            {roles?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
            Status
          </label>
          <Select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="h-10 text-xs"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="referred">Referred</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>

        {/* Interview Stage Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
            Interview Stage
          </label>
          <Select
            value={filters.stage}
            onChange={(e) => handleChange("stage", e.target.value)}
            className="h-10 text-xs"
          >
            <option value="">All Stages</option>
            <option value="resume_screen">Resume Screen</option>
            <option value="screening">Screening</option>
            <option value="technical">Technical Round</option>
            <option value="managerial">Managerial Round</option>
            <option value="hr">HR Round</option>
            <option value="offered">Offered</option>
          </Select>
        </div>
      </div>

      {/* Sorting & Additional controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            Sort By
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className="bg-transparent text-xs text-foreground font-semibold border-none focus:ring-0 outline-none cursor-pointer"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Candidate A-Z</option>
            <option value="name-desc">Candidate Z-A</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(filters.search || filters.company || filters.role || filters.status || filters.stage || filters.sortBy) && (
          <button
            onClick={() => {
              if (onFilterChange) {
                onFilterChange({
                  search: "",
                  company: "",
                  role: "",
                  status: "",
                  stage: "",
                  sortBy: ""
                });
              }
            }}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
