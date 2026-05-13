import { Button } from '@/components/ui/button.jsx';
import {
  Users,
  CheckCircle,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
} from 'lucide-react';

/**
 * ReferralsList Component
 * Displays a grid of referral opportunities posted by alumni.
 * * @param {Object} props
 * @param {Array} props.jobs - Array of Job objects available for referral
 * @param {Object|null} props.student - Current logged-in student profile
 * @param {string|null} props.isApplying - ID of the job currently being processed
 * @param {Function} props.onApply - Async handler to trigger the referral application
 */
export function ReferralsList({ jobs, student, isApplying, onApply }) {
  // All jobs posted by alumni are referral opportunities
  const referralJobs = jobs || [];

  if (referralJobs.length === 0) {
    return (
      <div className="bg-card max-w-7xl mx-auto rounded-lg p-12 border border-border/50 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Referral Opportunities Yet
        </h3>
        <p className="text-muted-foreground">
          Referral opportunities will appear here when alumni post them
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
      {referralJobs.map((job) => {
        const hasApplied = student?.appliedJobs?.includes(job.id);
        const canApply = student?.resumeStatus === 'verified';
        const referralCount = job.referred?.length || 0;

        return (
          <div
            key={job.id}
            className="bg-card rounded-lg p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col mt-4"
          >
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {job.title}
                </h3>
                {referralCount > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {referralCount} Referred
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {job.type}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  Referral Available
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex flex-col items-start">
              {hasApplied ? (
                <Button variant="success" disabled className="w-full justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </Button>
              ) : (
                <Button
                  variant="student"
                  onClick={() => onApply(job.id)}
                  disabled={!canApply || isApplying === job.id}
                  className="bg-primary text-background rounded-md w-full justify-center"
                >
                  {isApplying === job.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Apply for Referral
                    </>
                  )}
                </Button>
              )}
              
              {!canApply && !hasApplied && (
                <p className="text-xs text-yellow-600 mt-2">
                  Resume must be verified to apply
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}