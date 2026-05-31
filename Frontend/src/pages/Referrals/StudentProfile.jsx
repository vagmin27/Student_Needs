import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/Referrals/ui/input.jsx";
import { Label } from "@/components/Referrals/ui/label.jsx";
import { Button } from "@/components/Referrals/ui/button.jsx";
import { Textarea } from "@/components/Referrals/ui/textarea.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/Referrals/ui/card.jsx";
import { Badge } from "@/components/Referrals/ui/badge.jsx";
import {
  Loader2,
  Save,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Award,
  Upload,
  Trash2,
  Globe,
  Edit3,
  Mail,
  BookOpen
} from "lucide-react";

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
import { referralsApiClient } from "@/services/apiClient.js";
import {
  showTransactionToast,
  dismissToast,
} from "@/components/Referrals/TransactionToast.jsx";
// Import new profile section components
import { ResumeSection } from "@/components/Referrals/Student/ResumeSection.jsx";
import { LinkedInSection } from "@/components/Referrals/Student/LinkedInSection.jsx";
import { GitHubSection } from "@/components/Referrals/Student/GitHubSection.jsx";
import { PortfolioSection } from "@/components/Referrals/Student/PortfolioSection.jsx";
import { BASE_URL } from "@/services/api/tutorialsApi.js";

