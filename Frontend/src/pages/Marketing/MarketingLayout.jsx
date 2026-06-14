import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { Mail, Send, Check, AlertCircle, ChevronDown, ChevronUp, Star, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Brand() {
  return (
    <Link to="/" className="uc-brand" aria-label="UniConnect home">
      <span className="uc-brand-mark">U</span>
      <span className="font-bold text-foreground">UniConnect</span>
    </Link>
  );
}

export default function MarketingLayout() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Footer interactive states
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Quick Contact Form States
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const faqs = [
    { q: "What is UniConnect?", a: "An all-in-one student operating system unifying tutor matchmaking, analytics, budgets, and alumni networks." },
    { q: "How do Tutorials work?", a: "Match with tutors, book live calendar slots, and converse in real-time." },
    { q: "How secure is the platform?", a: "We protect accounts using secure JWT sessions, bcrypt passwords, and encrypted database fields." }
  ];

  const testimonials = [
    { text: "Helped me secure an internship!", author: "Priya S. (Alumni Referral)" },
    { text: "My grades jumped by 15% using tutor match.", author: "James K. (Tutorials)" },
    { text: "Saved over $200 in my first month tracking expenses.", author: "Sarah L. (Expenses)" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cycle testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setSending(true);
    setErrorMsg("");
    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setErrorMsg(data.message || "Failed to submit message.");
      }
    } catch (err) {
      setErrorMsg("Error sending message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const renderBreadcrumbs = () => {
    if (location.pathname === "/" || location.pathname === "") return null;
    
    return (
      <nav aria-label="breadcrumb" className="container mx-auto px-6 py-3 text-xs text-muted-foreground select-none">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const label = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
            
            return (
              <React.Fragment key={to}>
                <li className="text-muted-foreground/50">/</li>
                <li className={last ? "text-foreground font-semibold" : ""}>
                  {last ? (
                    <span>{label}</span>
                  ) : (
                    <Link to={to} className="hover:text-primary transition-colors">{label}</Link>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-[68px] md:pb-[76px]">
      {/* 🚀 SHARED NAVBAR WITH SCROLL STATE */}
      <nav 
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between border-b ${
          isScrolled 
            ? "bg-[var(--glass-bg)] backdrop-blur-md border-[var(--border-color)] shadow-[var(--shadow-sm)] py-3.5" 
            : "bg-transparent border-transparent"
        }`} 
        role="navigation" 
        aria-label="Main menu"
      >
        <Brand />
        <div className="uc-navlinks hidden md:flex items-center gap-8">
          <NavLink to="/" end className={({ isActive }) => `text-sm font-semibold transition-colors nav-underline-anim ${isActive ? "text-primary active" : "text-muted-foreground hover:text-primary"}`}>Home</NavLink>
          <NavLink to="/features" className={({ isActive }) => `text-sm font-semibold transition-colors nav-underline-anim ${isActive ? "text-primary active" : "text-muted-foreground hover:text-primary"}`}>Features</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => `text-sm font-semibold transition-colors nav-underline-anim ${isActive ? "text-primary active" : "text-muted-foreground hover:text-primary"}`}>How It Works</NavLink>
          <NavLink to="/about" className={({ isActive }) => `text-sm font-semibold transition-colors nav-underline-anim ${isActive ? "text-primary active" : "text-muted-foreground hover:text-primary"}`}>About</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link className="hidden md:inline-flex uc-btn-primary animate-pulse" to="/role-selection">
            Get Started
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-[var(--radius-sm)] bg-secondary/50 md:hidden transition-colors border border-border/40"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* spacer to prevent content shift since navbar is fixed */}
      <div className="h-[76px] w-full" />

      {/* Dynamic Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* 🚀 NESTED PAGES CONTENT WRAPPER */}
      <main className="flex-grow w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 🚀 MOBILE NAVIGATION SLIDE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-background border-l border-border z-50 p-6 flex flex-col justify-between md:hidden shadow-[var(--shadow-lg)]"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <Brand />
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-[var(--radius-sm)] bg-secondary/50 border border-border/40 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col gap-4 pt-2">
                  <NavLink 
                    to="/" 
                    end 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `text-sm font-semibold py-2 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Home
                  </NavLink>
                  <NavLink 
                    to="/features" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `text-sm font-semibold py-2 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Features
                  </NavLink>
                  <NavLink 
                    to="/how-it-works" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `text-sm font-semibold py-2 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    How It Works
                  </NavLink>
                  <NavLink 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `text-sm font-semibold py-2 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    About
                  </NavLink>
                </div>
              </div>
              
              <div className="border-t border-border/60 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
                <Link 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block py-2.5 bg-primary text-white rounded-[var(--radius-sm)] text-sm font-semibold hover:bg-primary-hover transition-colors shadow-[var(--shadow-md)]" 
                  to="/role-selection"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🚀 CONSOLIDATED COMPACT PREMIUM FOOTER (280px-350px height) */}
      <footer className="uc-footer bg-[var(--card-bg)] border-t border-[var(--border-color)] mt-16 px-space-md md:px-space-lg py-space-lg w-full text-xs text-[var(--text-secondary)]">
        <div className="max-w-[1600px] mx-auto uc-footer-grid-audit gap-space-lg text-left mb-space-lg">
          {/* Section 1: About UniConnect */}
          <div className="space-y-3">
            <h5 className="font-bold text-foreground text-sm uppercase tracking-wider">About UniConnect</h5>
            <p className="text-muted-foreground leading-relaxed text-[11px] max-w-sm">
              UniConnect is an all-in-one student platform that helps students manage academics, connect with tutors, track attendance, monitor expenses, discover referrals, and build professional alumni networks.
            </p>
            {/* Social SVGs */}
            <div className="flex gap-2.5 pt-1">
              <a href="https://twitter.com/uniconnect" target="_blank" rel="noreferrer" className="p-1.5 bg-secondary hover:bg-secondary/80 border border-border/60 rounded text-muted-foreground hover:text-primary transition-all" aria-label="Twitter">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com/uniconnect" target="_blank" rel="noreferrer" className="p-1.5 bg-secondary hover:bg-secondary/80 border border-border/60 rounded text-muted-foreground hover:text-primary transition-all" aria-label="GitHub">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/uniconnect" target="_blank" rel="noreferrer" className="p-1.5 bg-secondary hover:bg-secondary/80 border border-border/60 rounded text-muted-foreground hover:text-primary transition-all" aria-label="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Section 2: Quick FAQs (Accordion) */}
          <div className="space-y-3">
            <h5 className="font-bold text-foreground text-sm uppercase tracking-wider">Quick FAQs</h5>
            <div className="space-y-1.5">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-border/50 rounded-[var(--radius-sm)] overflow-hidden bg-background/50">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-[11px] text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {activeFaq === idx ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-3 pb-2 text-[10px] text-muted-foreground leading-normal border-t border-border/20 pt-1.5 bg-secondary/10 font-normal">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Success Stories (Testimonials) */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-foreground text-sm uppercase tracking-wider">Success Stories</h5>
              <div className="relative overflow-hidden h-[74px] mt-1.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col justify-center bg-background/40 border border-border/40 p-2.5 rounded-[var(--radius-sm)]"
                  >
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                    <p className="text-[10.5px] italic text-foreground leading-snug font-medium line-clamp-2">
                      "{testimonials[activeTestimonial].text}"
                    </p>
                    <span className="text-[9px] text-primary font-bold mt-1 block">
                      — {testimonials[activeTestimonial].author}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* Quick Site Links */}
            <div className="flex gap-3 text-[10px] text-muted-foreground pt-2 font-medium">
              <Link to="/gallery" className="hover:text-primary transition-colors">Platform Gallery</Link>
              <span>•</span>
              <Link to="/updates" className="hover:text-primary transition-colors">Release Updates</Link>
              <span>•</span>
              <Link to="/security" className="hover:text-primary transition-colors">Security Details</Link>
            </div>
          </div>

          {/* Section 4: Quick Contact Form */}
          <div className="space-y-3">
            <h5 className="font-bold text-foreground text-sm uppercase tracking-wider">Quick Contact</h5>
            <form onSubmit={handleContactSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-2.5 py-1 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="px-2.5 py-1 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-2.5 py-1 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              <div className="relative flex items-center">
                <textarea
                  placeholder="Message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="1"
                  className="w-full pl-2.5 pr-8 py-1 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="absolute right-1 text-primary hover:text-primary-hover transition-colors p-1"
                  aria-label="Send Inquiry"
                >
                  {sending ? (
                    <span className="w-3 h-3 border border-t-transparent border-primary rounded-full animate-spin block" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {success && (
                <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Inquiry sent! We'll reply soon.
                </div>
              )}
              {errorMsg && (
                <div className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="max-w-7xl mx-auto pt-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-muted-foreground font-medium">
          <span>&copy; {new Date().getFullYear()} UniConnect Platform. Unifying student life.</span>
          <div className="flex gap-3 items-center">
            <span>Version 1.2.0</span>
            <span>•</span>
            <Link to="/about" className="hover:text-primary transition-colors">About Team</Link>
            <span>•</span>
            <Link to="/architecture" className="hover:text-primary transition-colors font-bold text-foreground">Architecture View</Link>
          </div>
        </div>
      </footer>

      {/* 🚀 STICKY BOTTOM CTA BAR (Desktop Only) */}
      <div className="sticky-cta-bar select-none">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">UniConnect Operating System - Start boosting academic performance today.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/features" className="px-4 py-1.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded text-xs font-bold transition-all hover:border-primary">
            Explore Features
          </Link>
          <Link to="/role-selection" className="px-4.5 py-1.5 bg-primary text-white rounded text-xs font-black hover:bg-primary-hover transition-colors shadow-[var(--shadow-md)] flex items-center gap-1.5">
            Join UniConnect <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
