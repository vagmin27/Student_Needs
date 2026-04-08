import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

/**
 * Card component to display and manage a student's job application.
 * @param {Object} props
 * @param {Object} props.application - Application data including student profile and status
 * @param {string} props.opportunityId - ID of the job/referral opportunity
 * @param {Function} props.onViewProfile - Handler to open full student profile
 * @param {Function} props.onShortlist - Handler to shortlist the candidate
 * @param {Function} props.onReject - Handler to reject the application
 * @param {Function} props.onRefer - Handler to provide the final referral
 */
export function ApplicationCard({
  application,
  opportunityId,
  onViewProfile,
  onShortlist,
  onReject,
  onRefer,
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          {/* Profile Image */}
          {application.student.image ? (
            <img
              src={application.student.image}
              alt={`${application.student.firstName} ${application.student.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {application.student.firstName?.[0]}{application.student.lastName?.[0]}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-foreground">
              {application.student.firstName} {application.student.lastName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {application.student.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {application.student.branch || application.student.department} • {application.student.graduationYear}
            </p>
            {/* Skills Preview */}
            {application.student.skills && application.student.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {application.student.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {skill}
                  </span>
                ))}
                {application.student.skills.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    +{application.student.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full capitalize",
          application.status === 'Applied' && "bg-blue-500/10 text-blue-500",
          application.status === 'Shortlisted' && "bg-yellow-500/10 text-yellow-500",
          application.status === 'Referred' && "bg-success/10 text-success",
          application.status === 'Rejected' && "bg-destructive/10 text-destructive"
        )}>
          {application.status}
        </span>
      </div>

      {/* Profile Completeness */}
      {application.student.profileCompleteness !== undefined && (
        <div className="flex items-center gap-2 mt-2 mb-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                application.student.profileCompleteness >= 80 ? "bg-success" :
                application.student.profileCompleteness >= 50 ? "bg-yellow-500" : "bg-destructive"
              )}
              style={{ width: `${application.student.profileCompleteness}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {application.student.profileCompleteness}%
          </span>
        </div>
      )}

      {/* View Full Profile Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onViewProfile(application.student._id)}
        className="w-full mb-3 text-primary hover:text-primary hover:bg-primary/10"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Full Profile
      </Button>
      
      {/* Action Buttons based on status */}
      {application.status === 'Applied' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onShortlist(application._id, opportunityId)}
            className="flex-1"
          >
            Shortlist
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(application._id, opportunityId)}
            className="flex-1 text-destructive hover:text-destructive"
          >
            Reject
          </Button>
        </div>
      )}
      
      {application.status === 'Shortlisted' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onRefer(application._id, opportunityId)}
            className="flex-1 bg-success text-background hover:bg-success/90"
          >
            Provide Referral
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(application._id, opportunityId)}
            className="text-destructive hover:text-destructive"
          >
            Reject
          </Button>
        </div>
      )}

      {/* Applied date */}
      {application.appliedAt && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Applied on {new Date(application.appliedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}