import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, ShieldAlert, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { showToast } from "@/components/Referrals/TransactionToast.jsx";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const role = searchParams.get("role");

  // Flow steps: "email" | "otp" | "reset" | "success"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validatePasswordStrength = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const ROLE_HANDLERS = {
    student: {
      forgotPassword: auth.studentForgotPassword,
      verifyResetOtp: auth.studentVerifyResetOtp,
      resetPassword: auth.studentResetPassword,
      title: "Reset Student Password",
      emailSubtitle: "Enter your registered student email.",
      backText: "Back to Student Login"
    },
    alumni: {
      forgotPassword: auth.alumniForgotPassword,
      verifyResetOtp: auth.alumniVerifyResetOtp,
      resetPassword: auth.alumniResetPassword,
      title: "Reset Alumni Password",
      emailSubtitle: "Enter your registered alumni email.",
      backText: "Back to Alumni Login"
    },
    tutor: {
      forgotPassword: auth.tutorForgotPassword,
      verifyResetOtp: auth.tutorVerifyResetOtp,
      resetPassword: auth.tutorResetPassword,
      title: "Reset Tutor Password",
      emailSubtitle: "Enter your registered tutor email.",
      backText: "Back to Tutor Login"
    }
  };

  const activeRoleHandler = ROLE_HANDLERS[role];

  React.useEffect(() => {
    if (!role || !activeRoleHandler) {
      navigate("/role-selection", { replace: true });
    }
  }, [role, activeRoleHandler, navigate]);

  if (!role || !activeRoleHandler) {
    return null; // Return null while redirecting
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await activeRoleHandler.forgotPassword(email);

      if (response.success) {
        showToast("Reset password verification code sent to your email", "success");
        setStep("otp");
      } else {
        setErrorMsg(response.message || "Failed to send reset code.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6 || isNaN(otp)) {
      setErrorMsg("Please enter the 6-digit OTP code");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await activeRoleHandler.verifyResetOtp(email, otp);

      if (response.success) {
        showToast("OTP verified successfully.", "success");
        setStep("reset");
      } else {
        setErrorMsg(response.message || "Invalid OTP code.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (!validatePasswordStrength(password)) {
      setErrorMsg("Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = { email, otp, password, confirmPassword };
      const response = await activeRoleHandler.resetPassword(payload);

      if (response.success) {
        showToast("Password updated successfully! Redirecting to login...", "success");
        setStep("success");
        setTimeout(() => {
          navigate(`/login/${role}`);
        }, 3000);
      } else {
        setErrorMsg(response.message || "Reset failed.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="uc-login-page">
      <div className="uc-login-card">
        {step !== "success" && (
          <Link to={`/login/${role}`} className="uc-back-link">
            <span>{"<-"}</span>
            {activeRoleHandler.backText}
          </Link>
        )}

        <section className="uc-login-panel" aria-labelledby="forgot-title">
          <div className="uc-login-icon">
            <KeyRound />
          </div>
          <h1 id="forgot-title">{activeRoleHandler.title}</h1>
          <p className="px-4 text-center">
            {step === "email" && activeRoleHandler.emailSubtitle}
            {step === "otp" && `Enter the 6-digit OTP code sent to ${email}.`}
            {step === "reset" && "Create a secure new password for your account."}
            {step === "success" && `Password reset link sent to your ${role} email.`}
          </p>

          {errorMsg && (
            <div className="uc-form-error" role="alert">
              {errorMsg}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSendOtp} className="uc-login-form">
              <label className="uc-field">
                <span>Email Address</span>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-muted-foreground">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    placeholder="name@email.com"
                    disabled={isSubmitting}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </label>

              <button type="submit" className="uc-login-submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="uc-spin" /> : <ArrowRight size={18} />}
                {isSubmitting ? "Sending OTP..." : "Request Reset OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="uc-login-form">
              <label className="uc-field">
                <span>Verification OTP</span>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  placeholder="6-digit code"
                  disabled={isSubmitting}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="uc-login-submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="uc-spin" />}
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="uc-login-form">
              <label className="uc-field">
                <span>New Password</span>
                <input
                  type="password"
                  value={password}
                  placeholder="New password"
                  disabled={isSubmitting}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <label className="uc-field">
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  disabled={isSubmitting}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="uc-login-submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="uc-spin" />}
                {isSubmitting ? "Updating..." : "Save Password"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 my-8 text-center">
              <CheckCircle2 size={64} className="text-emerald-500 animate-bounce" />
              <p className="text-muted-foreground font-medium">
                Redirecting you to the login screen in a few seconds...
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
