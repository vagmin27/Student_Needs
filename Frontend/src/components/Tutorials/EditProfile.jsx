import React, { useState, useEffect, useRef } from "react";
import "../../styles/Tutorials/EditProfile.css";
import bulb2 from "../assets/images/bulb2.png";
import { useNavigate } from "react-router-dom";

// ✅ USE FUNCTIONS INSTEAD OF API
import {
  getEditProfile,
  editProfile,
  uploadProfilePic,
  deleteProfilePic,
} from "../utils/api";

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

        setPic(data.pic ? `http://localhost:8000/uploads/${data.pic}` : null);
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

      navigate("/profile");
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

      console.log("UPLOAD RESPONSE:", res.data);

      if (res.data.success) {
        alert("Profile Picture Saved!");
        navigate("/profile/editProfile");
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
    <main className="EditProfile">
      {" "}
      <div className="container-xl px-4 mt-4">
        {" "}
        <div className="background-white">
          {/* LEFT PROFILE CARD */}
          <div id="uploadProfileCard">
            <h1 className="card-header">Profile</h1>

            <div className="card-body text-center">
              <img
                className="img-account-profile"
                src={pic || bulb2}
                alt="Profile"
              />

              <div className="small text-muted">
                JPG or PNG no larger than 5 MB
              </div>

              <form ref={form} onSubmit={handleUpload}>
                <label htmlFor="files" className="btnEditProfile">
                  Upload new image
                </label>

                <input
                  id="files"
                  name="img"
                  type="file"
                  hidden
                  onChange={(e) => uploadImage(e.target.files[0])}
                />

                <button className="btnEditProfile" type="submit">
                  Save Profile Picture
                </button>

                <button className="btnEditProfile" onClick={delPic}>
                  Delete Profile Picture
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="pl-3">
            <h2 className="card-header">Account Details</h2>

            <form
              id="mainForm"
              onSubmit={handleSaveProfile}
              className="card-body form-grid"
            >
              {/* Username */}
              <div className="mb-3 full-row">
                <label className="small">Username</label>
                <input
                  className="form-control"
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={onInputChange}
                />
              </div>

              {/* First Name */}
              <div className="mb-3">
                <label className="small">First Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="fName"
                  value={profile.fName}
                  onChange={onInputChange}
                />
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <label className="small">Last Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="lName"
                  value={profile.lName}
                  onChange={onInputChange}
                />
              </div>

              {/* Email */}
              <div className="mb-3 full-row">
                <label className="small">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={onInputChange}
                />
              </div>

              {/* Subjects */}
              <div className="mb-3">
                <label className="small">Subjects</label>
                <input
                  className="form-control"
                  type="text"
                  name="subjects"
                  value={profile.subjects}
                  onChange={onInputChange}
                />
              </div>

              {/* Location */}
              <div className="mb-3">
                <label className="small">Location</label>
                <input
                  className="form-control"
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={onInputChange}
                />
              </div>

              {/* Schedule */}
              <div className="mb-3 full-row">
                <label className="small">Schedule Preference</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "6px",
                  }}
                >
                  {[
                    "weekdays AM",
                    "weekdays PM",
                    "weekends AM",
                    "weekends PM",
                    "flexible",
                  ].map((option) => (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={preferredSchedule.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredSchedule([
                              ...preferredSchedule,
                              option,
                            ]);
                          } else {
                            setPreferredSchedule(
                              preferredSchedule.filter((s) => s !== option),
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
              <button type="submit" className="btnEditProfile saveBtn">
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EditProfile;