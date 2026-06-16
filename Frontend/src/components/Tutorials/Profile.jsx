import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Tutorials/Profile.css";
import { AiOutlineMail, AiOutlineSchedule } from "react-icons/ai";
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdOutlineFreeCancellation } from "react-icons/md";
import bulb2 from "../../assets/images/bulb2.png";
import API, { BASE_URL } from "@/services/api/tutorialsApi.js";

function Profile() {
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

  useEffect(() => {
    const fetchExistData = async () => {
      try {
        const { data } = await API.get("/profile");

        if (data.user) {
          const profileInDB = data.user.profile || {};

          const profileData = {
            username: profileInDB.displayName || "",
            fName: profileInDB.fName || "",
            lName: profileInDB.lName || "",
            email: profileInDB.email || "",
            subjects: profileInDB.subjects || "",
            location: profileInDB.location || "",
          };

          setProfile(profileData);
          setPreferredSchedule(data.user.schedule || []);
          setPic(data.user.pic ? `${BASE_URL}/uploads/${data.user.pic}` : null);
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchExistData();
  }, []);

  return (
    <main className="container-profile">
      {" "}
      <div className="main-profile">
        {" "}
        <div className="welcome">
          {/* LEFT SIDE */}
          <div className="profileInnerDiv">
            <h1 className="userName">
              {profile.username
                ? "Hi, " + profile.username
                : "Welcome! Please proceed to edit your profile."}
            </h1>

            <br />

            <div>
              <AiOutlineMail />{" "}
              {profile.email
                ? profile.email
                : "Add your email in your edit profile settings."}
            </div>

            <br />

            <div>
              <FaRegCalendarCheck />{" "}
              {preferredSchedule.length > 0
                ? "My preferred schedule is " + preferredSchedule.join(", ")
                : "Please select your preferred schedule in Edit Profile"}
              .
            </div>

            {/* 🔥 NEW BUTTONS */}
            <div style={{ marginTop: "20px" }}>
              <button
                className="btnEditProfile"
                onClick={() => navigate("/tutorials/profile/manageBooking")}
              >
                📚 View My Bookings
              </button>

              <button
                className="btnEditProfile"
                style={{ marginLeft: "10px" }}
                onClick={() => navigate("/tutorials/profile/editProfile")}
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="secondDiv">
            <img
              className="img-account-profile"
              src={pic || bulb2}
              alt="Not Found"
            />

            <div className="policy">
              <h2>Policy:</h2>
              <MdOutlineFreeCancellation /> Lesson cancellation: 1 hour notice
              required
              <div className="innerTextPolicy">
                <AiOutlineSchedule />{" "}
                <Link to="/tutorials/book" className="bookATrial">
                  Book a Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
