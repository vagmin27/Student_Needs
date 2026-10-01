import { useState, useEffect } from "react";
import { referralsApiClient } from "@/services/apiClient.js";
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Loader2, TrendingUp, AlertCircle, Plus, X, Award,
  Upload, Trash2, Globe, Edit3, Mail, BookOpen,
  Phone, GraduationCap, Building2, Calendar, Star,
  ExternalLink, Code2, Briefcase, Target, CheckCircle,
  FileText,
} from "lucide-react";
import { showTransactionToast, dismissToast } from "@/components/Referrals/TransactionToast.jsx";
import { ResumeSection } from "@/components/Referrals/Student/ResumeSection.jsx";
import { LinkedInSection } from "@/components/Referrals/Student/LinkedInSection.jsx";
import { GitHubSection } from "@/components/Referrals/Student/GitHubSection.jsx";
import { PortfolioSection } from "@/components/Referrals/Student/PortfolioSection.jsx";
import { BASE_URL } from "@/services/api/tutorialsApi.js";
import { calculateStudentProfileCompleteness } from "@/utils/profileCompleteness.js";

// ─── SVG icons ────────────────────────────────────────────────────────────────
const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={props.style}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionCard({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      borderRadius: "20px",
      padding: "28px 28px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, color = "#6366f1", title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "11px", flexShrink: 0,
          background: `${color}18`, border: `1.5px solid ${color}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {Icon && <Icon size={13} style={{ color: highlight ? "#6366f1" : "var(--text-muted)", flexShrink: 0 }} />}
        <span style={{ fontSize: "14px", fontWeight: "600", color: highlight ? "#6366f1" : "var(--text-primary)" }}>
          {value || <em style={{ color: "var(--text-muted)", fontWeight: 400, fontStyle: "italic" }}>Not specified</em>}
        </span>
      </div>
    </div>
  );
}

function Chip({ label, color = "#6366f1", onRemove }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "5px 11px", borderRadius: "999px",
      background: `${color}12`, border: `1px solid ${color}28`,
      color, fontSize: "12px", fontWeight: "600",
      transition: "all 0.12s ease",
    }}>
      {label}
      {onRemove && (
        <button
          type="button" onClick={onRemove}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "inherit", opacity: 0.6 }}
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}

function TagInput({ value, onChange, onAdd, onKeyPress, placeholder }) {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        style={{
          flex: 1, height: "40px", borderRadius: "10px",
          border: "1.5px solid var(--border-color)",
          background: "var(--card-bg)", color: "var(--text-primary)",
          padding: "0 12px", fontSize: "13px", outline: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={e => e.target.style.borderColor = "#6366f1"}
        onBlur={e => e.target.style.borderColor = "var(--border-color)"}
      />
      <button
        type="button" onClick={onAdd}
        style={{
          height: "40px", width: "40px", borderRadius: "10px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <Plus size={16} style={{ color: "#fff" }} />
      </button>
    </div>
  );
}

const fieldStyle = {
  height: "44px", borderRadius: "11px",
  border: "1.5px solid var(--border-color)",
  background: "var(--card-bg)", color: "var(--text-primary)",
  padding: "0 13px", fontSize: "13px", fontWeight: "500",
  outline: "none", width: "100%", transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};
const fieldFocus = (e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; };
const fieldBlur  = (e) => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; };

// ─── Main component ───────────────────────────────────────────────────────────
export default function StudentProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states — preserved exactly
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

  // Image states — preserved exactly
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  // College autocomplete — preserved exactly
  const [allColleges, setAllColleges] = useState([]);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load data
  useEffect(() => {
    fetchProfile();
    fetchScores();
    fetchColleges();
  }, []);

  const getStudentImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    const cleanImg = img.startsWith("/") ? img.slice(1) : img;
    return `${BASE_URL}/${cleanImg.startsWith("uploads/") ? cleanImg : `uploads/${cleanImg}`}`;
  };

  const fetchColleges = async () => {
    try {
      const res = await referralsApiClient.get("/student/colleges");
      if (res.data?.success) setAllColleges(res.data.data || []);
    } catch (e) { console.error("Colleges fetch failed:", e); }
  };

  const fetchScores = async () => {
    try {
      const response = await referralsApiClient.get("/my-applications");
      if (response.status === 200) {
        const applications = response.data?.data?.applications || response.data?.applications || [];
        let totalProfileScore = 0, totalInterviewScore = 0, count = 0;
        applications.forEach((app) => {
          if (app.studentDetails?.profileScore != null) { totalProfileScore += app.studentDetails.profileScore; count++; }
          if (app.studentDetails?.interviewScore != null) totalInterviewScore += app.studentDetails.interviewScore;
        });
        const avgProfileScore = count > 0 ? totalProfileScore / count : null;
        const avgInterviewScore = applications.length > 0 ? totalInterviewScore / applications.length : null;
        setScores({
          profileScore: avgProfileScore,
          interviewScore: avgInterviewScore,
          combinedScore: avgProfileScore != null && avgInterviewScore != null ? (avgProfileScore * avgInterviewScore) / 100 : null,
        });
      }
    } catch (error) { console.error("Error fetching scores:", error); }
  };

  const fetchProfile = async () => {
    try {
      const response = await studentProfileApi.getProfile();
      if (response.success) {
        const d = response.data;
        setProfile(d);
        setFirstName(d.firstName || "");
        setLastName(d.lastName || "");
        setEmail(d.email || "");
        setPhoneNumber(d.phoneNumber || "");
        setCollegeName(d.college?.name || "");
        setBranch(d.branch || "");
        setDegree(d.degree || "");
        setGraduationYear(d.graduationYear || new Date().getFullYear() + 1);
        setCgpa(d.cgpa != null ? d.cgpa.toString() : "");
        setBio(d.bio || "");
        setCareerInterests(d.careerInterests || []);
        setSkills(d.skills || []);
        setProjects(d.projects || []);
        setCertifications(d.certifications || []);
        setPreferredRoles(d.preferredRoles || []);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      showTransactionToast({ type: "error", message: error.response?.data?.message || "Failed to load profile" });
    } finally { setLoading(false); }
  };

  const refreshProfile = async () => { await fetchProfile(); };

  const handleCollegeChange = (val) => {
    setCollegeName(val);
    if (val.trim() && allColleges.length > 0) {
      const filtered = allColleges.filter(c => c.name.toLowerCase().includes(val.toLowerCase()));
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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) { showTransactionToast({ type: "error", message: "Only JPG, JPEG, PNG and WEBP formats are allowed." }); return; }
    if (file.size > 5 * 1024 * 1024) { showTransactionToast({ type: "error", message: "Image size must be less than 5 MB." }); return; }
    setPendingImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setShouldRemoveImage(false);
  };

  const handleRemovePendingImage = () => {
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    if (profile?.image) setShouldRemoveImage(true);
  };

  const isCollegeNameValid = allColleges.length === 0 || allColleges.some(
    c => c.name.replace(/\s+/g, "").toLowerCase() === collegeName.replace(/\s+/g, "").toLowerCase()
  );

  const hasUnsavedChanges =
    firstName !== (profile?.firstName || "") || lastName !== (profile?.lastName || "") ||
    email !== (profile?.email || "") || phoneNumber !== (profile?.phoneNumber || "") ||
    collegeName !== (profile?.college?.name || "") || branch !== (profile?.branch || "") ||
    degree !== (profile?.degree || "") || graduationYear !== (profile?.graduationYear || "") ||
    cgpa !== (profile?.cgpa != null ? profile.cgpa.toString() : "") || bio !== (profile?.bio || "") ||
    JSON.stringify(careerInterests) !== JSON.stringify(profile?.careerInterests || []) ||
    JSON.stringify(skills) !== JSON.stringify(profile?.skills || []) ||
    JSON.stringify(projects) !== JSON.stringify(profile?.projects || []) ||
    JSON.stringify(certifications) !== JSON.stringify(profile?.certifications || []) ||
    JSON.stringify(preferredRoles) !== JSON.stringify(profile?.preferredRoles || []) ||
    pendingImageFile !== null || shouldRemoveImage;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing && hasUnsavedChanges) { e.preventDefault(); e.returnValue = ""; return ""; }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing, hasUnsavedChanges]);

  const formatLastUpdated = (updatedStr) => {
    if (!updatedStr) return "N/A";
    const date = new Date(updatedStr);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
      " " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const currentTempStudent = {
    firstName, lastName, email, phoneNumber,
    image: shouldRemoveImage ? null : (pendingImageFile ? "preview" : (profile?.image || "")),
    college: collegeName ? { name: collegeName } : null,
    branch, degree, graduationYear, cgpa, skills,
    resume: profile?.resume || null,
    linkedinUrl: profile?.linkedinUrl || "",
    githubUrl: profile?.githubUrl || "",
    portfolioUrl: profile?.portfolioUrl || "",
  };
  const { score: liveCompleteness, missingFields: liveMissingFields } = calculateStudentProfileCompleteness(currentTempStudent);

  const handleSaveProfile = async () => {
    if (!isCollegeNameValid && collegeName.trim()) {
      showTransactionToast({ type: "error", message: "Select a registered college name from the searchable dropdown." });
      return;
    }
    if (cgpa !== "" && (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10 || isNaN(parseFloat(cgpa)))) {
      showTransactionToast({ type: "error", message: "CGPA must be a valid number between 0.0 and 10.0" });
      return;
    }
    setSaving(true);
    const toastId = showTransactionToast({ type: "pending", message: "Saving profile changes..." });
    try {
      if (shouldRemoveImage) await studentProfileApi.removeProfileImage();
      else if (pendingImageFile) await studentProfileApi.uploadProfileImage(pendingImageFile);

      const response = await studentProfileApi.updateProfile({
        firstName, lastName, email, phoneNumber, collegeName, branch, degree, graduationYear,
        cgpa: cgpa !== "" ? parseFloat(cgpa) : null,
        bio, careerInterests, skills, projects, certifications, preferredRoles,
      });
      dismissToast(toastId);
      if (response.success) {
        setProfile(response.data);
        setPendingImageFile(null);
        setImagePreviewUrl(null);
        setShouldRemoveImage(false);
        setIsEditing(false);
        showTransactionToast({ type: "success", message: "Profile updated successfully!" });
      }
    } catch (error) {
      dismissToast(toastId);
      showTransactionToast({ type: "error", message: error.response?.data?.message || "Failed to update profile" });
    } finally { setSaving(false); }
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) { if (!window.confirm("You have unsaved changes. Leave without saving?")) return; }
    if (profile) {
      setFirstName(profile.firstName || ""); setLastName(profile.lastName || "");
      setEmail(profile.email || ""); setPhoneNumber(profile.phoneNumber || "");
      setCollegeName(profile.college?.name || ""); setBranch(profile.branch || "");
      setDegree(profile.degree || ""); setGraduationYear(profile.graduationYear || new Date().getFullYear() + 1);
      setCgpa(profile.cgpa != null ? profile.cgpa.toString() : "");
      setBio(profile.bio || ""); setCareerInterests(profile.careerInterests || []);
      setSkills(profile.skills || []); setProjects(profile.projects || []);
      setCertifications(profile.certifications || []); setPreferredRoles(profile.preferredRoles || []);
    }
    setPendingImageFile(null); setImagePreviewUrl(null); setShouldRemoveImage(false);
    setIsEditing(false);
  };

  const addSkill = () => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(""); } };
  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));
  const addCareerInterest = () => { if (interestInput.trim() && !careerInterests.includes(interestInput.trim())) { setCareerInterests([...careerInterests, interestInput.trim()]); setInterestInput(""); } };
  const removeCareerInterest = (i) => setCareerInterests(careerInterests.filter(x => x !== i));
  const addProject = () => {
    if (projectTitle.trim()) {
      setProjects([...projects, { title: projectTitle.trim(), description: projectDescription.trim(), link: projectLink.trim() }]);
      setProjectTitle(""); setProjectDescription(""); setProjectLink("");
    }
  };
  const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index));
  const addCertification = () => {
    if (certName.trim()) {
      setCertifications([...certifications, { name: certName.trim(), issuer: certIssuer.trim(), date: certDate }]);
      setCertName(""); setCertIssuer(""); setCertDate("");
    }
  };
  const removeCertification = (index) => setCertifications(certifications.filter((_, i) => i !== index));
  const addRole = () => { if (roleInput.trim() && !preferredRoles.includes(roleInput.trim())) { setPreferredRoles([...preferredRoles, roleInput.trim()]); setRoleInput(""); } };
  const removeRole = (role) => setPreferredRoles(preferredRoles.filter(r => r !== role));

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366f1", animation: "spn 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Loading your profile…</p>
        </div>
        <style>{`@keyframes spn { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const displayImageSrc = shouldRemoveImage ? null : (imagePreviewUrl || getStudentImageUrl(profile?.image));

  // ── Completeness color ──
  const compColor = liveCompleteness >= 80 ? "#10b981" : liveCompleteness >= 50 ? "#f59e0b" : "#ef4444";

  // ── Render ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── Hero: avatar + name + edit button ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.05))",
        border: "1px solid var(--border-color)", borderRadius: "20px", padding: "28px",
        display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap",
      }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: "96px", height: "96px", borderRadius: "50%",
            overflow: "hidden", border: "3px solid rgba(99,102,241,0.3)",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 24px rgba(99,102,241,0.25)",
          }}>
            {displayImageSrc ? (
              <img src={displayImageSrc} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "32px", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em" }}>
                {firstName?.[0]}{lastName?.[0]}
              </span>
            )}
          </div>
          {isEditing && (
            <label htmlFor="student-avatar-file" style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", cursor: "pointer",
              opacity: 0, transition: "opacity 0.15s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0"}
            >
              <Upload size={18} style={{ color: "#fff" }} />
              <span style={{ color: "#fff", fontSize: "9px", fontWeight: "700", marginTop: "3px" }}>Change</span>
              <input id="student-avatar-file" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
            </label>
          )}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                {firstName} {lastName}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                  <Mail size={12} style={{ color: "#6366f1" }} /> {email}
                </span>
                {profile?.college?.name && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                    <Building2 size={12} style={{ color: "#8b5cf6" }} /> {profile.college.name}
                  </span>
                )}
                {profile?.degree && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                    <GraduationCap size={12} style={{ color: "#06b6d4" }} /> {profile.degree}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "8px 0 0", opacity: 0.7 }}>
                Last updated: {formatLastUpdated(profile?.updatedAt)}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    height: "40px", padding: "0 18px", borderRadius: "11px", border: "none",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff", fontSize: "13px", fontWeight: "700",
                    display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.30)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 18px rgba(99,102,241,0.45)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.30)"}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button" onClick={handleCancelEdit}
                    style={{
                      height: "40px", padding: "0 16px", borderRadius: "11px",
                      border: "1.5px solid var(--border-color)", background: "transparent",
                      color: "var(--text-primary)", fontSize: "13px", fontWeight: "600",
                      cursor: "pointer", transition: "background 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    Cancel
                  </button>
                  <button
                    type="button" onClick={handleSaveProfile} disabled={saving}
                    style={{
                      height: "40px", padding: "0 18px", borderRadius: "11px", border: "none",
                      background: saving ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", fontSize: "13px", fontWeight: "700",
                      display: "flex", alignItems: "center", gap: "7px",
                      cursor: saving ? "not-allowed" : "pointer",
                      boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
                    }}
                  >
                    {saving ? <><span style={{ width: "13px", height: "13px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spn 0.8s linear infinite", display: "inline-block" }} /> Saving…</> : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Remove photo button in edit mode */}
          {isEditing && displayImageSrc && (
            <button
              type="button" onClick={handleRemovePendingImage}
              style={{
                marginTop: "10px", height: "32px", padding: "0 13px", borderRadius: "9px",
                border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)",
                color: "#ef4444", fontSize: "12px", fontWeight: "600",
                display: "flex", alignItems: "center", gap: "5px", cursor: "pointer",
              }}
            >
              <Trash2 size={12} /> Remove Photo
            </button>
          )}
        </div>

        {/* Completeness ring */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
          padding: "16px 20px", borderRadius: "14px",
          border: "1px solid var(--border-color)", background: "var(--card-bg)",
          flexShrink: 0, minWidth: "110px",
        }}>
          <div style={{ position: "relative", width: "56px", height: "56px" }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5" />
              <circle
                cx="28" cy="28" r="22" fill="none"
                stroke={compColor} strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - liveCompleteness / 100)}`}
                transform="rotate(-90 28 28)"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
            </svg>
            <span style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "800", color: compColor,
            }}>
              {liveCompleteness}%
            </span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3 }}>Profile Complete</span>
          {liveMissingFields.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginTop: "4px", maxWidth: "140px" }}>
              <AlertCircle size={10} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.4 }}>Missing: {liveMissingFields.slice(0, 2).join(", ")}{liveMissingFields.length > 2 ? ` +${liveMissingFields.length - 2}` : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Academic & Personal Info ── */}
      <SectionCard>
        <SectionHeader icon={GraduationCap} title="Academic & Personal Information" subtitle="Your core academic profile and contact details." />

        {!isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="spv-grid-3">
              <InfoRow icon={Building2} label="College" value={profile?.college?.name} />
              <InfoRow icon={GraduationCap} label="Degree" value={profile?.degree} />
              <InfoRow icon={BookOpen} label="Branch / Department" value={profile?.branch} />
              <InfoRow icon={Calendar} label="Graduation Year" value={profile?.graduationYear} />
              <InfoRow icon={Star} label="CGPA" value={profile?.cgpa != null ? Number(profile.cgpa).toFixed(2) : null} highlight />
              <InfoRow icon={Phone} label="Phone" value={profile?.phoneNumber} />
            </div>

            {profile?.bio && (
              <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>Bio</p>
                <p style={{
                  fontSize: "14px", color: "var(--text-primary)", lineHeight: "1.7",
                  padding: "14px 16px", borderRadius: "12px",
                  background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.10)",
                  margin: 0, whiteSpace: "pre-line",
                }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Social links */}
            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>Social Links</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {profile?.linkedinUrl ? (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px",
                    borderRadius: "10px", border: "1px solid rgba(10,102,194,0.25)",
                    background: "rgba(10,102,194,0.06)", color: "#0a66c2",
                    fontSize: "13px", fontWeight: "600", textDecoration: "none", transition: "all 0.15s ease",
                  }}>
                    <Linkedin className="" style={{ width: "14px", height: "14px" }} /> LinkedIn
                    <ExternalLink size={11} />
                  </a>
                ) : <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No LinkedIn</span>}

                {profile?.githubUrl ? (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px",
                    borderRadius: "10px", border: "1px solid rgba(0,0,0,0.15)",
                    background: "rgba(0,0,0,0.04)", color: "var(--text-primary)",
                    fontSize: "13px", fontWeight: "600", textDecoration: "none", transition: "all 0.15s ease",
                  }}>
                    <Github className="" style={{ width: "14px", height: "14px" }} /> GitHub
                    <ExternalLink size={11} />
                  </a>
                ) : <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No GitHub</span>}

                {profile?.portfolioUrl ? (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px",
                    borderRadius: "10px", border: "1px solid rgba(16,185,129,0.25)",
                    background: "rgba(16,185,129,0.07)", color: "#10b981",
                    fontSize: "13px", fontWeight: "600", textDecoration: "none",
                  }}>
                    <Globe size={14} /> Portfolio
                    <ExternalLink size={11} />
                  </a>
                ) : <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No Portfolio</span>}
              </div>
            </div>
          </div>
        ) : (
          /* Edit mode */
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="spv-grid-2">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>First Name</label>
                <input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Last Name</label>
                <input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Email</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} required />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Phone</label>
                <input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </div>

            {/* College autocomplete (full width) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>College</label>
              <input
                id="college" value={collegeName}
                onChange={e => handleCollegeChange(e.target.value)}
                // onFocus={() => setShowSuggestions(true)}
                // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search your college..."
                style={{ ...fieldStyle, borderColor: !isCollegeNameValid && collegeName.trim() ? "#ef4444" : "var(--border-color)" }}
                onFocus={e => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.10)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; setTimeout(() => setShowSuggestions(false), 200); }}
              />
              {!isCollegeNameValid && collegeName.trim() && (
                <p style={{ fontSize: "11px", color: "#ef4444", margin: "2px 0 0" }}>⚠️ Select a valid college from the dropdown.</p>
              )}
              {showSuggestions && collegeSuggestions.length > 0 && (
                <ul style={{
                  position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)",
                  zIndex: 50, maxHeight: "180px", overflowY: "auto",
                  background: "var(--card-bg)", border: "1px solid var(--border-color)",
                  borderRadius: "12px", padding: "6px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", listStyle: "none", margin: 0,
                }}>
                  {collegeSuggestions.map(c => (
                    <li
                      key={c._id}
                      onMouseDown={() => handleSelectCollege(c.name)}
                      style={{
                        padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                        fontSize: "13px", color: "var(--text-primary)", transition: "background 0.1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }} className="spv-grid-4">
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Degree</label>
                <input value={degree} onChange={e => setDegree(e.target.value)} placeholder="e.g., B.Tech" style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Branch</label>
                <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g., CSE" style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Grad. Year</label>
                <input type="number" value={graduationYear} onChange={e => setGraduationYear(parseInt(e.target.value) || new Date().getFullYear())} style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>CGPA (0–10)</label>
                <input type="text" value={cgpa} onChange={e => setCgpa(e.target.value)} placeholder="e.g., 8.95" style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>Bio</label>
              <textarea
                value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Write a brief professional summary…" rows={3}
                style={{ ...fieldStyle, height: "auto", padding: "12px 13px", lineHeight: "1.6", resize: "vertical" }}
                onFocus={fieldFocus} onBlur={fieldBlur}
              />
            </div>

            {/* Social links in edit mode */}
            <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", margin: "0 0 12px" }}>Social Links</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }} className="spv-grid-3">
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#0a66c2" }}>LinkedIn URL</label>
                  <input value={profile?.linkedinUrl || ""} onChange={e => setProfile(prev => ({ ...prev, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/..." style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-primary)" }}>GitHub URL</label>
                  <input value={profile?.githubUrl || ""} onChange={e => setProfile(prev => ({ ...prev, githubUrl: e.target.value }))} placeholder="https://github.com/..." style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#10b981" }}>Portfolio URL</label>
                  <input value={profile?.portfolioUrl || ""} onChange={e => setProfile(prev => ({ ...prev, portfolioUrl: e.target.value }))} placeholder="https://portfolio.com" style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Skills, Interests, Roles ── */}
      <SectionCard>
        <SectionHeader icon={Target} color="#8b5cf6" title="Skills & Career Interests" subtitle="Highlight your technical skills and career aspirations." />
        {!isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { label: "Skills", items: skills, color: "#6366f1" },
              { label: "Career Interests", items: careerInterests, color: "#8b5cf6" },
              { label: "Preferred Roles", items: preferredRoles, color: "#06b6d4" },
            ].map(({ label, items, color }) => (
              <div key={label}>
                <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px" }}>{label}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {items.length > 0 ? items.map((item, idx) => <Chip key={idx} label={item} color={color} />) :
                    <em style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>None added yet</em>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="spv-grid-2">
            {/* Skills editor */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Skills</label>
              <TagInput value={skillInput} onChange={e => setSkillInput(e.target.value)} onAdd={addSkill}
                onKeyPress={e => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill…" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px", background: "rgba(99,102,241,0.04)", borderRadius: "10px", border: "1px solid var(--border-color)", minHeight: "48px" }}>
                {skills.map(s => <Chip key={s} label={s} color="#6366f1" onRemove={() => removeSkill(s)} />)}
              </div>
            </div>

            {/* Career interests editor */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Career Interests</label>
              <TagInput value={interestInput} onChange={e => setInterestInput(e.target.value)} onAdd={addCareerInterest}
                onKeyPress={e => e.key === "Enter" && (e.preventDefault(), addCareerInterest())} placeholder="Add an interest…" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px", background: "rgba(139,92,246,0.04)", borderRadius: "10px", border: "1px solid var(--border-color)", minHeight: "48px" }}>
                {careerInterests.map(i => <Chip key={i} label={i} color="#8b5cf6" onRemove={() => removeCareerInterest(i)} />)}
              </div>
            </div>

            {/* Preferred roles editor (full width) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", gridColumn: "1 / -1" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Preferred Roles</label>
              <TagInput value={roleInput} onChange={e => setRoleInput(e.target.value)} onAdd={addRole}
                onKeyPress={e => e.key === "Enter" && (e.preventDefault(), addRole())} placeholder="Add a preferred role…" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px", background: "rgba(6,182,212,0.04)", borderRadius: "10px", border: "1px solid var(--border-color)", minHeight: "48px" }}>
                {preferredRoles.map(r => <Chip key={r} label={r} color="#06b6d4" onRemove={() => removeRole(r)} />)}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Projects ── */}
      <SectionCard>
        <SectionHeader icon={Code2} color="#10b981" title="Projects" subtitle="Showcase your work and technical projects."
          action={isEditing && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </span>
          )}
        />

        {/* Add project form (edit mode) */}
        {isEditing && (
          <div style={{
            padding: "20px", borderRadius: "14px",
            border: "1.5px dashed rgba(16,185,129,0.35)",
            background: "rgba(16,185,129,0.04)", marginBottom: "20px",
          }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#10b981", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Add New Project</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }} className="spv-grid-2">
              <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Project Title (required)" style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
              <input value={projectLink} onChange={e => setProjectLink(e.target.value)} placeholder="Project / GitHub Link (optional)" style={fieldStyle} onFocus={fieldFocus} onBlur={fieldBlur} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <textarea
                value={projectDescription} onChange={e => setProjectDescription(e.target.value)}
                placeholder="Short description (optional)" rows={2}
                style={{ ...fieldStyle, flex: 1, height: "auto", padding: "10px 13px", lineHeight: "1.6", resize: "vertical" }}
                onFocus={fieldFocus} onBlur={fieldBlur}
              />
              <button type="button" onClick={addProject} style={{
                height: "40px", width: "40px", borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none", cursor: "pointer", flexShrink: 0, alignSelf: "flex-end",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus size={16} style={{ color: "#fff" }} />
              </button>
            </div>
          </div>
        )}

        {/* Project list */}
        {projects.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
            }}>
              <Code2 size={24} style={{ color: "#10b981", opacity: 0.7 }} />
            </div>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 4px" }}>No projects yet</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              {isEditing ? "Add a project above to showcase your work." : "Edit your profile to add projects."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {projects.map((project, idx) => (
              <div
                key={idx}
                style={{
                  padding: "20px 22px", borderRadius: "14px",
                  border: "1px solid var(--border-color)",
                  background: "var(--card-bg)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,185,129,0.10)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: project.description ? "10px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                      background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Code2 size={15} style={{ color: "#10b981" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {project.title}
                      </h4>
                      {project.link && (
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                          {project.link}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
                    {project.link && (
                      <a
                        href={project.link} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          padding: "6px 12px", borderRadius: "8px", textDecoration: "none",
                          border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)",
                          color: "#10b981", fontSize: "12px", fontWeight: "600",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.08)"}
                      >
                        <ExternalLink size={11} /> View
                      </a>
                    )}
                    {isEditing && (
                      <button
                        type="button" onClick={() => removeProject(idx)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: "32px", height: "32px", borderRadius: "8px",
                          border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.07)",
                          color: "#ef4444", cursor: "pointer", transition: "all 0.15s ease",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "10px 0 0", lineHeight: "1.65", paddingLeft: "44px" }}>
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Documents & Professional Profiles ── */}
      <div style={{ paddingTop: "12px", width: "100%" }}>
        <div style={{ marginBottom: "20px" }}>
          <SectionHeader icon={FileText} color="#6366f1" title="Documents & Professional Profiles" subtitle="Manage your resume, LinkedIn, GitHub, and portfolio links." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px", width: "100%", alignItems: "stretch" }} className="spv-grid-2">
          <ResumeSection resume={profile?.resume} onResumeChange={refreshProfile} />
          <LinkedInSection linkedinUrl={profile?.linkedinUrl} onLinkedInChange={refreshProfile} />
          <GitHubSection githubUrl={profile?.githubUrl} onGitHubChange={refreshProfile} />
          <PortfolioSection portfolioUrl={profile?.portfolioUrl} onPortfolioChange={refreshProfile} />
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @keyframes spn { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .spv-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .spv-grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .spv-grid-2 { grid-template-columns: 1fr !important; }
          .spv-grid-3 { grid-template-columns: 1fr !important; }
          .spv-grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .spv-grid-4 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
