import { useState, useEffect } from "react";
import { referralsApiClient } from "@/services/apiClient.js";
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
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
  TrendingUp,
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
import { showTransactionToast, dismissToast } from "@/components/Referrals/TransactionToast.jsx";
import { ResumeSection } from "@/components/Referrals/Student/ResumeSection.jsx";
import { LinkedInSection } from "@/components/Referrals/Student/LinkedInSection.jsx";
import { GitHubSection } from "@/components/Referrals/Student/GitHubSection.jsx";
import { PortfolioSection } from "@/components/Referrals/Student/PortfolioSection.jsx";
import { BASE_URL } from "@/services/api/tutorialsApi.js";
import { calculateStudentProfileCompleteness } from "@/utils/profileCompleteness.js";

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

export default function StudentProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState(null);

  // View / Edit state
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [collegeName, setCollegeName] = useState("");
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

  // Image Upload states
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  // College autocomplete list
  const [allColleges, setAllColleges] = useState([]);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load Data
  useEffect(() => {
    fetchProfile();
    fetchScores();
    fetchColleges();
  }, []);

  const getStudentImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${BASE_URL}/${cleanImg.startsWith('uploads/') ? cleanImg : `uploads/${cleanImg}`}`;
  };

  const fetchColleges = async () => {
    try {
      const res = await referralsApiClient.get('/student/colleges');
      if (res.data?.success) {
        setAllColleges(res.data.data || []);
      }
    } catch (e) {
      console.error("Colleges fetch failed:", e);
    }
  };

  const fetchScores = async () => {
    try {
      const response = await referralsApiClient.get("/my-applications");
      if (response.status === 200) {
        const data = response.data;
        const applications = data.data?.applications || data.applications || [];
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

        // Populate fields
        setFirstName(profileData.firstName || "");
        setLastName(profileData.lastName || "");
        setEmail(profileData.email || "");
        setPhoneNumber(profileData.phoneNumber || "");
        setCollegeName(profileData.college?.name || "");
        setBranch(profileData.branch || "");
        setDegree(profileData.degree || "");
        setGraduationYear(profileData.graduationYear || new Date().getFullYear() + 1);
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

  const refreshProfile = async () => {
    await fetchProfile();
  };

  // Autocomplete change handler
  const handleCollegeChange = (val) => {
    setCollegeName(val);
    if (val.trim() && allColleges.length > 0) {
      const filtered = allColleges.filter((c) =>
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      setCollegeSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setCollegeSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCollege = (name) => {
    setCollegeName(name);
    setCollegeSuggestions([]);
    setShowSuggestions(false);
  };

  // Image upload preview constraints
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showTransactionToast({
        type: "error",
        message: "Only JPG, JPEG, PNG and WEBP formats are allowed.",
      });
      return;
    }

    // Validate size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showTransactionToast({
        type: "error",
        message: "Image size must be less than 5 MB.",
      });
      return;
    }

    setPendingImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setShouldRemoveImage(false);
  };

  const handleRemovePendingImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    if (profile?.image) {
      setShouldRemoveImage(true);
    }
  };

  // Form modification check (dirty checks)
  const isCollegeNameValid = allColleges.length === 0 || allColleges.some(
    c => c.name.replace(/\s+/g, "").toLowerCase() === collegeName.replace(/\s+/g, "").toLowerCase()
  );

  const hasUnsavedChanges =
    firstName !== (profile?.firstName || "") ||
    lastName !== (profile?.lastName || "") ||
    email !== (profile?.email || "") ||
    phoneNumber !== (profile?.phoneNumber || "") ||
    collegeName !== (profile?.college?.name || "") ||
    branch !== (profile?.branch || "") ||
    degree !== (profile?.degree || "") ||
    graduationYear !== (profile?.graduationYear || "") ||
    cgpa !== (profile?.cgpa !== undefined && profile?.cgpa !== null ? profile.cgpa.toString() : "") ||
    bio !== (profile?.bio || "") ||
    JSON.stringify(careerInterests) !== JSON.stringify(profile?.careerInterests || []) ||
    JSON.stringify(skills) !== JSON.stringify(profile?.skills || []) ||
    JSON.stringify(projects) !== JSON.stringify(profile?.projects || []) ||
    JSON.stringify(certifications) !== JSON.stringify(profile?.certifications || []) ||
    JSON.stringify(preferredRoles) !== JSON.stringify(profile?.preferredRoles || []) ||
    pendingImageFile !== null ||
    shouldRemoveImage;

  // Window unload guard
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing, hasUnsavedChanges]);

  // Format timestamp utility
  const formatLastUpdated = (updatedStr) => {
    if (!updatedStr) return "N/A";
    const date = new Date(updatedStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Live completeness calculation
  const currentTempStudent = {
    firstName,
    lastName,
    email,
    phoneNumber,
    image: shouldRemoveImage ? null : (pendingImageFile ? "preview" : (profile?.image || "")),
    college: collegeName ? { name: collegeName } : null,
    branch,
    degree,
    graduationYear,
    cgpa,
    skills,
    resume: profile?.resume || null,
    linkedinUrl: profile?.linkedinUrl || "",
    githubUrl: profile?.githubUrl || "",
    portfolioUrl: profile?.portfolioUrl || "",
  };
  const { score: liveCompleteness, missingFields: liveMissingFields } = calculateStudentProfileCompleteness(currentTempStudent);

  // Save changes
  const handleSaveProfile = async () => {
    if (!isCollegeNameValid && collegeName.trim()) {
      showTransactionToast({
        type: "error",
        message: "Select a registered college name from the searchable dropdown.",
      });
      return;
    }

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
      message: "Saving profile changes...",
    });

    try {
      // 1. Process profile picture upload/removal if changed
      if (shouldRemoveImage) {
        await studentProfileApi.removeProfileImage();
      } else if (pendingImageFile) {
        await studentProfileApi.uploadProfileImage(pendingImageFile);
      }

      // 2. Save text updates
      const response = await studentProfileApi.updateProfile({
        firstName,
        lastName,
        email,
        phoneNumber,
        collegeName,
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
        setPendingImageFile(null);
        setImagePreviewUrl(null);
        setShouldRemoveImage(false);
        setIsEditing(false);
        showTransactionToast({
          type: "success",
          message: "Profile updated successfully!",
        });
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

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm("You have unsaved changes. Leave without saving?");
      if (!confirm) return;
    }
    // Reset values to original profile
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setPhoneNumber(profile.phoneNumber || "");
      setCollegeName(profile.college?.name || "");
      setBranch(profile.branch || "");
      setDegree(profile.degree || "");
      setGraduationYear(profile.graduationYear || new Date().getFullYear() + 1);
      setCgpa(profile.cgpa !== undefined && profile.cgpa !== null ? profile.cgpa.toString() : "");
      setBio(profile.bio || "");
      setCareerInterests(profile.careerInterests || []);
      setSkills(profile.skills || []);
      setProjects(profile.projects || []);
      setCertifications(profile.certifications || []);
      setPreferredRoles(profile.preferredRoles || []);
    }
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    setShouldRemoveImage(false);
    setIsEditing(false);
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

  // Display active profile picture in UI
  const displayImageSrc = shouldRemoveImage
    ? null
    : (imagePreviewUrl || getStudentImageUrl(profile?.image));

  return (
    <div className="space-y-6">
      {/* Header and Toggle Edit Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile Information</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last Updated: {formatLastUpdated(profile?.updatedAt)}
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 flex items-center justify-center"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Live Completeness bar */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-base font-bold">Profile Completeness</CardTitle>
                <CardDescription className="text-xs">
                  {liveCompleteness}% Complete
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${liveCompleteness}%` }}
            />
          </div>
          {liveMissingFields.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/20">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Missing items:</span>{" "}
                {liveMissingFields.join(", ")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Form content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Profile Pic & Info details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border-4 border-background bg-muted flex items-center justify-center shrink-0 shadow-md">
              {displayImageSrc ? (
                <img
                  src={displayImageSrc}
                  alt="Student Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">
                  {firstName?.[0]}{lastName?.[0]}
                </span>
              )}
              {isEditing && (
                <label htmlFor="student-avatar-file" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200">
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <span className="text-white text-xs font-semibold">Change Photo</span>
                  <input
                    id="student-avatar-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>

            <h3 className="text-xl font-bold text-foreground mt-4">{firstName} {lastName}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 justify-center mt-1">
              <Mail className="w-4 h-4 text-primary" />
              {email}
            </p>

            {isEditing && displayImageSrc && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemovePendingImage}
                className="text-rose-400 border-rose-500/20 hover:bg-rose-950/20 w-fit mt-3"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Photo
              </Button>
            )}
          </div>

          {/* Social Links card */}
          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* LinkedIn */}
              {!isEditing ? (
                profile?.linkedinUrl ? (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2.5 rounded-lg bg-muted/20 border border-border/10">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span className="truncate text-foreground font-medium">{profile.linkedinUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground/50 py-1.5 px-2.5">
                    <Linkedin className="w-4 h-4" />
                    <span className="italic">No LinkedIn profile</span>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">LinkedIn URL</Label>
                  <Input
                    value={profile?.linkedinUrl || ""}
                    onChange={(e) => setProfile(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-muted/50 border-border/50 text-foreground text-xs h-9"
                  />
                </div>
              )}

              {/* GitHub */}
              {!isEditing ? (
                profile?.githubUrl ? (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2.5 rounded-lg bg-muted/20 border border-border/10">
                    <Github className="w-4 h-4 text-foreground" />
                    <span className="truncate text-foreground font-medium">{profile.githubUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground/50 py-1.5 px-2.5">
                    <Github className="w-4 h-4" />
                    <span className="italic">No GitHub profile</span>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">GitHub URL</Label>
                  <Input
                    value={profile?.githubUrl || ""}
                    onChange={(e) => setProfile(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username"
                    className="bg-muted/50 border-border/50 text-foreground text-xs h-9"
                  />
                </div>
              )}

              {/* Portfolio */}
              {!isEditing ? (
                profile?.portfolioUrl ? (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 px-2.5 rounded-lg bg-muted/20 border border-border/10">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span className="truncate text-foreground font-medium">{profile.portfolioUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground/50 py-1.5 px-2.5">
                    <Globe className="w-4 h-4" />
                    <span className="italic">No Portfolio website</span>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Portfolio URL</Label>
                  <Input
                    value={profile?.portfolioUrl || ""}
                    onChange={(e) => setProfile(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                    placeholder="https://portfolio.com"
                    className="bg-muted/50 border-border/50 text-foreground text-xs h-9"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Form Fields details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md p-6 space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b border-border/20 pb-2">Academic & Personal Profile</h3>

            {!isEditing ? (
              /* View mode profile fields */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">College</h4>
                  <p className="text-foreground font-medium">{profile?.college?.name || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Phone</h4>
                  <p className="text-foreground font-medium">{profile?.phoneNumber || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Degree</h4>
                  <p className="text-foreground font-medium">{profile?.degree || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Branch / Department</h4>
                  <p className="text-foreground font-medium">{profile?.branch || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Graduation Year</h4>
                  <p className="text-foreground font-medium">{profile?.graduationYear || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">CGPA</h4>
                  <p className="text-foreground font-semibold text-primary">
                    {profile?.cgpa !== undefined && profile?.cgpa !== null ? Number(profile.cgpa).toFixed(2) : 'Not Entered'}
                  </p>
                </div>
                {profile?.bio && (
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Bio</h4>
                    <p className="text-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/10 p-3 rounded-xl border border-border/30">{profile.bio}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Edit mode inputs */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Phone</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>

                {/* College autocomplete */}
                <div className="space-y-1 md:col-span-2 relative">
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={collegeName}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search your college..."
                    className={`bg-muted/50 border-border/50 text-foreground ${
                      !isCollegeNameValid && collegeName.trim() ? "border-rose-500 focus-visible:ring-rose-500" : ""
                    }`}
                  />
                  {!isCollegeNameValid && collegeName.trim() && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      ⚠️ Selected college is not registered. Please select a valid college from the dropdown.
                    </p>
                  )}

                  {showSuggestions && collegeSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-48 overflow-y-auto bg-card border border-border shadow-lg rounded-xl p-1.5 space-y-0.5">
                      {collegeSuggestions.map((c) => (
                        <li
                          key={c._id}
                          onMouseDown={() => handleSelectCollege(c.name)}
                          className="px-3 py-2 text-sm rounded-lg hover:bg-muted text-foreground cursor-pointer transition-colors"
                        >
                          {c.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g., Bachelor of Technology"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="branch">Branch / Department</Label>
                  <Input
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(parseInt(e.target.value) || new Date().getFullYear())}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
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
                <div className="space-y-1 md:col-span-2">
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
              </div>
            )}

            {/* View Mode Tags */}
            {!isEditing && (
              <div className="space-y-4 border-t border-border/20 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Career Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {careerInterests.length > 0 ? (
                      careerInterests.map((interest, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border font-medium">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">No career interests added yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Preferred Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferredRoles.length > 0 ? (
                      preferredRoles.map((role, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground border border-accent/30 font-medium">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-muted-foreground">No preferred roles listed yet</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode Tags */}
            {isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/20 pt-4">
                {/* Skills Editor */}
                <div className="space-y-2">
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
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1 bg-primary/10 text-primary border border-primary/20">
                        {skill}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Career Interests Editor */}
                <div className="space-y-2">
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
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                    {careerInterests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="gap-1 bg-secondary text-secondary-foreground border border-border">
                        {interest}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeCareerInterest(interest)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preferred Roles Editor */}
                <div className="space-y-2 md:col-span-2">
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
                  <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                    {preferredRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="gap-1 bg-accent/20 text-accent-foreground border border-accent/30">
                        {role}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeRole(role)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Projects and Certifications */}
          {!isEditing && projects.length > 0 && (
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Projects</h3>
              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border/30 bg-muted/20 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-foreground">{project.title}</h4>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                          View Link
                        </a>
                      )}
                    </div>
                    {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {isEditing && (
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-md p-6 space-y-4">
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
                {projects.map((project, idx) => (
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
            </Card>
          )}

          {/* Resume and links sections (render in both modes) */}
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
  );
}
