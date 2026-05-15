import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTutorProfile } from "../../utils/Tutorials/api";
import Navbar from "../../components/Tutorials/Navbar";

import "../../styles/Tutorials/TutorDashboard.css";

function TutorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await getTutorProfile();

        if (!res.data?.profile) {
          navigate("/login/teacher");
        }
      } catch {
        navigate("/login/teacher");
      }
    };

    check();
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="heading">👨‍🏫 Tutor Dashboard</h1>

        <div className="card">
          <h3>Manage Your Teaching</h3>

          <button
            className="button"
            onClick={() => navigate("/tutor/availability")}
          >
            📅 Set Availability
          </button>

          <button
            className="button"
            onClick={() => navigate("/tutor/editProfile")}
          >
            👤 View Profile
          </button>

          <button
            className="button"
            onClick={() => navigate("/tutor/schedule")}
          >
            📚 View Schedule
          </button>

          <button
            className="button"
            onClick={() => navigate("/tutor/accept")}
          >
            📥 Booking Requests
          </button>
        </div>
      </div>
    </>
  );
}

export default TutorDashboard;
