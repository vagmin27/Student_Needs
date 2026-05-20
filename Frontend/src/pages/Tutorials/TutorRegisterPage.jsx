import React, { useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import "../../styles/Tutorials/TutorLogin.css";
import "../../styles/Tutorials/TutorRegistration.css";
import { useNavigate } from "react-router-dom";
import blackboard from "../../assets/images/blackboard.png";

function TutorRegisterPage() {
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [tutor, setTutor] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  // STEP 1 — Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/tutor/register/request-otp", tutor);
      setMessage(res.data.message);
      setStep("otp");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP ❌");
    }
  };

  // STEP 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/tutor/register/verify-otp", {
        email: tutor.email,
        otp,
      });
      if (res.data.status === "ok") {
        alert("Registered successfully! Please log in 🎉");
        navigate("/login/tutor");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  return (
    <div className="tutor-page">
      <div className="tutor-navbar">
        <h2>💡 Tutor Match</h2>
      </div>

      <div className="tutor-container">
        <div className="tutor-left">
          <h2>Start Teaching Today 🚀</h2>
          <img src={blackboard} alt="illustration" />
        </div>

        <div className="tutor-right">
          <h1>Tutor Sign Up</h1>

          {step === "form" ? (
            <form onSubmit={handleRequestOtp} className="tutor-form">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={tutor.name}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={tutor.email}
                onChange={handleChange}
                required
              />
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={tutor.password}
                onChange={handleChange}
                required
              />
              <button type="submit">SEND OTP</button>
              <p style={{ marginTop: "10px" }}>
                Already have an account?{" "}
                <span
                  style={{ color: "#ff7a2f", cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => navigate("/login/tutor")}
                >
                  Login
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="tutor-form">
              <p style={{ color: "green", marginBottom: "12px" }}>{message}</p>
              <label>Enter OTP sent to {tutor.email}</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <button type="submit">VERIFY & REGISTER</button>
              <p
                style={{ marginTop: "10px", color: "#ff7a2f", cursor: "pointer" }}
                onClick={() => setStep("form")}
              >
                ← Back
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorRegisterPage;
