import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  ClipboardList, 
  GraduationCap, 
  DollarSign, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  LayoutDashboard,
  Users
} from "lucide-react";
import { useCountUp } from "@/pages/UnifiedFlow.jsx";
import { motion } from "framer-motion";

export default function Home() {
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    document.title = "UniConnect - All-in-One Student Operating System";
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
        }
      },
      { threshold: 0.15 }
    );
    const currentStatsRef = statsRef.current;
    if (currentStatsRef) observer.observe(currentStatsRef);

    return () => {
      if (currentStatsRef) observer.unobserve(currentStatsRef);
    };
  }, []);

  const studentsCount = useCountUp(10000, statsActive);
  const tutorsCount = useCountUp(500, statsActive);
  const sessionsCount = useCountUp(25000, statsActive);
  const referralsCount = useCountUp(1000, statsActive);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 🚀 HERO SECTION */}
      <section className="uc-modern-section uc-modern-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="uc-hero-copy text-left space-y-6"
        >
          <span className="uc-badge-text px-3.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> TRUSTED BY 10,000+ STUDENTS
          </span>
          <h1 className="uc-hero-title text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
            The Operating System for Modern <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Student Success</span>
          </h1>
          <p className="uc-body-text uc-hero-desc-audit leading-relaxed text-[var(--text-secondary)] text-lg">
            Manage academics, tutoring, attendance, finances, and career opportunities from one unified platform.
          </p>
          <div className="uc-actions flex flex-wrap gap-4 select-none pt-2">
            <Link className="uc-btn-primary px-8 py-4 rounded-[var(--radius-md)] text-sm font-bold flex items-center gap-1.5 shadow-[var(--shadow-lg)] shadow-primary/20 hover:scale-105 transition-all duration-300" to="/role-selection">
              Get Started &rarr;
            </Link>
            <Link className="uc-btn-secondary px-8 py-4 rounded-[var(--radius-md)] text-sm font-bold transition-all duration-300 flex items-center gap-2" to="/features">
              <svg className="w-4.5 h-4.5 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              Watch Demo
            </Link>
          </div>
        </motion.div>

        {/* CSS-Only Interactive Live Dashboard Preview Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="uc-hero-visual relative w-full flex items-center justify-center p-2"
          aria-hidden="true"
        >
          {/* Central Live Environment Container */}
          <div className="w-full max-w-[500px] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[24px] p-6 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-md">
            
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">Live Dashboard</span>
            </div>
            
            {/* Student Profile & Attendance Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Profile Widget */}
              <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-lg)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-black shrink-0">
                  AR
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">Alex Rivera</h4>
                  <p className="text-[9.5px] text-[var(--text-secondary)] truncate font-medium">CS Junior • GPA 3.82</p>
                </div>
              </div>

              {/* Attendance Indicator */}
              <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-lg)] flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-[9.5px] uppercase font-bold text-[var(--text-secondary)]">Attendance</h4>
                  <p className="text-base font-black text-emerald-500">94.2% Rate</p>
                </div>
                <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="14" stroke="currentColor" className="text-[var(--border-color)]" strokeWidth="2.5" fill="transparent" />
                    <circle cx="18" cy="18" r="14" stroke="currentColor" className="text-emerald-500" strokeWidth="2.5" strokeDasharray={88} strokeDashoffset={5} fill="transparent" />
                  </svg>
                  <span className="absolute text-[8px] font-bold text-emerald-500">94%</span>
                </div>
              </div>
            </div>

            {/* Expense Budget Indicator */}
            <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-lg)] space-y-2">
              <div className="flex justify-between items-center text-left">
                <div>
                  <h4 className="text-[9.5px] uppercase font-bold text-[var(--text-secondary)]">Monthly Budget</h4>
                  <p className="text-xs font-bold text-[var(--text-primary)]">$428.50 / $600.00</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">Within Limit</span>
              </div>
              <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-500" style={{ width: "45%" }} />
                <div className="h-full bg-purple-500" style={{ width: "22%" }} />
                <div className="h-full bg-cyan-400" style={{ width: "8%" }} />
              </div>
              <div className="flex justify-between text-[9px] text-[var(--text-secondary)] pt-0.5">
                <span>🍔 Food: $210</span>
                <span>📚 Books: $120</span>
                <span>🚇 Transit: $48</span>
              </div>
            </div>

            {/* Tutor Booking Slot */}
            <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-lg)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left flex-grow min-w-0">
                <h4 className="text-[9.5px] font-bold text-[var(--text-secondary)] uppercase">Next Tutor Session</h4>
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">CS-301 Algorithms with Dr. Marcus</p>
                <p className="text-[9.5px] text-indigo-400 font-bold">Today at 4:30 PM (Online Match)</p>
              </div>
              <span className="text-[8px] px-2 py-0.5 bg-indigo-500/15 text-indigo-400 rounded font-black uppercase shrink-0 border border-indigo-500/20">UPCOMING</span>
            </div>

            {/* Referral Alert Match */}
            <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-lg)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-left flex-grow min-w-0">
                <h4 className="text-[9.5px] font-bold text-[var(--text-secondary)] uppercase">Referrals & Jobs</h4>
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">Stripe Intern Referral Approved</p>
                <p className="text-[9.5px] text-cyan-400 font-bold">Referred by Priya S. (Alumni '23)</p>
              </div>
              <span className="text-[8px] px-2 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-full font-black uppercase shrink-0 border border-cyan-500/20 animate-pulse">Matched</span>
            </div>
            
            {/* Glowing Accent Ring */}
            <div className="absolute -inset-px rounded-[24px] border border-[var(--border-color)] pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* 🚀 LOGO STRIP */}
      <section className="uc-logo-strip w-full border-t border-[var(--border-color)] bg-[var(--card-bg)] py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-[0.2em] font-semibold mb-8">TRUSTED BY UNIVERSITIES & ORGANIZATIONS</p>
          <div className="flex justify-around items-center opacity-60 flex-wrap gap-8 text-sm font-semibold text-[var(--text-secondary)]">
            <div className="partner-logo font-serif text-lg tracking-wide text-[var(--text-primary)]">Stanford</div>
            <div className="partner-logo font-black tracking-tighter text-xl flex items-center gap-1"><span className="flex gap-0.5"><span className="w-1.5 h-6 bg-current" /><span className="w-1.5 h-6 bg-current" /><span className="w-1.5 h-6 bg-current" /></span>mit</div>
            <div className="partner-logo font-sans text-lg tracking-tight font-bold text-[var(--text-primary)]">Google</div>
            <div className="partner-logo font-sans text-xl font-black text-[var(--text-primary)] italic">stripe</div>
            <div className="partner-logo font-sans text-lg tracking-tight font-medium text-[var(--text-primary)]">amazon</div>
            <div className="partner-logo font-mono text-base tracking-[0.2em] text-[var(--text-primary)] font-bold">VERITEX</div>
          </div>
        </div>
      </section>

      {/* 🚀 PLATFORM HIGHLIGHTS */}
      <section className="uc-modern-section uc-modern-content px-6 w-full text-center">
        {/* <div className="text-center mb-16 space-y-4">
          <span className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Platform Overview</span>
          <h2 className="uc-section-heading">Everything You Need in One Place</h2>
          <p className="uc-subheading max-w-xl mx-auto text-[var(--text-secondary)]">A unified student journey designed to support you from class registration to graduation and career placement.</p>
        </div> */}
        <div className="text-center mb-16 space-y-6">
  <span className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">
    Platform Overview
  </span>

  <h2 className="uc-section-heading">
    Everything You Need in One Place
  </h2>

  <p className="uc-subheading max-w-xl mx-auto text-[var(--text-secondary)] mt-4">
    A unified student journey designed to support you from class registration to graduation and career placement.
  </p>
</div>


        {/* Dotted horizontal flow timeline */}
        <div className="relative max-w-4xl mx-auto mb-16 px-4">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dashed border-[var(--border-color)] -translate-y-12 z-0 hidden md:block" />
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
            {/* Step 1: Tutorials */}
            <Link to="/features/tutorials" className="group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-glow)] text-[var(--accent)] flex items-center justify-center mb-3 transition-all duration-300 relative z-10">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Tutorials</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Book Sessions</p>
            </Link>

            {/* Step 2: Attendance */}
            <Link to="/features/attendance" className="group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-glow)] text-[var(--accent)] flex items-center justify-center mb-3 transition-all duration-300 relative z-10">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Attendance</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Track Limits</p>
            </Link>

            {/* Step 3: Expenses */}
            <Link to="/features/expenses" className="group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-glow)] text-[var(--accent)] flex items-center justify-center mb-3 transition-all duration-300 relative z-10">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Expenses</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Manage Budget</p>
            </Link>

            {/* Step 4: Referrals */}
            <Link to="/features/referrals" className="group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-glow)] text-[var(--accent)] flex items-center justify-center mb-3 transition-all duration-300 relative z-10">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Referrals</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Find Opportunities</p>
            </Link>

            {/* Step 5: Alumni Hub */}
            <Link to="/features/alumni" className="group flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-glow)] text-[var(--accent)] flex items-center justify-center mb-3 transition-all duration-300 relative z-10">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Alumni Hub</h4>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Stay Connected</p>
            </Link>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link to="/how-it-works" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold inline-flex items-center gap-1.5 text-sm transition-colors">
            Learn more about the full workflow <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 🚀 TOP FEATURES PREVIEW */}
      <section className="w-full bg-[var(--bg-secondary)]/30 py-24 px-6 border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Core Modules</span>
            <h2 className="uc-section-heading">Everything You Need in One Place</h2>
            <p className="uc-subheading max-w-xl mx-auto text-[var(--text-secondary)]">Discover how our core sub-modules integrate cleanly under the unified dashboard.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Tutorial Matchmaking */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-card-modern p-8 text-left flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6 border border-indigo-500/20 shadow-[var(--shadow-sm)]"><BookOpen className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Tutorial Matchmaking</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Connect with vetted student tutors and request bookings instantly with integrated calendar syncing.</p>
              </div>
              <Link to="/features/tutorials" className="text-[var(--accent)] hover:underline font-semibold mt-6 block text-xs">Learn more &rarr;</Link>
            </motion.div>
            
            {/* Job Referrals */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-card-modern p-8 text-left flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[var(--shadow-sm)]"><Briefcase className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Job Referrals</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Accelerate your career search with exclusive job boards powered by verified alumni networks.</p>
              </div>
              <Link to="/features/referrals" className="text-[var(--accent)] hover:underline font-semibold mt-6 block text-xs">Learn more &rarr;</Link>
            </motion.div>

            {/* Attendance & Budget */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-card-modern p-8 text-left flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[var(--shadow-sm)]"><LayoutDashboard className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Attendance & Budget</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Monitor your attendance limits and track monthly expenses with beautiful interactive charts.</p>
              </div>
              <Link to="/features/attendance" className="text-[var(--accent)] hover:underline font-semibold mt-6 block text-xs">Learn more &rarr;</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🚀 STATISTICS PREVIEW */}
      <section ref={statsRef} className="w-full py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-8 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)] text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center p-6 md:p-4 first:pl-0 last:pr-0">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <strong className="block text-4xl font-extrabold text-[var(--text-primary)]">{studentsCount.toLocaleString()}+</strong>
              <span className="text-xs text-[var(--text-secondary)] mt-2 block font-semibold uppercase tracking-wider">Active Students</span>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col items-center p-6 md:p-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <strong className="block text-4xl font-extrabold text-[var(--text-primary)]">{tutorsCount.toLocaleString()}+</strong>
              <span className="text-xs text-[var(--text-secondary)] mt-2 block font-semibold uppercase tracking-wider">Certified Tutors</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center p-6 md:p-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <strong className="block text-4xl font-extrabold text-[var(--text-primary)]">{sessionsCount.toLocaleString()}+</strong>
              <span className="text-xs text-[var(--text-secondary)] mt-2 block font-semibold uppercase tracking-wider">Sessions Completed</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center p-6 md:p-4">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <strong className="block text-4xl font-extrabold text-[var(--text-primary)]">{referralsCount.toLocaleString()}+</strong>
              <span className="text-xs text-[var(--text-secondary)] mt-2 block font-semibold uppercase tracking-wider">Job Referrals</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="w-full px-6 py-20 max-w-6xl mx-auto mb-16">
        <div className="premium-cta-banner p-6 sm:p-12 md:p-20 text-center rounded-[var(--radius-xl)] relative overflow-hidden shadow-[var(--shadow-lg)]">
          {/* Animated Blobs */}
          <div className="cta-blobs-container">
            <div className="cta-blob cta-blob-1"></div>
            <div className="cta-blob cta-blob-2"></div>
            <div className="cta-blob cta-blob-3"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="uc-section-heading text-white mb-6">Ready to Upgrade Your Student Experience?</h2>
            <p className="text-white/80 text-base mb-10 leading-relaxed max-w-lg mx-auto">
              Join the platform that thousands of university students use daily to manage their entire academic lifecycle.
            </p>
            <div className="flex justify-center gap-4 select-none">
              <Link className="uc-btn-primary px-8 py-4 rounded-[var(--radius-md)] text-sm font-bold flex items-center gap-1.5 hover:scale-105 transition-all duration-300" to="/role-selection">
                Get Started Now &rarr;
              </Link>
              <Link className="uc-btn-secondary px-8 py-4 text-white border border-white/20 rounded-[var(--radius-md)] text-sm font-bold hover:bg-white/10 transition-all duration-300" to="/features">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
