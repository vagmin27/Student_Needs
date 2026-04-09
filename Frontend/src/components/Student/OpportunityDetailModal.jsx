import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import {
  X,
  Building2,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle,
  Loader2,
} from 'lucide-react';

/**
 * Modal component to display detailed information about a referral opportunity.
 * @param {Object} props
 * @param {Object|null} props.opportunity - The opportunity data object
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onApply - Async function to handle the application process
 * @param {boolean} props.isApplying - Loading state indicator for the application process
 * @param {boolean} props.hasApplied - Boolean indicating if the student has already applied
 */
export function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  onApply,
  isApplying,
  hasApplied,
}) {
  if (!isOpen || !opportunity) return null;

  const referralsGiven = opportunity.referralsGiven || 0;
  const referralsLeft = (opportunity.numberOfReferrals || 0) - referralsGiven;
  const isOpen_ = opportunity.status === 'Open' || opportunity.isActive;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {opportunity.jobTitle}
                </h2>
                {isOpen_ ? (
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
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Building2 className="w-4 h-4" />
                <span>
                  {opportunity.postedBy?.firstName} {opportunity.postedBy?.lastName} • {opportunity.postedBy?.designation} at {opportunity.postedBy?.company}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground uppercase">Experience</p>
                <p className="font-semibold text-foreground">{opportunity.experienceLevel}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground uppercase">Referrals</p>
                <p className="font-semibold text-foreground">{referralsGiven}/{opportunity.numberOfReferrals}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
                <p className="text-xs text-muted-foreground uppercase">Slots Left</p>
                <p className="font-semibold text-foreground">{referralsLeft}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground uppercase">Posted</p>
                <p className="font-semibold text-foreground">
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Role Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Role Description
              </h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
                  {opportunity.roleDescription}
                </p>
              </div>
            </div>

            {/* Required Skills Tags */}
            {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Referrer/Alumni Card */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                About the Referrer
              </h3>
              <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {opportunity.postedBy?.firstName?.[0]}{opportunity.postedBy?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {opportunity.postedBy?.firstName} {opportunity.postedBy?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {opportunity.postedBy?.designation} at {opportunity.postedBy?.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="sticky bottom-0 bg-card border-t border-border p-6">
            {hasApplied ? (
              <Button disabled className="w-full bg-success/20 text-success hover:bg-success/20">
                <CheckCircle className="w-4 h-4 mr-2" />
                Already Applied
              </Button>
            ) : !isOpen_ ? (
              <Button variant="secondary" disabled className="w-full">
                <X className="w-4 h-4 mr-2" />
                Opportunity Closed
              </Button>
            ) : referralsLeft === 0 ? (
              <Button variant="secondary" disabled className="w-full">
                <Users className="w-4 h-4 mr-2" />
                All Slots Filled
              </Button>
            ) : (
              <Button
                onClick={() => onApply(opportunity._id)}
                disabled={isApplying}
                className="w-full bg-primary text-background hover:bg-primary/90"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Apply for Referral
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}