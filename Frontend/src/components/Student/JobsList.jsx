import { Button } from '@/components/ui/button.jsx';
import {
  Briefcase,
  CheckCircle,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  Users,
} from 'lucide-react';

/**
 * Component to display a grid of job opportunities for students.
 * @param {Object} props
 * @param {Array} props.jobs - List of job objects
 * @param {Object|null} props.student - Current student profile data
 * @param {string|null} props.isApplying - The ID of the job currently being processed for application
 * @param {Function} props.onApply - Handler function to trigger the application process
 */
export function JobsList({ jobs = [], student, isApplying, onApply }) {
  // Empty State
  if (jobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto bg-card rounded-lg p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Jobs Posted Yet
        </h3>
        <p className="text-muted-foreground">
          Check back later for new opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
      {jobs.map((job) => {
        const hasApplied = student?.appliedJobs?.includes(job.id);
        const canApply = student?.resumeStatus === 'verified';

        return (
          <div
            key={job.id}
            className="bg-card rounded-lg p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col mt-4"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {job.title}
              </h3>
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
                {job.vacancy && (
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Users className="w-4 h-4" />
                    {job.vacancy} {job.vacancy === 1 ? 'Opening' : 'Openings'}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              <span className="inline-block mt-3 px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                {job.type}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex flex-col items-start">
              {hasApplied ? (
                <Button variant="success" disabled>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </Button>
              ) : (
                <Button
                  variant="student"
                  onClick={() => onApply(job.id)}
                  disabled={!canApply || isApplying === job.id}
                  className='bg-primary text-background rounded-md'
                >
                  {isApplying === job.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Signing...
                    </>
                  ) : (
                    'Sign & Apply'
                  )}
                </Button>
              )}
              
              {!canApply && !hasApplied && (
                <p className="text-xs text-warning mt-2">
                  Resume must be verified
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}