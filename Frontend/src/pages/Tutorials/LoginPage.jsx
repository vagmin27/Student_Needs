import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API from "@/services/api/tutorialsApi.js";
import { GraduationCap } from "lucide-react";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", user);

      if (res.data.status === "ok") {
        alert("Login successful ✅");

        if (auth.fetchUser) {
          await auth.fetchUser();
        }

        setTimeout(() => {
          navigate("/tutorials/home");
        }, 100);
      } else {
        alert(res.data.message || "Login failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed ❌");
    }
  };

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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Student Sign In</h1>
          <p className="text-sm text-[var(--text-muted)]">Sign in to find the perfect tutor and manage your sessions.</p>

          <form onSubmit={handleLogin} className="w-full space-y-4 text-left pt-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Email address</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm placeholder:text-[var(--text-muted)]"
                required
              />
            </label>
            <small className="text-xs text-[var(--text-muted)] opacity-80 block -mt-2">
              We will never share your email.
            </small>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm placeholder:text-[var(--text-muted)]"
                required
              />
            </label>

            <button 
              type="submit" 
              className="w-full py-3 px-4 font-bold text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-md)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px] mt-2"
            >
              Submit
            </button>
          </form>

          <p className="text-xs text-[var(--text-secondary)] pt-2">
            No Account? <Link to="/tutorials/register" className="text-[var(--primary)] hover:underline font-semibold">Sign Up!</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
