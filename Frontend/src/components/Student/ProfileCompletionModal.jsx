import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
  X,
  CheckCircle,
  User,
  GraduationCap,
  Code,
  FileText,
  Linkedin,
  Github,
  Briefcase,
  Award,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Upload,
} from 'lucide-react';
import {
  studentProfileApi,
  resumeApi,
  linkedInApi,
  githubApi,
} from '@/services/studentProfile.js';

/**
 * Step configuration for the modal
 */
const ALL_STEPS = [
  { key: 'academic', title: 'Academic Details', description: 'Add your branch and graduation year', icon: GraduationCap, field: 'academic' },
  { key: 'skills', title: 'Skills', description: 'Add your technical skills', icon: Code, field: 'skills' },
  { key: 'projects', title: 'Projects', description: 'Showcase your projects', icon: Briefcase, field: 'projects' },
  { key: 'certifications', title: 'Certifications', description: 'Add your certifications', icon: Award, field: 'certifications' },
  { key: 'preferredRoles', title: 'Preferred Roles', description: 'What roles are you looking for?', icon: User, field: 'preferredRoles' },
  { key: 'resume', title: 'Resume', description: 'Upload your resume (PDF)', icon: FileText, field: 'resume' },
  { key: 'linkedIn', title: 'LinkedIn', description: 'Add your LinkedIn profile', icon: Linkedin, field: 'linkedIn' },
  { key: 'github', title: 'GitHub', description: 'Add your GitHub profile', icon: Github, field: 'github' },
];

/**
 * ProfileCompletionModal Component
 * Multi-step form to help students complete their profile.
 * * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onComplete - Final completion callback
 * @param {Object|null} props.profileStatus - The status object from the API
 */
