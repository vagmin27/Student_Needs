import React, { useEffect, useState, useRef } from "react";
import { axiosClient } from "../../utils/Expenses/axiosClient";
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
      const response = await axiosClient.post("/auth/signup", {
        username,
        email,
        password,
      });
      console.log(response);
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
      console.log(error.message);
      toast.error("Internal server error or email already exists");
      if (ref.current) ref.current.complete();
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]"></div>

      <LoadingBar color="#10B981" ref={ref} height={3} />

      <div className="glass-panel p-8 md:p-12 w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-mont tracking-wider text-white mb-2">
            <span className="text-brand-primary">Join</span> Us
          </h1>
          <p className="text-slate-400">Create an account to start tracking.</p>
        </div>

        <form onSubmit={submitForm} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Username
            </label>
            <input
              type="text"
              placeholder="johndoe"
              onChange={(e) => setUsername(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Monthly Budget (₹)
            </label>
            <input
              type="number"
              placeholder="Enter your monthly spending limit"
              onChange={(e) => setBudget(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-brand-accent to-emerald-600 text-white font-bold tracking-wide shadow-lg shadow-brand-accent/30 hover:shadow-brand-accent/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-accent hover:text-white font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
