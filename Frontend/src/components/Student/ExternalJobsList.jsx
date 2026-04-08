import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Calendar, Building2, Briefcase } from 'lucide-react';

/**
 * Helper function to strip HTML tags from description
 * @param {string} html 
 * @returns {string}
 */
const stripHtml = (html) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Helper function to format timestamp
 * @param {number} timestamp 
 * @returns {string}
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
};

/**
 * Component to display a grid of external job opportunities.
 * @param {Object} props
 * @param {Array} props.jobs - List of external job objects
 * @param {boolean} [props.loading] - Loading state indicator
 */
export function ExternalJobsList({ jobs = [], loading }) {
  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-card rounded-lg p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Loading Jobs...
        </h3>
        <p className="text-muted-foreground">
          Fetching opportunities from around the world
        </p>
      </div>
    );
  }

  // Empty State
  if (jobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto bg-card rounded-lg p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Jobs Available
        </h3>
        <p className="text-muted-foreground">
          Check back later for new opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
      {jobs.map((job) => {
        const cleanDescription = stripHtml(job.description);
        const shortDescription = cleanDescription.length > 150 
          ? cleanDescription.substring(0, 150) + '...' 
          : cleanDescription;

        return (
          <div
            key={job.slug}
            className="bg-card rounded-lg p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col hover:border-primary/30"
          >
            <div className="flex-1">
              {/* Job Title */}
              <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
                {job.title}
              </h3>
              
              {/* Company Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{job.company_name}</span>
                </span>
              </div>

              {/* Location & Remote Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {job.location}
                </span>
                {job.remote && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    Remote
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3 min-h-[4.5rem]">
                {shortDescription}
              </p>

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      +{job.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Job Types */}
              {job.job_types && job.job_types.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.job_types.map((type, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-secondary/50 text-secondary-foreground"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}

              {/* Posted Date */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <Calendar className="w-3 h-3" />
                {formatDate(job.created_at)}
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button
                variant="default"
                className="w-full bg-primary text-background hover:bg-primary/90"
                onClick={() => window.open(job.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Job
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}