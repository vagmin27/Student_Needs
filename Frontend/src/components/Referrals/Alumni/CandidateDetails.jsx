import {
  User,
  Mail,
  Building2,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

/**
 * Component to display detailed profile information of a selected student candidate.
 * @param {Object} props
 * @param {Object|null} props.selectedStudent - The student data object or null if none selected
 */
export function CandidateDetails({ selectedStudent }) {
  
  // Helper to generate Explorer URL (replace with your actual utility if different)
  const getExplorerUrl = (txHash) => `https://explorer.aptoslabs.com/txn/${txHash}`;

  if (!selectedStudent) {
    return (
      <div className="bg-card rounded-lg border border-border/50 shadow-sm">
        <div className="p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a candidate to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-alumni/10 flex items-center justify-center">
            <User className="w-8 h-8 text-alumni" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {selectedStudent.name}
            </h3>
            <p className="text-muted-foreground">{selectedStudent.department}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{selectedStudent.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{selectedStudent.college}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              Class of {selectedStudent.graduationYear}
            </span>
          </div>
        </div>

        {/* Blockchain Verification Section */}
        <div className="pt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Resume Verified On-Chain</p>
          <code className="text-xs font-mono text-foreground bg-muted/50 p-2 rounded block break-all border border-border/30">
            {selectedStudent.resumeHash?.slice(0, 40)}...
          </code>
          
          {selectedStudent.verificationTxHash && (
            <a
              href={getExplorerUrl(selectedStudent.verificationTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
            >
              View verification TX
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}