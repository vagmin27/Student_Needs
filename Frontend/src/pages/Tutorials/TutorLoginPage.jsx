import React, { useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";

import "../../styles/Tutorials/TutorLogin.css";
import { useNavigate } from "react-router-dom";
import blackboard from "../../assets/images/blackboard.png";

function TutorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/tutor/login", { email, password });

      // ✅ SUCCESS LOGIN
      if (res.data.status === "ok") {
        alert("Login successful ✅");

        const tutorUser = {
          ...res.data.tutor,
          role: "tutor",
        };
        auth.setUser(tutorUser);

        const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ id: tutorUser._id || tutorUser.id, role: "tutor" }));
        const dummyToken = `${header}.${payload}.dummy_signature`;
        localStorage.setItem("token", dummyToken);

        navigate("/tutorials/tutor/dashboard", { replace: true });
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
    <div className="tutor-page">
      {/* 🔝 Navbar */}
      <div className="tutor-navbar">
        <h2>💡 Tutor Match</h2>
        <button onClick={() => navigate("/role-selection")}>Back</button>
      </div>

      {/* 🔥 Layout */}
      <div className="tutor-container">
        {/* LEFT */}
        <div className="tutor-left">
          <h2>Login to Start Teaching!</h2>
          <img src={blackboard} alt="illustration" />
        </div>

        {/* RIGHT */}
        <div className="tutor-right">
          <h1>Tutor Sign In</h1>

          <form onSubmit={handleSubmit} className="tutor-form">
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">LOGIN</button>

            {/* 🔥 SIGNUP LINK */}
            <p style={{ marginTop: "10px" }}>
              Don’t have an account?{" "}
              <span
                style={{
                  color: "#ff7a2f",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/signup/tutor")}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TutorLoginPage;
