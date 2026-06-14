import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { EmptyState } from "../dashboard/shared/Primitives";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto max-h-[600px] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-sm bg-[var(--bg-secondary)]/10">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm border-collapse", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-[var(--border-color)]", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-[var(--bg-secondary)]/50 font-medium [&>tr]:last:border-b-0 border-[var(--border-color)]",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--border-color)] transition-colors hover:bg-[var(--neutral-bg)]/50",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, sticky, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-semibold text-[var(--text-secondary)] bg-[var(--bg-secondary)] [&:has([role=checkbox])]:pr-0",
      sticky && "sticky top-0 z-10",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle text-[var(--text-primary)] [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-[var(--text-muted)]", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// High-level generic DataTable component
export const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = "No records found",
  stickyHeader = true,
  onRowClick,
  className,
}) => {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead key={idx} sticky={stickyHeader} className={col.headerClassName}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-40 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
                <span className="text-sm text-[var(--text-muted)]">Loading entries...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
              <div className="py-12 bg-[var(--card-bg)]/20">
                <EmptyState title="No items" description={emptyMessage} />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIdx) => (
            <TableRow
              key={rowIdx}
              onClick={() => onRowClick && onRowClick(row, rowIdx)}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((col, colIdx) => (
                <TableCell key={colIdx} className={col.cellClassName}>
                  {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
