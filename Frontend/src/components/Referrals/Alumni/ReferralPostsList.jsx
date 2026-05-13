import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/utils.js';
import {
  Building2,
  MapPin,
  Plus,
  ExternalLink,
  Star,
} from 'lucide-react';

/**
 * Component to display a list of referral opportunities created by an alumni.
 * @param {Object} props
 * @param {Array} props.referrals - List of referral objects
 * @param {Object|null} props.selectedReferral - Currently selected referral
 * @param {Function} props.onSelectReferral - Handler to select a referral
 * @param {Function} props.onCreateReferral - Handler to open create referral modal
 */
export function ReferralPostsList({
  referrals = [],
  selectedReferral,
  onSelectReferral,
  onCreateReferral,
}) {
  
  /**
   * Helper to generate Aptos Explorer URLs.
   * Replace with your actual project utility if available.
   */
  const getExplorerUrl = (txHash) => `https://explorer.aptoslabs.com/txn/${txHash}`;

  if (referrals.length === 0) {
    return (
      <div className="bg-card rounded-xl p-12 border border-border/50 text-center">
        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Referrals Posted Yet
        </h3>
        <p className="text-muted-foreground mb-4">
          Create your first referral opportunity to help students
        </p>
        <Button variant="alumni" onClick={onCreateReferral} className='bg-primary text-background'>
          <Plus className="w-4 h-4 mr-2" />
          Post Referral
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {referrals.map((referral) => (
        <motion.button
          key={referral.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelectReferral(referral)}
          className={cn(
            'w-full bg-card rounded-xl p-4 border-2 text-left transition-all',
            selectedReferral?.id === referral.id
              ? 'border-alumni shadow-md'
              : 'border-border/50 hover:border-alumni/50'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{referral.title}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
              {referral.type}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {referral.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {referral.location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">
                {referral.applications?.length || 0} applications
              </span>
              <span className="text-success">
                {referral.accepted?.length || 0} accepted
              </span>
            </div>

            <div className="flex items-center gap-2">
              {referral.ipfsCid && (
                <a
                  href={referral.ipfsUrl || `https://gateway.pinata.cloud/ipfs/${referral.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  title="View on IPFS"
                >
                  IPFS
                </a>
              )}
              {referral.txHash && (
                <a
                  href={getExplorerUrl(referral.txHash)}
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