import React, { useEffect, useState, useRef } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

function Signup() {
  document.title = "Create Account | FinTrack";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("User")) {
      navigate("/expenses-tracker");
    }
  }, [navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      ref.current.staticStart();
      const response = await expensesApi.signup({
        username,
        email,
        password,
      });
      toast.success("Registered Successfully!!");
      // SAVE USER BUDGET
      const userKey = username; // temporary identifier before login

      localStorage.setItem(
        `user_settings_${userKey}`,
        JSON.stringify({
          monthlyBudget: Number(budget),
          currency: "INR",
        }),
      );

      ref.current.complete();
      navigate("/expenses-tracker/login");
    } catch (error) {
      toast.error("Internal server error or email already exists");
      if (ref.current) ref.current.complete();
    }
  };

  return (
    <div className="uc-login-page">
      <div className="uc-login-card">
        <Link to="/role-selection" className="uc-back-link">
          <span>{"<- "}</span>
          Back to role selection
        </Link>
        
        <LoadingBar color="#10B981" ref={ref} height={3} />

        <section className="uc-login-panel">
          <div className="uc-login-icon">
            <span className="font-bold text-xl leading-none">F</span>
          </div>
          <h1>FinTrack Sign Up</h1>
          <p>Create an account to start tracking your student budget.</p>

          <form onSubmit={submitForm} className="uc-login-form">
            <label className="uc-field">
              <span>Username</span>
              <input
                type="text"
                placeholder="johndoe"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label className="uc-field">
              <span>Email Address</span>
              <input
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="uc-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label className="uc-field">
              <span>Monthly Budget (₹)</span>
              <input
                type="number"
                placeholder="Enter your monthly spending limit"
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="uc-login-submit">
              Create Account
            </button>
          </form>

          <p className="uc-login-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Signup;