export function StudentProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState(null);

  // View / Edit state
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear() + 1);
  const [cgpa, setCgpa] = useState("");
  const [bio, setBio] = useState("");
  const [careerInterests, setCareerInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [preferredRoles, setPreferredRoles] = useState([]);
  const [roleInput, setRoleInput] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchProfileStatus();
    fetchScores();
  }, []);

  const getStudentImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${BASE_URL}/${cleanImg.startsWith('uploads/') ? cleanImg : `uploads/${cleanImg}`}`;
  };

  const fetchScores = async () => {
    try {
      // Fetch applications to get interview and profile scores
      const response = await referralsApiClient.get("/my-applications");
      if (response.status === 200) {
        const data = response.data;
        const applications = data.data?.applications || data.applications || [];

        // Calculate average scores from all applications
        let totalProfileScore = 0;
        let totalInterviewScore = 0;
        let count = 0;

        applications.forEach((app) => {
          if (
            app.studentDetails?.profileScore !== undefined &&
            app.studentDetails?.profileScore !== null
          ) {
            totalProfileScore += app.studentDetails.profileScore;
            count++;
          }
          if (
            app.studentDetails?.interviewScore !== undefined &&
            app.studentDetails?.interviewScore !== null
          ) {
            totalInterviewScore += app.studentDetails.interviewScore;
          }
        });

        const avgProfileScore = count > 0 ? totalProfileScore / count : null;
        const avgInterviewScore =
          applications.length > 0
            ? totalInterviewScore / applications.length
            : null;

        let combinedScore = null;
        if (avgProfileScore !== null && avgInterviewScore !== null) {
          combinedScore = (avgProfileScore * avgInterviewScore) / 100;
        }

        setScores({
          profileScore: avgProfileScore,
          interviewScore: avgInterviewScore,
          combinedScore: combinedScore,
        });
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await studentProfileApi.getProfile();
      if (response.success) {
        const profileData = response.data;
        setProfile(profileData);

        // Populate form fields
        setFirstName(profileData.firstName || "");
        setLastName(profileData.lastName || "");
        setEmail(profileData.email || "");
        setBranch(profileData.branch || "");
        setDegree(profileData.degree || "");
        setGraduationYear(
          profileData.graduationYear || new Date().getFullYear() + 1,
        );
        setCgpa(profileData.cgpa !== undefined && profileData.cgpa !== null ? profileData.cgpa.toString() : "");
        setBio(profileData.bio || "");
        setCareerInterests(profileData.careerInterests || []);
        setSkills(profileData.skills || []);
        setProjects(profileData.projects || []);
        setCertifications(profileData.certifications || []);
        setPreferredRoles(profileData.preferredRoles || []);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to load profile",
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
      console.error("Error fetching profile status:", error);
    }
  };

  const refreshProfile = async () => {
    await Promise.all([fetchProfile(), fetchProfileStatus()]);
  };

  const handleSaveProfile = async () => {
    if (cgpa !== "" && (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10 || isNaN(parseFloat(cgpa)))) {
      showTransactionToast({
        type: "error",
        message: "CGPA must be a valid number between 0.0 and 10.0",
      });
      return;
    }

    setSaving(true);
    const toastId = showTransactionToast({
      type: "pending",
      message: "Updating profile...",
    });

    try {
      const response = await studentProfileApi.updateProfile({
        firstName,
        lastName,
        email,
        branch,
        degree,
        graduationYear,
        cgpa: cgpa !== "" ? parseFloat(cgpa) : null,
        bio,
        careerInterests,
        skills,
        projects,
        certifications,
        preferredRoles,
      });

      dismissToast(toastId);
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        showTransactionToast({
          type: "success",
          message: "Profile updated successfully!",
        });

        // Refresh profile status
        await fetchProfileStatus();
      }
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const toastId = showTransactionToast({
      type: "pending",
      message: "Uploading profile image...",
    });
    try {
      const response = await studentProfileApi.uploadProfileImage(file);
      dismissToast(toastId);
      if (response.success) {
        showTransactionToast({
          type: "success",
          message: "Profile image updated successfully!",
        });
        setProfile(response.data);
        await fetchProfileStatus();
      }
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to upload image",
      });
    }
  };

  const handleImageRemove = async () => {
    const toastId = showTransactionToast({
      type: "pending",
      message: "Removing profile image...",
    });
    try {
      const response = await studentProfileApi.removeProfileImage();
      dismissToast(toastId);
      if (response.success) {
        showTransactionToast({
          type: "success",
          message: "Profile image removed successfully!",
        });
        setProfile(response.data);
        await fetchProfileStatus();
      }
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({
        type: "error",
        message: error.response?.data?.message || "Failed to remove image",
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills?.filter((s) => s !== skill));
  };

  const addCareerInterest = () => {
    if (interestInput.trim() && !careerInterests.includes(interestInput.trim())) {
      setCareerInterests([...careerInterests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const removeCareerInterest = (interest) => {
    setCareerInterests(careerInterests?.filter((i) => i !== interest));
  };

  const addProject = () => {
    if (projectTitle.trim()) {
      setProjects([
        ...projects,
        {
          title: projectTitle.trim(),
          description: projectDescription.trim(),
          link: projectLink.trim(),
        },
      ]);
      setProjectTitle("");
      setProjectDescription("");
      setProjectLink("");
    }
  };

  const removeProject = (index) => {
    setProjects(projects?.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (certName.trim()) {
      setCertifications([
        ...certifications,
        {
          name: certName.trim(),
          issuer: certIssuer.trim(),
          date: certDate,
        },
      ]);
      setCertName("");
      setCertIssuer("");
      setCertDate("");
    }
  };

  const removeCertification = (index) => {
    setCertifications(certifications?.filter((_, i) => i !== index));
  };

  const addRole = () => {
    if (roleInput.trim() && !preferredRoles.includes(roleInput.trim())) {
      setPreferredRoles([...preferredRoles, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const removeRole = (role) => {
    setPreferredRoles(preferredRoles?.filter((r) => r !== role));
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
          <p className="text-muted-foreground mt-1">
            Manage your profile information and track your application completeness
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary text-background font-semibold hover:bg-primary/95"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {!isEditing ? (
        /* ================= VIEW MODE ================= */
        <div className="space-y-6">
          {/* Banner & Avatar Card */}
          <div className="relative bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-lg">
            <div className="h-32 bg-gradient-to-r from-primary/30 via-accent/30 to-purple-600/30" />
            <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border-4 border-background bg-muted flex items-center justify-center shrink-0 shadow-md">
                {profile?.image ? (
                  <img
                    src={getStudentImageUrl(profile.image)}
                    alt="Student Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-muted-foreground">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </span>
                )}
                <label htmlFor="student-avatar-file" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200">
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <span className="text-white text-xs font-semibold">Change Photo</span>
                  <input
                    id="student-avatar-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {profile?.firstName} {profile?.lastName}
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {profile?.degree || "No Degree"} in {profile?.branch || "No Branch"} • Class of {profile?.graduationYear || "N/A"}
                    </p>
                  </div>
                  {profile?.image && !profile.image.startsWith('https://api.dicebear.com') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImageRemove}
                      className="text-rose-400 border-rose-500/20 hover:bg-rose-950/20 w-fit"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Completeness, Scores & Socials */}
            <div className="space-y-6 lg:col-span-1">
              {/* Profile Completion Status */}
              {profileStatus && (
                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-base font-bold">Profile Completeness</CardTitle>
                          <CardDescription className="text-xs">
                            {profileStatus.completeness}% Complete
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          profileStatus.strength === "Strong"
                            ? "default"
                            : profileStatus.strength === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-[10px] px-2 py-0.5 rounded-full"
                      >
                        {profileStatus.strength}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${profileStatus.completeness}%` }}
                      />
                    </div>
                    {profileStatus.missingFields?.length > 0 && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/20">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground">Pending:</span>{" "}
                          {profileStatus.missingFields.join(", ")}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Interview & Profile Scores */}
              {scores && (scores.profileScore !== null || scores.interviewScore !== null) && (
                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2.5">
                      <Award className="w-5 h-5 text-amber-500" />
                      <div>
                        <CardTitle className="text-base font-bold">Performance Scores</CardTitle>
                        <CardDescription className="text-xs">Average applicant statistics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scores.profileScore !== null && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Profile Alignment</span>
                          <span className="text-amber-500">{scores.profileScore.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${scores.profileScore}%` }} />
                        </div>
                      </div>
                    )}
                    {scores.interviewScore !== null && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Interview Performance</span>
                          <span className="text-blue-500">{scores.interviewScore.toFixed(0)}/100</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${scores.interviewScore}%` }} />
                        </div>
                      </div>
                    )}
                    {scores.combinedScore !== null && (
                      <div className="pt-2 border-t border-border/20 flex justify-between items-center text-xs font-bold text-foreground">
                        <span className="text-muted-foreground font-semibold">Combined Alignment</span>
                        <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{scores.combinedScore.toFixed(2)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Social URLs */}
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Academic & Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground py-1 px-2.5 rounded-lg bg-muted/20 border border-border/10">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="truncate text-foreground font-medium">{profile?.email}</span>
                  </div>
                  {profile?.linkedinUrl ? (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-muted/20 border border-border/10 hover:border-primary/20">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span className="truncate text-foreground">{profile.linkedinUrl}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground/50 py-1 px-2.5">
                      <Linkedin className="w-4 h-4" />
                      <span className="italic">No LinkedIn profile</span>
                    </div>
                  )}
                  {profile?.githubUrl ? (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-muted/20 border border-border/10 hover:border-primary/20">
                      <Github className="w-4 h-4 text-foreground" />
                      <span className="truncate text-foreground">{profile.githubUrl}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground/50 py-1 px-2.5">
                      <Github className="w-4 h-4" />
                      <span className="italic">No GitHub profile</span>
                    </div>
                  )}
                  {profile?.portfolioUrl ? (
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-muted/20 border border-border/10 hover:border-primary/20">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span className="truncate text-foreground">{profile.portfolioUrl}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground/50 py-1 px-2.5">
                      <Globe className="w-4 h-4" />
                      <span className="italic">No Portfolio website</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Profile Info View */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details Card */}
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Academic Profile</h3>
                  <p className="text-xs text-muted-foreground">Verification details and CGPA</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border/20 pb-6">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Degree</h4>
                    <p className="text-foreground font-medium">{profile?.degree || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Branch / Department</h4>
                    <p className="text-foreground font-medium">{profile?.branch || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Graduation Year</h4>
                    <p className="text-foreground font-medium">{profile?.graduationYear || 'Not Specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">CGPA</h4>
                    <p className="text-foreground font-semibold text-primary">{profile?.cgpa !== undefined && profile?.cgpa !== null ? Number(profile.cgpa).toFixed(2) : 'Not Entered'}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <div className="border-b border-border/20 pb-6">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Bio</h4>
                    <p className="text-foreground leading-relaxed whitespace-pre-line text-sm">{profile.bio}</p>
                  </div>
                )}

                {/* Skills Section */}
                <div className="border-b border-border/20 pb-6">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills?.length > 0 ? (
                      skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                </div>

                {/* Career Interests Section */}
                <div className="border-b border-border/20 pb-6">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Career Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {careerInterests?.length > 0 ? (
                      careerInterests.map((interest, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border font-medium">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">No career interests added</span>
                    )}
                  </div>
                </div>

                {/* Preferred Roles Section */}
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Preferred Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferredRoles?.length > 0 ? (
                      preferredRoles.map((role, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/30 font-medium">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">No preferred roles listed</span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Projects Card */}
              {projects?.length > 0 && (
                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Projects</h3>
                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/30 bg-muted/20 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-foreground">{project.title}</h4>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                              View Project Link
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Certifications Card */}
              {certifications?.length > 0 && (
                <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md p-6 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/30 bg-muted/20 flex gap-3 items-center">
                        <Award className="w-8 h-8 text-primary shrink-0" />
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {cert.issuer} {cert.date && `• ${new Date(cert.date).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Documents & Links */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground px-1">Documents & Resume</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResumeSection
                    resume={profile?.resume}
                    onResumeChange={refreshProfile}
                  />
                  <LinkedInSection
                    linkedinUrl={profile?.linkedinUrl}
                    onLinkedInChange={refreshProfile}
                  />
                  <GitHubSection
                    githubUrl={profile?.githubUrl}
                    onGitHubChange={refreshProfile}
                  />
                  <PortfolioSection
                    portfolioUrl={profile?.portfolioUrl}
                    onPortfolioChange={refreshProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= EDIT MODE ================= */
        <div className="space-y-6">
          <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-md space-y-6">
            <div className="flex justify-between items-start border-b border-border/30 pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Edit Student Profile</h3>
                <p className="text-sm text-muted-foreground">Update your details to qualify for more referrals</p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  size="sm"
                  className="bg-primary text-background font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save'}
                </Button>
              </div>
            </div>

            {/* Basic & Academic Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g., Bachelor of Technology"
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branch">Branch / Department</Label>
                <Input
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(parseInt(e.target.value) || new Date().getFullYear())}
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cgpa">CGPA (0.00 to 10.00)</Label>
                <Input
                  id="cgpa"
                  type="text"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="e.g., 8.95"
                  className="bg-muted/50 border-border/50 text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5 border-t border-border/20 pt-4">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief professional summary..."
                rows={3}
                className="bg-muted/50 border-border/50 text-foreground"
              />
            </div>

            {/* Tag Editors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/20 pt-4">
              {/* Skills Editor */}
              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <Button onClick={addSkill} size="icon" type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                  {skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 bg-primary/10 text-primary border border-primary/20">
                      {skill}
                      <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Career Interests Editor */}
              <div className="space-y-3">
                <Label>Career Interests</Label>
                <div className="flex gap-2">
                  <Input
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCareerInterest())}
                    placeholder="Add an interest..."
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <Button onClick={addCareerInterest} size="icon" type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                  {careerInterests?.map((interest) => (
                    <Badge key={interest} variant="secondary" className="gap-1 bg-secondary text-secondary-foreground border border-border">
                      {interest}
                      <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeCareerInterest(interest)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Roles Editor */}
              <div className="space-y-3 md:col-span-2">
                <Label>Preferred Roles</Label>
                <div className="flex gap-2">
                  <Input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                    placeholder="Add a preferred role..."
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <Button onClick={addRole} size="icon" type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                  {preferredRoles?.map((role) => (
                    <Badge key={role} variant="secondary" className="gap-1 bg-accent/20 text-accent-foreground border border-accent/30">
                      {role}
                      <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeRole(role)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Editor */}
            <div className="space-y-4 border-t border-border/20 pt-4">
              <Label className="text-base font-bold text-foreground">Manage Projects</Label>
              <div className="p-4 rounded-xl border border-border/30 bg-muted/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Project Title (required)"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <Input
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="Project Link (optional)"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <Button onClick={addProject} size="icon" className="self-end" type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {projects?.map((project, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-muted/20 text-sm">
                    <div>
                      <span className="font-semibold text-foreground">{project.title}</span>
                      {project.link && <span className="text-xs text-muted-foreground ml-2">({project.link})</span>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeProject(idx)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20" type="button">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Editor */}
            <div className="space-y-4 border-t border-border/20 pt-4">
              <Label className="text-base font-bold text-foreground">Manage Certifications</Label>
              <div className="p-4 rounded-xl border border-border/30 bg-muted/10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="Certification Name (required)"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <Input
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="Issuer (optional)"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="Date (optional)"
                      className="bg-muted/50 border-border/50 text-foreground"
                    />
                    <Button onClick={addCertification} size="icon" type="button">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {certifications?.map((cert, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-muted/20 text-sm">
                    <div>
                      <span className="font-semibold text-foreground">{cert.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">by {cert.issuer}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeCertification(idx)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20" type="button">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
