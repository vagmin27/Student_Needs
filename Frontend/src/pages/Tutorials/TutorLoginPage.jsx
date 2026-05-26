import React, { useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

function TutorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/tutor/login", { email, password });

      if (res.data.status === "ok") {
        alert("Login successful ✅");

        const normalizedUser = {
          ...res.data.tutor,
          role: "tutor",
          accountType: "tutor",
        };

        const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ id: normalizedUser._id || normalizedUser.id, role: "tutor" }));
        const dummyToken = `${header}.${payload}.dummy_signature`;
        
        localStorage.setItem("token", dummyToken);
        localStorage.setItem("auth_token", dummyToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("User", JSON.stringify(normalizedUser));
        localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
        localStorage.setItem("auth_data", JSON.stringify({ token: dummyToken, user: normalizedUser }));

        auth.setUser(normalizedUser);

        setTimeout(() => {
          navigate("/tutorials/tutor/dashboard");
        }, 100);
      } else {
        handleError(res.data.message);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);

      const message = err.response?.data?.message || "Login failed ❌";

      handleError(message);
    }
  };

  // 🔥 CENTRALIZED ERROR HANDLER
  const handleError = (message) => {
    if (!message) return alert("Login failed ❌");

    if (message.toLowerCase().includes("not")) {
      alert("Tutor not found. Redirecting to Sign Up 🚀");
      navigate("/signup/tutor");
    } else {
      alert(message);
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
            <BookOpen />
          </div>
          <h1>Tutor Sign In</h1>
          <p>Login to start teaching and manage your student bookings.</p>

          <form onSubmit={handleSubmit} className="uc-login-form">
            <label className="uc-field">
              <span>Email address</span>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="uc-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="uc-login-submit">
              LOGIN
            </button>
          </form>

          <p className="uc-login-switch">
            Don't have an account? <Link to="/signup/tutor">Sign Up</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default TutorLoginPage;
