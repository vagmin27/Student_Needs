import { Button } from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Loader2,
  Building2,
  Calendar,
  TrendingUp,
  Briefcase,
  Target,
  Eye,
} from 'lucide-react';

/**
 * Component to display a grid of referral opportunities for students.
 * @param {Object} props
 * @param {Array} props.opportunities - List of opportunity objects
 * @param {Array} props.appliedOpportunities - Array of opportunity IDs the student has applied to
 * @param {boolean} [props.loading] - Loading state for the list
 * @param {string|null} props.isApplying - ID of the opportunity currently being processed
 * @param {Function} props.onApply - Handler for applying
 * @param {Function} props.onViewDetails - Handler for opening the details modal
 * @param {boolean} [props.canApply=true] - Permission flag for the student
 */
export function OpportunitiesList({ 
  opportunities = [], 
  appliedOpportunities = [],
  loading,
  isApplying, 
  onApply,
  onViewDetails,
  canApply = true 
}) {
  const navigate = useNavigate();

  const handleApplyClick = (opportunityId) => {
    // Redirect to interview page with opportunity ID
    navigate(`/student/interview?opportunityId=${opportunityId}`);
  };
  
  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-card rounded-lg p-12 border border-border/50 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Loading Opportunities...
        </h3>
        <p className="text-muted-foreground">
          Fetching referral opportunities from your college
        </p>
      </div>
    );
  }

  // Empty State
  if (opportunities.length === 0) {
    return (
      <div className="bg-card max-w-7xl mx-auto rounded-lg p-12 border border-border/50 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Referral Opportunities Yet
        </h3>
        <p className="text-muted-foreground">
          Referral opportunities from your college alumni will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
      {opportunities.map((opportunity) => {
        const hasApplied = appliedOpportunities.includes(opportunity._id);
        const referralsGiven = opportunity.referralsGiven || 0;
        const referralsLeft = (opportunity.numberOfReferrals || 0) - referralsGiven;
        const isOpen = opportunity.status === 'Open' || opportunity.isActive;

        return (
          <div
            key={opportunity._id}
            className="bg-card rounded-lg p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col hover:border-primary/30"
          >
            <div className="flex-1">
              {/* Header with Referral Count */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
                  {opportunity.jobTitle}
                </h3>
                {referralsLeft > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium ml-2 flex-shrink-0">
                    <TrendingUp className="w-3 h-3" />
                    {referralsLeft} left
                  </div>
                )}
              </div>

              {/* Posted By Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 bg-muted/30 p-2 rounded-md">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {opportunity.postedBy?.firstName} {opportunity.postedBy?.lastName}
                  </span>
                  <span className="text-xs">
                    {opportunity.postedBy?.designation} at {opportunity.postedBy?.company}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {opportunity.roleDescription}
              </p>

              {/* Skills */}
              {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {opportunity.requiredSkills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                  {opportunity.requiredSkills.length > 3 && (
                    <span className="inline-block px-2 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                      +{opportunity.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Experience Level & Date */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50">
                  <Target className="w-3 h-3" />
                  {opportunity.experienceLevel}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                    <Briefcase className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                    <Briefcase className="w-3 h-3" />
                    Closed
                  </span>
                )}
                {referralsLeft === 0 && (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                    Slots Full
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
              <Button
                variant="outline"
                onClick={() => onViewDetails(opportunity)}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {hasApplied ? (
                <Button variant="default" disabled className="w-full bg-success/20 text-success hover:bg-success/20">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </Button>
              ) : referralsLeft === 0 || !isOpen ? (
                <Button variant="secondary" disabled className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Not Available
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => handleApplyClick(opportunity._id)}
                  disabled={!canApply}
                  className='w-full bg-primary text-background hover:bg-primary/90'
                >
                  <Users className="w-4 h-4 mr-2" />
                  Start Interview
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}