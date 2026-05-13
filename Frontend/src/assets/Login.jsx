import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Tutorials/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem("user"));
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "teacher" ? "/dashboard" : "/student-dashboard");
    } else {
      toast.error(result.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <MdOutlineSchool color="#fff" size={22} />
          </div>
          <div>
            <div className="auth-logo-text">AttendEase</div>
          </div>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subtext">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <FiMail className="input-icon-right" style={{ pointerEvents: "none" }} />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? <><span className="spinner" /> Signing in...</> : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;