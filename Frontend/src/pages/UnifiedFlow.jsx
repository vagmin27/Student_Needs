import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Loader2,
  ArrowRight,
  Clock,
  TrendingUp,
  Sun,
  Moon,
  Laptop,
  UserPlus,
  Layers,
  Link2,
  Heart,
  Smile,
  Lightbulb,
  ChevronDown,
  Star,
  Check,
  Minus,
  Info,
  Users,
  Award,
  Tablet,
  Smartphone,
  ExternalLink,
  Mail,
  MapPin,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme.js";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { cn } from "@/lib/utils";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TutorLoginPage from "./Tutorials/TutorLoginPage";
import TutorRegisterPage from "./Tutorials/TutorRegisterPage";

import {
  useAlumniLogin,
  useAlumniSignup,
  useStudentLogin,
  useStudentSignup,
} from "@/services/Referrals/Auth/hooks.js";

// const roles = [
//   {
//     id: "student",
//     title: "Student",
//     description: "Access all student features and tools",
//     icon: GraduationCap,
//     loginTo: "/login/student",
//   },
//   {
//     id: "teacher",
//     title: "Teacher / Tutor",
//     description: "Teach, manage students and track performance",
//     icon: BookOpen,
//     loginTo: "/login/teacher",
//   },
//   {
//     id: "alumni",
//     title: "Alumni / Verifier",
//     description: "Provide referrals, verify students and opportunities",
//     icon: ShieldCheck,
//     loginTo: "/login/alumni",
//   },
// ];

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Access all student features and tools",
    icon: GraduationCap,
    loginTo: "/login/student",
  },
  {
    id: "tutor",
    title: "Tutor",
    description: "Teach, manage students and track performance",
    icon: BookOpen,
    loginTo: "/login/tutor",
  },
  {
    id: "alumni",
    title: "Alumni",
    description: "Provide referrals and opportunities",
    icon: Briefcase,
    loginTo: "/login/alumni",
  },

];

const studentModules = [
  { title: "Find Tutor", text: "Search tutors, view profiles and book classes.", icon: UserRound, to: "/tutorials/home" },
  { title: "Attendance", text: "View attendance status and class records.", icon: CheckSquare, to: "/student/attendance" },
  { title: "Expense Tracker", text: "Add, categorize and track monthly spending.", icon: ReceiptText, to: "/student/expenses" },
  { title: "Internships & Referrals", text: "Apply to alumni-posted opportunities.", icon: UsersRound, to: "/referrals/browse-referrals" },
  { title: "Grade Management", text: "Review academic progress and reports.", icon: ClipboardList, to: "/attendance/reports" },
];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/student/dashboard" },
  { label: "Find Tutor", icon: Search, to: "/tutorials/home" },
  { label: "Attendance", icon: CheckSquare, to: "/student/attendance" },
  { label: "Expenses", icon: ReceiptText, to: "/student/expenses" },
  { label: "Internships & Referrals", icon: Briefcase, to: "/referrals/browse-referrals" },
  { label: "Grades", icon: ClipboardList, to: "/attendance/reports" },
  { label: "Calendar", icon: CalendarDays, to: "/tutorials/profile/classHistory" },
  { label: "Messages", icon: MessageSquare, to: "/referrals" },
  { label: "Settings", icon: Settings, to: "/tutorials/profile/accountSettings" },
];

function Brand() {
  return (
    <Link to="/" className="uc-brand" aria-label="UniConnect home">
      <span className="uc-brand-mark">U</span>
      <span>UniConnect</span>
    </Link>
  );
}

// A custom counter hook triggered when the stats section enters the viewport
export function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let startTimestamp = null;
    const duration = 1500; // 1.5 seconds animation
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, active]);

  return count;
}

