import { Button } from '@/components/ui/button.jsx';
import { StatusBadge } from '@/components/StatusBadge.jsx';
import {
  FileText,
  CheckCircle,
  Loader2,
  ExternalLink,
  XCircle,
} from 'lucide-react';

/**
 * Component to display a list of applications for a selected referral and handle management actions.
 * @param {Object} props
 * @param {Object|null} props.selectedReferral - The current referral object being viewed
 * @param {Array} props.applications - List of application objects including student data
 * @param {Object|null} props.processingAction - Metadata about an action currently in progress
 * @param {Function} props.onAccept - Async handler to accept and refer a student
 * @param {Function} props.onReject - Async handler to reject an application
 */
export function ReferralApplications({
  selectedReferral,
  applications = [],
  processingAction,
  onAccept,
  onReject,
}) {
  
  /**
   * Helper to determine if a specific button should show a loading state
   */
  const isProcessingThis = (referralId, studentAddress, action) => {
    return (
      processingAction?.referralId === referralId &&
      processingAction?.studentAddress === studentAddress &&
      processingAction?.action === action
    );
  };

  /**
   * Helper to generate Aptos Explorer URLs. 
   * Replace with your actual project utility if available globally.
   */
  const getExplorerUrl = (txHash) => `https://explorer.aptoslabs.com/txn/${txHash}`;

  if (!selectedReferral) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm">
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a referral to view applications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">
          Applications for {selectedReferral.title}
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
                {/* Maps 'accepted' status to 'referred' for the badge display */}
                <StatusBadge status={status === 'accepted' ? 'referred' : status} />
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
                {status === 'pending' && (
                  <>
                    {/* Accept/Refer Action */}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => onAccept(selectedReferral.id, student.walletAddress)}
                      disabled={!!processingAction}
                    >
                      {isProcessingThis(selectedReferral.id, student.walletAddress, 'accept') ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 mr-2" />
                      )}
                      Sign & Accept
                    </Button>

                    {/* Reject Action */}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(selectedReferral.id, student.walletAddress)}
                      disabled={!!processingAction}
                    >
                      {isProcessingThis(selectedReferral.id, student.walletAddress, 'reject') ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 mr-2" />
                      )}
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}