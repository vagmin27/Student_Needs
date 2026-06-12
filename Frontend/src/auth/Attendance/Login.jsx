import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
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
      navigate(user.role === "teacher" ? "/attendance/dashboard" : "/student/dashboard");
    } else {
      toast.error(result.message || "Invalid credentials");
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
            <MdOutlineSchool size={28} />
          </div>
          <h1>AttendEase Sign In</h1>
          <p>Sign in to your teacher or student attendance account.</p>

          <form onSubmit={handleSubmit} noValidate className="uc-login-form">
            <label className="uc-field">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}

            <label className="uc-field">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <span 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </label>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}

            <button
              type="submit"
              className="uc-login-submit mt-2"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="uc-login-switch">
            Don't have an account? <Link to="/attendance/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
