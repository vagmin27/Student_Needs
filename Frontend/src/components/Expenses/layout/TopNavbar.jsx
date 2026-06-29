import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiOutlineMenuAlt2, HiOutlineSearch } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';
import LoadingBar from 'react-top-loading-bar';
import { NotificationCenter } from '../../ui/NotificationCenter.jsx';
import { ThemeToggle } from '@/components/ThemeToggle.jsx';
import { useAuth } from '@/contexts/GlobalAuthContext.jsx';

import { useSidebar } from "@/contexts/SidebarContext";

const TopNavbar = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { user, logout } = useAuth();
  const { toggleSidebar, toggleMobileMenu } = useSidebar();

  const logoutHandle = () => {
    logout();
  };

  const handleHamburgerClick = () => {
    if (window.innerWidth < 1024) {
      toggleMobileMenu();
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-6 bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <LoadingBar color='var(--primary)' ref={ref} height={3} />
      
      <div className="flex items-center gap-4 min-w-0">
        <button 
          onClick={handleHamburgerClick}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-animation rounded-[var(--radius-sm)] shrink-0 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <HiOutlineMenuAlt2 size={22} className="text-foreground" />
        </button>

        <Link
          to="/student/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm font-medium shrink-0"
          aria-label="Back to Dashboard"
        >
          <MdArrowBack size={20} />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </Link>
        
        <div className="hidden md:flex items-center bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] px-4 py-2 hover:border-[var(--primary)]/50 transition-colors min-w-0 h-10 w-[320px]">
          <HiOutlineSearch size={20} className="text-muted-foreground mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none outline-none text-foreground placeholder-muted-foreground/60 w-full text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <ThemeToggle className="border-border/60" />

        {/* Global Notification Center */}
        <div className="relative notification-container flex items-center justify-center">
          <NotificationCenter />
        </div>

        <div className="h-8 w-px bg-border/20 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-foreground">{user?.username || user?.name || "User"}</p>
            <Link to="/student/settings?tab=expenses" className="text-[10px] font-semibold text-[var(--primary)] hover:underline hover:text-indigo-300 transition-colors">Profile & Settings</Link>
          </div>
          
          <Link to="/student/settings?tab=expenses" className="w-10 h-10 rounded-[var(--radius-sm)] bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg shadow-[var(--shadow-lg)] shadow-[var(--primary)]/20 hover:scale-105 transition-transform duration-200 cursor-pointer border border-[var(--border-color)] shrink-0">
            {(user?.username?.charAt(0) || user?.name?.charAt(0) || user?.fullName?.charAt(0) || 'U').toUpperCase()}
          </Link>

          <button 
            onClick={logoutHandle}
            className="ml-1 p-2 text-muted-foreground hover:text-[var(--danger)] transition-colors focus-animation rounded-[var(--radius-sm)] group hidden sm:block"
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