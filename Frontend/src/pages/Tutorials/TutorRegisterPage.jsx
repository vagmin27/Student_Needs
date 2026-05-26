import React, { useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

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
    <div className="uc-login-page">
      <div className="uc-login-card">
        <Link to="/role-selection" className="uc-back-link">
          <span>{"<- "}</span>
          Back to role selection
        </Link>

        <section className="uc-login-panel">
          <div className="uc-login-icon">
            <BookOpen />
          </div>
          <h1>Tutor Sign Up</h1>
          <p>Register as a tutor to start teaching on UniConnect.</p>

          {step === "form" ? (
            <form onSubmit={handleRequestOtp} className="uc-login-form">
              <label className="uc-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={tutor.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="uc-field">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={tutor.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="uc-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={tutor.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit" className="uc-login-submit">
                SEND OTP
              </button>

              <p className="uc-login-switch">
                Already have an account? <Link to="/login/tutor">Login</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="uc-login-form">
              <p style={{ color: "green", marginBottom: "12px" }}>{message}</p>
              <label className="uc-field">
                <span>Enter OTP sent to {tutor.email}</span>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </label>

              <button type="submit" className="uc-login-submit">
                VERIFY & REGISTER
              </button>

              <p className="uc-login-switch">
                <span onClick={() => setStep("form")} style={{ cursor: "pointer", fontWeight: "bold" }}>
                  ← Back to form
                </span>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default TutorRegisterPage;
