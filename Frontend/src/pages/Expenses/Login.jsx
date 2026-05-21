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
    <div className='min-h-screen bg-brand-900 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>

      <LoadingBar color='#6366F1' ref={ref} height={3} />
      
      <div className="glass-panel p-8 md:p-12 w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-mont tracking-wider text-white mb-2">
            <span className="text-brand-primary">Fin</span>Track
          </h1>
          <p className="text-slate-400">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={submitForm} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <input 
              type="email"
              placeholder="you@example.com" 
              onChange={(e) => setEmail(e.target.value)} 
              className="premium-input" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input 
              type="password"
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)} 
              className="premium-input" 
              required
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs text-brand-primary cursor-pointer hover:underline">Forgot password?</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 text-white font-bold tracking-wide shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account? <Link to='/signup' className="text-brand-primary hover:text-white font-semibold transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
