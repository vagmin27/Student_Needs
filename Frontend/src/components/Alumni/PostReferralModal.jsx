import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Loader2 } from 'lucide-react';

/**
 * Modal component for alumni to post new referral opportunities.
 * @param {Object} props
 * @param {boolean} props.showModal - Visibility state
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.referralForm - Form data state
 * @param {Function} props.setReferralForm - Form data setter
 * @param {Function} props.onSubmit - Async submission handler
 * @param {boolean} props.isCreating - Loading state for the submit button
 */
export function PostReferralModal({
  showModal,
  onClose,
  referralForm,
  setReferralForm,
  onSubmit,
  isCreating,
}) {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card rounded-lg px-6 py-4 w-full max-w-lg shadow-xl border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Post Referral Opportunity</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className='border p-1 rounded-sm'>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Position Title */}
              <div>
                <Label htmlFor="ref-title">Position Title</Label>
                <Input
                  id="ref-title"
                  value={referralForm.title}
                  onChange={(e) => setReferralForm({ ...referralForm, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </div>

              {/* Company & Location Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ref-company">Company</Label>
                  <Input
                    id="ref-company"
                    value={referralForm.company}
                    onChange={(e) => setReferralForm({ ...referralForm, company: e.target.value })}
                    placeholder="Tech Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="ref-location">Location</Label>
                  <Input
                    id="ref-location"
                    value={referralForm.location}
                    onChange={(e) => setReferralForm({ ...referralForm, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <Label htmlFor="ref-type">Employment Type</Label>
                <select
                  id="ref-type"
                  value={referralForm.type}
                  onChange={(e) =>
                    setReferralForm({ ...referralForm, type: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              {/* Vacancy count */}
              <div>
                <Label htmlFor="ref-vacancy">Number of Positions</Label>
                <Input
                  id="ref-vacancy"
                  type="number"
                  min="1"
                  value={referralForm.vacancy}
                  onChange={(e) => setReferralForm({ ...referralForm, vacancy: e.target.value })}
                  placeholder="e.g., 3"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="ref-description">Description</Label>
                <Textarea
                  id="ref-description"
                  value={referralForm.description}
                  onChange={(e) => setReferralForm({ ...referralForm, description: e.target.value })}
                  placeholder="Describe the opportunity and your connection..."
                  rows={3}
                />
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="ref-requirements">Requirements (one per line)</Label>
                <Textarea
                  id="ref-requirements"
                  value={referralForm.requirements}
                  onChange={(e) => setReferralForm({ ...referralForm, requirements: e.target.value })}
                  placeholder="5+ years experience&#10;Master's degree preferred&#10;Strong leadership skills"
                  rows={3}
                />
              </div>

              {/* Blockchain Info Note */}
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Referral Posting:</strong> Your referral will be saved to the database.
                  If wallet is connected, it will also be recorded on Aptos blockchain.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                variant="alumni"
                className="w-full"
                onClick={onSubmit}
                disabled={!referralForm.title || !referralForm.company || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Posting Referral...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Post Referral
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}