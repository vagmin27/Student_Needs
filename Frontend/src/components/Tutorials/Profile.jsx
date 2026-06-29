import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <main className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDE */}
          <div className="flex-grow lg:flex-[2] bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] text-[var(--text-secondary)] space-y-4">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              {profile.username
                ? "Hi, " + profile.username
                : "Welcome! Please proceed to edit your profile."}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] pt-2">
              <AiOutlineMail className="w-4 h-4 text-[var(--text-muted)] shrink-0" />{" "}
              <span>
                {profile.email
                  ? profile.email
                  : "Add your email in your edit profile settings."}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <FaRegCalendarCheck className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" />{" "}
              <span>
                {preferredSchedule.length > 0
                  ? "My preferred schedule is " + preferredSchedule.join(", ")
                  : "Please select your preferred schedule in Edit Profile"}
                .
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border-color)]/50 mt-6">
              <button
                className="px-4 py-2 text-xs font-bold rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:-translate-y-px transition-all shadow-[var(--shadow-sm)]"
                onClick={() => navigate("/tutorials/profile/manageBooking")}
              >
                📚 View My Bookings
              </button>

              <button
                className="px-4 py-2 text-xs font-bold rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/85 hover:-translate-y-px transition-all shadow-[var(--shadow-sm)]"
                onClick={() => navigate("/tutorials/profile/editProfile")}
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-[300px] bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col items-center gap-5 text-center text-[var(--text-secondary)] h-fit">
            <img
              className="w-28 h-28 rounded-full object-cover border-4 border-[var(--primary)] p-1 bg-[var(--bg-secondary)] shadow-[var(--shadow-sm)]"
              src={pic || bulb2}
              alt="Profile"
            />

            <div className="w-full text-left space-y-2 border-t border-[var(--border-color)]/50 pt-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Cancellation Policy</h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-center gap-2">
                <MdOutlineFreeCancellation className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Lesson cancellation: 1 hour notice required</span>
              </p>
              <div className="text-xs text-[var(--text-secondary)] leading-relaxed flex items-center gap-2 pt-1">
                <AiOutlineSchedule className="w-4 h-4 text-[var(--primary)] shrink-0" />{" "}
                <Link to="/tutorials/book" className="text-[var(--primary)] hover:underline font-semibold">
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
