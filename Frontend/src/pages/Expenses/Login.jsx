import React, { useEffect, useState, useRef } from 'react';
import { expensesApi } from "../../services/api/expensesApi";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';

function Login() {
  document.title = 'Login | FinTrack';
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const ref = useRef(null);
  
  useEffect (() => {
    if(localStorage.getItem("User")) {
      navigate("/expenses-tracker");
    }
  }, [navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      ref.current.staticStart();
      const response = await expensesApi.login({
        email,
        password
      });
      
      if(response.data.statusCode !== 200) {
        toast.error(response.data.message);
        ref.current.complete();
        return;
      }
      
      toast.success("Successfully Logged In !!");
      const userData = response.data.message;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('User', JSON.stringify(userData)); // Legacy fallback
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      localStorage.setItem('auth_token', userData.token);
      localStorage.setItem('auth_data', JSON.stringify({ token: userData.token, user: userData }));
      
      // Update global context if available
      window.dispatchEvent(new Event('storage'));
      
      ref.current.complete();
      navigate('/expenses-tracker');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Internal server error";
      toast.error(errorMessage);
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
        
        <LoadingBar color='#6366F1' ref={ref} height={3} />

        <section className="uc-login-panel">
          <div className="uc-login-icon">
            <span className="font-bold text-xl leading-none">F</span>
          </div>
          <h1>FinTrack Sign In</h1>
          <p>Welcome back! Please login to your expenses account.</p>

          <form onSubmit={submitForm} className="uc-login-form">
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

            <button type="submit" className="uc-login-submit">
              Sign In
            </button>
          </form>

          <p className="uc-login-switch">
            Don't have an account? <Link to='/signup'>Sign up</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
