import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ApplicantStatusIndicator } from "./ApplicantStatusIndicator";
import { EmptyState } from "../shared/EmptyState";
import { Briefcase, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export const InteractiveJobsTable = React.memo(({ jobs = [], onRowClick, onActionClick, actionLabel = "View" }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedJobs = useMemo(() => {
    let sortableJobs = [...jobs];
    if (sortConfig.key !== null) {
      sortableJobs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableJobs;
  }, [jobs, sortConfig]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedJobs, currentPage]);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState 
        icon={Briefcase} 
        title="No Jobs Found" 
        description="There are currently no job postings to display." 
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => requestSort('title')} className="-ml-4 h-8 data-[state=open]:bg-accent">
                  Job Title <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('applicants')} className="-ml-4 h-8">
                  Applicants <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs?.map((job) => (
              <TableRow 
                key={job.id || job._id}
                className="cursor-pointer hover:bg-secondary/40"
                onClick={() => onRowClick && onRowClick(job)}
              >
                <TableCell className="font-medium text-foreground">{job.title || job.jobTitle}</TableCell>
                <TableCell>{job.company || job.postedBy?.company || "Unknown"}</TableCell>
                <TableCell>{job.location || job.experienceLevel || "Remote"}</TableCell>
                <TableCell>{job.applicants || job.referralsGiven || 0}</TableCell>
                <TableCell>
                  <ApplicantStatusIndicator status={job.status || (job.isActive ? "Active" : "Closed")} />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick && onActionClick(job);
                    }}
                  >
                    {actionLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, jobs.length)} of {jobs.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
