import React, { useEffect, useState } from "react";
import "../../styles/Tutorials/Navbar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Tutorials/auth";
import bulb2 from "../assets/images/bulb2.png";

function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [navColor, setNavColor] = useState(false);

  const isTutorRoute = location.pathname.startsWith("/tutor");

  const changeNavBackground = () => {
    window.scrollY >= 66 ? setNavColor(true) : setNavColor(false);
  };

  useEffect(() => {
    changeNavBackground();
    window.addEventListener("scroll", changeNavBackground);

    return () => window.removeEventListener("scroll", changeNavBackground);
  }, []);

  const handleLogout = () => {
    auth.logout();
    localStorage.clear();
    navigate("/");
  };

  const navClass = navColor
    ? "navbarActive"
    : location.pathname === "/"
      ? "navHome"
      : "navAll";

  return (
    <nav id="mainNavbar" className={navClass}>
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
        <NavLink className="nav-link" to="/tutor/dashboard">
          Dashboard
        </NavLink>
      </li>

      <li>
        <NavLink className="nav-link" to="/tutor/editProfile">
          Profile
        </NavLink>
      </li>

      <li>
        <NavLink className="nav-link" to="/tutor/schedule">
          Schedule
        </NavLink>
      </li>

      <li>
        <NavLink className="nav-link" to="/tutor/accept">
          Requests
        </NavLink>
      </li>
    </>
  ) : (
    <>
      {/* STUDENT / PUBLIC */}
      <li>
        <NavLink className="nav-link" to="/book">
          Book Class
        </NavLink>
      </li>

      {auth.user?.role === "student" && (
        <li>
          <NavLink className="nav-link" to="/profile">
            My Profile
          </NavLink>
        </li>
      )}
    </>
  )}
</ul>

        {/* RIGHT BUTTON */}
        <div className="rightSection">
          {auth.user || isTutorRoute ? (
            <button className="loginBtn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="loginBtn"
              onClick={() => navigate("/login")}
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