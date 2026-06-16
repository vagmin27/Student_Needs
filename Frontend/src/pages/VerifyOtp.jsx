import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { GraduationCap, Briefcase, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { showToast } from "@/components/Referrals/TransactionToast.jsx";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyStudentOtp, resendStudentOtp, verifyAlumniOtp, resendAlumniOtp } = useAuth();

  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "student";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      showToast("Email address is missing from the query params", "error");
      navigate("/role-selection");
    }
  }, [email, navigate]);

  // Resend OTP Countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length !== 6 || isNaN(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP code");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = role === "alumni" 
        ? await verifyAlumniOtp(email, otpValue)
        : await verifyStudentOtp(email, otpValue);

      if (response.success) {
        showToast("Email verified successfully! You can now log in.", "success");
        setTimeout(() => {
          navigate(`/login/${role}`);
        }, 1500);
      } else {
        setErrorMsg(response.message || "Invalid OTP code.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setErrorMsg("");
    try {
      const response = role === "alumni"
        ? await resendAlumniOtp(email)
        : await resendStudentOtp(email);

      if (response.success) {
        showToast("A fresh OTP has been sent to your email.", "success");
        setResendCooldown(60);
      } else {
        setErrorMsg(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      setErrorMsg(err.message || "Resend failed");
    }
  };

  const RoleIcon = role === "alumni" ? Briefcase : GraduationCap;

  return (
    <main className="uc-login-page">
      <div className="uc-login-card">
        <Link to={`/login/${role}`} className="uc-back-link">
          <span>{"<-"}</span>
          Back to Login
        </Link>

        <section className="uc-login-panel" aria-labelledby="verify-title">
          <div className="uc-login-icon">
            <RoleIcon />
          </div>
          <h1 id="verify-title">Verify Your Email</h1>
          <p className="px-4 text-center text-muted-foreground">
            We sent a 6-digit One-Time Password to <strong className="text-primary font-semibold">{email}</strong>. Enter the code below to verify your account.
          </p>
 
          {errorMsg && (
            <div className="uc-form-error" role="alert">
              {errorMsg}
            </div>
          )}
 
          <form onSubmit={handleVerify} className="uc-login-form">
            <div className="flex justify-center gap-2 my-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={isSubmitting}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-secondary border border-border rounded-[var(--radius-sm)] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              ))}
            </div>
 
            <button type="submit" className="uc-login-submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="uc-spin" />}
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </button>
          </form>
 
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive the email?{" "}
            {resendCooldown > 0 ? (
              <span className="text-muted-foreground/60 font-semibold">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline font-semibold transition-colors inline-flex items-center gap-1 focus:outline-none"
              >
                <RefreshCw size={14} /> Resend Code
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
