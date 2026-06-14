import React, { useEffect, useState, useContext } from "react";
import "../../styles/Tutorials/Navbar.css";
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

  const navClass = navColor
    ? "navbarActive"
    : location.pathname === "/"
      ? "navHome"
      : "navAll";

  return (
    <nav id="mainNavbar" className={`${navClass} gemini-navbar`}>
      <div className="navContainer">

        {/* LOGO */}
        <div className="logoWrapper">
          <img src={bulb2} className="logo" alt="logo" />

          <NavLink className="navbrand-link" to="/">
            Tutor Match
          </NavLink>
        </div>

        {/* LINKS */}
        <ul className="navbar-nav">

  <li>
    <NavLink className="nav-link" to="/">
      Home
    </NavLink>
  </li>

  {/* TUTOR ROUTES */}
  {isTutorRoute ? (
    <>
      <li>
          <NavLink className="nav-link" to="/tutorials/tutor/dashboard">
          Dashboard
        </NavLink>
      </li>

      <li>
          <NavLink className="nav-link" to="/tutorials/tutor/editProfile">
          Profile
        </NavLink>
      </li>

      <li>
          <NavLink className="nav-link" to="/tutorials/tutor/schedule">
          Schedule
        </NavLink>
      </li>

      <li>
          <NavLink className="nav-link" to="/tutorials/tutor/accept">
          Requests
        </NavLink>
      </li>
    </>
  ) : (
    <>
      {/* STUDENT / PUBLIC */}
      <li>
        <NavLink className="nav-link" to={TUTORIAL_PATHS.moduleHome}>
          Tutorials
        </NavLink>
      </li>
      <li>
        <NavLink className="nav-link" to={TUTORIAL_PATHS.studentSearch}>
          Find a Tutor
        </NavLink>
      </li>

      {(user?.role === "student" || user?.accountType === "student") && (
        <li>
          <NavLink className="nav-link" to="/tutorials/profile">
            My Profile
          </NavLink>
        </li>
      )}
    </>
  )}
</ul>

        {/* RIGHT BUTTON */}
        <div className="rightSection">
          <ThemeToggle size="sm" className="mr-2 shrink-0" />
          {user || isTutorRoute ? (
            <button className="loginBtn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="loginBtn"
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