export function ProfileCompletionModal({
  isOpen,
  onClose,
  onComplete,
  profileStatus,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // Form states
  const [academicData, setAcademicData] = useState({ branch: '', graduationYear: new Date().getFullYear() + 1 });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([{ title: '', description: '', link: '' }]);
  const [certifications, setCertifications] = useState([{ name: '', issuer: '' }]);
  const [preferredRoles, setPreferredRoles] = useState([]);
  const [roleInput, setRoleInput] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  // Filtered steps to show only incomplete ones
  const [incompleteSteps, setIncompleteSteps] = useState([]);

  useEffect(() => {
    if (profileStatus) {
      const incomplete = ALL_STEPS.filter(step => {
        const status = profileStatus.breakdown[step.field];
        return status === 'Incomplete';
      });
      setIncompleteSteps(incomplete);
      
      const completed = new Set();
      ALL_STEPS.forEach(step => {
        const status = profileStatus.breakdown[step.field];
        if (status === 'Complete') {
          completed.add(step.key);
        }
      });
      setCompletedSteps(completed);
    }
  }, [profileStatus]);

  const currentStep = incompleteSteps[currentStepIndex];
  const isLastStep = currentStepIndex === incompleteSteps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const saveCurrentStep = async () => {
    if (!currentStep) return;

    switch (currentStep.key) {
      case 'academic':
        if (!academicData.branch || !academicData.graduationYear) {
          throw new Error('Please fill in all academic details');
        }
        await studentProfileApi.updateProfile({
          branch: academicData.branch,
          graduationYear: academicData.graduationYear,
        });
        break;

      case 'skills':
        if (skills.length === 0) {
          throw new Error('Please add at least one skill');
        }
        await studentProfileApi.updateProfile({ skills });
        break;

      case 'projects':
        if (projects.length === 0 || !projects[0].title) {
          throw new Error('Please add at least one project');
        }
        await studentProfileApi.updateProfile({ projects });
        break;

      case 'certifications':
        if (certifications.length === 0 || !certifications[0].name) {
          throw new Error('Please add at least one certification');
        }
        await studentProfileApi.updateProfile({ certifications });
        break;

      case 'preferredRoles':
        if (preferredRoles.length === 0) {
          throw new Error('Please add at least one preferred role');
        }
        await studentProfileApi.updateProfile({ preferredRoles });
        break;

      case 'resume':
        if (!resumeFile) {
          throw new Error('Please upload your resume');
        }
        await resumeApi.uploadResume(resumeFile);
        break;

      case 'linkedIn':
        if (!linkedInUrl) {
          throw new Error('Please add your LinkedIn URL');
        }
        await linkedInApi.updateLinkedInUrl(linkedInUrl);
        break;

      case 'github':
        if (!githubUrl) {
          throw new Error('Please add your GitHub URL');
        }
        try {
          await githubApi.addGithubUrl(githubUrl);
        } catch {
          await githubApi.updateGithubUrl(githubUrl);
        }
        break;
      default:
        break;
    }
  };

  const handleNext = async () => {
    if (!currentStep) return;
    
    setLoading(true);
    setError(null);

    try {
      await saveCurrentStep();
      setCompletedSteps(prev => new Set([...prev, currentStep.key]));

      if (isLastStep) {
        onComplete();
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
      setError(null);
    }
  };

  const handleSkip = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
      setError(null);
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.key) {
      case 'academic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="branch">Branch/Department</Label>
              <Input
                id="branch"
                placeholder="e.g., Computer Science"
                value={academicData.branch}
                onChange={(e) => setAcademicData({ ...academicData, branch: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={academicData.graduationYear}
                onChange={(e) => setAcademicData({ ...academicData, graduationYear: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), (() => {
                  if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                    setSkills([...skills, skillInput.trim()]);
                    setSkillInput('');
                  }
                })())}
              />
              <Button type="button" onClick={() => {
                if (skillInput.trim() && !skills.includes(skillInput.trim())) {
                  setSkills([...skills, skillInput.trim()]);
                  setSkillInput('');
                }
              }} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1">
                  {skill}
                  <button onClick={() => setSkills(skills.filter(s => s !== skill))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Project {index + 1}</span>
                  <button onClick={() => setProjects(projects.filter((_, i) => i !== index))} className="text-destructive"><X className="w-4 h-4" /></button>
                </div>
                <Input placeholder="Title" value={project.title} onChange={(e) => {
                  const updated = [...projects];
                  updated[index].title = e.target.value;
                  setProjects(updated);
                }} />
                <Input placeholder="Description" value={project.description} onChange={(e) => {
                  const updated = [...projects];
                  updated[index].description = e.target.value;
                  setProjects(updated);
                }} />
                <Input placeholder="Link" value={project.link} onChange={(e) => {
                  const updated = [...projects];
                  updated[index].link = e.target.value;
                  setProjects(updated);
                }} />
              </div>
            ))}
            <Button type="button" onClick={() => setProjects([...projects, { title: '', description: '', link: '' }])} variant="outline" className="w-full">+ Add Project</Button>
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-4 text-center">
            <div className="border-2 border-dashed rounded-lg p-8">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer text-primary hover:underline">Click to upload PDF</label>
              {resumeFile && <p className="mt-2 text-sm text-success">{resumeFile.name}</p>}
            </div>
          </div>
        );
        
      case 'linkedIn':
        return (
          <div>
            <Label>LinkedIn Profile URL</Label>
            <Input 
              placeholder="https://linkedin.com/in/username" 
              value={linkedInUrl} 
              onChange={(e) => setLinkedInUrl(e.target.value)} 
            />
          </div>
        );

      case 'github':
        return (
          <div>
            <Label>GitHub Profile URL</Label>
            <Input 
              placeholder="https://github.com/username" 
              value={githubUrl} 
              onChange={(e) => setGithubUrl(e.target.value)} 
            />
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Please complete this section in your profile settings.</p>;
    }
  };

  if (!isOpen) return null;

  if (incompleteSteps.length === 0) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Profile Complete!</h2>
            <p className="text-muted-foreground mb-6">You can now apply for referral opportunities.</p>
            <Button onClick={onComplete} className="w-full">Apply Now</Button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-card border border-border rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Complete Your Profile</h2>
              <p className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {incompleteSteps.length}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${profileStatus?.completeness || 0}%` }} />
            </div>
          </div>

          {currentStep && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <currentStep.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{currentStep.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                </div>
              </div>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {renderStepContent()}
            </div>
          )}

          <div className="flex gap-3">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious} disabled={loading} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip} disabled={loading || isLastStep} className="flex-1">Skip</Button>
            <Button onClick={handleNext} disabled={loading} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLastStep ? 'Complete & Apply' : <>Next <ChevronRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}