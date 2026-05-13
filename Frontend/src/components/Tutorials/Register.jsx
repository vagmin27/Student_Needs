import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Tutorials/LoginRegister.css";

/**
 * Amanda Au-Yeung
 * registers user with the email and pw to passport, session
 * @returns jsx of registration form
 */
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
    const res = await fetch("/api/register/request-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep("otp");
      setMessage(data.message);
    } else {
      setError({ ...error, email: data.message });
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        otp: otp,
      }),
    });
    const data = await res.json();
    if (res.ok) {
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
    const res = await fetch("/api/register/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
    });
    const data = await res.json();
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
      <main className="card" id="signupCard">
        <div className="signUp-title">
          <h1 className="card-title" id="signUp">
            Registration Successful
          </h1>
        </div>
        <div className="log-reg-body">
          <p>{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="card" id="signupCard">
      <div className="alternate-text">
        <Link id="sign-in" to="/login">
          <div>Already have an account?</div>
          <div>Sign In</div>
        </Link>
      </div>
      <div className="signUp-title">
        <h1 className="card-title" id="signUp">
          Sign Up
        </h1>
      </div>
      <div className="log-reg-body">
        {step === "form" && (
          <form className="form-body" onSubmit={requestOtp}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter Email"
                value={user.email}
                onChange={onInputChange}
                name="email"
                required
              />
              <div id="emailHelp" className="form-text">
                We will never share your email with anyone else.
              </div>
              {error.email && <span className="err">{error.email}</span>}
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword5">Password</label>
              <input
                type="password"
                id="inputPassword5"
                className="form-control"
                placeholder="Enter your password"
                name="password"
                value={user.password}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <div htmlFor="inputPassword5">Confirm Password</div>
              <input
                type="password"
                id="inputConfirmedPassword5"
                className="form-control"
                placeholder="Confirm your password"
                name="confirmedPassword"
                value={user.confirmedPassword}
                onChange={onInputChange}
                onBlur={validateInput}
                required
              />
              {error.confirmedPassword && (
                <span className="err">{error.confirmedPassword}</span>
              )}
            </div>
            <button type="submit" className="btn">
              Send OTP
            </button>
          </form>
        )}
        {step === "otp" && (
          <form className="form-body" onSubmit={verifyOtp}>
            <div className="mb-3">
              <label htmlFor="otpInput" className="form-label">
                Enter 6-digit OTP sent to {user.email}
              </label>
              <input
                type="text"
                className="form-control"
                id="otpInput"
                placeholder="Enter OTP"
                value={otp}
                onChange={onOtpChange}
                maxLength="6"
                required
              />
              {error.otp && <span className="err">{error.otp}</span>}
            </div>
            <button type="submit" className="btn">
              Verify and Register
            </button>
            <button type="button" className="btn" onClick={resendOtp}>
              Resend OTP
            </button>
            {message && <p>{message}</p>}
          </form>
        )}
      </div>
    </main>
  );
}

Register.protTypes = {};

export default Register;