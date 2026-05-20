import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Tutorials/Navbar";
import "../../styles/Tutorials/EditProfile.css";
import bulb2 from "../../assets/images/bulb2.png";
import { useNavigate } from "react-router-dom";

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
  });

  const [pic, setPic] = useState(null);

  // ✅ FETCH PROFILE
  useEffect(() => {
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
        console.error("❌ Error:", err);
      }
    };

    fetchData();
  }, []);

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
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ✅ SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      });

      alert(res.data.msg || "Profile updated!");

      navigate("/tutorials/tutor/dashboard");
    } catch (err) {
      console.error("❌ Save error:", err);
    }
  };

  return (
    <>
      <Navbar />

      <main className="EditProfile">
        <div className="container-xl px-4 mt-4">
          <div className="background-white">

            {/* LEFT CARD */}
            <div id="uploadProfileCard">

              <h1 className="card-header">
                Profile
              </h1>

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

                  <label
                    htmlFor="files"
                    className="btnEditProfile"
                  >
                    Upload new image
                  </label>

                  <input
                    id="files"
                    name="profilePic"
                    type="file"
                    hidden
                    onChange={(e) =>
                      previewImage(e.target.files[0])
                    }
                  />

                  <button
                    className="btnEditProfile"
                    type="submit"
                  >
                    Save Profile Picture
                  </button>

                  <button
                    className="btnEditProfile"
                    onClick={handleDelete}
                  >
                    Delete Profile Picture
                  </button>

                </form>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="pl-3">

              <h2 className="card-header">
                Tutor Details
              </h2>

              <form
                className="card-body form-grid"
                onSubmit={handleSubmit}
              >

                {/* USERNAME */}
                <div className="mb-3 full-row">
                  <label className="small">
                    Username
                  </label>

                  <input
                    className="form-control"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                  />
                </div>

                {/* FIRST NAME */}
                <div className="mb-3">
                  <label className="small">
                    First Name
                  </label>

                  <input
                    className="form-control"
                    name="fName"
                    value={profile.fName}
                    onChange={handleChange}
                  />
                </div>

                {/* LAST NAME */}
                <div className="mb-3">
                  <label className="small">
                    Last Name
                  </label>

                  <input
                    className="form-control"
                    name="lName"
                    value={profile.lName}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL */}
                <div className="mb-3 full-row">
                  <label className="small">
                    Email
                  </label>

                  <input
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                {/* CONTACT */}
                <div className="mb-3">
                  <label className="small">
                    Contact
                  </label>

                  <input
                    className="form-control"
                    name="contact"
                    value={profile.contact}
                    onChange={handleChange}
                  />
                </div>

                {/* LOCATION */}
                <div className="mb-3">
                  <label className="small">
                    Location
                  </label>

                  <input
                    className="form-control"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>

                {/* EXPERIENCE */}
                <div className="mb-3">
                  <label className="small">
                    Experience
                  </label>

                  <input
                    className="form-control"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                  />
                </div>

                {/* EXPERTISE */}
                <div className="mb-3">
                  <label className="small">
                    Expertise
                  </label>

                  <input
                    className="form-control"
                    name="expertise"
                    value={profile.expertise}
                    onChange={handleChange}
                  />
                </div>

                {/* SAVE */}
                <button
                  className="btnEditProfile saveBtn"
                  type="submit"
                >
                  Save Changes
                </button>

              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default TutorEditProfilePage;