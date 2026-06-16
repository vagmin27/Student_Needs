import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Smile, 
  Heart, 
  Lightbulb, 
  Users, 
  Cpu, 
  Database, 
  Shield, 
  Layers, 
  Layout, 
  ArrowRight, 
  CheckCircle2, 
  Milestone 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const [selectedTech, setSelectedTech] = useState("react");

  useEffect(() => {
    document.title = "About UniConnect - Project Showcase & Architecture";
  }, []);

  const techStack = {
    react: {
      name: "React.js & Vite",
      desc: "Powers the client UI layer, featuring modular state management, lazy loading, and reactive component lifecycles.",
      role: "Client-Side SPA Architecture"
    },
    node: {
      name: "Node.js Environment",
      desc: "Executes the backend engine, orchestrating asynchronous requests and handling server-level task runners.",
      role: "Asynchronous Runtime"
    },
    express: {
      name: "Express.js Router",
      desc: "Serves endpoints for Tutor Matching, JWT Session verification, Expense Ledgers, and Contact Message inputs.",
      role: "RESTful HTTP API Router"
    },
    mongodb: {
      name: "MongoDB & Mongoose",
      desc: "Stores student credentials, class attendances, financial trackers, and contact messages in schema-enforced structures.",
      role: "NoSQL Database Storage"
    },
    lenis: {
      name: "Lenis Smooth Scroll",
      desc: "Enforces smooth, inertia-driven page movements across marketing layouts, improving readability and presentation.",
      role: "Web Scrolling Experience"
    },
    framer: {
      name: "Framer Motion",
      desc: "Calculates physics-based animations, page routing transitions, mobile side drawer slides, and interactive previews.",
      role: "Micro-animations Engine"
    }
  };

  return (
    <div className="uc-modern-section uc-modern-container text-left py-12 md:py-24">
      
      {/* 🚀 PAGE HEADER */}
      <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
        <span className="text-primary font-extrabold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Project Presentation
        </span>
        <h1 className="uc-section-heading mt-4 text-4xl md:text-6xl font-black text-foreground tracking-tight">
          Unifying Student Operations
        </h1>
        <p className="uc-subheading uc-long-form-text-audit mx-auto text-base text-muted-foreground text-center">
          {/* UniConnect was designed to solve the fragmentation of university life, replacing scattered sheets with a secure operating system. */}
        </p>
      </div>

      {/* 🚀 MISSION & VISION DECK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="glass-card-modern p-8 bg-gradient-to-tr from-primary/5 via-transparent to-transparent flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded">Our Mission</span>
            <h3 className="text-xl font-extrabold text-foreground mt-4 mb-3">Empower Academic Term Success</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To consolidate all critical student resources—tutoring rosters, budget calculators, class checklists, and corporate job referral pipelines—into a single high-contrast desktop and mobile environment.
            </p>
          </div>
          <div className="flex gap-2 items-center text-xs font-bold text-primary pt-4 select-none">
            Verified Success Framework <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
        
        <div className="glass-card-modern p-8 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-[var(--primary)] uppercase tracking-wider bg-[var(--primary)]/10 px-2.5 py-0.5 rounded">Our Vision</span>
            <h3 className="text-xl font-extrabold text-foreground mt-4 mb-3">Bridge the Career Placement Divide</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To build a seamless, community-driven channel where students collaborate with verified alumni mentors to refine resumes, conduct interview pre-screenings, and secure corporate placement.
            </p>
          </div>
          <div className="flex gap-2 items-center text-xs font-bold text-[var(--primary)] pt-4 select-none">
            Alumni Endorsement Pipelines <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 🚀 BACKSTORY: WHY UNICONNECT WAS BUILT */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">Why UniConnect Was Built</h2>
          <p className="text-sm text-muted-foreground leading-relaxed uc-long-form-text-audit">
            University academics can be highly overwhelming. Students navigate separate portals for logging attendances, searching tutors, organizing meal plans, and requesting job postings.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed uc-long-form-text-audit">
            UniConnect integrates these operations under a single account. Protected by secure JWT keys, students log financial transactions, match with peer mentors, and check attendance curves on one responsive dashboard.
          </p>
          <div className="flex gap-4 select-none pt-2">
            <Link to="/role-selection" className="uc-btn-primary">Get Started Now</Link>
            <Link to="/features" className="uc-btn-secondary">Explore All Modules</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Smile, title: "Student-First Design", desc: "No generic templates. Built with a dark-theme adaptive glassmorphic framework." },
            { icon: Heart, title: "Verification Checked", desc: "Tutors verify transcripts; alumni mentors verify email credentials." },
            { icon: Lightbulb, title: "Intelligent Warnings", desc: "Auto triggers alerts when budget drops or attendance curves warning states." },
            { icon: Users, title: "Unified Community", desc: "Fosters long-term networks spanning student juniors, peer tutors, and corporate seniors." }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 bg-card border border-border rounded-[var(--radius-md)] space-y-3 hover:border-primary/45 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🚀 INTERACTIVE TECH STACK EXPLORER */}
      <section className="mb-20 bg-secondary/10 border border-border/60 rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-sm)]">
        <div className="text-center mb-8 max-w-lg mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Interactive Platform Stack</h2>
          <p className="text-xs text-muted-foreground">Click a layer to inspect how the technology powers our operations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Tech selectors */}
          <div className="lg:col-span-2 space-y-2 select-none">
            {Object.keys(techStack).map((key) => (
              <button 
                key={key}
                onClick={() => setSelectedTech(key)}
                className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border text-xs font-bold transition-all flex items-center justify-between ${selectedTech === key ? "bg-primary text-white border-primary shadow" : "bg-card border-border/50 text-foreground hover:border-primary/50"}`}
              >
                <span>{techStack[key].name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            ))}
          </div>

          {/* Details screen */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedTech}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 bg-card border border-border rounded-[var(--radius-lg)] min-h-[180px] flex flex-col justify-between text-left"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">{techStack[selectedTech].role}</span>
                  <h3 className="text-xl font-extrabold text-foreground mt-2 mb-3">{techStack[selectedTech].name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{techStack[selectedTech].desc}</p>
                </div>
                <div className="flex gap-1.5 items-center text-[10px] font-bold text-emerald-500 pt-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Architecture Verified & Deployed
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 🚀 PLATFORM ARCHITECTURE PIPELINE */}
      <section className="mb-20">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center text-foreground tracking-tight mb-12">Security & Data Pipelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative select-none">
          {[
            { icon: Layout, title: "1. Client UI Layout", desc: "Responsive React layouts rendering dynamic CSS previews and sandboxes." },
            { icon: Shield, title: "2. JWT Authentication", desc: "Auth middleware intercepting API calls and verifying user roles." },
            { icon: Cpu, title: "3. Service Routers", desc: "API handlers query database models and processes calculations." },
            { icon: Database, title: "4. MongoDB Cluster", desc: "Secure schema collection sets validating user documents." }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 bg-card border border-border/75 rounded-[var(--radius-lg)] text-left space-y-3 relative">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🚀 DEVELOPMENT TIMELINE */}
      <section>
        <h2 className="text-2xl md:text-4xl font-extrabold text-center text-foreground tracking-tight mb-12">Development Roadmap</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            { year: "2025 Q1", title: "Project Core Planning", desc: "Created initial system flow charts to replace campus worksheets." },
            { year: "2025 Q3", title: "Private Alpha Launch", desc: "Onboarded initial student cohorts to test calendar slot bookings." },
            { year: "2026 Q1", title: "Version 1.0 Release", desc: "Deployed restful routers, JWT auth, and active alumni directories." },
            { year: "2026 Q2", title: "UX Refactoring v1.2", desc: "Completed premium dashboard previews, mobile navigation slides, and footer forms." }
          ].map((item, idx) => (
            <div key={idx} className="p-6 glass-card-modern border-l-4 border-l-primary flex flex-col justify-between min-h-[150px]">
              <span className="text-xs font-black text-primary uppercase tracking-widest">{item.year}</span>
              <div className="mt-4">
                <h4 className="font-bold text-sm text-foreground mb-1">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