export function UnifiedLanding() {
  const { theme } = useTheme();
  
  // Section active states for scrolling and metrics trigger
  const [statsActive, setStatsActive] = useState(false);
  const [activeNav, setActiveNav] = useState("hero");

  const statsRef = useRef(null);
  const observerRefs = useRef({});

  // 1. Dynamic structured JSON-LD Injection for SEO
  useEffect(() => {
    const existingScript = document.getElementById("uniconnect-jsonld");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "uniconnect-jsonld";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://uniconnect.com/#organization",
            "name": "UniConnect",
            "url": "https://uniconnect.com",
            "logo": "https://uniconnect.com/logo.png",
            "sameAs": [
              "https://www.linkedin.com/company/uniconnect",
              "https://github.com/uniconnect",
              "https://twitter.com/uniconnect"
            ]
          },
          {
            "@type": "SoftwareApplication",
            "@id": "https://uniconnect.com/#application",
            "name": "UniConnect Platform",
            "operatingSystem": "All",
            "applicationCategory": "EducationalApplication, BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        ]
      });
      document.head.appendChild(script);
    }
  }, []);

  // 2. Intersection Observer for Stats Section & Scroll Active Highlight
  useEffect(() => {
    // Stats section trigger
    const statsEl = statsRef.current;
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
        }
      },
      { threshold: 0.15 }
    );
    if (statsEl) statsObserver.observe(statsEl);

    // Section Nav links highlight observer
    const sectionIds = ["features", "how-it-works", "testimonials", "about", "faq"];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: "-10% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observerRefs.current[id] = el;
        sectionObserver.observe(el);
      }
    });

    return () => {
      if (statsEl) statsObserver.unobserve(statsEl);
      sectionIds.forEach((id) => {
        const el = observerRefs.current[id];
        if (el) sectionObserver.unobserve(el);
      });
    };
  }, []);

  // Dynamic Count Up Hook calls
  const studentsCount = useCountUp(10000, statsActive);
  const tutorsCount = useCountUp(500, statsActive);
  const sessionsCount = useCountUp(25000, statsActive);
  const referralsCount = useCountUp(1000, statsActive);
  const satisfactionCount = useCountUp(95, statsActive);
  const mentorsCount = useCountUp(50, statsActive);

  // 3. Testimonial State & Carousel Config
  const [testimonialCategory, setTestimonialCategory] = useState("all");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const testimonials = useMemo(() => [
    {
      name: "Ananya Sharma",
      role: "student",
      branch: "Computer Science",
      year: "2027",
      rating: 5,
      content: "UniConnect completely streamlined my studies. Finding a verified Python tutor took seconds, and I track my exam scores and monthly spending right on the same dashboard!",
      avatarText: "AS"
    },
    {
      name: "Dr. Rohan Mehta",
      role: "tutor",
      branch: "Data Structures & Math",
      year: "Faculty",
      rating: 5,
      content: "As a tutor on UniConnect, I can manage class requests and check student attendance history without friction. The built-in chat module is highly responsive.",
      avatarText: "RM"
    },
    {
      name: "Siddharth Sen",
      role: "alumni",
      branch: "Software Engineer @ Google",
      year: "Class of 2023",
      rating: 5,
      content: "I use UniConnect to share referrals for internships at Google. The portal validates student profiles beforehand, which makes my review load much lighter.",
      avatarText: "SS"
    },
    {
      name: "Tanya Goel",
      role: "student",
      branch: "Information Technology",
      year: "2026",
      rating: 5,
      content: "I love the Expense Tracker! Having budgets, class history, and job applications integrated in one unified app saves me so much time every day.",
      avatarText: "TG"
    },
    {
      name: "Prof. Priya Nair",
      role: "tutor",
      branch: "Database Management",
      year: "Faculty",
      rating: 5,
      content: "Marking online attendance and compiling statistics reports has never been easier. The UI/UX is clean, professional, and adapts instantly to mobile devices.",
      avatarText: "PN"
    },
    {
      name: "Rahul K.",
      role: "alumni",
      branch: "Product Designer @ Stripe",
      year: "Class of 2022",
      rating: 5,
      content: "Mentoring juniors via the Alumni directory lets me give back to the student community directly. The platform's ecosystem provides a clear career path.",
      avatarText: "RK"
    }
  ], []);

  // Filtered testimonials list
  const filteredTestimonials = useMemo(() => {
    if (testimonialCategory === "all") return testimonials;
    return testimonials.filter(t => t.role === testimonialCategory);
  }, [testimonialCategory, testimonials]);

  // Adjust index bounds if category filter drops item size
  useEffect(() => {
    setTestimonialIdx(0);
  }, [testimonialCategory]);

  // Auto-sliding interval for carousel (every 6 seconds)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setTestimonialIdx((prev) => 
        prev === filteredTestimonials.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [filteredTestimonials.length]);

  // 4. FAQ State and Toggle Accordion Helper
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (idx) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  const faqs = [
    {
      q: "What is UniConnect?",
      a: "UniConnect is a unified student platform designed as a central operating system for university life. It integrates tutoring, attendance logging, personal expense budgeting, job referrals, and alumni networking into one high-contrast, theme-adaptive workspace."
    },
    {
      q: "How do tutorials work?",
      a: "Students can search for certified tutors by subject, view complete profiles and reviews, book online class sessions, and message tutors instantly. Once booked, class history, materials sharing, and interactive seen/delivered chat states reside in the Tutorials sub-module."
    },
    {
      q: "Can alumni join?",
      a: "Yes! Alumni can register to mentor students, share internal company job listings, review application requests, and provide referrals. This establishes a direct transition from academic learning to professional success."
    },
    {
      q: "Is the platform free?",
      a: "UniConnect is free to use for students, tutors, and alumni as a core university support system. Premium tutoring rates or paid class hours are handled directly based on tutor-student booking selections."
    },
    {
      q: "How does referral sharing work?",
      a: "Alumni post open internship or job opportunities. Students browse the listings, upload their resumes, and request referrals. The platform validates student profiles and matches them with alumni verifiers for direct company endorsements."
    }
  ];

  // 5. Previews Mockup tab controls
  const [activePreviewTab, setActivePreviewTab] = useState("laptop");

  return (
    <main className="uc-page">
      {/* Dynamic SEO JSON-LD Scheme is mounted */}
      
      {/* 🚀 NAVBAR SECTION */}
      <nav className="uc-topbar" role="navigation" aria-label="Main menu">
        <Brand />
        <div className="uc-navlinks">
          <a href="#features" className={activeNav === "features" ? "active" : ""}>Features</a>
          <a href="#how-it-works" className={activeNav === "how-it-works" ? "active" : ""}>How It Works</a>
          <a href="#testimonials" className={activeNav === "testimonials" ? "active" : ""}>Testimonials</a>
          <a href="#about" className={activeNav === "about" ? "active" : ""}>About Us</a>
          <a href="#faq" className={activeNav === "faq" ? "active" : ""}>FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link className="uc-primary-button" to="/role-selection">
            Get Started
          </Link>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="uc-hero">
        <div className="uc-hero-copy">
          <span className="uc-badge-text">🔥 VERSION 2.0 IS LIVE</span>
          <h1>
            The Operating System for <span>Student</span> Success
          </h1>
          <p>
            UniConnect integrates everything you need to study better, manage your schedule, plan finances, and secure job referrals in one unified platform.
          </p>
          <ul className="uc-check-list">
            <li>Find Verified Tutors & Schedule Classes</li>
            <li>Track Class Attendance & Analytics Reports</li>
            <li>Plan Monthly Budgets & Analyze Expenses</li>
            <li>Get Corporate Job Referrals from Alumni</li>
          </ul>
          <div className="uc-actions">
            <Link className="uc-primary-button" to="/role-selection">
              Get Started Now <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <a className="uc-secondary-button" href="#features">
              Explore Modules
            </a>
          </div>
        </div>

        {/* Floating Modules Hero Visual */}
        <div className="uc-hero-visual" aria-hidden="true">
          <div className="uc-floating-board">
            <div className="floating-card c-tutorials">
              <span className="card-dot text-[var(--primary)]">📚</span>
              <div>
                <strong>Tutorials</strong>
                <small>Find online tutors & book sessions</small>
              </div>
            </div>
            <div className="floating-card c-referrals">
              <span className="card-dot text-cyan-400">💼</span>
              <div>
                <strong>Referrals</strong>
                <small>Get job referrals from alumni</small>
              </div>
            </div>
            <div className="floating-card c-attendance">
              <span className="card-dot text-emerald-500">📊</span>
              <div>
                <strong>Attendance</strong>
                <small>Log classes & check history</small>
              </div>
            </div>
            <div className="floating-card c-expenses">
              <span className="card-dot text-rose-500">💰</span>
              <div>
                <strong>Expenses</strong>
                <small>Daily budgets & category details</small>
              </div>
            </div>
            <div className="floating-card c-alumni">
              <span className="card-dot text-[var(--primary)]">🎓</span>
              <div>
                <strong>Alumni Hub</strong>
                <small>Mentorship & career networking</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 TRUSTED BY LOGO STRIP */}
      <section className="uc-logo-strip">
        <p>SUPPORTED ACROSS UNIVERSITY CAMPUSES & INDUSTRY ORGANIZATIONS</p>
        <div className="flex justify-around items-center opacity-65 flex-wrap gap-6">
          <div className="partner-logo"><span>U</span> Stanford Connect</div>
          <div className="partner-logo"><span>U</span> MIT Alliance</div>
          <div className="partner-logo"><span>U</span> Google Referrals</div>
          <div className="partner-logo"><span>U</span> Stripe Student Dev</div>
          <div className="partner-logo"><span>U</span> Discord Community</div>
        </div>
      </section>

      {/* 🚀 FEATURE CARDS GRID SECTION */}
      <section id="features" className="uc-section uc-features">
        <div className="uc-section-header">
          <h2>One Hub. Endless Possibilities.</h2>
          <p>Ditch the tab clutter. Every core resource of your university journey is built directly into UniConnect.</p>
        </div>

        <div className="uc-features-grid">
          {/* Card 1: Tutorials */}
          <div className="uc-feature-card glass-panel">
            <div className="icon-wrapper bg-[var(--primary)]/10 text-[var(--primary)]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3>Tutorials</h3>
            <p>Connect with vetted student tutors and request class bookings instantly.</p>
            <ul className="card-bullets mt-3">
              <li>Find expert tutors by academic course</li>
              <li>Schedule classes via real-time calendars</li>
              <li>Real-time chat with file uploads & seen indicators</li>
              <li>Online classroom attendance validation</li>
            </ul>
          </div>

          {/* Card 2: Referrals & Internships */}
          <div className="uc-feature-card glass-panel">
            <div className="icon-wrapper bg-cyan-400/10 text-cyan-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3>Referrals & Internships</h3>
            <p>Accelerate your career search with job boards powered by verified alumni.</p>
            <ul className="card-bullets mt-3">
              <li>Browse job roles filtered by tech area</li>
              <li>Submit referral applications directly</li>
              <li>Interactive application pipeline tracker</li>
              <li>Alumni resume review & interview stubs</li>
            </ul>
          </div>

          {/* Card 3: Attendance Management */}
          <div className="uc-feature-card glass-panel">
            <div className="icon-wrapper bg-emerald-500/10 text-emerald-500">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3>Attendance Tracker</h3>
            <p>Monitor your attendance criteria across academic subjects automatically.</p>
            <ul className="card-bullets mt-3">
              <li>Log subject attendance logs with one tap</li>
              <li>Check threshold alerts (e.g. 75% rule)</li>
              <li>Tutor attendance mark portals</li>
              <li>Statistical dashboards & download exports</li>
            </ul>
          </div>

          {/* Card 4: Expense Tracker */}
          <div className="uc-feature-card glass-panel">
            <div className="icon-wrapper bg-rose-500/10 text-rose-500">
              <ReceiptText className="w-6 h-6" />
            </div>
            <h3>Expense Planning</h3>
            <p>Take control of your personal finances with smart student budget logs.</p>
            <ul className="card-bullets mt-3">
              <li>Log daily spend categories (Food, Travel, Rent)</li>
              <li>Set monthly savings goals & notification thresholds</li>
              <li>Visualize category charts & monthly insights</li>
              <li>Export budget statement spreadsheets</li>
            </ul>
          </div>

          {/* Card 5: Student Dashboard */}
          <div className="uc-feature-card glass-panel">
            <div className="icon-wrapper bg-[var(--primary)]/10 text-[var(--primary)]">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3>Student Dashboard</h3>
            <p>Get a central overview of your entire university day on load.</p>
            <ul className="card-bullets mt-3">
              <li>Unified view of tutor chats & bookings</li>
              <li>Class attendance threshold warning cards</li>
              <li>Recent expenses & quick budget logs</li>
              <li>Real-time notifications for incoming referrals</li>
            </ul>
          </div>

          {/* Card 6: Alumni Network */}
          <div className="uc-feature-card glass-panel">
            <div className="icon-wrapper bg-amber-500/10 text-amber-500">
              <Users className="w-6 h-6" />
            </div>
            <h3>Alumni Directory</h3>
            <p>Bridge the gap between campus study and career placement.</p>
            <ul className="card-bullets mt-3">
              <li>Directory of alumni mapped by industry employer</li>
              <li>Direct 1-on-1 career consultation requests</li>
              <li>LinkedIn / GitHub profile verification</li>
              <li>Resume building guidelines & recommendations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🚀 WHY STUDENTS LOVE UNICONNECT: COMPARISON */}
      <section className="uc-section uc-comparison bg-secondary/20">
        <div className="uc-section-header">
          <h2>Ditch the Old Way</h2>
          <p>Traditional student life is fragmented. Here is how UniConnect changes the game.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional */}
          <div className="comparison-box traditional border-danger/30 bg-danger/5">
            <h3 className="text-danger flex items-center gap-2 text-lg font-bold mb-4">
              <Minus className="w-5 h-5" /> Traditional Student Life
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-danger">❌</span> Wasting time juggling 4 different apps (Excel, Slack, Splitwise, portals)
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-danger">❌</span> Manual spreadsheet tracking for class thresholds and budgets
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-danger">❌</span> Difficulty locating verified tutors for tough curriculum topics
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-danger">❌</span> Career boards filled with outdated links and generic application forms
              </li>
            </ul>
          </div>

          {/* UniConnect */}
          <div className="comparison-box uniconnect border-primary bg-primary/10 shadow-[var(--shadow-glow)]">
            <h3 className="text-primary flex items-center gap-2 text-lg font-bold mb-4">
              <Check className="w-5 h-5" /> The UniConnect Way
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-emerald-500">✅</span> One unified dashboard containing stats, bookings, and chat rooms
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-emerald-500">✅</span> Smart automated warnings for attendance limits and expense budgets
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-emerald-500">✅</span> Vetted on-demand tutors accessible with direct real-time chats
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <span className="text-emerald-500">✅</span> Internal company referrals shared directly by verified alumni
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🚀 ECOSYSTEM SHOWCASE & JOURNEY TIMELINE */}
      <section className="uc-section uc-ecosystem">
        <div className="uc-section-header">
          <h2>Everything Students Need in One Platform</h2>
          <p>A unified student journey designed to support you from registration to graduation and career placement.</p>
        </div>

        {/* Ecosystem Nodes Flow */}
        <div className="ecosystem-flow-wrapper flex justify-center items-center flex-wrap gap-4 max-w-4xl mx-auto mb-16">
          <div className="eco-node">Tutorials</div>
          <div className="eco-arrow">→</div>
          <div className="eco-node">Attendance</div>
          <div className="eco-arrow">→</div>
          <div className="eco-node">Expenses</div>
          <div className="eco-arrow">→</div>
          <div className="eco-node">Referrals</div>
          <div className="eco-arrow">→</div>
          <div className="eco-node">Alumni</div>
          <div className="eco-arrow">→</div>
          <div className="eco-node career">Career Growth</div>
        </div>

        {/* Journey Timeline */}
        <div className="journey-timeline max-w-lg mx-auto">
          <h3 className="text-center text-lg font-bold mb-8">The Student Journey Workflow</h3>
          <div className="timeline-items relative pl-8 border-l border-border/80 space-y-8">
            <div className="timeline-item relative">
              <div className="timeline-badge bg-primary">1</div>
              <h4>Register Profile</h4>
              <p className="text-sm text-muted-foreground">Sign up as a student or tutor. Your profile is automatically verified based on college email check.</p>
            </div>
            <div className="timeline-item relative">
              <div className="timeline-badge bg-primary">2</div>
              <h4>Find & Message Tutors</h4>
              <p className="text-sm text-muted-foreground">Search by subject and open a direct chat conversation. Book custom class times on the tutor's calendar.</p>
            </div>
            <div className="timeline-item relative">
              <div className="timeline-badge bg-primary">3</div>
              <h4>Attend Sessions & Sync Attendance</h4>
              <p className="text-sm text-muted-foreground">Review session history and class resources. Ensure attendance checklists are kept above criteria targets.</p>
            </div>
            <div className="timeline-item relative">
              <div className="timeline-badge bg-primary">4</div>
              <h4>Track Progress & Grow Finances</h4>
              <p className="text-sm text-muted-foreground">Input daily savings targets, monitor expense distributions, and focus on studying.</p>
            </div>
            <div className="timeline-item relative">
              <div className="timeline-badge bg-primary">5</div>
              <h4>Connect Alumni & Secure Referrals</h4>
              <p className="text-sm text-muted-foreground">Search alumni verifiers inside the corporate listing and submit resume applications for company jobs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 PLATFORM SCREENSHOT PREVIEWS: LAPTOP, TABLET & MOBILE */}
      <section className="uc-section uc-previews bg-secondary/15">
        <div className="uc-section-header">
          <h2>Interactive Module Preview</h2>
          <p>Take a peek inside the actual dashboard and tools running live on UniConnect.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center gap-3 mb-8">
          <button 
            onClick={() => setActivePreviewTab("laptop")}
            className={cn("px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-border/60", activePreviewTab === "laptop" ? "bg-primary text-white" : "bg-card text-foreground")}
          >
            <Laptop className="w-4 h-4" /> Laptop: Dashboard
          </button>
          <button 
            onClick={() => setActivePreviewTab("tablet")}
            className={cn("px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-border/60", activePreviewTab === "tablet" ? "bg-primary text-white" : "bg-card text-foreground")}
          >
            <Tablet className="w-4 h-4" /> Tablet: Tutorials & Chat
          </button>
          <button 
            onClick={() => setActivePreviewTab("mobile")}
            className={cn("px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-border/60", activePreviewTab === "mobile" ? "bg-primary text-white" : "bg-card text-foreground")}
          >
            <Smartphone className="w-4 h-4" /> Mobile: Referrals & Expenses
          </button>
        </div>

        {/* Device frame container */}
        <div className="device-mockup-wrapper max-w-4xl mx-auto flex items-center justify-center p-4">
          
          {/* Laptop Mockup */}
          {activePreviewTab === "laptop" && (
            <div className="laptop-mockup w-full">
              <div className="laptop-screen bg-slate-900 border-4 border-slate-700 rounded-t-xl overflow-hidden shadow-2xl relative">
                {/* Simulated browser navbar */}
                <div className="browser-header bg-slate-800/80 px-4 py-2 flex items-center gap-2 border-b border-border/20">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <div className="flex-1 max-w-xs mx-auto bg-slate-950/60 text-[10px] text-slate-400 py-0.5 rounded px-3 truncate text-center select-none">
                    uniconnect.com/student/dashboard
                  </div>
                </div>
                
                {/* Simulated Student Dashboard Content */}
                <div className="browser-content p-4 text-left text-xs text-slate-300 min-h-[300px]">
                  <div className="flex justify-between items-center mb-4 border-b border-border/10 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">👨‍🎓 Student Dashboard</h4>
                      <p className="text-[10px] text-slate-400">Welcome back, Anaya Sharma</p>
                    </div>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold border border-primary/25">IT Branch</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-800/60 rounded-[var(--radius-sm)] border border-border/10">
                      <span className="text-[10px] text-slate-400">Class Attendance</span>
                      <strong className="block text-sm text-emerald-400 mt-1">84.5%</strong>
                      <span className="text-[8px] text-slate-500">Above criteria target (75%)</span>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-[var(--radius-sm)] border border-border/10">
                      <span className="text-[10px] text-slate-400">Active Bookings</span>
                      <strong className="block text-sm text-[var(--primary)] mt-1">3 Upcoming</strong>
                      <span className="text-[8px] text-slate-500">Next class tomorrow at 3 PM</span>
                    </div>
                    <div className="p-3 bg-slate-800/60 rounded-[var(--radius-sm)] border border-border/10">
                      <span className="text-[10px] text-slate-400">Remaining Budget</span>
                      <strong className="block text-sm text-rose-400 mt-1">$245.50</strong>
                      <span className="text-[8px] text-slate-500">Goal alert: 82% spent</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-slate-800/40 rounded-[var(--radius-sm)] border border-border/10">
                    <h5 className="font-semibold text-white mb-2 text-[11px]">🔔 System Alerts & Notifications</h5>
                    <div className="space-y-1.5">
                      <div className="p-1.5 bg-slate-900/60 rounded text-[9px] flex justify-between border-l-2 border-l-indigo-500">
                        <span>New tutor message from Rohan Mehta (Math)</span>
                        <span className="text-slate-500">2 mins ago</span>
                      </div>
                      <div className="p-1.5 bg-slate-900/60 rounded text-[9px] flex justify-between border-l-2 border-l-cyan-400">
                        <span>Internship Referral Active: Software Intern at Stripe</span>
                        <span className="text-slate-500">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Keyboard/Stand part of laptop */}
              <div className="laptop-base bg-slate-700 h-3 w-[105%] -ml-[2.5%] rounded-b-xl border-t border-slate-600 shadow-xl"></div>
            </div>
          )}

          {/* Tablet Mockup */}
          {activePreviewTab === "tablet" && (
            <div className="tablet-mockup w-[80%] max-w-lg bg-slate-900 border-[8px] border-slate-700 rounded-[var(--radius-xl)] overflow-hidden shadow-2xl relative">
              {/* Speaker & camera dots */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full"></div>
              
              {/* Browser Header */}
              <div className="browser-header bg-slate-800/80 px-4 py-2 flex justify-between items-center border-b border-border/20 pt-4">
                <span className="text-[8px] text-slate-500">uniconnect.com/tutorials/chat</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
              </div>

              {/* Tablet Content */}
              <div className="tablet-content p-4 text-left text-xs text-slate-300 min-h-[300px]">
                <h4 className="font-bold text-white text-sm mb-3">📚 Tutorials & Class Chat</h4>
                
                <div className="grid grid-cols-5 gap-3">
                  {/* Left contacts list */}
                  <div className="col-span-2 border-r border-border/10 pr-2 space-y-1.5">
                    <div className="p-1.5 bg-[var(--primary)]/20 text-white rounded text-[10px] font-semibold">
                      Dr. Rohan Mehta
                      <span className="block text-[7px] text-[var(--primary)] font-normal">Active Class Session</span>
                    </div>
                    <div className="p-1.5 bg-slate-800/40 rounded text-[10px]">
                      Prof. Priya Nair
                      <span className="block text-[7px] text-slate-500">Seen yesterday</span>
                    </div>
                  </div>

                  {/* Right Chat Area */}
                  <div className="col-span-3 flex flex-col justify-between h-[180px] bg-slate-950/45 p-2 rounded-[var(--radius-sm)] border border-border/10">
                    <div className="chat-messages space-y-2 overflow-y-auto">
                      <div className="p-1.5 bg-slate-800/80 rounded max-w-[85%] text-[9px] self-start">
                        Hi Anaya, did you review the tutorial notes on recursion algorithms?
                      </div>
                      <div className="p-1.5 bg-[var(--primary)] rounded max-w-[85%] text-[9px] text-white self-end ml-auto text-right">
                        Yes Prof, I checked the PDF slides. Can we schedule a doubt session?
                      </div>
                    </div>
                    <div className="mt-2 p-1 bg-slate-900 border border-border/20 rounded flex items-center justify-between">
                      <span className="text-[8px] text-slate-500">Type a message...</span>
                      <span className="text-[8px] text-white bg-primary px-1.5 py-0.5 rounded">SEND</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2 bg-slate-800/50 rounded-[var(--radius-sm)] border border-border/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <strong>Recent Booked Classes</strong>
                    <span className="text-[8px] text-emerald-400 font-semibold">ALL COMPLETED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Mockup */}
          {activePreviewTab === "mobile" && (
            <div className="mobile-mockup w-[55%] max-w-sm bg-slate-900 border-[10px] border-slate-700 rounded-[36px] overflow-hidden shadow-2xl relative">
              {/* Speaker notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-slate-700 rounded-full z-10 flex items-center justify-center">
                <span className="w-6 h-0.5 bg-slate-600 rounded-full"></span>
              </div>

              {/* Content */}
              <div className="mobile-content p-4 text-left text-xs text-slate-300 min-h-[300px] pt-8">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-border/15 pb-2 mb-3">
                  <strong className="text-white text-xs">💼 Career Referrals</strong>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                {/* Job opportunities feed */}
                <div className="space-y-2 mb-4">
                  <div className="p-2 bg-slate-800/80 rounded border border-border/10">
                    <div className="flex justify-between items-start">
                      <strong className="text-[10px] text-white">Software Intern</strong>
                      <span className="text-[7px] bg-cyan-500/20 text-cyan-400 px-1 rounded border border-cyan-400/25">Google</span>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1">Verified alumni referral available from Siddharth Sen.</p>
                  </div>
                  <div className="p-2 bg-slate-800/80 rounded border border-border/10">
                    <div className="flex justify-between items-start">
                      <strong className="text-[10px] text-white">UI/UX Associate</strong>
                      <span className="text-[7px] bg-[var(--primary)]/20 text-[var(--primary)] px-1 rounded border border-[var(--primary)]/30/25">Stripe</span>
                    </div>
                    <p className="text-[8px] text-slate-400 mt-1">Verified alumni referral available from Rahul K.</p>
                  </div>
                </div>

                {/* Expenses logger widget */}
                <div className="p-2 bg-slate-950/60 rounded-[var(--radius-sm)] border border-border/10">
                  <strong className="text-[9px] text-white block mb-1">💰 Spend Log</strong>
                  <div className="flex justify-between text-[8px] border-b border-border/5 py-1">
                    <span>Dinner at Cafeteria</span>
                    <span className="text-rose-400">-$12.40</span>
                  </div>
                  <div className="flex justify-between text-[8px] py-1">
                    <span>Train ticket subscription</span>
                    <span className="text-rose-400">-$45.00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 🚀 TESTIMONIALS SECTION */}
      <section id="testimonials" className="uc-section uc-testimonials">
        <div className="uc-section-header">
          <h2>Loved by Students, Faculty, and Alumni</h2>
          <p>Read review stories from members of the UniConnect community.</p>
        </div>

        {/* Categories filters */}
        <div className="flex justify-center gap-2 mb-8 select-none flex-wrap">
          {["all", "student", "tutor", "alumni"].map((cat) => (
            <button
              key={cat}
              onClick={() => setTestimonialCategory(cat)}
              className={cn("px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer border border-border/50 transition-all", testimonialCategory === cat ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground hover:text-foreground")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel Component */}
        <div className="testimonial-carousel max-w-xl mx-auto glass-panel p-6 sm:p-8 text-center relative">
          
          {filteredTestimonials.length === 0 ? (
            <div className="py-8 text-muted-foreground text-sm">No reviews available in this category.</div>
          ) : (
            <div className="carousel-slide transition-opacity duration-300">
              <div className="flex justify-center mb-3 text-amber-500">
                {Array.from({ length: filteredTestimonials[testimonialIdx]?.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base italic text-foreground leading-relaxed mb-6 font-medium">
                &quot;{filteredTestimonials[testimonialIdx]?.content}&quot;
              </blockquote>
              <div className="flex justify-center items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary border border-primary/25 font-bold text-xs flex items-center justify-center uppercase">
                  {filteredTestimonials[testimonialIdx]?.avatarText}
                </div>
                <div className="text-left">
                  <strong className="block text-sm text-foreground">{filteredTestimonials[testimonialIdx]?.name}</strong>
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    {filteredTestimonials[testimonialIdx]?.branch} • {filteredTestimonials[testimonialIdx]?.year}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Manual next/prev arrow buttons */}
          {filteredTestimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => setTestimonialIdx(prev => prev === 0 ? filteredTestimonials.length - 1 : prev - 1)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-pointer bg-card text-xs font-bold"
                aria-label="Previous review"
              >
                {"<"}
              </button>
              <button 
                onClick={() => setTestimonialIdx(prev => prev === filteredTestimonials.length - 1 ? 0 : prev + 1)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all cursor-pointer bg-card text-xs font-bold"
                aria-label="Next review"
              >
                {">"}
              </button>
            </div>
          )}

          {/* Dots Indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {filteredTestimonials.map((_, i) => (
              <span 
                key={i} 
                onClick={() => setTestimonialIdx(i)}
                className={cn("w-1.5 h-1.5 rounded-full transition-all cursor-pointer", testimonialIdx === i ? "bg-primary w-3" : "bg-border")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 ABOUT US & COUNT-UP STATS SECTION */}
      <section id="about" className="uc-section uc-about" ref={statsRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Mission & Vision Copy */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission & Vision</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We empower students to succeed in university life by unifying essential resources into a single central operating system. No student should struggle finding academic support, planning budget lines, or applying for jobs.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/10 border border-border/30 rounded-[var(--radius-md)]">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-[var(--primary)]" /> Simplicity
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1">An elegant student-tutor workflow dashboard designed to operate smoothly.</p>
              </div>
              <div className="p-4 bg-secondary/10 border border-border/30 rounded-[var(--radius-md)]">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" /> Accessibility
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1">A highly accessible interface with WCAG AA compliance and light/dark theme toggles.</p>
              </div>
              <div className="p-4 bg-secondary/10 border border-border/30 rounded-[var(--radius-md)]">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" /> Innovation
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1">Real-time socket alerts, custom charts, and direct verifier referral channels.</p>
              </div>
              <div className="p-4 bg-secondary/10 border border-border/30 rounded-[var(--radius-md)]">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--primary)]" /> Community
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1">Bringing students, faculty tutors, and alumni together into a single hub.</p>
              </div>
            </div>
          </div>

          {/* Stats grid triggered by viewport count-up hook */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-card border border-border rounded-[var(--radius-md)] text-center shadow-sm">
              <strong className="block text-2xl sm:text-3xl font-extrabold text-primary">
                {studentsCount.toLocaleString()}+
              </strong>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Students Supported</span>
            </div>
            <div className="p-5 bg-card border border-border rounded-[var(--radius-md)] text-center shadow-sm">
              <strong className="block text-2xl sm:text-3xl font-extrabold text-[var(--primary)]">
                {tutorsCount.toLocaleString()}+
              </strong>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Vetted Tutors</span>
            </div>
            <div className="p-5 bg-card border border-border rounded-[var(--radius-md)] text-center shadow-sm col-span-2">
              <strong className="block text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {sessionsCount.toLocaleString()}+
              </strong>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Tutorial Sessions Booked</span>
            </div>
            <div className="p-5 bg-card border border-border rounded-[var(--radius-md)] text-center shadow-sm">
              <strong className="block text-2xl sm:text-3xl font-extrabold text-cyan-400">
                {referralsCount.toLocaleString()}+
              </strong>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Referrals Shared</span>
            </div>
            <div className="p-5 bg-card border border-border rounded-[var(--radius-md)] text-center shadow-sm">
              <strong className="block text-2xl sm:text-3xl font-extrabold text-[var(--primary)]">
                {satisfactionCount}%
              </strong>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">User Satisfaction</span>
            </div>
            <div className="p-5 bg-card border border-border rounded-[var(--radius-md)] text-center shadow-sm col-span-2">
              <strong className="block text-2xl sm:text-3xl font-extrabold text-amber-500">
                {mentorsCount}+
              </strong>
              <span className="text-xs text-muted-foreground font-semibold mt-1 block">Active Alumni Mentors</span>
            </div>
          </div>

        </div>
      </section>

      {/* 🚀 FAQ ACCORDION SECTION */}
      <section id="faq" className="uc-section uc-faq bg-secondary/10">
        <div className="uc-section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about the UniConnect student platform.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                className="faq-panel border border-border rounded-[var(--radius-md)] overflow-hidden bg-card transition-all"
                key={idx}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center font-bold text-sm text-foreground focus:outline-none focus:bg-secondary/20 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4.5 h-4.5 text-muted-foreground transition-transform duration-300", isOpen ? "rotate-180" : "")} />
                </button>
                <div 
                  className="faq-answer-container transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "150px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden"
                  }}
                >
                  <p className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🚀 CTA: TRANSFORM YOUR STUDENT JOURNEY */}
      <section className="uc-section uc-cta">
        <div className="cta-gradient-box glass-panel p-8 sm:p-12 max-w-4xl mx-auto text-center relative overflow-hidden rounded-[var(--radius-lg)] border border-primary/25">
          {/* Animated gradient blob background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-indigo-500/5 to-cyan-500/10 z-0 pointer-events-none"></div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4 relative z-10">
            Start Building Your Academic Success Story
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8 relative z-10 leading-relaxed">
            Join thousands of university students matching with tutors, securing corporate job referrals, and planning budgets today on UniConnect.
          </p>
          <div className="flex justify-center gap-4 relative z-10 select-none">
            <Link className="uc-primary-button px-8" to="/role-selection">
              Get Started Free
            </Link>
            <a className="uc-secondary-button px-6 bg-card" href="#features">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* 🚀 EXPANDED FOOTER SECTION */}
      <footer className="uc-footer bg-card border-t border-border mt-16 px-6 py-12">
        <div className="max-w-5xl mx-auto uc-footer-grid-audit gap-8 text-left text-xs mb-8">
          
          {/* Col 1 Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <span className="w-6 h-6 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">U</span>
              <span>UniConnect</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              The central operating system for student success. Unifying tutoring, attendance, and placement networks.
            </p>
          </div>

          {/* Col 2 Platform Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Platform</h5>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><Link to="/role-selection" className="hover:text-primary transition-colors">Tutors Match</Link></li>
              <li><Link to="/role-selection" className="hover:text-primary transition-colors">Referrals Hub</Link></li>
              <li><Link to="/role-selection" className="hover:text-primary transition-colors">Alumni Directory</Link></li>
            </ul>
          </div>

          {/* Col 3 Resources Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Resources</h5>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="mailto:support@uniconnect.com" className="hover:text-primary transition-colors flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Support Email</a></li>
              <li className="flex items-start gap-1"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> University Campus Hub</li>
              <li className="flex items-start gap-1"><Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Mon–Fri, 9AM-5PM</li>
            </ul>
          </div>

          {/* Col 4 Legal Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Legal</h5>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link to="/role-selection" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/role-selection" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Socials & copyright */}
        <div className="max-w-5xl mx-auto pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} UniConnect Platform. All rights reserved.</span>
          <div className="flex gap-4 select-none">
            <a href="https://linkedin.com/company/uniconnect" target="_blank" rel="noreferrer" className="hover:text-primary flex items-center gap-1 transition-colors">
              <Award className="w-3.5 h-3.5" /> LinkedIn
            </a>
            <a href="https://github.com/uniconnect" target="_blank" rel="noreferrer" className="hover:text-primary flex items-center gap-1 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export function RoleSelectionPage() {
  return (
    <main className="uc-auth-shell">
      <Brand />
      <section className="uc-role-panel">
        <h1>Choose how you want to continue</h1>
        <div className="uc-role-list">
          {roles?.map((role) => {
            const Icon = role.icon;
            return (
              <Link className="uc-role-card" to={role.loginTo} key={role.id}>
                <span className="uc-role-avatar"><Icon /></span>
                <span>
                  <strong>{role.title}</strong>
                  <small>{role.description}</small>
                </span>
                <span className="uc-arrow">{"->"}</span>
              </Link>
            );
          })}
        </div>
        <p className="uc-auth-switch">
          Already have an account? <Link to="/login/student">Login</Link>
        </p>
      </section>
    </main>
  );
}

export function RoleAuthPage({ mode = "login" }) {
  const { role } = useParams();
  const normalizedRole = role;

  if (normalizedRole === "student") {
    return mode === "signup" ? <StudentSignupFlow /> : <StudentLoginFlow />;
  }

  if (normalizedRole === "teacher" || normalizedRole === "tutor") {
    return mode === "signup" ? <TutorRegisterPage /> : <TutorLoginPage />;
  }

  if (normalizedRole === "alumni") {
    return mode === "signup" ? <AlumniSignupFlow /> : <AlumniLoginFlow />;
  }



  if (normalizedRole === "tutor") {
    return mode === "signup" ? <TutorRegisterPage /> : <TutorLoginPage />;
  }

  return <Navigate to="/role-selection" replace />;
}

function RoleAuthShell({
  role,
  mode,
  title,
  subtitle,
  icon: Icon,
  form,
  fields,
  submitText,
  submittingText,
  switchText,
  switchTo,
  switchLabel,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    await form.handleSubmit();
  };

  return (
    <main className="uc-login-page">
      <div className="uc-login-card">
        <Link to="/role-selection" className="uc-back-link">
          <span>{"<-"}</span>
          Back to role selection
        </Link>

        <section className="uc-login-panel" aria-labelledby={`${role}-${mode}-title`}>
          <div className="uc-login-icon">
            <Icon />
          </div>
          <h1 id={`${role}-${mode}-title`}>{title}</h1>
          <p>{subtitle}</p>

          {form.submitError && (
            <div className="uc-form-error" role="alert">
              {form.submitError}
            </div>
          )}

          <form onSubmit={onSubmit} className="uc-login-form">
            <div className={fields.length > 4 ? "uc-field-grid" : ""}>
              {fields?.map((field) => (
                <label key={field.name} className="uc-field">
                  <span>{field.label}</span>
                  <div className="relative w-full">
                    <input
                      type={field.type === "password" ? (showPassword ? "text" : "password") : field.type}
                      value={form.data[field.name] || ""}
                      placeholder={field.placeholder}
                      disabled={form.isSubmitting}
                      onChange={(event) => form.setField(field.name, event.target.value)}
                      className={field.type === "password" ? "pr-12 w-full" : "w-full"}
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none text-xs font-semibold select-none cursor-pointer"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </button>
                    )}
                  </div>
                  {field.name === "password" && mode === "login" && (
                    <div className="flex justify-end mt-1">
                      <Link
                        to={`/forgot-password?role=${role}`}
                        className="text-xs text-[var(--primary)] hover:text-indigo-300 font-semibold transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                  {form.errors[field.name] && (
                    <small>{form.errors[field.name]}</small>
                  )}
                </label>
              ))}
            </div>

            {mode === "login" && (
              <label className="flex items-center gap-2 mt-2 mb-4 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-indigo-950/60 bg-indigo-950/20 text-[var(--primary)] focus:ring-[var(--primary)]/20/50 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            )}

            <button type="submit" className="uc-login-submit" disabled={form.isSubmitting}>
              {form.isSubmitting && <Loader2 className="uc-spin" />}
              {form.isSubmitting ? submittingText : submitText}
            </button>
          </form>

          {(role === "student" || role === "alumni") && (
            <>
              <div className="uc-social-separator my-5 flex items-center justify-center gap-3 w-full">
                <span className="h-[1px] bg-slate-800 flex-grow"></span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or continue with</span>
                <span className="h-[1px] bg-slate-800 flex-grow"></span>
              </div>
              <div className="uc-social-buttons flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => window.location.href = `http://localhost:8000/api/v1/student/auth/google?role=${role}`}
                  className="uc-social-btn flex-grow py-2.5 px-4 rounded-[var(--radius-md)] border border-indigo-950/60 bg-indigo-950/20 text-sm font-semibold text-slate-300 hover:bg-indigo-950/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = `http://localhost:8000/api/v1/student/auth/github?role=${role}`}
                  className="uc-social-btn flex-grow py-2.5 px-4 rounded-[var(--radius-md)] border border-indigo-950/60 bg-indigo-950/20 text-sm font-semibold text-slate-300 hover:bg-indigo-950/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="uc-login-switch">
            {switchText} <Link to={switchTo}>{switchLabel}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function StudentLoginFlow() {
  const form = useStudentLogin();
  return (
    <RoleAuthShell
      role="student"
      mode="login"
      title="Welcome Back, Student"
      subtitle="Login to continue to your dashboard."
      icon={GraduationCap}
      form={form}
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "name@email.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
      ]}
      submitText="Login"
      submittingText="Logging in..."
      switchText="New here?"
      switchTo="/signup/student"
      switchLabel="Sign up as Student"
    />
  );
}

function StudentSignupFlow() {
  const form = useStudentSignup();
  return (
    <RoleAuthShell
      role="student"
      mode="signup"
      title="Create Student Account"
      subtitle="Sign up to access tutors, attendance, expenses and referrals."
      icon={GraduationCap}
      form={form}
      fields={[
        { name: "firstName", label: "First Name", type: "text", placeholder: "Anaya" },
        { name: "lastName", label: "Last Name", type: "text", placeholder: "Sharma" },
        { name: "email", label: "Email", type: "email", placeholder: "name@email.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
        { name: "collegeName", label: "College Name", type: "text", placeholder: "e.g. Stanford University" },
      ]}
      submitText="Sign up"
      submittingText="Creating account..."
      switchText="Already have an account?"
      switchTo="/login/student"
      switchLabel="Login"
    />
  );
}

function AlumniLoginFlow() {
  const form = useAlumniLogin();
  return (
    <RoleAuthShell
      role="alumni"
      mode="login"
      title="Welcome Back, Alumni"
      subtitle="Login to post opportunities and manage referrals."
      icon={Briefcase}
      form={form}
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "name@company.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
      ]}
      submitText="Login"
      submittingText="Logging in..."
      switchText="New here?"
      switchTo="/signup/alumni"
      switchLabel="Sign up as Alumni"
    />
  );
}

function AlumniSignupFlow() {
  const form = useAlumniSignup();
  return (
    <RoleAuthShell
      role="alumni"
      mode="signup"
      title="Create Alumni Account"
      subtitle="Sign up to create referrals and verify student opportunities."
      icon={Briefcase}
      form={form}
      fields={[
        { name: "firstName", label: "First Name", type: "text", placeholder: "Rohan" },
        { name: "lastName", label: "Last Name", type: "text", placeholder: "Mehta" },
        { name: "email", label: "Email", type: "email", placeholder: "name@company.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
        { name: "collegeName", label: "College Name", type: "text", placeholder: "e.g. Stanford University" },
        { name: "company", label: "Company", type: "text", placeholder: "Company" },
        { name: "jobTitle", label: "Job Title", type: "text", placeholder: "Job title" },
      ]}
      submitText="Sign up"
      submittingText="Creating account..."
      switchText="Already have an account?"
      switchTo="/login/alumni"
      switchLabel="Login"
    />
  );
}

// StudentOverviewDashboard has been permanently removed and replaced by StudentDashboard.jsx

