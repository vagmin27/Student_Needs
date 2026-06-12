import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Referrals/ui/button.jsx';
import { cn } from '@/lib/Referrals/utils.js';
import { Eye, MessageSquare, Download, Check, X } from 'lucide-react';
import { applicationsApi } from '@/services/Referrals/application.js';
import { BASE_URL } from '@/services/api/tutorialsApi.js';

/**
 * Card component to display and manage a student's job application.
 * @param {Object} props
 * @param {Object} props.application - Application data including student profile and status
 * @param {string} props.opportunityId - ID of the job/referral opportunity
 * @param {Function} props.onViewProfile - Handler to open full student profile
 * @param {Function} props.onShortlist - Handler to shortlist the candidate
 * @param {Function} props.onReject - Handler to reject the application
 * @param {Function} props.onRefer - Handler to provide the final referral
 * @param {Function} props.onApprove - Handler to approve the application
 */
export function ApplicationCard({
  application,
  opportunityId,
  onViewProfile,
  onShortlist,
  onReject,
  onRefer,
  onApprove,
}) {
  const navigate = useNavigate();
  const student = application.student || application.profileSnapshot || {};
  const studentId = student._id || application.student;

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${BASE_URL}/${cleanImg.startsWith('uploads/') ? cleanImg : `uploads/${cleanImg}`}`;
  };

  const handleDownloadResume = async (e) => {
    e.stopPropagation();
    if (!studentId) return;
    try {
      await applicationsApi.downloadStudentResume(studentId);
    } catch (error) {
      console.error('Failed to download resume:', error);
    }
  };

  const status = application.status;
  const isPending = status === 'pending' || status === 'Applied';
  const isApproved = status === 'approved' || status === 'Referred' || status === 'Shortlisted';
  const isRejected = status === 'rejected' || status === 'Rejected';

  const handleApprove = (e) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove(application._id);
    } else if (onShortlist) {
      onShortlist(application._id, opportunityId);
    }
  };

  const handleReject = (e) => {
    e.stopPropagation();
    onReject(application._id, opportunityId);
  };

  return (
    <div className="bg-card/40 backdrop-blur-md rounded-[var(--radius-md)] p-5 border border-border/50 shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          {student.image ? (
            <img
              src={getImageUrl(student.image)}
              alt={`${student.firstName || ''} ${student.lastName || ''}`}
              className="w-12 h-12 rounded-full object-cover border border-primary/20"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/5.x/initials/svg?seed=${student.firstName || 'Student'}`;
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-primary font-bold text-base">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-lg text-foreground leading-snug">
              {student.firstName} {student.lastName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {student.email}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              {student.branch || student.department} • Class of {student.graduationYear}
            </p>
            
            {/* Applied Role */}
            <p className="text-xs font-medium text-primary mt-2">
              Role: <span className="text-foreground font-medium">{application.opportunity?.jobTitle || 'N/A'}</span>
            </p>

            {/* CGPA Display */}
            {student.cgpa !== undefined && student.cgpa !== null && (
              <p className="text-xs font-medium text-muted-foreground mt-1">
                CGPA: <span className="text-foreground font-semibold">{Number(student.cgpa).toFixed(2)}</span> / 10.0
              </p>
            )}

            {/* Resume Details with Download Button */}
            {application.resumeSnapshot?.fileName && (
              <div className="flex items-center gap-2 mt-2 bg-muted/40 px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-border/30 w-fit">
                <span className="text-xs text-muted-foreground max-w-[150px] truncate" title={application.resumeSnapshot.fileName}>
                  📄 {application.resumeSnapshot.fileName}
                </span>
                <button
                  onClick={handleDownloadResume}
                  className="p-1 hover:bg-primary/20 rounded text-primary transition-colors"
                  title="Download Resume"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Skills Preview */}
            {student.skills && student.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {student.skills.slice(0, 4)?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
                {student.skills.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    +{student.skills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <span className={cn(
          "text-xs px-2.5 py-1 rounded-full font-medium border capitalize",
          isPending && "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30/20",
          isApproved && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          isRejected && "bg-rose-500/10 text-rose-400 border-rose-500/20"
        )}>
          {status === 'pending' ? 'Pending' : status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : status}
        </span>
      </div>

      {/* Profile Completeness */}
      {student.profileCompleteness !== undefined && (
        <div className="flex items-center gap-2.5 mt-3 mb-4 bg-muted/20 p-2 rounded-[var(--radius-sm)] border border-border/20">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Completeness</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                student.profileCompleteness >= 80 ? "bg-emerald-500" :
                student.profileCompleteness >= 50 ? "bg-amber-500" : "bg-rose-500"
              )}
              style={{ width: `${student.profileCompleteness}%` }}
            />
          </div>
          <span className="text-xs font-bold text-foreground">
            {student.profileCompleteness}%
          </span>
        </div>
      )}

      {/* Action Buttons based on status */}
      {isPending && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/20"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            className="flex-1 border-rose-500/30 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
          >
            <X className="w-4 h-4 mr-1.5" />
            Reject
          </Button>
        </div>
      )}

      {isApproved && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewProfile(studentId, application.chatId)}
            className="flex-1 text-primary hover:text-primary hover:bg-primary/10 border border-primary/20"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Profile
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/alumni/chat?chatId=${application.chatId || ''}`)}
            className="flex-1 text-primary hover:text-primary hover:bg-primary/10 border border-primary/20"
          >
            <MessageSquare className="w-4 h-4 mr-1.5" />
            Message
          </Button>
        </div>
      )}

      {/* Applied date */}
      {application.appliedAt && (
        <p className="text-[10px] text-muted-foreground mt-4 text-center border-t border-border/20 pt-2">
          Applied on {new Date(application.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}