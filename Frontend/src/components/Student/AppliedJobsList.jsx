import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Target,
} from 'lucide-react';

/**
 * Helper function to determine styling and icons based on application status.
 * @param {string} status 
 */
const getStatusConfig = (status) => {
  switch (status.toLowerCase()) {
    case 'applied':
      return {
        icon: Clock,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        label: 'Applied',
      };
    case 'shortlisted':
      return {
        icon: AlertCircle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        label: 'Shortlisted',
      };
    case 'referred':
      return {
        icon: CheckCircle,
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        label: 'Referred',
      };
    case 'rejected':
      return {
        icon: XCircle,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
        label: 'Rejected',
      };
    default:
      return {
        icon: Clock,
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        borderColor: 'border-border',
        label: status,
      };
  }
};

/**
 * Component to display the list of referral jobs a student has applied to.
 * @param {Object} props
 * @param {Array} props.applications - List of application objects
 * @param {boolean} [props.loading] - Loading state indicator
 */
export function AppliedJobsList({ applications = [], loading }) {
  // Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-card rounded-lg p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Loading Applications...
        </h3>
        <p className="text-muted-foreground">
          Fetching your job applications
        </p>
      </div>
    );
  }

  // Empty State
  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-card rounded-lg p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Applications Yet
        </h3>
        <p className="text-muted-foreground">
          You haven't applied to any referral opportunities yet.
          Browse available opportunities and start applying!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {applications.map((application, index) => {
        const statusConfig = getStatusConfig(application.status);
        const StatusIcon = statusConfig.icon;

        return (
          <motion.div
            key={application._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Job Info Section */}
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {application.opportunity.jobTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>
                        {application.alumni?.firstName} {application.alumni?.lastName}
                        {application.alumni?.currentRole && ` • ${application.alumni.currentRole}`}
                        {application.alumni?.company && ` at ${application.alumni.company}`}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50">
                        <Target className="w-3 h-3" />
                        {application.opportunity.experienceLevel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Role Description Preview */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {application.opportunity.roleDescription}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}