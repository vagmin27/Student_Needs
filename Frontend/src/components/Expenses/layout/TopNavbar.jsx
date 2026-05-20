import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineMenuAlt2, HiOutlineSearch } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';
import { NotificationCenter } from '../../ui/NotificationCenter.jsx';

const TopNavbar = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const ref = useRef(null);

  const user = JSON.parse(localStorage.getItem('User')) || { username: 'User' };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-brand-900/80 backdrop-blur-md border-b border-white/5">
      <LoadingBar color='#6366F1' ref={ref} height={3} />
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors md:hidden focus-animation rounded-lg"
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-brand-800/80 border border-white/10 rounded-xl px-4 py-2 hover:border-brand-primary/50 transition-colors">
          <HiOutlineSearch size={20} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Global Notification Center */}
        <div className="relative notification-container flex items-center justify-center">
          <NotificationCenter />
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-white">{user.username}</p>
            <Link to="/settings" className="text-xs text-brand-primary hover:underline hover:text-indigo-300 transition-colors">Profile & Settings</Link>
          </div>
          
          <Link to="/settings" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform duration-200 cursor-pointer border border-white/10">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </Link>

          <button 
            onClick={logoutHandle}
            className="ml-1 p-2 text-slate-400 hover:text-brand-danger transition-colors focus-animation rounded-lg group hidden sm:block"
            title="Log out"
          >
            <FiLogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;