import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const screenshotsData = [
  {
    id: "dashboard",
    title: "Student Dashboard",
    category: "dashboard",
    desc: "Overview of student progress logs, pending tutorials chat counters, and threshold warnings.",
    renderScreen: () => (
      <div className="p-4 bg-slate-900 rounded-[var(--radius-sm)] text-left text-[9px] text-slate-300">
        <div className="flex justify-between border-b border-border/10 pb-1.5 mb-3">
          <strong>👨‍🎓 Student Dashboard</strong>
          <span className="text-[8px] bg-primary/20 text-primary px-1.5 rounded">Anaya Sharma</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-1.5 bg-slate-800 rounded"><span>Attendance</span><strong className="block text-emerald-400">84.5%</strong></div>
          <div className="p-1.5 bg-slate-800 rounded"><span>Bookings</span><strong className="block text-[var(--primary)]">3 Upcoming</strong></div>
          <div className="p-1.5 bg-slate-800 rounded"><span>Budget left</span><strong className="block text-rose-400">$245.50</strong></div>
        </div>
        <div className="p-2 bg-slate-950 rounded text-[8px] border-l-2 border-l-primary">
          <strong>🔔 Notifications</strong>
          <p className="text-slate-400 mt-0.5">New tutor message from Dr. Rajesh Kumar (Math)</p>
        </div>
      </div>
    )
  },
  {
    id: "tutorials",
    title: "Tutorials Directory",
    category: "tutorials",
    desc: "List of certified on-demand campus tutors grouped by academic subjects.",
    renderScreen: () => (
      <div className="p-4 bg-slate-900 rounded-[var(--radius-sm)] text-left text-[9px] text-slate-300">
        <div className="flex justify-between border-b border-border/10 pb-1.5 mb-2">
          <strong>📚 Search Tutors</strong>
          <span className="text-[7px] text-slate-500">24 active tutors</span>
        </div>
        <div className="space-y-2">
          <div className="p-2 bg-slate-800 rounded flex justify-between items-center">
            <div>
              <strong>Dr. Rajesh Kumar</strong>
              <span className="block text-[7px] text-slate-400">Data Structures • Rating: 4.9 (42 reviews)</span>
            </div>
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[8px]">Message</span>
          </div>
          <div className="p-2 bg-slate-800 rounded flex justify-between items-center">
            <div>
              <strong>Prof. Priya Nair</strong>
              <span className="block text-[7px] text-slate-400">Database Management • Rating: 4.8 (30 reviews)</span>
            </div>
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[8px]">Message</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "chat",
    title: "Tutor Chat Room",
    category: "chat",
    desc: "Real-time communication panel linking students and tutors with typing status.",
    renderScreen: () => (
      <div className="p-4 bg-slate-900 rounded-[var(--radius-sm)] text-left text-[9px] text-slate-300">
        <div className="border-b border-border/10 pb-1.5 mb-3 flex justify-between">
          <strong>💬 Dr. Rajesh Kumar</strong>
          <span className="text-[7px] text-emerald-400">typing...</span>
        </div>
        <div className="space-y-2 mb-3 h-[90px] overflow-y-auto">
          <div className="p-1.5 bg-slate-800 rounded w-4/5">Hi Anaya, did you check the algorithm slides?</div>
          <div className="p-1.5 bg-[var(--primary)] text-white rounded w-4/5 ml-auto text-right">Yes, I checked them. Let's schedule tomorrow.</div>
        </div>
        <div className="p-1 bg-slate-950 rounded flex justify-between">
          <span className="text-slate-500">Type message...</span>
          <span className="bg-primary text-white px-2 py-0.5 rounded text-[7px]">SEND</span>
        </div>
      </div>
    )
  },
  {
    id: "attendance",
    title: "Attendance Logs",
    category: "attendance",
    desc: "Progress checklist tracking college thresholds and monthly logs.",
    renderScreen: () => (
      <div className="p-4 bg-slate-900 rounded-[var(--radius-sm)] text-left text-[9px] text-slate-300">
        <strong className="block mb-2">📊 Attendance tracking</strong>
        <div className="space-y-1.5">
          <div className="p-1.5 bg-slate-800 rounded flex justify-between border-l-2 border-l-emerald-500">
            <span>Data Structures</span><strong>88.0%</strong>
          </div>
          <div className="p-1.5 bg-slate-800 rounded flex justify-between border-l-2 border-l-rose-500">
            <span>Database Systems</span><strong>72.5%</strong>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "expenses",
    title: "Expense Tracker",
    category: "expenses",
    desc: "Student personal budgeting sheet detailing transaction categories and limits.",
    renderScreen: () => (
      <div className="p-4 bg-slate-900 rounded-[var(--radius-sm)] text-left text-[9px] text-slate-300">
        <strong className="block border-b border-border/10 pb-1 mb-2">💰 Spend Tracker</strong>
        <div className="space-y-1">
          <div className="flex justify-between py-1 border-b border-border/5"><span>Dinner at Cafeteria</span><span className="text-rose-400">-$12.40</span></div>
          <div className="flex justify-between py-1"><span>Train Ticket Pass</span><span className="text-rose-400">-$45.00</span></div>
        </div>
      </div>
    )
  },
  {
    id: "referrals",
    title: "Referrals Pipeline",
    category: "referrals",
    desc: "Direct alumni-posted corporate opportunities board.",
    renderScreen: () => (
      <div className="p-4 bg-slate-900 rounded-[var(--radius-sm)] text-left text-[9px] text-slate-300">
        <strong className="block mb-2">💼 Careers verifier listings</strong>
        <div className="p-2 bg-slate-800 rounded border border-border/5">
          <div className="flex justify-between"><span className="text-white font-semibold">Software Intern</span><span className="bg-cyan-500/20 text-cyan-400 px-1 rounded">Google</span></div>
          <p className="text-[7px] text-slate-400 mt-1">Endorsement from alumnus Priya Verma (Class of 2023)</p>
        </div>
      </div>
    )
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    document.title = "UniConnect Gallery - Visual Mockup Screenshots";
  }, []);

  const filtered = screenshotsData.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="container px-6 py-12 max-w-6xl mx-auto text-left relative">
      <div className="uc-section-header text-center mb-12 max-w-xl mx-auto">
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Gallery</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-4">Screenshots Showcase</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Explore the visual interface panels drawn from core modules like student dashboard overview, tutor chat rooms, and job boards. Click any screen to zoom in.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex justify-center gap-2 mb-8 select-none flex-wrap">
        {["all", "dashboard", "tutorials", "chat", "attendance", "expenses", "referrals"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer border transition-all ${activeCategory === cat ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border/60 hover:text-foreground"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Screenshot grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            className="p-4 bg-card border border-border rounded-[var(--radius-lg)] hover:border-primary hover:shadow-glow cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="bg-slate-950 p-2 rounded-[var(--radius-md)] mb-4 overflow-hidden select-none border border-border/10">
              {item.renderScreen()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 LIGHTBOX ZOOM OVERLAY MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg bg-card p-6 border border-border rounded-[var(--radius-lg)] shadow-xl text-left">
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary cursor-pointer focus:outline-none"
                aria-label="Close zoomed view"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-foreground mb-1">{filtered[lightboxIndex]?.title}</h2>
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider mb-4 block">
                Category: {filtered[lightboxIndex]?.category}
              </span>

              <div className="bg-slate-950 p-4 rounded-[var(--radius-md)] border border-border/10 mb-4 select-none">
                {filtered[lightboxIndex]?.renderScreen()}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {filtered[lightboxIndex]?.desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
