import React from "react";
import "../../styles/Tutorials/Landing.css";
import Navbar from "../../components/Tutorials/Navbar";
import Footer from "../../components/Tutorials/Footer";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";

function Landing() {
  const { isAuthenticated, isStudent, isTutor } = useAuth();

  return (
    <div className="landingPage">
      <Navbar />

      <main className="mainContainer" role="main">
        <section className="banner">
          <div className="subContainer">
            <h1>Tutor Match helps you get the help you need</h1>
            <p>Learn smarter, faster, and more efficiently with expert tutors</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
              {isAuthenticated && isStudent && (
                <NavLink to={TUTORIAL_PATHS.moduleHome} className="ctaLink">
                  <button type="button" className="bookBtn">
                    Enter Tutorials Module
                  </button>
                </NavLink>
              )}
              {isAuthenticated && isTutor && (
                <NavLink to={TUTORIAL_PATHS.tutorHome} className="ctaLink">
                  <button type="button" className="bookBtn">
                    Tutor Dashboard
                  </button>
                </NavLink>
              )}
              {!isAuthenticated && (
                <>
                  <NavLink to={TUTORIAL_PATHS.studentLogin} className="ctaLink">
                    <button type="button" className="bookBtn">
                      Student Login
                    </button>
                  </NavLink>
                  <NavLink to={TUTORIAL_PATHS.tutorLogin} className="ctaLink">
                    <button type="button" className="bookBtn" style={{ background: "#475569" }}>
                      Tutor Login
                    </button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="featuresSection">
          <h2>Why Choose Tutor Match?</h2>
          <div className="featureGrid">
            <div className="featureCard">
              <h3>📚 Expert Tutors</h3>
              <p>Learn from highly qualified and experienced tutors</p>
            </div>
            <div className="featureCard">
              <h3>⏱ Flexible Scheduling</h3>
              <p>Book sessions anytime that fits your schedule</p>
            </div>
            <div className="featureCard">
              <h3>💻 Online Learning</h3>
              <p>Attend classes from anywhere in the world</p>
            </div>
          </div>
          {isAuthenticated && isStudent && (
            <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Link to={TUTORIAL_PATHS.moduleHome} style={{ color: "var(--primary)", fontWeight: 600 }}>
                Go to Tutorials home →
              </Link>
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
