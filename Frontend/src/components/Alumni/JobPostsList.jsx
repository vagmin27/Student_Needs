import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Briefcase,
  Building2,
  MapPin,
  Plus,
  ExternalLink,
} from 'lucide-react';

/**
 * Component to display a list of job postings for an alumni user.
 * @param {Object} props
 * @param {Array} props.jobs - List of job objects
 * @param {Object|null} props.selectedJob - The currently selected job
 * @param {Function} props.onSelectJob - Handler for selecting a job
 * @param {Function} props.onCreateJob - Handler for opening the create job modal
 */
export function JobPostsList({ jobs = [], selectedJob, onSelectJob, onCreateJob }) {
  
  // Replace with your actual project utility for Aptos explorer links
  const getExplorerUrl = (txHash) => `https://explorer.aptoslabs.com/txn/${txHash}`;

  if (jobs.length === 0) {
    return (
      <div className="bg-card rounded-lg p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Jobs Posted Yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Create your first job posting to start receiving applications
        </p>
        <Button variant="alumni" onClick={onCreateJob}>
          <Plus className="w-4 h-4 mr-2" />
          Post Job
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <motion.button
          key={job.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelectJob(job)}
          className={cn(
            'w-full bg-card rounded-lg p-4 border-2 text-left transition-all',
            selectedJob?.id === job.id
              ? 'border-alumni shadow-md'
              : 'border-border/50 hover:border-alumni/50'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{job.title}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {job.type}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">
                {job.applications?.length || 0} applications
              </span>
              <span className="text-success">
                {job.referred?.length || 0} referred
              </span>
            </div>

            <div className="flex items-center gap-2">
              {job.ipfsCid && (
                <a
                  href={job.ipfsUrl || `https://gateway.pinata.cloud/ipfs/${job.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  title="View on IPFS"
                >
                  IPFS
                </a>
              )}
              {job.txHash && (
                <a
                  href={getExplorerUrl(job.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}