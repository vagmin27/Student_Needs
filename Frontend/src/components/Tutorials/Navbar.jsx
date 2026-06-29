import React, { useEffect, useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import bulb2 from "../../assets/images/bulb2.png";
import { LayoutContext } from "../layouts/DashboardLayout";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";

function Navbar() {
  const isNested = useContext(LayoutContext);
  const { user, logout, isAuthenticated, isInitialized, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isNested) {
    return null;
  }

  const [navColor, setNavColor] = useState(false);

  const isTutorRoute = location.pathname.startsWith("/tutorials/tutor");

  const changeNavBackground = () => {
    window.scrollY >= 66 ? setNavColor(true) : setNavColor(false);
  };

  useEffect(() => {
    changeNavBackground();
    window.addEventListener("scroll", changeNavBackground);

    return () => window.removeEventListener("scroll", changeNavBackground);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navBgClass = navColor
    ? "bg-[var(--navbar-bg)] backdrop-blur-md border-b border-[var(--border-color)]/30"
    : location.pathname === "/"
      ? "bg-transparent"
      : "bg-[var(--navbar-bg)] border-b border-[var(--border-color)]/30";

  return (
    <nav className={`w-full py-3.5 px-6 md:px-8 fixed top-0 left-0 z-50 transition-all duration-300 ${navBgClass} gemini-navbar`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={bulb2} className="w-10 h-10 object-contain" alt="logo" />

          <NavLink className="text-xl md:text-2xl font-extrabold text-[var(--text-navbar)] hover:opacity-90 transition-opacity" to="/">
            Tutor Match
          </NavLink>
        </div>

        {/* LINKS */}
        <ul className="flex flex-wrap items-center justify-center gap-6 list-none font-medium">

          <li>
            <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to="/">
              Home
            </NavLink>
          </li>

          {/* TUTOR ROUTES */}
          {isTutorRoute ? (
            <>
              <li>
                <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to="/tutorials/tutor/dashboard">
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to="/tutorials/tutor/editProfile">
                  Profile
                </NavLink>
              </li>

              <li>
                <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to="/tutorials/tutor/schedule">
                  Schedule
                </NavLink>
              </li>

              <li>
                <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to="/tutorials/tutor/accept">
                  Requests
                </NavLink>
              </li>
            </>
          ) : (
            <>
              {/* STUDENT / PUBLIC */}
              <li>
                <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to={TUTORIAL_PATHS.moduleHome}>
                  Tutorials
                </NavLink>
              </li>
              <li>
                <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to={TUTORIAL_PATHS.studentSearch}>
                  Find a Tutor
                </NavLink>
              </li>

              {(user?.role === "student" || user?.accountType === "student") && (
                <li>
                  <NavLink className="text-sm text-[var(--text-navbar)] hover:text-[var(--primary)] transition-colors py-1" to="/tutorials/profile">
                    My Profile
                  </NavLink>
                </li>
              )}
            </>
          )}
        </ul>

        {/* RIGHT BUTTON */}
        <div className="flex items-center justify-center md:justify-end gap-3 shrink-0">
          <ThemeToggle size="sm" className="mr-2 shrink-0" />
          {user || isTutorRoute ? (
            <button className="px-4 py-1.5 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--text-navbar)] hover:bg-[var(--text-navbar)] hover:text-[var(--bg-primary)] transition-all bg-transparent cursor-pointer text-[var(--text-navbar)]" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="px-4 py-1.5 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--text-navbar)] hover:bg-[var(--text-navbar)] hover:text-[var(--bg-primary)] transition-all bg-transparent cursor-pointer text-[var(--text-navbar)]"
              onClick={() => navigate("/tutorials/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
