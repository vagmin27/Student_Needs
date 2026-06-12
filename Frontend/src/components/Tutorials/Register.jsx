import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import API from "@/services/api/tutorialsApi.js";

function Register() {
  const [step, setStep] = useState("form"); // 'form', 'otp', 'success'
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
    otp: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    const res = await API.post("/register/request-otp", {
        email: user.email,
        password: user.password,
    });
    const data = res.data;
    if (res.status === 200) {
      setStep("otp");
      setMessage(data.message);
    } else {
      setError({ ...error, email: data.message });
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const res = await API.post("/register/verify-otp", {
        email: user.email,
        otp: otp,
    });
    const data = res.data;
    if (res.status === 200) {
      setStep("success");
      setMessage(data.message);
      setTimeout(() => {
        navigate("/login/student");
      }, 2000);
    } else {
      setError({ ...error, otp: data.message });
    }
  };

  const resendOtp = async () => {
    const res = await API.post("/register/resend-otp", {
        email: user.email,
    });
    const data = res.data;
    setMessage(data.message);
  };

  const onInputChange = (evt) => {
    const { value, name } = evt.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(evt);
  };

  const validateInput = (evt) => {
    let { name, value } = evt.target;
    setError((prev) => {
      const obj = { ...prev, [name]: "" };
      if (user.password && value !== user.password) {
        obj[name] = "The confirmed password does not match with the password";
      }
      return obj;
    });
  };

  const onOtpChange = (e) => {
    setOtp(e.target.value);
  };

  if (step === "success") {
    return (
      <div className="uc-login-page">
        <div className="uc-login-card">
          <section className="uc-login-panel">
            <div className="uc-login-icon">
              <GraduationCap />
            </div>
            <h1>Registration Successful</h1>
            <p>{message}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="uc-login-page">
      <div className="uc-login-card">
        <Link to="/role-selection" className="uc-back-link">
          <span>{"<- "}</span>
          Back to role selection
        </Link>

        <section className="uc-login-panel">
          <div className="uc-login-icon">
            <GraduationCap />
          </div>
          <h1>Student Sign Up</h1>
          <p>Create your account to start matching with expert tutors.</p>

          {step === "form" && (
            <form className="uc-login-form" onSubmit={requestOtp}>
              <label className="uc-field">
                <span>Email address</span>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={user.email}
                  onChange={onInputChange}
                  name="email"
                  required
                />
              </label>
              <small style={{ color: "var(--text-secondary)", opacity: 0.8, display: "block" }}>
                We will never share your email.
              </small>
              {error.email && <span className="text-xs text-destructive">{error.email}</span>}

              <label className="uc-field">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={user.password}
                  onChange={onInputChange}
                  required
                />
              </label>

              <label className="uc-field">
                <span>Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmedPassword"
                  value={user.confirmedPassword}
                  onChange={onInputChange}
                  onBlur={validateInput}
                  required
                />
              </label>
              {error.confirmedPassword && (
                <span className="text-xs text-destructive">{error.confirmedPassword}</span>
              )}

              <button type="submit" className="uc-login-submit">
                Send OTP
              </button>

              <p className="uc-login-switch">
                Already have an account? <Link to="/login/student">Login</Link>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form className="uc-login-form" onSubmit={verifyOtp}>
              <p className="text-sm text-success mb-3">{message}</p>
              <label className="uc-field">
                <span>Enter 6-digit OTP sent to {user.email}</span>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={onOtpChange}
                  maxLength="6"
                  required
                />
              </label>
              {error.otp && <span className="text-xs text-destructive">{error.otp}</span>}

              <button type="submit" className="uc-login-submit">
                Verify and Register
              </button>

              <button type="button" className="uc-secondary-button w-full" onClick={resendOtp}>
                Resend OTP
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default Register;
