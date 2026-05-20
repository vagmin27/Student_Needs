import React from "react";
import "../../styles/Tutorials/Landing.css";
import Navbar from "../../components/Tutorials/Navbar";
import Footer from "../../components/Tutorials/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useEffect } from "react";

function Landing() {
  const { isAuthenticated, isStudent, isTutor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (isTutor) navigate("/tutorials/tutor/dashboard", { replace: true });
      else if (isStudent) navigate("/tutorials/book", { replace: true });
    }
  }, [isAuthenticated, isStudent, isTutor, navigate]);

  return (
    <div className="landingPage">
      <Navbar />

      {/* HERO SECTION */}
      <main className="mainContainer" role="main">
        <section className="banner">
          <div className="subContainer">
            <h1>
              Tutor Match helps you get the help you need
            </h1>

            <p>
              Learn smarter, faster, and more efficiently with expert tutors
            </p>

            <NavLink to="/tutorials/book" className="ctaLink">
              <button className="bookBtn">
                🚀 Book Class Now
              </button>
            </NavLink>
          </div>
        </section>

        {/* OPTIONAL FEATURES SECTION */}
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
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
