import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Tutorials/auth";
import API from "../../utils/Tutorials/api";

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

        // fetch user after login
        if (auth.fetchUser) {
          await auth.fetchUser();
        }

        navigate("/tutorials/profile", { replace: true });
      } else {
        alert(res.data.message || "Login failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed ❌");
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>💡 Tutor Match</h2>
        <button style={styles.navBtn}>Login</button>
      </div>

      {/* Main Layout */}
      <div style={styles.container}>

        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h2>Sign In to Find the Perfect Tutor!</h2>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="illustration"
            style={styles.image}
          />
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <h1>Sign In</h1>

          <form onSubmit={handleLogin} style={styles.form}>
            
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={user.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <small style={{ color: "#777" }}>
              We will never share your email.
            </small>

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.submit}>
              SUBMIT
            </button>

            <p style={{ marginTop: "10px" }}>
              No Account?{" "}
              <span
                style={styles.link}
                onClick={() => navigate("/tutorials/register")}
              >
                Sign Up!
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

/* 🎨 STYLES */
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f5f6f8",
    minHeight: "100vh",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "#8fa79a",
    color: "#fff",
  },

  logo: {
    margin: 0,
  },

  navBtn: {
    padding: "8px 16px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  },

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "50px",
    padding: "50px",
    flexWrap: "wrap",
  },

  left: {
    flex: 1,
    minWidth: "300px",
    textAlign: "center",
  },

  image: {
    width: "260px",
    marginTop: "20px",
  },

  right: {
    flex: 1,
    maxWidth: "400px",
    background: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },

  submit: {
    marginTop: "15px",
    padding: "12px",
    background: "#ff7a2f",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
  },

  link: {
    color: "#ff7a2f",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
