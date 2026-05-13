import { Button } from '@/components/ui/button.jsx';
import { StatusBadge } from '@/components/StatusBadge.jsx';
import {
  FileText,
  Star,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';

/**
 * Component to display a list of applications for a selected job and handle management actions.
 * @param {Object} props
 * @param {Object|null} props.selectedJob - The current job object being viewed
 * @param {Array} props.applications - List of application objects including student data
 * @param {Object|null} props.processingAction - Metadata about an action currently in progress
 * @param {Function} props.onShortlist - Async handler to shortlist a student
 * @param {Function} props.onRefer - Async handler to refer a student
 */
export function JobApplications({
  selectedJob,
  applications = [],
  processingAction,
  onShortlist,
  onRefer,
}) {
  
  // Helper to determine if a specific button should show a loading state
  const isProcessingThis = (jobId, studentAddress, action) => {
    return (
      processingAction?.jobId === jobId &&
      processingAction?.studentAddress === studentAddress &&
      processingAction?.action === action
    );
  };

  // Replace with your actual project utility for Aptos explorer links
  const getExplorerUrl = (txHash) => `https://explorer.aptoslabs.com/txn/${txHash}`;

  if (!selectedJob) {
    return (
      <div className="bg-card rounded-lg border border-border/50 shadow-sm">
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a job to view applications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">
          Applications for {selectedJob.title}
        </h3>
      </div>
      <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No applications yet
          </div>
        ) : (
          applications.map(({ student, status, txHash }) => (
            <div
              key={student.walletAddress}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.college} • {student.department}
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>

              {txHash && (
                <a
                  href={getExplorerUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mb-3"
                >
                  Application TX
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex gap-2">
                {/* Shortlist Action */}
                {status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onShortlist(selectedJob.id, student.walletAddress)}
                    disabled={!!processingAction}
                  >
                    {isProcessingThis(selectedJob.id, student.walletAddress, 'shortlist') ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : (
                      <Star className="w-3.5 h-3.5 mr-2" />
                    )}
                    Sign & Shortlist
                  </Button>
                )}

                {/* Referral Action */}
                {(status === 'pending' || status === 'shortlisted') && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onRefer(selectedJob.id, student.walletAddress)}
                    disabled={!!processingAction}
                  >
                    {isProcessingThis(selectedJob.id, student.walletAddress, 'refer') ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : (
                      <Send className="w-3.5 h-3.5 mr-2" />
                    )}
                    Sign & Refer
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}