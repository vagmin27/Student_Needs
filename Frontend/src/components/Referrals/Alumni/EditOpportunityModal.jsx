import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Modal component for alumni to edit an existing referral/job opportunity.
 * @param {Object} props
 * @param {boolean} props.showModal - Controls visibility of the modal
 * @param {Function} props.onClose - Handler to close the modal
 * @param {Object|null} props.opportunity - The existing opportunity data to be edited
 * @param {Function} props.onSubmit - Async handler for submitting the update
 * @param {boolean} props.isUpdating - Loading state indicator for the update process
 */
export function EditOpportunityModal({
  showModal,
  onClose,
  opportunity,
  onSubmit,
  isUpdating,
}) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    roleDescription: '',
    requiredSkills: '',
    experienceLevel: 'full-time',
    numberOfReferrals: 1,
  });

  // Update internal form state whenever the opportunity prop changes
  useEffect(() => {
    if (opportunity) {
      setFormData({
        jobTitle: opportunity.jobTitle || '',
        roleDescription: opportunity.roleDescription || '',
        requiredSkills: Array.isArray(opportunity.requiredSkills) 
          ? opportunity.requiredSkills.join('\n') 
          : '',
        experienceLevel: opportunity.experienceLevel || 'full-time',
        numberOfReferrals: opportunity.numberOfReferrals || 1,
      });
    }
  }, [opportunity]);

  const handleSubmit = async () => {
    if (!opportunity) return;

    // Format the data for the API (convert skills string back to array)
    const updateData = {
      jobTitle: formData.jobTitle,
      roleDescription: formData.roleDescription,
      requiredSkills: formData.requiredSkills
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0),
      experienceLevel: formData.experienceLevel,
      numberOfReferrals: formData.numberOfReferrals,
    };

    await onSubmit(opportunity._id, updateData);
  };

  // Prevent rendering if there is no data to edit
  if (!opportunity) return null;

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
            className="bg-card rounded-lg px-6 py-4 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Edit Opportunity</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="border p-1 rounded-sm">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>

              {/* Employment Type */}
              <div>
                <Label htmlFor="edit-type">Employment Type *</Label>
                <select
                  id="edit-type"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              {/* Role Description */}
              <div>
                <Label htmlFor="edit-description">Role Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.roleDescription}
                  onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  required
                />
              </div>

              {/* Required Skills */}
              <div>
                <Label htmlFor="edit-skills">Required Skills (one per line)</Label>
                <Textarea
                  id="edit-skills"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="React&#10;Node.js&#10;TypeScript"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each skill on a new line
                </p>
              </div>

              {/* Number of Referrals */}
              <div>
                <Label htmlFor="edit-referrals">Number of Referrals *</Label>
                <Input
                  id="edit-referrals"
                  type="number"
                  min="1"
                  value={formData.numberOfReferrals}
                  onChange={(e) => setFormData({ ...formData, numberOfReferrals: parseInt(e.target.value) || 1 })}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How many students can you refer for this position?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  variant="alumni"
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-background"
                  disabled={isUpdating || !formData.jobTitle || !formData.roleDescription}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Opportunity'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}