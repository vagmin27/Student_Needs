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
    <div className="flex flex-col items-center">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="w-full uc-modern-container" style={{ paddingTop: "56px", paddingBottom: "56px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-left flex flex-col gap-6"
          >
            <h1 className="uc-hero-title" style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.03em" }}>
              The Operating System for Modern{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Student Success
              </span>
            </h1>
            <p style={{ fontSize: "17px", lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: "520px" }}>
              Manage academics, tutoring, attendance, finances, and career opportunities from one unified platform.
            </p>
            <div className="flex flex-wrap gap-3 select-none">
              <Link
                className="uc-btn-primary px-7 py-3.5 rounded-[var(--radius-md)] text-sm font-bold flex items-center gap-1.5 hover:scale-105 transition-all duration-300"
                to="/role-selection"
              >
                Get Started &rarr;
              </Link>
              <Link
                className="uc-btn-secondary px-7 py-3.5 rounded-[var(--radius-md)] text-sm font-bold transition-all duration-300 flex items-center gap-2"
                to="/features"
              >
                <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* RIGHT: Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="w-full flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[20px] p-5 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-md">
              {/* Window bar */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">Live Dashboard</span>
              </div>

              {/* Student Profile & Attendance Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-md)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-black shrink-0 text-xs">AR</div>
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">Alex Rivera</h4>
                    <p className="text-[9.5px] text-[var(--text-secondary)] truncate font-medium">CS Junior • GPA 3.82</p>
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-md)] flex items-center justify-between">
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

              {/* Budget */}
              <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-2">
                <div className="flex justify-between items-center">
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
                <div className="flex justify-between text-[9px] text-[var(--text-secondary)]">
                  <span>🍔 Food: $210</span>
                  <span>📚 Books: $120</span>
                  <span>🚇 Transit: $48</span>
                </div>
              </div>

              {/* Tutor Booking */}
              <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-md)] flex items-center gap-3">
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

              {/* Referral */}
              <div className="p-3 bg-[var(--bg-secondary)]/10 border border-[var(--border-color)] rounded-[var(--radius-md)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-[var(--radius-md)] bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-left flex-grow min-w-0">
                  <h4 className="text-[9.5px] font-bold text-[var(--text-secondary)] uppercase">Referrals &amp; Jobs</h4>
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">Stripe Intern Referral Approved</p>
                  <p className="text-[9.5px] text-cyan-400 font-bold">Referred by Priya S. (Alumni '23)</p>
                </div>
                <span className="text-[8px] px-2 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-full font-black uppercase shrink-0 border border-cyan-500/20 animate-pulse">Matched</span>
              </div>

              <div className="absolute -inset-px rounded-[20px] border border-[var(--border-color)] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LOGO STRIP ───────────────────────────────────────────────── */}
      <section className="w-full border-t border-[var(--border-color)] bg-[var(--card-bg)]" style={{ padding: "20px 24px" }}>
        <div className="uc-modern-container">
          <p className="text-[var(--text-secondary)] text-[10px] uppercase tracking-[0.2em] font-semibold text-center mb-5">
            TRUSTED BY UNIVERSITIES &amp; ORGANIZATIONS
          </p>
          <div className="flex justify-around items-center opacity-60 flex-wrap gap-6 text-sm font-semibold text-[var(--text-secondary)]">
            <div className="partner-logo font-serif text-lg tracking-wide text-[var(--text-primary)]">Stanford</div>
            <div className="partner-logo font-black tracking-tighter text-xl flex items-center gap-1">
              <span className="flex gap-0.5">
                <span className="w-1.5 h-6 bg-current" />
                <span className="w-1.5 h-6 bg-current" />
                <span className="w-1.5 h-6 bg-current" />
              </span>
              mit
            </div>
            <div className="partner-logo font-sans text-lg tracking-tight font-bold text-[var(--text-primary)]">Google</div>
            <div className="partner-logo font-sans text-xl font-black text-[var(--text-primary)] italic">stripe</div>
            <div className="partner-logo font-sans text-lg tracking-tight font-medium text-[var(--text-primary)]">amazon</div>
            <div className="partner-logo font-mono text-base tracking-[0.2em] text-[var(--text-primary)] font-bold">VERITEX</div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM HIGHLIGHTS ──────────────────────────────────────── */}
      <section className="w-full uc-modern-container" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Platform Overview</span>
          <h2 className="uc-section-heading">Everything You Need in One Place</h2>
          <p style={{ maxWidth: "640px", margin: "0 auto", fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            A unified student journey designed to support you from class registration to graduation and career placement.
          </p>
        </div>

        {/* 5-step horizontal flow */}
        <div className="relative mb-10">
          <div className="absolute top-8 left-0 right-0 h-0.5 border-t-2 border-dashed border-[var(--border-color)] z-0 hidden lg:block" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {[
              { to: "/features/tutorials", Icon: BookOpen, label: "Tutorials", sub: "Book Sessions" },
              { to: "/features/attendance", Icon: CheckCircle, label: "Attendance", sub: "Track Limits" },
              { to: "/features/expenses", Icon: DollarSign, label: "Expenses", sub: "Manage Budget" },
              { to: "/features/referrals", Icon: Briefcase, label: "Referrals", sub: "Find Opportunities" },
              { to: "/features/alumni", Icon: GraduationCap, label: "Alumni Hub", sub: "Stay Connected" },
            ].map(({ to, Icon, label, sub }) => (
              <Link key={to} to={to} className="group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-glow)] text-[var(--accent)] flex items-center justify-center mb-3 transition-all duration-300 relative z-10">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{label}</h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{sub}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/how-it-works" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold inline-flex items-center gap-1.5 text-sm transition-colors">
            Learn more about the full workflow <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── CORE MODULES (FEATURES PREVIEW) ─────────────────────────── */}
      <section className="w-full bg-[var(--bg-secondary)]/30 border-y border-[var(--border-color)]" style={{ padding: "60px 0" }}>
        <div className="uc-modern-container">
          <div className="text-center mb-10 space-y-3">
            <span className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Core Modules</span>
            <h2 className="uc-section-heading">Built for Every Part of Student Life</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto", fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Discover how our core sub-modules integrate cleanly under the unified dashboard.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                color: "indigo",
                Icon: BookOpen,
                title: "Tutorial Matchmaking",
                desc: "Connect with vetted student tutors and request bookings instantly with integrated calendar syncing.",
                to: "/features/tutorials",
              },
              {
                color: "cyan",
                Icon: Briefcase,
                title: "Job Referrals",
                desc: "Accelerate your career search with exclusive job boards powered by verified alumni networks.",
                to: "/features/referrals",
              },
              {
                color: "emerald",
                Icon: LayoutDashboard,
                title: "Attendance & Budget",
                desc: "Monitor your attendance limits and track monthly expenses with beautiful interactive charts.",
                to: "/features/attendance",
              },
            ].map(({ color, Icon, title, desc, to }) => (
              <motion.div
                key={to}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                className="glass-card-modern p-7 text-left flex flex-col justify-between gap-4"
              >
                <div>
                  <div className={`w-12 h-12 rounded-[var(--radius-md)] bg-${color}-500/10 text-${color}-500 flex items-center justify-center mb-5 border border-${color}-500/20 shadow-[var(--shadow-sm)]`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                </div>
                <Link to={to} className="text-[var(--accent)] hover:underline font-semibold text-xs">
                  Learn more &rarr;
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATISTICS ───────────────────────────────────────────────── */}
      <section ref={statsRef} className="w-full uc-modern-container" style={{ paddingTop: "52px", paddingBottom: "52px" }}>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-8 backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x divide-[var(--border-color)] text-center">
            {[
              { Icon: Users, value: `${studentsCount.toLocaleString()}+`, label: "Active Students" },
              { Icon: GraduationCap, value: `${tutorsCount.toLocaleString()}+`, label: "Certified Tutors" },
              { Icon: BookOpen, value: `${sessionsCount.toLocaleString()}+`, label: "Sessions Completed" },
              { Icon: Briefcase, value: `${referralsCount.toLocaleString()}+`, label: "Job Referrals" },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center py-6 px-4">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <strong className="block text-4xl font-extrabold text-[var(--text-primary)]">{value}</strong>
                <span className="text-xs text-[var(--text-secondary)] mt-2 block font-semibold uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="w-full uc-modern-container" style={{ paddingTop: "16px", paddingBottom: "56px" }}>
        <div className="premium-cta-banner p-8 md:p-14 text-center rounded-[var(--radius-xl)] relative overflow-hidden shadow-[var(--shadow-lg)]">
          <div className="cta-blobs-container">
            <div className="cta-blob cta-blob-1" />
            <div className="cta-blob cta-blob-2" />
            <div className="cta-blob cta-blob-3" />
          </div>
          <div className="relative z-10" style={{ maxWidth: "680px", margin: "0 auto" }}>
            <h2 className="uc-section-heading text-white mb-5">Ready to Upgrade Your Student Experience?</h2>
            <p className="text-white/80 text-base mb-8 leading-relaxed" style={{ maxWidth: "520px", margin: "0 auto 2rem" }}>
              Join the platform that thousands of university students use daily to manage their entire academic lifecycle.
            </p>
            <div className="flex justify-center gap-4 select-none flex-wrap">
              <Link className="uc-btn-primary px-8 py-3.5 rounded-[var(--radius-md)] text-sm font-bold flex items-center gap-1.5 hover:scale-105 transition-all duration-300" to="/role-selection">
                Get Started Now &rarr;
              </Link>
              <Link className="uc-btn-secondary px-8 py-3.5 text-white border border-white/20 rounded-[var(--radius-md)] text-sm font-bold hover:bg-white/10 transition-all duration-300" to="/features">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
