import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserCheck } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { attendanceApiClient } from "@/services/apiClient.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
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
    try {
      await attendanceApiClient.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast.success("Account created! Please log in.");
      navigate("/attendance/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
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
          <h1>AttendEase Sign Up</h1>
          <p>Join AttendEase to manage your class attendance.</p>

          <form onSubmit={handleSubmit} noValidate className="uc-login-form">
            <label className="uc-field">
              <span>Full Name</span>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}

            <label className="uc-field">
              <span>Email Address</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}

            <label className="uc-field">
              <span>Role</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </label>

            <label className="uc-field">
              <span>Password</span>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <span 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground" 
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </label>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}

            <label className="uc-field">
              <span>Confirm Password</span>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <span 
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground" 
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </label>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}

            <button type="submit" className="uc-login-submit mt-1" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="uc-login-switch">
            Already have an account? <Link to="/attendance/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
