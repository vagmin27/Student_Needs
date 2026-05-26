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
          <h1>Student Sign In</h1>
          <p>Sign in to find the perfect tutor and manage your sessions.</p>

          <form onSubmit={handleLogin} className="uc-login-form">
            <label className="uc-field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </label>
            <small style={{ color: "var(--text-secondary)", opacity: 0.8, display: "block" }}>
              We will never share your email.
            </small>

            <label className="uc-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="uc-login-submit">
              SUBMIT
            </button>
          </form>

          <p className="uc-login-switch">
            No Account? <Link to="/tutorials/register">Sign Up!</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
