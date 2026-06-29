import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Edit3,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  Trash2,
  Upload,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import {
  getTutorProfile,
  editTutorProfile,
  uploadTutorProfilePic,
  deleteTutorProfilePic,
  BASE_URL
} from "@/services/api/tutorialsApi.js";
import bulb2 from "@/assets/images/bulb2.png";
import { calculateTutorProfileCompleteness } from "@/utils/profileCompleteness.js";

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

export default function TutorProfileView() {
  const formRef = useRef(null);
  const [profile, setProfile] = useState({
    username: "",
    fName: "",
    lName: "",
    email: "",
    contact: "",
    location: "",
    experience: "",
    expertise: "",
    bio: "",
    subjects: "",
    skills: "",
    hourlyRate: 0,
    availableDays: "",
    availableTimeSlots: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    profileCompleteness: 0,
  });

  const [initialProfile, setInitialProfile] = useState({});
  const [dbProfileData, setDbProfileData] = useState(null); // Keep original to read updatedAt
  const [picSrc, setPicSrc] = useState(null);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTutorProfile();
      const data = res.data;

      if (data.profile) {
        const p = data.profile;
        setDbProfileData(p);
        const mapped = {
          username: p.name || "",
          fName: p.fName || "",
          lName: p.lName || "",
          email: p.email || "",
          contact: p.contact || "",
          location: p.location || "",
          experience: p.experience || "",
          expertise: p.expertise || "",
          bio: p.bio || "",
          subjects: (p.subjects || []).join(", "),
          skills: (p.skills || []).join(", "),
          hourlyRate: p.hourlyRate || 0,
          availableDays: (p.availableDays || []).join(", "),
          availableTimeSlots: (p.availableTimeSlots || []).join(", "),
          linkedinUrl: p.linkedinUrl || "",
          githubUrl: p.githubUrl || "",
          portfolioUrl: p.portfolioUrl || "",
          profileCompleteness: p.profileCompleteness || 0,
        };
        setProfile(mapped);
        setInitialProfile(mapped);
      }

      const picValue = data.pic || data.profile?.profilePic;
      setPicSrc(
        picValue
          ? picValue.startsWith("http")
            ? picValue
            : `${BASE_URL}/uploads/${picValue}`
          : null
      );
    } catch (err) {
      console.error("❌ Error fetching tutor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image upload preview constraints
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG and WEBP formats are allowed.");
      return;
    }

    // Validate size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setPendingImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setShouldRemoveImage(false);
  };

  const handleRemovePendingImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    if (picSrc) {
      setShouldRemoveImage(true);
    }
  };

  // Form modification check (dirty checks)
  const hasUnsavedChanges =
    profile.username !== (initialProfile.username || "") ||
    profile.fName !== (initialProfile.fName || "") ||
    profile.lName !== (initialProfile.lName || "") ||
    profile.email !== (initialProfile.email || "") ||
    profile.contact !== (initialProfile.contact || "") ||
    profile.location !== (initialProfile.location || "") ||
    profile.experience !== (initialProfile.experience || "") ||
    profile.expertise !== (initialProfile.expertise || "") ||
    profile.bio !== (initialProfile.bio || "") ||
    profile.subjects !== (initialProfile.subjects || "") ||
    profile.skills !== (initialProfile.skills || "") ||
    profile.hourlyRate !== (initialProfile.hourlyRate || 0) ||
    profile.availableDays !== (initialProfile.availableDays || "") ||
    profile.availableTimeSlots !== (initialProfile.availableTimeSlots || "") ||
    profile.linkedinUrl !== (initialProfile.linkedinUrl || "") ||
    profile.githubUrl !== (initialProfile.githubUrl || "") ||
    profile.portfolioUrl !== (initialProfile.portfolioUrl || "") ||
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
  const currentTempTutor = {
    fName: profile.fName,
    lName: profile.lName,
    email: profile.email,
    contact: profile.contact,
    bio: profile.bio,
    subjects: profile.subjects,
    skills: profile.skills,
    expertise: profile.expertise,
    experience: profile.experience,
    hourlyRate: profile.hourlyRate,
    availableDays: profile.availableDays,
    availableTimeSlots: profile.availableTimeSlots,
    profilePic: shouldRemoveImage ? null : (pendingImageFile ? "preview" : picSrc),
    linkedinUrl: profile.linkedinUrl,
    githubUrl: profile.githubUrl,
    portfolioUrl: profile.portfolioUrl,
  };
  const { score: liveCompleteness, missingFields: liveMissingFields } = calculateTutorProfileCompleteness(currentTempTutor);

  // Save changes
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      // 1. Process profile picture upload/removal if changed
      if (shouldRemoveImage) {
        await deleteTutorProfilePic();
      } else if (pendingImageFile) {
        const formData = new FormData();
        formData.append("profilePic", pendingImageFile);
        await uploadTutorProfilePic(formData);
      }

      // 2. Save text updates
      const res = await editTutorProfile({
        displayName: profile.username,
        fName: profile.fName,
        lName: profile.lName,
        email: profile.email,
        contact: profile.contact,
        location: profile.location,
        experience: profile.experience,
        expertise: profile.expertise,
        bio: profile.bio,
        subjects: profile.subjects,
        skills: profile.skills,
        hourlyRate: Number(profile.hourlyRate) || 0,
        availableDays: profile.availableDays,
        availableTimeSlots: profile.availableTimeSlots,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        portfolioUrl: profile.portfolioUrl,
      });

      alert(res.data.msg || "Profile updated!");
      setPendingImageFile(null);
      setImagePreviewUrl(null);
      setShouldRemoveImage(false);
      setIsEditing(false);
      fetchData(); // reload complete DB representation
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm("You have unsaved changes. Leave without saving?");
      if (!confirm) return;
    }
    setProfile(initialProfile);
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
    ? bulb2
    : (imagePreviewUrl || picSrc || bulb2);

  return (
    <div className="container-xl px-4 mt-4">
      {/* Header and Toggle Edit Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/40 backdrop-blur-md rounded-[var(--radius-md)] p-4 border border-border/40 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tutor Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last Updated: {formatLastUpdated(dbProfileData?.updatedAt)}
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover px-4 py-2 rounded-md transition-colors"
          >
            <Edit3 className="w-4 h-4 inline-block mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover border border-[var(--border-color)] px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover px-4 py-2 rounded-md transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Live Completeness bar */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-[var(--shadow-md)] p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">Profile Completeness</h3>
              <p className="text-xs text-muted-foreground">{liveCompleteness}% Complete</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-3">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${liveCompleteness}%` }}
          />
        </div>
        {liveMissingFields.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-[var(--radius-sm)] border border-border/20">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Missing items:</span>{" "}
              {liveMissingFields.join(", ")}
            </div>
          </div>
        )}
      </Card>

      <div className="background-white">
        {/* LEFT CARD - IMAGE UPLOAD */}
        <div id="uploadProfileCard">
          <h2 className="card-header">Profile Photo</h2>

          <div className="card-body text-center flex flex-col items-center">
            <img
              className="img-account-profile object-cover rounded-full w-32 h-32 mb-4"
              src={displayImageSrc}
              alt="Profile"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = bulb2;
              }}
            />

            {isEditing && (
              <div className="flex flex-col gap-2 mt-2 w-full px-4">
                <label htmlFor="tutor-avatar-file" className="bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover px-4 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center">
                  <Upload className="w-4 h-4 inline-block mr-2" />
                  Select New Image
                </label>
                <input
                  id="tutor-avatar-file"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
                {displayImageSrc !== bulb2 && (
                  <button
                    className="bg-btn-danger text-btn-danger-text hover:bg-btn-danger-hover px-4 py-2 rounded-md transition-colors"
                    type="button"
                    onClick={handleRemovePendingImage}
                  >
                    <Trash2 className="w-4 h-4 inline-block mr-2" />
                    Remove Image
                  </button>
                )}
              </div>
            )}
            <div className="small text-muted mt-2">
              JPG, JPEG, PNG, or WEBP. Max 5 MB
            </div>
          </div>
        </div>

        {/* RIGHT CARD - DETAILS VIEW OR EDIT */}
        <div className="pl-3 w-full">
          {!isEditing ? (
            /* ================= VIEW MODE ================= */
            <div className="p-4 space-y-6">
              <h2 className="card-header">Tutor Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/20">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Username</h4>
                    <p className="text-foreground font-medium">{profile.username || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</h4>
                    <p className="text-foreground font-medium">
                      {profile.fName || profile.lName ? `${profile.fName} ${profile.lName}` : "Not Specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</h4>
                    <p className="text-foreground font-medium">{profile.email || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</h4>
                    <p className="text-foreground font-medium">{profile.contact || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</h4>
                    <p className="text-foreground font-medium">{profile.location || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hourly Rate</h4>
                    <p className="text-foreground font-semibold text-primary">
                      {profile.hourlyRate ? `₹${profile.hourlyRate}/hour` : "Free / Undefined"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/20">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Experience</h4>
                    <p className="text-foreground font-medium">{profile.experience || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expertise Area</h4>
                    <p className="text-foreground font-medium">{profile.expertise || "Not Specified"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pb-6 border-b border-border/20">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Subjects Handled</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects ? (
                      profile.subjects.split(",").map((s) => s.trim()).map((subject, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          {subject}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">No subjects specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills ? (
                      profile.skills.split(",").map((s) => s.trim()).map((skill, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-muted-foreground">No skills listed</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/20">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Available Days</h4>
                    <p className="text-foreground font-medium">{profile.availableDays || "Not Specified"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Available Slots</h4>
                    <p className="text-foreground font-medium">{profile.availableTimeSlots || "Not Specified"}</p>
                  </div>
                </div>
              </div>

              <div className="pb-6 border-b border-border/20 space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Social Links</h4>
                <div className="flex flex-wrap gap-4">
                  {profile.linkedinUrl ? (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic flex items-center gap-1"><Linkedin className="w-4 h-4" /> No LinkedIn</span>
                  )}
                  {profile.githubUrl ? (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:underline">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic flex items-center gap-1"><Github className="w-4 h-4" /> No GitHub</span>
                  )}
                  {profile.portfolioUrl ? (
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-400 hover:underline">
                      <Globe className="w-4 h-4" />
                      Portfolio
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic flex items-center gap-1"><Globe className="w-4 h-4" /> No Portfolio</span>
                  )}
                </div>
              </div>

              {profile.bio && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Bio</h4>
                  <p className="text-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/20 p-3 rounded-[var(--radius-sm)] border border-border/30">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ================= EDIT MODE ================= */
            <div>
              <h2 className="card-header">Edit Tutor Details</h2>

              <form className="card-body form-grid space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {/* USERNAME */}
                <div className="mb-3 full-row">
                  <label className="small font-semibold text-foreground">Username</label>
                  <input
                    className="form-control"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* NAMES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="small font-semibold text-foreground">First Name</label>
                    <input
                      className="form-control"
                      name="fName"
                      value={profile.fName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Last Name</label>
                    <input
                      className="form-control"
                      name="lName"
                      value={profile.lName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* EMAIL & CONTACT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="small font-semibold text-foreground">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Contact</label>
                    <input
                      className="form-control"
                      name="contact"
                      value={profile.contact}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* LOCATION & RATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="small font-semibold text-foreground">Location</label>
                    <input
                      className="form-control"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Hourly Rate (₹/hr)</label>
                    <input
                      className="form-control"
                      name="hourlyRate"
                      type="number"
                      min="0"
                      value={profile.hourlyRate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* EXPERIENCE & EXPERTISE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="small font-semibold text-foreground">Experience</label>
                    <input
                      className="form-control"
                      name="experience"
                      value={profile.experience}
                      onChange={handleChange}
                      placeholder="e.g., 3 years of teaching"
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Expertise Area</label>
                    <input
                      className="form-control"
                      name="expertise"
                      value={profile.expertise}
                      onChange={handleChange}
                      placeholder="e.g., Computer Science, Mathematics"
                    />
                  </div>
                </div>

                {/* SUBJECTS & SKILLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="small font-semibold text-foreground">Subjects (comma-separated)</label>
                    <input
                      className="form-control"
                      name="subjects"
                      value={profile.subjects}
                      onChange={handleChange}
                      placeholder="Physics, Calculus, Python"
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Skills (comma-separated)</label>
                    <input
                      className="form-control"
                      name="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      placeholder="Teaching, Code Review, Mentorship"
                    />
                  </div>
                </div>

                {/* AVAILABILITY DAYS & SLOTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="small font-semibold text-foreground">Available Days (comma-separated)</label>
                    <input
                      className="form-control"
                      name="availableDays"
                      value={profile.availableDays}
                      onChange={handleChange}
                      placeholder="Monday, Wednesday, Friday"
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Available Slots (comma-separated)</label>
                    <input
                      className="form-control"
                      name="availableTimeSlots"
                      value={profile.availableTimeSlots}
                      onChange={handleChange}
                      placeholder="10:00 AM - 12:00 PM, 3:00 PM - 5:00 PM"
                    />
                  </div>
                </div>

                {/* SOCIAL URLS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/20 pt-3">
                  <div>
                    <label className="small font-semibold text-foreground">LinkedIn URL</label>
                    <input
                      className="form-control"
                      name="linkedinUrl"
                      value={profile.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">GitHub URL</label>
                    <input
                      className="form-control"
                      name="githubUrl"
                      value={profile.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="small font-semibold text-foreground">Portfolio URL</label>
                    <input
                      className="form-control"
                      name="portfolioUrl"
                      value={profile.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* BIO */}
                <div className="mb-3 border-t border-border/20 pt-3">
                  <label className="small font-semibold text-foreground">Bio</label>
                  <textarea
                    className="form-control"
                    name="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Write a personal tutoring bio..."
                    style={{ height: "auto" }}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
