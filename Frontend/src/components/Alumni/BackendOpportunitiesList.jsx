import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Briefcase,
  Plus,
  Building2,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';

/**
 * List component to display job/referral opportunities created by the alumni.
 * @param {Object} props
 * @param {Array} props.opportunities - Array of opportunity objects
 * @param {Object|null} props.selectedOpportunity - The currently active opportunity
 * @param {Function} props.onSelectOpportunity - Handler for selecting an opportunity
 * @param {Function} props.onCreateOpportunity - Handler for opening the creation modal
 * @param {Function} [props.onEditOpportunity] - Optional handler for editing
 * @param {Function} [props.onDeleteOpportunity] - Optional handler for deleting/closing
 */
export function BackendOpportunitiesList({
  opportunities = [],
  selectedOpportunity,
  onSelectOpportunity,
  onCreateOpportunity,
  onEditOpportunity,
  onDeleteOpportunity,
}) {
  // Empty state handling
  if (opportunities.length === 0) {
    return (
      <div className="bg-card rounded-xl p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Opportunities Posted Yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Create your first opportunity to help students from your college
        </p>
        <Button variant="alumni" onClick={onCreateOpportunity} className='bg-primary text-background'>
          <Plus className="w-4 h-4" />
          Post Opportunity
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">My Opportunities</h2>
        <Button 
          variant="alumni" 
          size="sm"
          onClick={onCreateOpportunity} 
          className='bg-primary text-background'
        >
          <Plus className="w-4 h-4" />
          Post New
        </Button>
      </div>

      {opportunities.map((opportunity) => {
        const isOpen = opportunity.status === 'Open' || opportunity.isActive;
        
        return (
          <motion.div
            key={opportunity._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'w-full bg-card rounded-xl p-4 border-2 transition-all cursor-pointer',
              selectedOpportunity?._id === opportunity._id
                ? 'border-alumni shadow-md'
                : 'border-border/50 hover:border-alumni/50'
            )}
            onClick={() => onSelectOpportunity(opportunity)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{opportunity.jobTitle}</h3>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                    isOpen 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}>
                    {isOpen ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Open
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Closed
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {opportunity.postedBy?.company}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {opportunity.experienceLevel}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 ml-2">
                {onEditOpportunity && isOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditOpportunity(opportunity);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    title="Edit opportunity"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDeleteOpportunity && isOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to close this opportunity? This action cannot be undone.')) {
                        onDeleteOpportunity(opportunity._id);
                      }
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    title="Close opportunity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Skills tags */}
            {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
                {opportunity.requiredSkills.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    +{opportunity.requiredSkills.length - 3} more
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {opportunity.roleDescription}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  <Star className="w-3 h-3 inline mr-1" />
                  {opportunity.referralsGiven || 0}/{opportunity.numberOfReferrals} referrals given
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
              >
                View Applications →
              </Button>
            </div>

            <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Posted on {new Date(opportunity.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}