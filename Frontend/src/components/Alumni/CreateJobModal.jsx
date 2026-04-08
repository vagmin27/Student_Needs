import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Loader2 } from 'lucide-react';

/**
 * Modal component for alumni to create and post new job opportunities.
 * @param {Object} props
 * @param {boolean} props.showModal - Controls visibility
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.jobForm - Current form state
 * @param {Function} props.setJobForm - State setter for the form
 * @param {Function} props.onSubmit - Submission handler
 * @param {boolean} props.isCreating - Loading state for submission
 */
export function CreateJobModal({
  showModal,
  onClose,
  jobForm,
  setJobForm,
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
              <h3 className="text-xl font-semibold text-foreground">Post New Job</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className='border p-1 rounded-sm'>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="Tech Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Job Type</Label>
                <select
                  id="type"
                  value={jobForm.type}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, type: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <Label htmlFor="vacancy">Number of Openings</Label>
                <Input
                  id="vacancy"
                  type="number"
                  min="1"
                  value={jobForm.vacancy}
                  onChange={(e) => setJobForm({ ...jobForm, vacancy: e.target.value })}
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the role and responsibilities..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea
                  id="requirements"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="3+ years experience&#10;Bachelor's degree&#10;Strong communication"
                  rows={3}
                />
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Job Posting:</strong> Your job will be saved to the database.
                  If wallet is connected, it will also be recorded on the blockchain.
                </p>
              </div>

              <Button
                variant="alumni"
                className="w-full"
                onClick={onSubmit}
                disabled={!jobForm.title || !jobForm.company || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Post Job
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