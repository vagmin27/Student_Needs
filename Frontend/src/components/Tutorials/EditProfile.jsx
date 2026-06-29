import React, { useState, useEffect, useRef } from "react";
import bulb2 from "../../assets/images/bulb2.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";

// ✅ USE FUNCTIONS INSTEAD OF API
import {
  getEditProfile,
  editProfile,
  uploadProfilePic,
  deleteProfilePic,
} from "@/services/api/tutorialsApi.js";
import { BASE_URL } from "@/services/api/tutorialsApi.js";

function EditProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: "",
    fName: "",
    lName: "",
    email: "",
    subjects: "",
    location: "",
  });

  const [preferredSchedule, setPreferredSchedule] = useState([]);
  const [pic, setPic] = useState(null);
  const form = useRef(null);

  // ✅ FETCH PROFILE
  useEffect(() => {
    const fetchExistData = async () => {
      try {
        const res = await getEditProfile(); // ✅ FIXED

        const data = res.data;

        if (data.profile) {
          const p = data.profile;

          setProfile({
            username: p.displayName || "",
            fName: p.fName || "",
            lName: p.lName || "",
            email: p.email || "",
            subjects: p.subjects || "",
            location: p.location || "",
          });

          setPreferredSchedule(p.schedule || []);
        }

        setPic(data.pic ? `${BASE_URL}/uploads/${data.pic}` : null);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchExistData();
  }, []);

  // ✅ SAVE PROFILE
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await editProfile({
        // ✅ FIXED
        displayName: profile.username,
        fName: profile.fName,
        lName: profile.lName,
        email: profile.email,
        subjects: profile.subjects,
        location: profile.location,
        schedule: preferredSchedule,
      });

      alert(res.data.msg || "Profile updated!");

      // 🔥 REFETCH UPDATED DATA
      const updated = await getEditProfile(); // ✅ FIXED

      if (updated.data.profile) {
        const p = updated.data.profile;

        setProfile({
          username: p.displayName || "",
          fName: p.fName || "",
          lName: p.lName || "",
          email: p.email || "",
          subjects: p.subjects || "",
          location: p.location || "",
        });

        setPreferredSchedule(p.schedule || []);
      }

      navigate("/tutorials/profile");
    } catch (err) {
      console.error("❌ Error saving profile:", err);
    }
  };

  // ✅ INPUT CHANGE
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ IMAGE PREVIEW
  const uploadImage = (file) => {
    if (!file) return;
    if (pic) URL.revokeObjectURL(pic);
    setPic(URL.createObjectURL(file));
  };

  // ✅ UPLOAD IMAGE
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const fileInput = form.current.querySelector('input[type="file"]');
      const file = fileInput.files[0];

      if (!file) {
        alert("Please select a file first");
        return;
      }

      const formData = new FormData();
      formData.append("profilePic", file); // ✅ MUST MATCH BACKEND

      const res = await uploadProfilePic(formData);


      if (res.data.success) {
        alert("Profile Picture Saved!");
        navigate("/tutorials/profile/editProfile");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  // ✅ DELETE IMAGE
  const delPic = async (e) => {
    e.preventDefault();

    try {
      await deleteProfilePic(); // ✅ FIXED

      setPic(bulb2);
      alert("Profile picture removed!");
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  return (
    <main className="w-full py-4 md:py-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 bg-[var(--card-bg)] border border-[var(--border-color)] p-6 md:p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
        {/* LEFT PROFILE CARD */}
        <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col items-center p-6 bg-[var(--bg-secondary)]/20 border border-[var(--border-color)] rounded-[var(--radius-lg)] text-center h-fit">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Profile Picture</h3>

          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary)] mb-3 shadow-[var(--shadow-sm)]"
            src={pic || bulb2}
            alt="Profile"
          />

          <div className="text-xs text-[var(--text-muted)] mb-5">
            JPG or PNG no larger than 5 MB
          </div>

          <form ref={form} onSubmit={handleUpload} className="w-full flex flex-col gap-2">
            <label 
              htmlFor="files" 
              className="w-full py-2 px-4 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] transition-all cursor-pointer block text-center"
            >
              Upload new image
            </label>

            <input
              id="files"
              name="img"
              type="file"
              hidden
              onChange={(e) => uploadImage(e.target.files[0])}
            />

            <Button className="w-full text-xs h-9 font-semibold" type="submit">
              Save Photo
            </Button>

            <Button variant="outline" className="w-full text-xs h-9 font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20" onClick={delPic}>
              Delete Photo
            </Button>
          </form>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 pb-2 border-b border-[var(--border-color)]">
            Account Details
          </h3>

          <form
            onSubmit={handleSaveProfile}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* Username */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Username</label>
              <input
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                type="text"
                name="username"
                value={profile.username}
                onChange={onInputChange}
              />
            </div>

            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">First Name</label>
              <input
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                type="text"
                name="fName"
                value={profile.fName}
                onChange={onInputChange}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Last Name</label>
              <input
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                type="text"
                name="lName"
                value={profile.lName}
                onChange={onInputChange}
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Email</label>
              <input
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                type="email"
                name="email"
                value={profile.email}
                onChange={onInputChange}
              />
            </div>

            {/* Subjects */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Subjects</label>
              <input
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                type="text"
                name="subjects"
                value={profile.subjects}
                onChange={onInputChange}
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Location</label>
              <input
                className="w-full p-2.5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                type="text"
                name="location"
                value={profile.location}
                onChange={onInputChange}
              />
            </div>

            {/* Schedule */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)] block">Schedule Preference</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {[
                  "weekdays AM",
                  "weekdays PM",
                  "weekends AM",
                  "weekends PM",
                  "flexible",
                ]?.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={preferredSchedule.includes(option)}
                      className="rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]/50 w-4 h-4"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferredSchedule([
                            ...preferredSchedule,
                            option,
                          ]);
                        } else {
                          setPreferredSchedule(
                            preferredSchedule?.filter((s) => s !== option),
                          );
                        }
                      }}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="sm:col-span-2 pt-4 flex justify-end">
              <Button type="submit" className="w-full sm:w-[160px] font-bold text-sm h-10 shadow-[var(--shadow-sm)]">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default EditProfile;
