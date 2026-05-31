import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Tutorials/Navbar";
import "../../styles/Tutorials/EditProfile.css";
import bulb2 from "../../assets/images/bulb2.png";
import { useNavigate } from "react-router-dom";
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

// ✅ API FUNCTIONS
import {
  getTutorProfile,
  editTutorProfile,
  uploadTutorProfilePic,
  deleteTutorProfilePic,
} from "@/services/api/tutorialsApi.js";

import { BASE_URL } from "@/services/api/tutorialsApi.js";

function TutorEditProfilePage() {
  const navigate = useNavigate();
  const form = useRef(null);

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

  const [pic, setPic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ FETCH PROFILE
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTutorProfile();
      const data = res.data;

      if (data.profile) {
        const p = data.profile;

        setProfile({
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
        });
      }

      const picValue = data.pic || data.profile?.profilePic;

      setPic(
        picValue
          ? picValue.startsWith("http")
            ? picValue
            : `${BASE_URL}/uploads/${picValue}`
          : null
      );
    } catch (err) {
      console.error("❌ Error fetching tutor profile:", err);
    }
  };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ IMAGE PREVIEW
  const previewImage = (file) => {
    if (!file) return;

    if (pic) URL.revokeObjectURL(pic);

    setPic(URL.createObjectURL(file));
  };

  // ✅ UPLOAD IMAGE
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(form.current);

      const res = await uploadTutorProfilePic(formData);

      if (res.data.status === "OK") {
        const filename = res.data.filename;

        setPic(
          filename
            ? `${BASE_URL}/uploads/${filename}`
            : null
        );

        alert("Profile Picture Saved!");
        fetchData(); // Refresh to recalculate completeness
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  // ✅ DELETE IMAGE
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await deleteTutorProfilePic();

      setPic(bulb2);

      alert("Profile picture removed!");
      fetchData(); // Refresh to recalculate completeness
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ✅ SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
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
      
      if (res.data && res.data.profile) {
        const p = res.data.profile;
        setProfile({
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
        });
      }

      setIsEditing(false);
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchData();
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />

      <main className="EditProfile">
        <div className="container-xl px-4 mt-4">
          <div className="flex justify-between items-center mb-4 bg-card/40 backdrop-blur-md rounded-xl p-4 border border-border/40">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tutor Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your tutoring offerings and details</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btnEditProfile saveBtn"
                style={{ margin: 0 }}
              >
                <Edit3 className="w-4 h-4 inline-block mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="background-white">
            {/* LEFT CARD - IMAGE UPLOAD */}
            <div id="uploadProfileCard">
              <h2 className="card-header">Profile Photo</h2>

              <div className="card-body text-center">
                <img
                  className="img-account-profile"
                  src={pic || bulb2}
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = bulb2;
                  }}
                />

                {/* Completeness Bar */}
                <div className="mt-4 px-4">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Completeness</span>
                    <span className="text-primary">{profile.profileCompleteness || 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile.profileCompleteness || 0}%` }}
                    />
                  </div>
                </div>

                <div className="small text-muted mt-3">
                  JPG or PNG no larger than 5 MB
                </div>

                <form ref={form} onSubmit={handleUpload} className="mt-3">
                  <label htmlFor="files" className="btnEditProfile cursor-pointer">
                    <Upload className="w-4 h-4 inline-block mr-2" />
                    Upload new image
                  </label>

                  <input
                    id="files"
                    name="profilePic"
                    type="file"
                    hidden
                    onChange={(e) => previewImage(e.target.files[0])}
                  />

                  <button className="btnEditProfile" type="submit">
                    Save Profile Picture
                  </button>

                  {pic && pic !== bulb2 && (
                    <button className="btnEditProfile btn-danger" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 inline-block mr-2" />
                      Delete Picture
                    </button>
                  )}
                </form>
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
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline">
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
                      <p className="text-foreground leading-relaxed text-sm whitespace-pre-line bg-muted/20 p-3 rounded-lg border border-border/30">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* ================= EDIT MODE ================= */
                <div>
                  <h2 className="card-header">Edit Tutor Details</h2>

                  <form className="card-body form-grid space-y-4" onSubmit={handleSubmit}>
                    {/* USERNAME */}
                    <div className="mb-3 full-row">
                      <label className="small font-semibold">Username</label>
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
                        <label className="small font-semibold">First Name</label>
                        <input
                          className="form-control"
                          name="fName"
                          value={profile.fName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">Last Name</label>
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
                        <label className="small font-semibold">Email</label>
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
                        <label className="small font-semibold">Contact</label>
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
                        <label className="small font-semibold">Location</label>
                        <input
                          className="form-control"
                          name="location"
                          value={profile.location}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">Hourly Rate (₹/hr)</label>
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
                        <label className="small font-semibold">Experience</label>
                        <input
                          className="form-control"
                          name="experience"
                          value={profile.experience}
                          onChange={handleChange}
                          placeholder="e.g., 3 years of teaching"
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">Expertise Area</label>
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
                        <label className="small font-semibold">Subjects (comma-separated)</label>
                        <input
                          className="form-control"
                          name="subjects"
                          value={profile.subjects}
                          onChange={handleChange}
                          placeholder="Physics, Calculus, Python"
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">Skills (comma-separated)</label>
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
                        <label className="small font-semibold">Available Days (comma-separated)</label>
                        <input
                          className="form-control"
                          name="availableDays"
                          value={profile.availableDays}
                          onChange={handleChange}
                          placeholder="Monday, Wednesday, Friday"
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">Available Slots (comma-separated)</label>
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
                        <label className="small font-semibold">LinkedIn URL</label>
                        <input
                          className="form-control"
                          name="linkedinUrl"
                          value={profile.linkedinUrl}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">GitHub URL</label>
                        <input
                          className="form-control"
                          name="githubUrl"
                          value={profile.githubUrl}
                          onChange={handleChange}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <label className="small font-semibold">Portfolio URL</label>
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
                      <label className="small font-semibold">Bio</label>
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

                    {/* FORM ACTIONS */}
                    <div className="flex gap-2 justify-end pt-3">
                      <button
                        className="btnEditProfile"
                        type="button"
                        onClick={handleCancel}
                        style={{ background: "#4a5568", color: "#fff" }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btnEditProfile saveBtn"
                        type="submit"
                        disabled={saving}
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
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default TutorEditProfilePage;