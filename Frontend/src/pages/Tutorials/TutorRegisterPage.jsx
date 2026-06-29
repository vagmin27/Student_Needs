import React, { useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { API_PREFIXES, getApiUrl } from "@/config/api.js";

// Google SVG Icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
    <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.08H2.15V16.94C3.96 20.53 7.69 23 12 23Z" fill="#34A853"/>
    <path d="M5.82 14.08C5.59 13.4 5.46 12.71 5.46 12C5.46 11.29 5.59 10.6 5.82 9.92V7.06H2.15C1.4 8.56 0.98 10.24 0.98 12C0.98 13.76 1.4 15.44 2.15 16.94L5.82 14.08Z" fill="#FBBC05"/>
    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.03L19.37 3.86C17.46 2.07 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.06L5.82 9.92C6.7 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
  </svg>
);

// GitHub SVG Icon
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.868 20.166 8.839 21.488C9.339 21.578 9.52 21.268 9.52 21.008C9.52 20.771 9.511 19.982 9.506 19.112C6.726 19.714 6.14 17.771 6.14 17.771C5.685 16.616 5.029 16.308 5.029 16.308C4.122 15.689 5.097 15.701 5.097 15.701C6.099 15.772 6.626 16.73 6.626 16.73C7.516 18.254 8.956 17.814 9.54 17.554C9.63 16.89 9.899 16.45 10.198 16.198C7.978 15.945 5.645 15.087 5.645 11.218C5.645 10.115 6.039 9.213 6.685 8.513C6.581 8.261 6.237 7.234 6.784 5.845C6.784 5.845 7.632 5.574 9.501 6.839C10.306 6.615 11.166 6.503 12.02 6.499C12.873 6.503 13.733 6.615 14.539 6.839C16.407 5.574 17.254 5.845 17.254 5.845C17.802 7.234 17.458 8.261 17.355 8.513C18.002 9.213 18.394 10.115 18.394 11.218C18.394 15.098 16.059 15.941 13.834 16.19C14.209 16.514 14.545 17.151 14.545 18.121C14.545 19.511 14.533 20.635 14.533 21.008C14.533 21.271 14.713 21.583 15.218 21.487C19.186 20.161 22 16.418 22 12C22 6.477 17.523 2 12 2Z"/>
  </svg>
);

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
    <main className="uc-login-page">
      <div className="uc-login-card">
        <Link to="/role-selection" className="uc-back-link" aria-label="Back to role selection">
          <span>{"<-"}</span> Back to role selection
        </Link>

        <section className="uc-login-panel" aria-labelledby="tutor-register-title">
          <div className="uc-login-icon">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 id="tutor-register-title">Tutor Sign Up</h1>
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

              <button 
                type="submit" 
                className="uc-primary-button w-full h-11 font-bold text-sm rounded-[var(--radius-sm)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] mt-4 cursor-pointer"
              >
                Send OTP
              </button>

              <p className="text-xs text-[var(--text-secondary)] text-center w-full pt-2">
                Already have an account? <Link to="/login/tutor" className="text-[var(--primary)] hover:underline font-semibold ml-1">Login</Link>
              </p>

              <div className="w-full flex items-center text-center my-6 text-xs text-[var(--text-muted)] tracking-wider font-semibold before:content-[''] before:flex-1 before:border-b before:border-[var(--border-color)] before:mr-3 after:content-[''] after:flex-1 after:border-b after:border-[var(--border-color)] after:ml-3">
                OR CONTINUE WITH
              </div>

              <div className="social-auth-grid w-full grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 h-11 bg-transparent border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/80 rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--text-primary)] transition-all cursor-pointer" 
                  onClick={() => window.location.href = `${getApiUrl(API_PREFIXES.referrals)}/student/auth/google?role=tutor`}
                >
                  <GoogleIcon />
                  Google
                </button>
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 h-11 bg-transparent border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/80 rounded-[var(--radius-sm)] text-sm font-semibold text-[var(--text-primary)] transition-all cursor-pointer" 
                  onClick={() => window.location.href = `${getApiUrl(API_PREFIXES.referrals)}/student/auth/github?role=tutor`}
                >
                  <GitHubIcon />
                  GitHub
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="uc-login-form">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-[var(--radius-sm)]">{message}</p>
              
              <label className="uc-field">
                <span>Enter OTP sent to {tutor.email}</span>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="tracking-wider text-center font-bold"
                  required
                />
              </label>

              <button 
                type="submit" 
                className="uc-primary-button w-full h-11 font-bold text-sm rounded-[var(--radius-sm)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] mt-4 cursor-pointer"
              >
                Verify & Register
              </button>

              <p className="text-xs text-[var(--text-secondary)] text-center w-full pt-2">
                <span onClick={() => setStep("form")} className="text-[var(--primary)] hover:underline font-semibold cursor-pointer">
                  ← Back to form
                </span>
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default TutorRegisterPage;
