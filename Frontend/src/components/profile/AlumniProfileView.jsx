import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { Button } from "@/components/Referrals/ui/button.jsx";
import { Input } from "@/components/Referrals/ui/input.jsx";
import { Label } from "@/components/Referrals/ui/label.jsx";
import { Textarea } from "@/components/Referrals/ui/textarea.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Referrals/ui/card.jsx";
import {
  Briefcase,
  Users,
  User,
  Trash2,
  Upload,
  TrendingUp,
  Globe,
  Edit3,
  Loader2,
  AlertCircle
} from "lucide-react";
import { showToast, dismissToast } from "@/components/Referrals/TransactionToast.jsx";
import { alumniProfileApi } from "@/services/Referrals/alumniProfile.js";
import { BASE_URL } from "@/services/api/tutorialsApi.js";
import { calculateAlumniProfileCompleteness } from "@/utils/profileCompleteness.js";

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

export default function AlumniProfileView() {
  const { user } = useAuth();
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    yearsOfExperience: 0,
    skills: "",
    referralPreferences: "",
    hiringInterests: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    bio: "",
    careerJourney: "",
  });

  // Image Upload states
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  useEffect(() => {
    fetchAlumniProfile();
  }, [user]);

  const getAlumniImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    const cleanImg = img.startsWith('/') ? img.slice(1) : img;
    return `${BASE_URL}/${cleanImg.startsWith('uploads/') ? cleanImg : `uploads/${cleanImg}`}`;
  };

  const fetchAlumniProfile = async () => {
    try {
      const response = await alumniProfileApi.getProfile();
      if (response.success) {
        setAlumniProfile(response.data);
        setProfileForm({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          company: response.data.company || "",
          jobTitle: response.data.jobTitle || "",
          yearsOfExperience: response.data.yearsOfExperience || 0,
          skills: (response.data.skills || []).join(", "),
          referralPreferences: response.data.referralPreferences || "",
          hiringInterests: response.data.hiringInterests || "",
          linkedinUrl: response.data.linkedinUrl || "",
          githubUrl: response.data.githubUrl || "",
          portfolioUrl: response.data.portfolioUrl || "",
          bio: response.data.bio || "",
          careerJourney: response.data.careerJourney || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch alumni profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Image upload preview constraints
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast({
        type: "error",
        message: "Only JPG, JPEG, PNG and WEBP formats are allowed.",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast({
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
    if (alumniProfile?.image) {
      setShouldRemoveImage(true);
    }
  };

  // Form modification check (dirty checks)
  const hasUnsavedChanges =
    profileForm.firstName !== (alumniProfile?.firstName || "") ||
    profileForm.lastName !== (alumniProfile?.lastName || "") ||
    profileForm.company !== (alumniProfile?.company || "") ||
    profileForm.jobTitle !== (alumniProfile?.jobTitle || "") ||
    profileForm.yearsOfExperience !== (alumniProfile?.yearsOfExperience || 0) ||
    profileForm.skills !== (alumniProfile?.skills || []).join(", ") ||
    profileForm.referralPreferences !== (alumniProfile?.referralPreferences || "") ||
    profileForm.hiringInterests !== (alumniProfile?.hiringInterests || "") ||
    profileForm.linkedinUrl !== (alumniProfile?.linkedinUrl || "") ||
    profileForm.githubUrl !== (alumniProfile?.githubUrl || "") ||
    profileForm.portfolioUrl !== (alumniProfile?.portfolioUrl || "") ||
    profileForm.bio !== (alumniProfile?.bio || "") ||
    profileForm.careerJourney !== (alumniProfile?.careerJourney || "") ||
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
  const currentTempAlumni = {
    firstName: profileForm.firstName,
    lastName: profileForm.lastName,
    email: alumniProfile?.email || "",
    image: shouldRemoveImage ? null : (pendingImageFile ? "preview" : (alumniProfile?.image || "")),
    company: profileForm.company,
    jobTitle: profileForm.jobTitle,
    yearsOfExperience: profileForm.yearsOfExperience,
    skills: profileForm.skills.split(",").map(s => s.trim()).filter(Boolean),
    referralPreferences: profileForm.referralPreferences,
    hiringInterests: profileForm.hiringInterests,
    bio: profileForm.bio,
    careerJourney: profileForm.careerJourney,
    linkedinUrl: profileForm.linkedinUrl,
    githubUrl: profileForm.githubUrl,
    portfolioUrl: profileForm.portfolioUrl,
  };
  const { score: liveCompleteness, missingFields: liveMissingFields } = calculateAlumniProfileCompleteness(currentTempAlumni);

  // Save changes
  const handleSaveAlumniProfile = async (e) => {
    if (e) e.preventDefault();
    setProfileSaving(true);
    const toastId = showToast({
      type: "pending",
      message: "Saving profile changes...",
    });

    try {
      // 1. Process picture upload/removal if changed
      if (shouldRemoveImage) {
        await alumniProfileApi.removeProfileImage();
      } else if (pendingImageFile) {
        await alumniProfileApi.uploadProfileImage(pendingImageFile);
      }

      // 2. Save text updates
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        company: profileForm.company,
        jobTitle: profileForm.jobTitle,
        yearsOfExperience: parseInt(profileForm.yearsOfExperience) || 0,
        skills: profileForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        referralPreferences: profileForm.referralPreferences,
        hiringInterests: profileForm.hiringInterests,
        linkedinUrl: profileForm.linkedinUrl,
        githubUrl: profileForm.githubUrl,
        portfolioUrl: profileForm.portfolioUrl,
        bio: profileForm.bio,
        careerJourney: profileForm.careerJourney,
      };

      const response = await alumniProfileApi.updateProfile(payload);
      dismissToast(toastId);
      if (response.success) {
        showToast({
          type: "success",
          message: "Profile saved successfully!",
        });
        setAlumniProfile(response.data);
        setPendingImageFile(null);
        setImagePreviewUrl(null);
        setShouldRemoveImage(false);
        setIsEditing(false);
      }
    } catch (error) {
      dismissToast(toastId);
      showToast({
        type: "error",
        message: error.response?.data?.message || error.message || "Failed to save profile",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm("You have unsaved changes. Leave without saving?");
      if (!confirm) return;
    }
    if (alumniProfile) {
      setProfileForm({
        firstName: alumniProfile.firstName || "",
        lastName: alumniProfile.lastName || "",
        company: alumniProfile.company || "",
        jobTitle: alumniProfile.jobTitle || "",
        yearsOfExperience: alumniProfile.yearsOfExperience || 0,
        skills: (alumniProfile.skills || []).join(", "),
        referralPreferences: alumniProfile.referralPreferences || "",
        hiringInterests: alumniProfile.hiringInterests || "",
        linkedinUrl: alumniProfile.linkedinUrl || "",
        githubUrl: alumniProfile.githubUrl || "",
        portfolioUrl: alumniProfile.portfolioUrl || "",
        bio: alumniProfile.bio || "",
        careerJourney: alumniProfile.careerJourney || "",
      });
    }
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    setShouldRemoveImage(false);
    setIsEditing(false);
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
    : (imagePreviewUrl || getAlumniImageUrl(alumniProfile?.image));

  return (
    <div className="space-y-6">
      {/* Header and Toggle Edit Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alumni Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last Updated: {formatLastUpdated(alumniProfile?.updatedAt)}
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
              onClick={handleSaveAlumniProfile}
              disabled={profileSaving}
              size="sm"
              className="bg-primary text-primary-foreground font-semibold"
            >
              {profileSaving ? (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Profile Photo & Social Links */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="relative group w-32 h-32 rounded-2xl overflow-hidden border-4 border-background bg-muted flex items-center justify-center shrink-0 shadow-md">
              {displayImageSrc ? (
                <img
                  src={displayImageSrc}
                  alt="Alumni Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">
                  {profileForm.firstName?.[0]}{profileForm.lastName?.[0]}
                </span>
              )}
              {isEditing && (
                <label htmlFor="alumni-avatar-file" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200">
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <span className="text-white text-xs font-semibold">Change Photo</span>
                  <input
                    id="alumni-avatar-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>

            <h3 className="text-xl font-bold text-foreground mt-4">{profileForm.firstName} {profileForm.lastName}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 justify-center mt-1">
              <Briefcase className="w-4 h-4 text-primary" />
              {profileForm.jobTitle || 'No Title'} at {profileForm.company || 'No Company'}
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
              <CardTitle className="text-base font-bold">Social Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* LinkedIn */}
              {!isEditing ? (
                alumniProfile?.linkedinUrl ? (
                  <a href={alumniProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/30">
                    <Linkedin className="w-5 h-5 text-blue-400" />
                    <span className="text-sm truncate">{alumniProfile.linkedinUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground/50 py-2 px-3">
                    <Linkedin className="w-5 h-5" />
                    <span className="text-sm italic">No LinkedIn linked</span>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">LinkedIn URL</Label>
                  <Input
                    value={profileForm.linkedinUrl}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-muted/50 border-border/50 text-foreground text-xs h-9"
                  />
                </div>
              )}

              {/* GitHub */}
              {!isEditing ? (
                alumniProfile?.githubUrl ? (
                  <a href={alumniProfile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/30">
                    <Github className="w-5 h-5 text-foreground" />
                    <span className="text-sm truncate">{alumniProfile.githubUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground/50 py-2 px-3">
                    <Github className="w-5 h-5" />
                    <span className="text-sm italic">No GitHub linked</span>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">GitHub URL</Label>
                  <Input
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username"
                    className="bg-muted/50 border-border/50 text-foreground text-xs h-9"
                  />
                </div>
              )}

              {/* Portfolio */}
              {!isEditing ? (
                alumniProfile?.portfolioUrl ? (
                  <a href={alumniProfile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/30">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm truncate">{alumniProfile.portfolioUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground/50 py-2 px-3">
                    <Globe className="w-5 h-5" />
                    <span className="text-sm italic">No Portfolio linked</span>
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Portfolio URL</Label>
                  <Input
                    value={profileForm.portfolioUrl}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
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
            <h3 className="text-lg font-bold text-foreground border-b border-border/20 pb-2">Professional Details</h3>

            {!isEditing ? (
              /* View mode profile fields */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Company</h4>
                  <p className="text-foreground font-medium">{alumniProfile?.company || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Job Title</h4>
                  <p className="text-foreground font-medium">{alumniProfile?.jobTitle || 'Not Specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Experience</h4>
                  <p className="text-foreground font-medium">{alumniProfile?.yearsOfExperience || 0} Years</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Referral Preferences</h4>
                  <p className="text-foreground font-medium">{alumniProfile?.referralPreferences || 'None set'}</p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills / Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {alumniProfile?.skills && alumniProfile.skills.length > 0 ? (
                      alumniProfile.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                </div>

                {alumniProfile?.hiringInterests && (
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Hiring Interests</h4>
                    <p className="text-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/10 p-3 rounded-xl border border-border/30">{alumniProfile.hiringInterests}</p>
                  </div>
                )}

                {alumniProfile?.bio && (
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Bio</h4>
                    <p className="text-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/10 p-3 rounded-xl border border-border/30">{alumniProfile.bio}</p>
                  </div>
                )}

                {alumniProfile?.careerJourney && (
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Career Journey</h4>
                    <p className="text-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/10 p-3 rounded-xl border border-border/30">{alumniProfile.careerJourney}</p>
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
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profileForm.jobTitle}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    value={profileForm.yearsOfExperience}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={profileForm.skills}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="React, Node.js, AWS, Python"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="referralPreferences">Referral Preferences</Label>
                  <Input
                    id="referralPreferences"
                    value={profileForm.referralPreferences}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, referralPreferences: e.target.value }))}
                    placeholder="E.g., Preferred CGPA > 8.0, Software developer roles"
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="hiringInterests">Hiring Interests</Label>
                  <Textarea
                    id="hiringInterests"
                    value={profileForm.hiringInterests}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, hiringInterests: e.target.value }))}
                    placeholder="Describe your current or upcoming hiring requirements..."
                    rows={2}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="A short intro about yourself..."
                    rows={3}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="careerJourney">Career Journey</Label>
                  <Textarea
                    id="careerJourney"
                    value={profileForm.careerJourney}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, careerJourney: e.target.value }))}
                    placeholder="Tell us about your professional path..."
                    rows={4}
                    className="bg-muted/50 border-border/50 text-foreground"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
