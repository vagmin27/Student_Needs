import React from "react";
import Navbar from "../../components/Tutorials/Navbar";
import Footer from "../../components/Tutorials/Footer";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";

function Landing() {
  const { isAuthenticated, isStudent, isTutor } = useAuth();

  return (
    <div className="w-full min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col" role="main">
        <section 
          className="flex-grow min-h-[60vh] flex items-center justify-center text-center px-4 py-20 bg-cover bg-center bg-no-repeat pt-[90px]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url("https://i.postimg.cc/TYG3jB4P/linkedin-sales-solutions-6ie6-Ojshv-Wg-unsplash-min.jpg")`
          }}
        >
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Tutor Match helps you get the help you need
            </h1>
            <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto">
              Learn smarter, faster, and more efficiently with expert tutors
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              {isAuthenticated && isStudent && (
                <NavLink to={TUTORIAL_PATHS.moduleHome} className="w-full sm:w-auto">
                  <button 
                    type="button" 
                    className="w-full sm:w-auto px-6 py-3 font-semibold text-sm rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
                  >
                    Enter Tutorials Module
                  </button>
                </NavLink>
              )}
              {isAuthenticated && isTutor && (
                <NavLink to={TUTORIAL_PATHS.tutorHome} className="w-full sm:w-auto">
                  <button 
                    type="button" 
                    className="w-full sm:w-auto px-6 py-3 font-semibold text-sm rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
                  >
                    Tutor Dashboard
                  </button>
                </NavLink>
              )}
              {!isAuthenticated && (
                <>
                  <NavLink to={TUTORIAL_PATHS.studentLogin} className="w-full sm:w-auto">
                    <button 
                      type="button" 
                      className="w-full sm:w-auto px-6 py-3 font-semibold text-sm rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:-translate-y-[2px] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
                    >
                      Student Login
                    </button>
                  </NavLink>
                  <NavLink to={TUTORIAL_PATHS.tutorLogin} className="w-full sm:w-auto">
                    <button 
                      type="button" 
                      className="w-full sm:w-auto px-6 py-3 font-semibold text-sm rounded-[var(--radius-md)] bg-neutral-700 hover:bg-neutral-800 text-white hover:-translate-y-[2px] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
                    >
                      Tutor Login
                    </button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-[var(--bg-secondary)]/50 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-10">Why Choose Tutor Match?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:-translate-y-[4px] hover:scale-[1.01] hover:shadow-[var(--shadow-md)] transition-all duration-300 text-left sm:text-center">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">📚 Expert Tutors</h3>
              <p className="text-sm text-[var(--text-secondary)]">Learn from highly qualified and experienced tutors</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:-translate-y-[4px] hover:scale-[1.01] hover:shadow-[var(--shadow-md)] transition-all duration-300 text-left sm:text-center">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">⏱ Flexible Scheduling</h3>
              <p className="text-sm text-[var(--text-secondary)]">Book sessions anytime that fits your schedule</p>
            </div>
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:-translate-y-[4px] hover:scale-[1.01] hover:shadow-[var(--shadow-md)] transition-all duration-300 text-left sm:text-center">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">💻 Online Learning</h3>
              <p className="text-sm text-[var(--text-secondary)]">Attend classes from anywhere in the world</p>
            </div>
          </div>
          {isAuthenticated && isStudent && (
            <p className="text-center mt-8">
              <Link to={TUTORIAL_PATHS.moduleHome} className="text-[var(--primary)] hover:underline font-semibold text-sm inline-flex items-center gap-1">
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
