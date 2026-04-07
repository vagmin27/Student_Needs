import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, TrendingUp, CheckCircle2, AlertCircle, Plus, X, Award } from 'lucide-react';
import { studentProfileApi } from '@/services/studentProfile';
import { showTransactionToast, dismissToast } from '@/components/TransactionToast';
// Import new profile section components
import { ResumeSection } from '@/components/Student/ResumeSection';
import { LinkedInSection } from '@/components/Student/LinkedInSection';
import { GitHubSection } from '@/components/Student/GitHubSection';

export function StudentProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState(null);

  // Form data
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear() + 1);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [preferredRoles, setPreferredRoles] = useState([]);
  const [roleInput, setRoleInput] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchProfileStatus();
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      // Fetch applications to get interview and profile scores
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'}/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const applications = data.data || data;
        
        // Calculate average scores from all applications
        let totalProfileScore = 0;
        let totalInterviewScore = 0;
        let count = 0;
        
        applications.forEach((app) => {
          if (app.studentDetails?.profileScore !== undefined && app.studentDetails?.profileScore !== null) {
            totalProfileScore += app.studentDetails.profileScore;
            count++;
          }
          if (app.studentDetails?.interviewScore !== undefined && app.studentDetails?.interviewScore !== null) {
            totalInterviewScore += app.studentDetails.interviewScore;
          }
        });
        
        const avgProfileScore = count > 0 ? totalProfileScore / count : null;
        const avgInterviewScore = applications.length > 0 ? totalInterviewScore / applications.length : null;
        
        let combinedScore = null;
        if (avgProfileScore !== null && avgInterviewScore !== null) {
          combinedScore = (avgProfileScore * avgInterviewScore) / 100;
        }
        
        setScores({
          profileScore: avgProfileScore,
          interviewScore: avgInterviewScore,
          combinedScore: combinedScore
        });
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await studentProfileApi.getProfile();
      if (response.success) {
        const profileData = response.data;
        setProfile(profileData);
        
        // Populate form fields
        setBranch(profileData.branch || '');
        setGraduationYear(profileData.graduationYear || new Date().getFullYear() + 1);
        setSkills(profileData.skills || []);
        setProjects(profileData.projects || []);
        setCertifications(profileData.certifications || []);
        setPreferredRoles(profileData.preferredRoles || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStatus = async () => {
    try {
      const response = await studentProfileApi.getProfileStatus();
      if (response.success) {
        setProfileStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile status:', error);
    }
  };

  const refreshProfile = async () => {
    await Promise.all([fetchProfile(), fetchProfileStatus()]);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const toastId = showTransactionToast({
      type: 'pending',
      message: 'Updating profile...',
    });

    try {
      const response = await studentProfileApi.updateProfile({
        branch,
        graduationYear,
        skills,
        projects,
        certifications,
        preferredRoles,
      });

      dismissToast(toastId);
      if (response.success) {
        setProfile(response.data);
        showTransactionToast({
          type: 'success',
          message: 'Profile updated successfully!',
        });
        
        // Refresh profile status
        await fetchProfileStatus();
      }
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addProject = () => {
    if (projectTitle.trim()) {
      setProjects([...projects, { 
        title: projectTitle.trim(), 
        description: projectDescription.trim(), 
        link: projectLink.trim() 
      }]);
      setProjectTitle('');
      setProjectDescription('');
      setProjectLink('');
    }
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (certName.trim()) {
      setCertifications([...certifications, { 
        name: certName.trim(), 
        issuer: certIssuer.trim(), 
        date: certDate 
      }]);
      setCertName('');
      setCertIssuer('');
      setCertDate('');
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addRole = () => {
    if (roleInput.trim() && !preferredRoles.includes(roleInput.trim())) {
      setPreferredRoles([...preferredRoles, roleInput.trim()]);
      setRoleInput('');
    }
  };

  const removeRole = (role) => {
    setPreferredRoles(preferredRoles.filter(r => r !== role));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your profile information</p>
        </div>
      </div>

      {/* Profile Completion Status */}
      {profileStatus && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Profile Completeness</CardTitle>
                  <CardDescription>
                    {profileStatus.completeness}% Complete - {profileStatus.strength}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={
                profileStatus.strength === 'Strong' ? 'default' :
                profileStatus.strength === 'Medium' ? 'secondary' : 'destructive'
              }>
                {profileStatus.strength}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary rounded-full h-3 mb-4">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${profileStatus.completeness}%` }}
              />
            </div>
            {profileStatus.missingFields.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Missing fields:</span>{' '}
                  {profileStatus.missingFields.join(', ')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interview & Profile Scores */}
      {scores && (scores.profileScore !== null || scores.interviewScore !== null) && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-600" />
                <div>
                  <CardTitle className="text-lg">Interview Performance</CardTitle>
                  <CardDescription>Your scores from interviews and applications</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Profile Score */}
              {scores.profileScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-4 rounded-lg border border-amber-200"
                >
                  <div className="text-sm font-medium text-muted-foreground mb-2">Profile Score</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-amber-600">
                      {scores.profileScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scores.profileScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Average compatibility score</p>
                </motion.div>
              )}

              {/* Interview Score */}
              {scores.interviewScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-4 rounded-lg border border-blue-200"
                >
                  <div className="text-sm font-medium text-muted-foreground mb-2">Interview Score</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {scores.interviewScore.toFixed(0)}/100
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(scores.interviewScore, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Average interview performance</p>
                </motion.div>
              )}

              {/* Combined Score */}
              {scores.combinedScore !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-4 rounded-lg border border-green-200"
                >
                  <div className="text-sm font-medium text-muted-foreground mb-2">Combined Score</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-600">
                      {scores.combinedScore.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((scores.combinedScore / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">(Profile Score × Interview Score) / 100</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your account details (cannot be changed)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={profile?.firstName || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={profile?.lastName || ''} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label>College</Label>
              <Input value={profile?.college?.name || ''} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch/Department</Label>
              <Input
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(parseInt(e.target.value))}
                placeholder="2024"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your technical and soft skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="e.g., React, Python, Communication"
              />
              <Button onClick={addSkill} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Add your notable projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Project Title (required)"
              />
              <Input
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Description (optional)"
              />
              <div className="flex gap-2">
                <Input
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="Project Link (optional)"
                />
                <Button onClick={addProject} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {projects.map((project, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {project.title}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeProject(index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Add your professional certifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder="Certification Name (required)"
              />
              <Input
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="Issuer (optional)"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  placeholder="Date (optional)"
                />
                <Button onClick={addCertification} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {cert.name}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeCertification(index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferred Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Preferred Roles</CardTitle>
            <CardDescription>What positions are you interested in?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRole()}
                placeholder="e.g., Frontend Developer"
              />
              <Button onClick={addRole} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferredRoles.map((role) => (
                <Badge key={role} variant="secondary" className="gap-1">
                  {role}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeRole(role)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents & Links Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Documents & Links</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          <ResumeSection 
            resume={profile?.resume} 
            onResumeChange={refreshProfile} 
          />
          <LinkedInSection 
            linkedIn={profile?.linkedIn} 
            onLinkedInChange={refreshProfile} 
          />
          <GitHubSection 
            githubUrl={profile?.githubUrl} 
            onGitHubChange={refreshProfile} 
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={saving}
          size="lg"
          className="min-w-[150px]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}