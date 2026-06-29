import React, { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const studentJourneySteps = [
  { step: "1", title: "Register Account", desc: "Create a student profile using your verified university email. Sync IT or CS branch details automatically." },
  { step: "2", title: "Find Verified Tutors", desc: "Browse through tutor lists filtered by academic courses. Check profiles of tutors like Dr. Rajesh Kumar." },
  { step: "3", title: "Book Study Session", desc: "Secure dates on the interactive tutor calendar. Manage booking schedules on the dashboard." },
  { step: "4", title: "Attend Classes", desc: "Review materials, chat with tutors in real-time rooms, and ensure logs are updated." },
  { step: "5", title: "Track Progress & Expenses", desc: "Check attendance percentages to keep averages above criteria, and log daily transaction budgets." },
  { step: "6", title: "Connect with Alumni", desc: "Browse the directory to find verifier professionals like Priya Verma at companies like Google or Amazon." },
  { step: "7", title: "Secure Internships & Placements", desc: "Request referrals, upload verified resumes, and accelerate your career path." }
];

const tutorJourneySteps = [
  { step: "1", title: "Register Profile", desc: "Create a tutor profile. Authenticate academic transcripts or expert teaching qualifications." },
  { step: "2", title: "List Subject Areas", desc: "Declare courses and subjects you teach. Sync with college curricula schedules." },
  { step: "3", title: "Define Calendar Availability", desc: "Open slot times for student bookings. Keep schedules organized." },
  { step: "4", title: "Accept Student Bookings", desc: "Manage incoming bookings requests. Coordinate doubts inside chat channels." },
  { step: "5", title: "Teach & Manage Attendance", desc: "Conduct tutoring hours and mark student presence checklists in the tutor portal." }
];

const faqs = [
  { q: "Who can use UniConnect?", a: "UniConnect is designed for university students and verified tutors/alumni. Any student with a valid university email can register and access all modules." },
  { q: "Is attendance tracking automated?", a: "Yes. Attendance is tracked per subject and per session. You receive real-time percentages and alerts if you fall below the minimum threshold." },
  { q: "How are tutors verified?", a: "Tutors upload academic credentials or teaching certifications which are reviewed before their profiles go live. Only verified tutors appear in search results." },
  { q: "Can I track expenses without a budget?", a: "Yes. You can log expenses freely. Setting a monthly budget unlocks prediction features, overage warnings, and savings goal tracking." },
  { q: "How do alumni referrals work?", a: "Alumni post verified job opportunities. Students can request referrals by submitting their resume directly. Alumni review and accept or decline referral requests." },
];

const successStories = [
  { name: "Priya Verma", company: "Google", text: "UniConnect helped me connect with the right alumni and land my dream internship within 3 months of using the referral module." },
  { name: "Arjun Mehta", company: "Amazon", text: "The expense tracker kept me on budget throughout my final year. I tracked over ₹80,000 in expenses and saved 18% compared to the previous year." },
  { name: "Dr. Rajesh Kumar", company: "BITS Pilani", text: "As a tutor, managing availability and bookings used to be chaotic. UniConnect simplified everything — my sessions are now 40% better utilized." },
];

export default function HowItWorks() {
  const [journeyMode, setJourneyMode] = useState("student");
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    document.title = "About How UniConnect Works - Visual Journey";
  }, []);

  useEffect(() => {
    setActiveStep(0);
  }, [journeyMode]);

  const activeSteps = journeyMode === "student" ? studentJourneySteps : tutorJourneySteps;

  return (
    <div className="w-full" style={{ paddingTop: "52px", paddingBottom: "72px" }}>

      {/* PAGE HEADER */}
      <div className="text-center mb-10" style={{ maxWidth: "760px", margin: "0 auto 40px" }}>
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          How It Works
        </span>
        <h1
          className="mt-4 mb-4 text-foreground font-extrabold tracking-tight"
          style={{ fontSize: "clamp(26px, 4vw, 46px)", lineHeight: 1.1 }}
        >
          Choose Your Visual Journey
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed" style={{ maxWidth: "600px", margin: "0 auto" }}>
          UniConnect supports both students aiming for academic success and tutors looking to verify and teach classes.
          Toggle between paths to see step details.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-10 select-none">
        <div className="flex bg-secondary p-1 rounded-[var(--radius-md)] border border-border/60">
          <button
            onClick={() => setJourneyMode("student")}
            className={`px-8 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold transition-all cursor-pointer ${journeyMode === "student" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            STUDENT PATHWAY
          </button>
          <button
            onClick={() => setJourneyMode("tutor")}
            className={`px-8 py-2.5 rounded-[var(--radius-sm)] text-xs font-bold transition-all cursor-pointer ${journeyMode === "tutor" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
          >
            TUTOR PATHWAY
          </button>
        </div>
      </div>

      {/* Two-column layout: timeline list + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 uc-modern-container">

        {/* LEFT: step index */}
        <div className="lg:col-span-4 timeline-items relative pl-8 border-l border-border/80 flex flex-col gap-5">
          {activeSteps.map((item, index) => {
            const isActive = index === activeStep;
            return (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`timeline-item relative cursor-pointer group select-none transition-all ${isActive ? "opacity-100" : "opacity-55 hover:opacity-80"}`}
              >
                <div className={`timeline-badge border-2 ${isActive ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border group-hover:border-primary/50"}`}>
                  {item.step}
                </div>
                <h4 className={`text-sm font-bold leading-snug ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                  {item.title}
                </h4>
              </div>
            );
          })}
        </div>

        {/* RIGHT: detail panel */}
        <div className="lg:col-span-8 p-7 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] min-h-[220px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep + journeyMode}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                Stage {activeSteps[activeStep]?.step} Detail
              </span>
              <h3 className="text-2xl font-bold text-foreground">{activeSteps[activeStep]?.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeSteps[activeStep]?.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="border-t border-border/60 pt-4 mt-6 flex justify-between items-center text-[10px] text-muted-foreground select-none">
            <span>Click stages on the left to explore the journey</span>
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Fully Vetted</span>
          </div>
        </div>
      </div>

      {/* ── SECONDARY GRID: 4 balanced columns ── */}
      <div
        className="grid gap-8"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >

        {/* Column 1: About UniConnect */}
        <div className="p-6 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] flex flex-col gap-4">
          <h2 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block" />
            About UniConnect
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            UniConnect is a unified academic platform built for modern university students and educators. It consolidates attendance management, tutor booking, expense tracking, and alumni networking into a single, cohesive experience.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you are tracking attendance for 12 subjects, managing a monthly budget, or seeking industry referrals from verified alumni at top companies — UniConnect handles it all in one place.
          </p>
          <ul className="space-y-2 mt-2">
            {["Real-time attendance alerts", "Verified tutor profiles", "AI-powered expense prediction", "Alumni referral pipeline"].map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: FAQs */}
        <div className="p-6 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] flex flex-col gap-3">
          <h2 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block" />
            FAQs
          </h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border/60 rounded-[var(--radius-md)] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-start gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <span className="leading-snug">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  }
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Success Stories */}
        <div className="p-6 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] flex flex-col gap-4">
          <h2 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block" />
            Success Stories
          </h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={storyIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-3 flex-1"
            >
              <div className="flex-1 p-4 bg-secondary/40 rounded-[var(--radius-md)] border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{successStories[storyIndex].text}"
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {successStories[storyIndex].name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{successStories[storyIndex].name}</p>
                    <p className="text-[10px] text-muted-foreground">{successStories[storyIndex].company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2 items-center justify-center mt-2">
            {successStories.map((_, i) => (
              <button
                key={i}
                onClick={() => setStoryIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === storyIndex ? "bg-primary scale-125" : "bg-border hover:bg-primary/40"}`}
              />
            ))}
          </div>
        </div>

        {/* Column 4: Quick Contact */}
        <div className="p-6 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] flex flex-col gap-4">
          <h2 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block" />
            Quick Contact
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Have a question about UniConnect? Send us a message and our team will get back to you within 24 hours.
          </p>
          <form
            className="flex flex-col gap-3 flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              setContactForm({ name: "", email: "", message: "" });
            }}
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Your Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="e.g. Arjun Mehta"
                className="premium-input h-9 text-sm text-foreground w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="you@university.edu"
                className="premium-input h-9 text-sm text-foreground w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Describe your question or feedback..."
                rows={4}
                className="premium-input text-sm text-foreground w-full resize-none py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary bg-primary text-white px-4 py-2.5 rounded-[var(--radius-sm)] hover:bg-primary-hover text-sm font-bold mt-1 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
