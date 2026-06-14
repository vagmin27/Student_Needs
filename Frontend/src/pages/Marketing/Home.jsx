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
          <span className="uc-badge-text px-3.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
            🛡️ TRUSTED BY 10,000+ ACADEMICS NATIONWIDE
          </span>
          <h1 className="uc-hero-title text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
            The Central OS for <span>Student</span> Success
          </h1>
          <p className="uc-body-text uc-hero-desc-audit leading-relaxed text-muted-foreground text-lg">
            UniConnect integrates everything you need to study better, manage your schedule, plan finances, and secure corporate job referrals in one unified platform.
          </p>
          <div className="uc-actions flex flex-wrap gap-4 select-none pt-2">
            <Link className="uc-btn-primary px-8 py-4 text-white rounded-[var(--radius-sm)] text-sm font-bold flex items-center gap-1.5 shadow-[var(--shadow-lg)] shadow-primary/20" to="/role-selection">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link className="uc-btn-secondary px-8 py-4 rounded-[var(--radius-sm)] text-sm font-bold transition-all" to="/features">
              Explore Features
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
          <div className="w-full max-w-[500px] bg-card/60 border border-border/80 rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-lg)] space-y-4 relative overflow-hidden backdrop-blur-md">
            
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">UniConnect Live Workspace</span>
            </div>
            
            {/* Student Profile & Attendance Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Profile Widget */}
              <div className="p-3 bg-secondary/35 border border-border/40 rounded-[var(--radius-md)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-primary shrink-0">
                  AR
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-foreground truncate">Alex Rivera</h4>
                  <p className="text-[9.5px] text-muted-foreground truncate font-medium">CS Junior • GPA 3.82</p>
                </div>
              </div>

              {/* Attendance Indicator */}
              <div className="p-3 bg-secondary/35 border border-border/40 rounded-[var(--radius-md)] flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-[9.5px] uppercase font-bold text-muted-foreground">Attendance</h4>
                  <p className="text-base font-black text-emerald-500">94.2% Rate</p>
                </div>
                <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="14" stroke="currentColor" className="text-muted-foreground/10" strokeWidth="2.5" fill="transparent" />
                    <circle cx="18" cy="18" r="14" stroke="currentColor" className="text-emerald-500" strokeWidth="2.5" strokeDasharray={88} strokeDashoffset={5} fill="transparent" />
                  </svg>
                  <span className="absolute text-[8px] font-bold text-emerald-500">94%</span>
                </div>
              </div>
            </div>

            {/* Expense Budget Indicator */}
            <div className="p-3 bg-secondary/35 border border-border/40 rounded-[var(--radius-md)] space-y-2">
              <div className="flex justify-between items-center text-left">
                <div>
                  <h4 className="text-[9.5px] uppercase font-bold text-muted-foreground">Monthly Budget</h4>
                  <p className="text-xs font-bold text-foreground">$428.50 / $600.00</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">Within Limit</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-primary" style={{ width: "45%" }} />
                <div className="h-full bg-indigo-400" style={{ width: "22%" }} />
                <div className="h-full bg-cyan-400" style={{ width: "8%" }} />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground pt-0.5">
                <span>🍔 Food: $210</span>
                <span>📚 Books: $120</span>
                <span>🚇 Transit: $48</span>
              </div>
            </div>

            {/* Tutor Booking Slot */}
            <div className="p-3 bg-secondary/35 border border-border/40 rounded-[var(--radius-md)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--primary)]/30/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-left flex-grow min-w-0">
                <h4 className="text-[9.5px] font-bold text-muted-foreground uppercase">Next Tutor Session</h4>
                <p className="text-xs font-bold text-foreground truncate">CS-301 Algorithms with Dr. Marcus</p>
                <p className="text-[9.5px] text-primary font-bold">Today at 4:30 PM (Online Match)</p>
              </div>
              <span className="text-[8px] px-2 py-0.5 bg-[var(--primary)]/15 text-[var(--primary)] rounded font-black uppercase shrink-0 border border-[var(--primary)]/30/20">Pending</span>
            </div>

            {/* Referral Alert Match */}
            <div className="p-3 bg-secondary/35 border border-border/40 rounded-[var(--radius-md)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-left flex-grow min-w-0">
                <h4 className="text-[9.5px] font-bold text-muted-foreground uppercase">Referrals & Jobs</h4>
                <p className="text-xs font-bold text-foreground truncate">Stripe Intern Referral Approved</p>
                <p className="text-[9.5px] text-cyan-400 font-bold">Referred by Priya S. (Alumni '23)</p>
              </div>
              <span className="text-[8px] px-2 py-0.5 bg-cyan-500/15 text-cyan-400 rounded-full font-black uppercase shrink-0 border border-cyan-500/20 animate-pulse">Matched</span>
            </div>
            
            {/* Glowing Accent Ring */}
            <div className="absolute -inset-px rounded-[var(--radius-lg)] border border-primary/20 pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* 🚀 LOGO STRIP */}
      <section className="uc-logo-strip w-full border-t border-border/80 bg-card py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-8">SUPPORTED ACROSS UNIVERSITY CAMPUSES & INDUSTRY ORGANIZATIONS</p>
          <div className="flex justify-around items-center opacity-65 flex-wrap gap-6 text-xs font-bold text-muted-foreground">
            <div className="partner-logo"><span>U</span> Stanford Connect</div>
            <div className="partner-logo"><span>U</span> MIT Alliance</div>
            <div className="partner-logo"><span>U</span> Google Referrals</div>
            <div className="partner-logo"><span>U</span> Stripe Student Dev</div>
            <div className="partner-logo"><span>U</span> Amazon Student Hub</div>
          </div>
        </div>
      </section>

      {/* 🚀 PLATFORM HIGHLIGHTS */}
      <section className="uc-modern-section uc-modern-content px-6 w-full text-center">
        <div className="text-center mb-16 space-y-4">
          <h2 className="uc-section-heading">Everything Students Need in One Platform</h2>
          <p className="uc-subheading max-w-xl mx-auto">A unified student journey designed to support you from registration to graduation and career placement.</p>
        </div>

        <div className="ecosystem-flow-wrapper flex justify-center items-center flex-wrap gap-4 max-w-4xl mx-auto p-6 bg-card border border-border rounded-[var(--radius-lg)] mb-12">
          <Link to="/features/tutorials" className="eco-node">Tutorials</Link>
          <div className="eco-arrow font-bold text-muted-foreground">→</div>
          <Link to="/features/attendance" className="eco-node">Attendance</Link>
          <div className="eco-arrow font-bold text-muted-foreground">→</div>
          <Link to="/features/expenses" className="eco-node">Expenses</Link>
          <div className="eco-arrow font-bold text-muted-foreground">→</div>
          <Link to="/features/referrals" className="eco-node">Referrals</Link>
          <div className="eco-arrow font-bold text-muted-foreground">→</div>
          <Link to="/features/alumni" className="eco-node">Alumni Hub</Link>
          <div className="eco-arrow font-bold text-muted-foreground">→</div>
          <Link to="/features/dashboard" className="eco-node career bg-primary text-white font-bold">Career Growth</Link>
        </div>

        <div className="text-center">
          <Link to="/how-it-works" className="text-primary hover:text-primary-hover font-semibold inline-flex items-center gap-1.5 text-sm">
            Learn more about the full workflow <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 🚀 TOP FEATURES PREVIEW */}
      <section className="w-full bg-secondary/10 py-24 px-6 border-y border-border/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="uc-section-heading">Modular Features Preview</h2>
            <p className="uc-subheading max-w-xl mx-auto">Discover how our core sub-modules integrate cleanly under the unified dashboard.</p>
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
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-card-modern p-8 text-left flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6 shadow-[var(--shadow-sm)]"><BookOpen className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-foreground mb-3">Tutorials</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Connect with vetted student tutors and request bookings instantly.</p>
              </div>
              <Link to="/features/tutorials" className="text-primary hover:underline font-semibold mt-6 block text-xs">Learn details →</Link>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-card-modern p-8 text-left flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6 shadow-[var(--shadow-sm)]"><Briefcase className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-foreground mb-3">Referrals & Internships</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Accelerate your career search with job boards powered by verified alumni.</p>
              </div>
              <Link to="/features/referrals" className="text-primary hover:underline font-semibold mt-6 block text-xs">Learn details →</Link>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="glass-card-modern p-8 text-left flex flex-col justify-between gap-4"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 shadow-[var(--shadow-sm)]"><ClipboardList className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-foreground mb-3">Attendance Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Monitor your attendance limits and sync class lists automatically.</p>
              </div>
              <Link to="/features/attendance" className="text-primary hover:underline font-semibold mt-6 block text-xs">Learn details →</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🚀 STATISTICS PREVIEW */}
      <section ref={statsRef} className="w-full py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-8 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <strong className="block text-4xl font-extrabold text-primary">{studentsCount.toLocaleString()}+</strong>
            <span className="text-xs text-muted-foreground mt-2 block font-semibold uppercase tracking-wider">Active Students</span>
          </div>
          <div className="p-8 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <strong className="block text-4xl font-extrabold text-[var(--primary)]">{tutorsCount.toLocaleString()}+</strong>
            <span className="text-xs text-muted-foreground mt-2 block font-semibold uppercase tracking-wider">Certified Tutors</span>
          </div>
          <div className="p-8 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <strong className="block text-4xl font-extrabold text-emerald-500">{sessionsCount.toLocaleString()}+</strong>
            <span className="text-xs text-muted-foreground mt-2 block font-semibold uppercase tracking-wider">Sessions Completed</span>
          </div>
          <div className="p-8 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]">
            <strong className="block text-4xl font-extrabold text-cyan-400">{referralsCount.toLocaleString()}+</strong>
            <span className="text-xs text-muted-foreground mt-2 block font-semibold uppercase tracking-wider">Job Referrals</span>
          </div>
        </div>
      </section>

      {/* 🚀 CTA SECTION */}
      <section className="w-full px-6 py-20 max-w-6xl mx-auto mb-16">
        <div className="premium-cta-banner p-12 sm:p-20 text-center rounded-[var(--radius-xl)] relative overflow-hidden shadow-[var(--shadow-lg)]">
          {/* Animated Blobs */}
          <div className="cta-blobs-container">
            <div className="cta-blob cta-blob-1"></div>
            <div className="cta-blob cta-blob-2"></div>
            <div className="cta-blob cta-blob-3"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="uc-section-heading text-white mb-6">Ready to Transform Your Student Journey?</h2>
            <p className="text-muted-foreground text-base mb-10 leading-relaxed max-w-lg mx-auto">
              Join thousands of university students matching with verified tutors, tracking schedules, budgeting, and securing corporate job referrals.
            </p>
            <div className="flex justify-center gap-4 select-none">
              <Link className="uc-btn-primary px-8 py-4 text-white rounded-[var(--radius-sm)] text-sm font-bold flex items-center gap-1.5" to="/role-selection">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link className="uc-btn-secondary px-8 py-4 text-white border border-white/20 rounded-[var(--radius-sm)] text-sm font-bold hover:bg-white/10 transition-colors" to="/features">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
