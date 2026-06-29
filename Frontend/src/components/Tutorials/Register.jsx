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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
        <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)] space-y-6 text-center">
          <section className="flex flex-col items-center space-y-4">
            <div className="p-3.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Registration Successful</h1>
            <p className="text-sm text-[var(--text-muted)]">{message}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)] space-y-6">
        <Link to="/role-selection" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
          ← Back to role selection
        </Link>

        <section className="flex flex-col items-center text-center space-y-4">
          <div className="p-3.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Student Sign Up</h1>
          <p className="text-sm text-[var(--text-muted)]">Create your account to start matching with expert tutors.</p>

          {step === "form" && (
            <form className="w-full space-y-4 text-left pt-2" onSubmit={requestOtp}>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Email address</span>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={user.email}
                  onChange={onInputChange}
                  name="email"
                  className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm placeholder:text-[var(--text-muted)]"
                  required
                />
              </label>
              <small className="text-xs text-[var(--text-muted)] opacity-80 block -mt-2">
                We will never share your email.
              </small>
              {error.email && <span className="text-xs text-red-500 font-medium block">{error.email}</span>}

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  value={user.password}
                  onChange={onInputChange}
                  className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm placeholder:text-[var(--text-muted)]"
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmedPassword"
                  value={user.confirmedPassword}
                  onChange={onInputChange}
                  onBlur={validateInput}
                  className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm placeholder:text-[var(--text-muted)]"
                  required
                />
              </label>
              {error.confirmedPassword && (
                <span className="text-xs text-red-500 font-medium block">{error.confirmedPassword}</span>
              )}

              <button 
                type="submit" 
                className="w-full py-3 px-4 font-bold text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-md)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] mt-4"
              >
                Send OTP
              </button>

              <p className="text-xs text-[var(--text-secondary)] text-center pt-2">
                Already have an account? <Link to="/login/student" className="text-[var(--primary)] hover:underline font-semibold">Login</Link>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form className="w-full space-y-4 text-left pt-2" onSubmit={verifyOtp}>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-[var(--radius-md)]">{message}</p>
              
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Enter 6-digit OTP sent to {user.email}</span>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={onOtpChange}
                  maxLength="6"
                  className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm placeholder:text-[var(--text-muted)] tracking-wider text-center font-bold"
                  required
                />
              </label>
              {error.otp && <span className="text-xs text-red-500 font-medium block">{error.otp}</span>}

              <button 
                type="submit" 
                className="w-full py-3 px-4 font-bold text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-md)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] mt-4"
              >
                Verify and Register
              </button>

              <button 
                type="button" 
                className="w-full py-2.5 px-4 font-semibold text-xs border border-[var(--border-color)] text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 rounded-[var(--radius-md)] transition-all"
                onClick={resendOtp}
              >
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
