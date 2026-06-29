import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
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

export default function HowItWorks() {
  const [journeyMode, setJourneyMode] = useState("student");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    document.title = "About How UniConnect Works - Visual Journey";
  }, []);

  useEffect(() => {
    setActiveStep(0);
  }, [journeyMode]);

  const activeSteps = journeyMode === "student" ? studentJourneySteps : tutorJourneySteps;

  return (
    <div className="w-full uc-modern-container" style={{ paddingTop: "52px", paddingBottom: "72px" }}>

      {/* PAGE HEADER */}
      <div className="text-center mb-10" style={{ maxWidth: "680px", margin: "0 auto 40px" }}>
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          How It Works
        </span>
        <h1
          className="mt-4 mb-4 text-foreground font-extrabold tracking-tight"
          style={{ fontSize: "clamp(26px, 4vw, 46px)", lineHeight: 1.1 }}
        >
          Choose Your Visual Journey
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

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
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ maxWidth: "560px" }}>
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
    </div>
  );
}
