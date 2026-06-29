import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Calendar, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Award, 
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ClipboardList,
  ReceiptText,
  LayoutDashboard,
  Users,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const modulesList = ["dashboard", "tutorials", "attendance", "expenses", "referrals", "alumni"];

export default function ModuleDetail() {
  const { module } = useParams();
  const normalizedModule = module?.toLowerCase() || "dashboard";

  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // --- STATE FOR INTERACTIVE SANDBOXES ---
  // Tutorials states
  const [bookedTutor, setBookedTutor] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: "tutor", text: "Hi! Ready to review binary search trees?" },
    { sender: "student", text: "Yes! Can we check the time complexity bounds first?" }
  ]);
  const [newChatText, setNewChatText] = useState("");

  // Referrals states
  const [activePipelineStage, setActivePipelineStage] = useState(2); // 0: Applied, 1: Reviewed, 2: Match, 3: Endorsed
  const [referredCompany, setReferredCompany] = useState("Stripe");

  // Attendance states
  const [csAttendance, setCsAttendance] = useState([
    { date: "June 08", status: "Present" },
    { date: "June 09", status: "Present" },
    { date: "June 10", status: "Absent" },
    { date: "June 11", status: "Present" }
  ]);

  // Expenses states
  const [remainingBudget, setRemainingBudget] = useState(260.00);
  const [expensesList, setExpensesList] = useState([
    { label: "Starbucks Coffee", amount: 5.80, date: "Today" },
    { label: "Uber Campus Ride", amount: 14.20, date: "Yesterday" }
  ]);
  const [newExpenseLabel, setNewExpenseLabel] = useState("");
  const [newExpenseAmt, setNewExpenseAmt] = useState("");

  // Alumni states
  const [mentorshipStatus, setMentorshipStatus] = useState("idle"); // idle, requested, matched
  const [selectedMentor, setSelectedMentor] = useState("Marcus Aurelius");

  // Dashboard states
  const [dashStats, setDashStats] = useState({
    bookings: 2,
    attendance: "94.2%",
    budget: 260.00
  });

  useEffect(() => {
    document.title = `UniConnect - ${normalizedModule.charAt(0).toUpperCase() + normalizedModule.slice(1)} Module`;
  }, [normalizedModule]);

  if (!modulesList.includes(normalizedModule)) {
    return <Navigate to="/features" replace />;
  }

  const prevModule = modulesList[(modulesList.indexOf(normalizedModule) - 1 + modulesList.length) % modulesList.length];
  const nextModule = modulesList[(modulesList.indexOf(normalizedModule) + 1) % modulesList.length];

  // --- MODULE CORE STATIC DATA CONFIG ---
  const moduleInfo = {
    dashboard: {
      title: "Central Student Dashboard",
      overview: "UniConnect's Central Command Center. Get a complete, unified overview of your academic stats, tutor schedules, expenditures, and career pipelines on a single page, dynamically synchronized in real-time.",
      statistics: [
        { label: "Active Students", value: "10,000+" },
        { label: "Database Sync SLA", value: "99.9%" },
        { label: "Average Daily Saves", value: "$45/student" }
      ],
      benefits: [
        "Unifies data inputs across all 5 sub-modules",
        "Responsive, scroll-optimized metrics feed with safety indicators",
        "Automatic push notifications for warnings and approvals",
        "Quick action shortcuts for logging variables directly"
      ],
      workflow: [
        { step: "01", title: "Sign in with Credentials", desc: "Access the environment securely via encrypted JWT tokens." },
        { step: "02", title: "Review Notifications", desc: "Track pending tutor chat notes, attendance limits, and internship actions." },
        { step: "03", title: "Utilize Smart Shortcuts", desc: "Directly log daily expenses, book tutors, or update attendance stats." }
      ],
      faqs: [
        { q: "Is dashboard data synchronized in real-time?", a: "Yes. Any data logged in Tutorials, Expenses, or Attendance is instantly committed to MongoDB and updates the dashboard immediately." },
        { q: "Can students custom organize widgets?", a: "The layout automatically prioritize columns based on your active modules and warnings." }
      ]
    },
    tutorials: {
      title: "Tutor Match & Conversations",
      overview: "Vetted peer-to-peer tutoring built for university courses. Discover expert tutors matching your specific class codes, schedule sessions on interactive calendars, and converse via real-time chats.",
      statistics: [
        { label: "Certified Tutors", value: "500+" },
        { label: "Tutoring Sessions", value: "1,500+" },
        { label: "Average Rating", value: "4.8 / 5.0" }
      ],
      benefits: [
        "Search vetted student peers by course code & syllabus",
        "Instant booking calendar integrations with zero slot conflicts",
        "Encrypted chat channel with typing indicators and file sharing",
        "Automatic notifications upon slot approval"
      ],
      workflow: [
        { step: "01", title: "Search Course Code", desc: "Filter active directories to match tutors with specific subjects." },
        { step: "02", title: "Coordinate in Chat", desc: "Message tutors to discuss problem sets, project details, and availability." },
        { step: "03", title: "Book Calendar Slot", desc: "Choose an open slot on their live calendar to instantly secure the match." }
      ],
      faqs: [
        { q: "How are student tutors verified?", a: "Every tutor must upload official transcripts demonstrating an A grade in the matched subject before approval." },
        { q: "Are study sessions conducted online?", a: "Yes. The match includes room links for online sandbox classroom workspaces." }
      ]
    },
    attendance: {
      title: "Class Attendance Tracker",
      overview: "Prevent academic probation and grade blocks. Log lectures, evaluate course attendance rates automatically, and receive instant alerts when drops approach criteria thresholds.",
      statistics: [
        { label: "Lectures Tracked", value: "20,000+" },
        { label: "Accuracy Rate", value: "95%" },
        { label: "Warning Dropouts prevented", value: "850+ students" }
      ],
      benefits: [
        "Immediate color warnings for classes dropping below 75% limits",
        "Tutor-student automatic sync validation checks",
        "Audit log history for class attendance discrepancies",
        "CSV list exports for formal university verification boards"
      ],
      workflow: [
        { step: "01", title: "Register Subject Blocks", desc: "Configure course requirements and minimum attendance criteria." },
        { step: "02", title: "Log lecture Attendance", desc: "Tap to record status (Present or Absent) for today's slot." },
        { step: "03", title: "Analyze Rate Curves", desc: "Check graphical metrics to ensure safety status remains green." }
      ],
      faqs: [
        { q: "Can attendance sync with tutor bookings?", a: "Yes. Tutors can mark attendance during match slots, updating your tracker automatically." },
        { q: "Can I manual override attendance logs?", a: "Yes, you can edit entries manually, but warnings will show 'Self-Reported' status." }
      ]
    },
    expenses: {
      title: "Student Budget & Expense Tracker",
      overview: "A student-tailored personal finance engine. Log transaction receipts, categorize expenditures automatically, track term budget limits, and review responsive spending analytics.",
      statistics: [
        { label: "Records Managed", value: "10,000+" },
        { label: "Average Savings", value: "18.5% / month" },
        { label: "Total Tracked Vol", value: "$120K+" }
      ],
      benefits: [
        "Interactive budget allocation distribution bars",
        "Instant transaction categorization (Food, Books, Travel, Rent)",
        "Daily spend alerts warning you as category limits approach caps",
        "Excel/CSV spreadsheet exports for personal finance software"
      ],
      workflow: [
        { step: "01", title: "Set Term Budget Limit", desc: "Define your monthly cap (e.g. $600) and allocate category targets." },
        { step: "02", title: "Record Daily Spent lines", desc: "Input cost amount and tags for transactions as they occur." },
        { step: "03", title: "Analyze Spending Diagrams", desc: "Review real-time progress bars to optimize your financial habits." }
      ],
      faqs: [
        { q: "Is my personal budgeting data private?", a: "Absolutely. All financial ledger logs are encrypted and private to your profile." },
        { q: "Can I track recurring transactions?", a: "Yes. Add subscriptions like public transit cards to trigger automatically." }
      ]
    },
    referrals: {
      title: "Alumni Referral Pipeline",
      overview: "Bridge the gap between graduation and corporate placement. Browse verified jobs posted by alumni, submit portfolios, and track internal referral submissions in real-time.",
      statistics: [
        { label: "Referrals Approved", value: "1,000+" },
        { label: "Partner Companies", value: "250+" },
        { label: "Endorsement Rate", value: "88%" }
      ],
      benefits: [
        "Vetted job board populated only by registered alumni verifiers",
        "Resume pre-screening reviews from industry professionals",
        "Transparent step-by-step pipeline status tracking",
        "Private chat rooms to coordinate interview preparation"
      ],
      workflow: [
        { step: "01", title: "Discover Verified Positions", desc: "Browse listings matching roles at Google, Stripe, Linear, Vercel, etc." },
        { step: "02", title: "Request Internal Referral", desc: "Submit resume for review by alumni working at that organization." },
        { step: "03", title: "Alumni Endorsement Submission", desc: "Alumni approves portfolio and submits your profile to internal fast-track pipelines." }
      ],
      faqs: [
        { q: "Who qualifies as a referral verifier?", a: "Only authenticated alumni with active corporate email domains can verify student applications." },
        { q: "Is the portal referral process secure?", a: "Yes. Student profiles are pre-vetted to guarantee alignment with company parameters." }
      ]
    },
    alumni: {
      title: "Alumni Mentorship Network",
      overview: "Access 1-on-1 guidance from seniors who walked the path. Search the mentor directory, request portfolio reviews, and coordinate career prep sessions.",
      statistics: [
        { label: "Verified Alumni", value: "512+" },
        { label: "Active Connections", value: "1,200+" },
        { label: "Success Rate", value: "92% Placement" }
      ],
      benefits: [
        "1-on-1 mentorship request threads with direct inbox alerts",
        "Career guidelines based on successful alumni trajectories",
        "Social credential validation via GitHub & LinkedIn synchronization",
        "Interactive Q&A slots with industry experts"
      ],
      workflow: [
        { step: "01", title: "Browse Mentor Directory", desc: "Locate mentors by corporate title, university batch, or skills." },
        { step: "02", title: "Send Mentorship Request", desc: "Describe your objectives (e.g. portfolio feedback, interview prep)." },
        { step: "03", title: "Begin Career Guidance", desc: "Launch direct chats and schedule guidance sessions with matching mentors." }
      ],
      faqs: [
        { q: "Is the mentorship network free?", a: "Yes. Mentorship is completely free and driven by community-minded alumni." },
        { q: "How are alumni credentials verified?", a: "Alumni sync corporate LinkedIn profiles or verify via work email pins." }
      ]
    }
  };

  const data = moduleInfo[normalizedModule];

  // --- RENDERING MODULE SPECIFIC INTERACTIVE PREVIEW WIDGETS ---
  const renderInteractivePreview = () => {
    switch (normalizedModule) {
      case "tutorials":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-4xl mx-auto">
            {/* Tutor Booking Panel */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Tutor Selection Board
                </h4>
                <p className="text-[11px] text-muted-foreground mb-4">Click to schedule an online match with a verified tutor.</p>
                <div className="space-y-2.5">
                  {[
                    { id: "marcus", name: "Dr. Marcus Aurelius", dept: "Computer Science", rating: "5.0" },
                    { id: "chen", name: "Sarah Chen, MSc", dept: "React Architecture", rating: "4.9" }
                  ].map((tutor) => (
                    <div key={tutor.id} className={`p-3 border rounded-[var(--radius-sm)] flex items-center justify-between transition-colors ${bookedTutor === tutor.id ? "border-primary bg-primary/5" : "border-border/50 bg-secondary/20"}`}>
                      <div className="text-left">
                        <span className="text-xs font-bold text-foreground block">{tutor.name}</span>
                        <span className="text-[10px] text-muted-foreground">{tutor.dept} • ★ {tutor.rating}</span>
                      </div>
                      <button 
                        onClick={() => setBookedTutor(tutor.id)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${bookedTutor === tutor.id ? "bg-emerald-500 text-white cursor-default" : "bg-primary text-white hover:bg-primary-hover"}`}
                      >
                        {bookedTutor === tutor.id ? "Booked ✓" : "Book Match"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {bookedTutor && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[var(--radius-sm)] text-left">
                  <span className="text-[10px] text-emerald-500 font-bold block">✓ Matches Confirmed!</span>
                  <span className="text-[9.5px] text-muted-foreground">Session locked for Today 4:30 PM. Meet room active.</span>
                </div>
              )}
            </div>

            {/* Chat Simulator Panel */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] flex flex-col justify-between h-[300px]">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-2.5">
                  <MessageSquare className="w-4 h-4 text-primary" /> Active Room Conversation
                </h4>
                <div className="space-y-2 mt-3 overflow-y-auto max-h-[160px] pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2 rounded-[var(--radius-sm)] text-[10.5px] max-w-[80%] text-left ${msg.sender === "student" ? "bg-primary text-white rounded-br-none" : "bg-secondary text-foreground rounded-bl-none border border-border/40"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 border-t border-border/40 pt-3 mt-2">
                <input 
                  type="text" 
                  placeholder="Ask a question..."
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") {
                    if (!newChatText.trim()) return;
                    setChatMessages([...chatMessages, { sender: "student", text: newChatText }]);
                    setNewChatText("");
                  }}}
                  className="flex-grow px-3 py-1 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none"
                />
                <button 
                  onClick={() => {
                    if (!newChatText.trim()) return;
                    setChatMessages([...chatMessages, { sender: "student", text: newChatText }]);
                    setNewChatText("");
                  }}
                  className="px-3 py-1 bg-primary text-white rounded text-[10.5px] font-bold"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        );
      case "referrals":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-4xl mx-auto">
            {/* Company Selection Panel */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] space-y-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Company Listing</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Stripe", "Google", "Vercel"].map((comp) => (
                  <button 
                    key={comp}
                    onClick={() => {
                      setReferredCompany(comp);
                      setActivePipelineStage(1);
                    }}
                    className={`p-3.5 border rounded-[var(--radius-sm)] font-bold text-[11px] text-center transition-all ${referredCompany === comp ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/20 hover:border-primary/50 text-foreground"}`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
              <div className="p-3 bg-secondary/35 border border-border/40 rounded-[var(--radius-sm)] space-y-1">
                <span className="text-[10px] font-bold text-foreground">Stripe - Software Engineer Intern</span>
                <p className="text-[9.5px] text-muted-foreground leading-snug">Verifier: Priya S. (Alumni '23, Backend Lead at Stripe)</p>
              </div>
            </div>

            {/* Pipeline Stage Tracker */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] flex flex-col justify-between text-left">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-cyan-400" /> Pipeline Application Tracker
              </h4>
              <div className="space-y-4 my-2">
                {[
                  { stage: 0, label: "Applied", desc: "Resume submitted to alumni inbox" },
                  { stage: 1, label: "Resume Checked", desc: "Passed profile screening checklist" },
                  { stage: 2, label: "Mentor Match", desc: "1-on-1 technical mock interview passed" },
                  { stage: 3, label: "Referral Submitted", desc: "Submitted to Stripe referral database" }
                ].map((item) => (
                  <div key={item.stage} className="flex gap-3 items-start cursor-pointer" onClick={() => setActivePipelineStage(item.stage)}>
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${activePipelineStage >= item.stage ? "bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/20" : "bg-background border-border text-muted-foreground"}`}>
                        {activePipelineStage >= item.stage ? "✓" : item.stage + 1}
                      </div>
                    </div>
                    <div>
                      <span className={`text-[10.5px] font-bold block transition-colors ${activePipelineStage >= item.stage ? "text-cyan-400 font-extrabold" : "text-muted-foreground"}`}>{item.label}</span>
                      <span className="text-[9px] text-muted-foreground font-medium">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "attendance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-4xl mx-auto">
            {/* Log Panel */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-emerald-500" /> Log Today's Lecture
              </h4>
              <p className="text-[10.5px] text-muted-foreground leading-relaxed">Update your CS-301 attendance rate dynamically by marking today's lecture outcome below.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const todayStr = "June " + (12 + csAttendance.length - 4);
                    setCsAttendance([...csAttendance, { date: todayStr, status: "Present" }]);
                  }}
                  className="flex-1 py-2 bg-emerald-500 text-white rounded text-xs font-bold hover:bg-emerald-600 transition-colors"
                >
                  Mark Present (Lecture Attended)
                </button>
                <button 
                  onClick={() => {
                    const todayStr = "June " + (12 + csAttendance.length - 4);
                    setCsAttendance([...csAttendance, { date: todayStr, status: "Absent" }]);
                  }}
                  className="flex-1 py-2 bg-rose-500 text-white rounded text-xs font-bold hover:bg-rose-600 transition-colors"
                >
                  Mark Absent (Skipped)
                </button>
              </div>
              <div className="flex justify-between items-center bg-secondary/35 p-3 rounded-[var(--radius-sm)] border border-border/40">
                <span className="text-xs text-muted-foreground">Attendance Percentage</span>
                <span className="text-base font-black text-emerald-500">
                  {((csAttendance.filter(a => a.status === "Present").length / csAttendance.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Matrix logs feed */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">CS-301 Audit Ledger</h4>
                <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-1">
                  {csAttendance.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-background border border-border/50 rounded-[var(--radius-sm)]">
                      <span className="text-[10px] font-bold text-foreground">{log.date} Lecture</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${log.status === "Present" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setCsAttendance([
                  { date: "June 08", status: "Present" },
                  { date: "June 09", status: "Present" },
                  { date: "June 10", status: "Absent" },
                  { date: "June 11", status: "Present" }
                ])}
                className="text-[9px] text-muted-foreground hover:text-primary transition-colors text-right pt-2"
              >
                Reset Ledger Logs
              </button>
            </div>
          </div>
        );
      case "expenses":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-4xl mx-auto">
            {/* Add transaction form */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-2">
                  <Plus className="w-4.5 h-4.5 text-rose-500" /> Log Spent Cost
                </h4>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Expense Description (e.g. Lunch)"
                    value={newExpenseLabel}
                    onChange={(e) => setNewExpenseLabel(e.target.value)}
                    className="w-full px-3 py-1.5 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Cost (e.g. 12.50)"
                    value={newExpenseAmt}
                    onChange={(e) => setNewExpenseAmt(e.target.value)}
                    className="w-full px-3 py-1.5 bg-background border border-border rounded text-[10.5px] text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  const amt = parseFloat(newExpenseAmt);
                  if (!newExpenseLabel || isNaN(amt) || amt <= 0) return;
                  setExpensesList([{ label: newExpenseLabel, amount: amt, date: "Just now" }, ...expensesList]);
                  setRemainingBudget(prev => Math.max(0, prev - amt));
                  setNewExpenseLabel("");
                  setNewExpenseAmt("");
                }}
                className="w-full py-2 bg-rose-500 text-white rounded text-xs font-bold hover:bg-rose-600 transition-colors mt-2"
              >
                Subtract from Student Budget
              </button>
            </div>

            {/* Finances logs list */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-border/40 pb-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Term Balance Sheet</span>
                  <span className="text-xs font-bold text-foreground">Remaining: <span className="text-emerald-500 font-extrabold">${remainingBudget.toFixed(2)}</span></span>
                </div>
                <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1">
                  {expensesList.map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-secondary/30 rounded border border-border/30">
                      <div>
                        <span className="text-[10px] font-bold text-foreground block">{exp.label}</span>
                        <span className="text-[7.5px] text-muted-foreground">{exp.date}</span>
                      </div>
                      <span className="text-[10px] font-black text-rose-500">-${exp.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  setRemainingBudget(260.00);
                  setExpensesList([
                    { label: "Starbucks Coffee", amount: 5.80, date: "Today" },
                    { label: "Uber Campus Ride", amount: 14.20, date: "Yesterday" }
                  ]);
                }}
                className="text-[9px] text-muted-foreground hover:text-primary transition-colors text-right pt-2"
              >
                Reset Balance Sheet
              </button>
            </div>
          </div>
        );
      case "alumni":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-4xl mx-auto">
            {/* Mentors roster */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verified Mentor Profiles</h4>
              <div className="space-y-2.5">
                {[
                  { name: "Marcus Aurelius", title: "Staff Tech Lead @ Linear", batch: "Class of '18" },
                  { name: "Diana Prince", title: "Principal PM @ Stripe", batch: "Class of '20" }
                ].map((mentor) => (
                  <div key={mentor.name} className={`p-3 border rounded-[var(--radius-sm)] flex justify-between items-center transition-all ${selectedMentor === mentor.name ? "border-primary bg-primary/5" : "border-border/50 bg-secondary/20"}`}>
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground block">{mentor.name}</span>
                      <span className="text-[9.5px] text-muted-foreground">{mentor.title} • {mentor.batch}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedMentor(mentor.name);
                        setMentorshipStatus("idle");
                      }}
                      className="px-2 py-0.5 border border-border text-[9.5px] font-semibold text-foreground rounded hover:border-primary"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Request center */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Mentorship Request Center</h4>
                <p className="text-[10.5px] text-muted-foreground leading-normal mb-4">Request 1-on-1 career guidance or a resume critique from your selected mentor: <span className="font-bold text-primary">{selectedMentor}</span>.</p>
                
                {mentorshipStatus === "idle" && (
                  <button 
                    onClick={() => {
                      setMentorshipStatus("requested");
                      setTimeout(() => setMentorshipStatus("matched"), 3000);
                    }}
                    className="w-full py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary-hover transition-colors"
                  >
                    Submit Resume Review Request
                  </button>
                )}

                {mentorshipStatus === "requested" && (
                  <div className="p-4 bg-secondary border border-border rounded-[var(--radius-sm)] text-center py-6 animate-pulse">
                    <span className="text-[11px] font-bold text-muted-foreground">Verifying profile credentials on database...</span>
                  </div>
                )}

                {mentorshipStatus === "matched" && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[var(--radius-sm)] text-left space-y-1">
                    <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">✓ Mentorship Request Accepted!</span>
                    <p className="text-[10px] text-muted-foreground leading-snug">Marcus Aurelius approved your project review. CS-301 room link sent to your campus inbox.</p>
                  </div>
                )}
              </div>
              
              {mentorshipStatus !== "idle" && (
                <button onClick={() => setMentorshipStatus("idle")} className="text-[9px] text-muted-foreground hover:text-primary transition-colors text-right pt-2">
                  Reset Center
                </button>
              )}
            </div>
          </div>
        );
      case "dashboard":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-4xl mx-auto">
            {/* Quick Actions Console */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <LayoutDashboard className="w-4.5 h-4.5 text-primary" /> Workspace Command Console
              </h4>
              <p className="text-[10.5px] text-muted-foreground leading-relaxed">Trigger state operations to watch parameters sync across the live student environment.</p>
              <div className="space-y-2">
                <button 
                  onClick={() => setDashStats({ ...dashStats, bookings: dashStats.bookings + 1 })}
                  className="w-full py-2 bg-[var(--primary)] text-white rounded text-xs font-bold hover:bg-[var(--primary)] transition-colors"
                >
                  Increment Scheduled Booking (+1)
                </button>
                <button 
                  onClick={() => setDashStats({ ...dashStats, budget: Math.max(0, dashStats.budget - 15.00) })}
                  className="w-full py-2 bg-rose-500 text-white rounded text-xs font-bold hover:bg-rose-600 transition-colors"
                >
                  Simulate Coffee Purchase (-$15.00)
                </button>
              </div>
            </div>

            {/* Dashboard Workspace Mock */}
            <div className="p-5 bg-card border border-border/80 rounded-[var(--radius-md)] text-left flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">Live Environment Widgets</h4>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="p-2.5 bg-secondary/35 border border-border/40 rounded-[var(--radius-sm)]">
                    <span className="text-[8px] text-muted-foreground block font-bold uppercase">Bookings</span>
                    <strong className="text-sm font-black text-[var(--primary)] mt-1 block">{dashStats.bookings} Slots</strong>
                  </div>
                  <div className="p-2.5 bg-secondary/35 border border-border/40 rounded-[var(--radius-sm)]">
                    <span className="text-[8px] text-muted-foreground block font-bold uppercase">Attendance</span>
                    <strong className="text-sm font-black text-emerald-400 mt-1 block">{dashStats.attendance}</strong>
                  </div>
                  <div className="p-2.5 bg-secondary/35 border border-border/40 rounded-[var(--radius-sm)]">
                    <span className="text-[8px] text-muted-foreground block font-bold uppercase">Budget Left</span>
                    <strong className="text-sm font-black text-foreground mt-1 block">${dashStats.budget.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="p-3 bg-secondary/30 border border-border/40 rounded-[var(--radius-sm)] flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[9.5px] text-muted-foreground font-medium">All database channels synced (latency: 12ms)</span>
                </div>
              </div>
              
              <button 
                onClick={() => setDashStats({ bookings: 2, attendance: "94.2%", budget: 260.00 })}
                className="text-[9px] text-muted-foreground hover:text-primary transition-colors text-right pt-2"
              >
                Reset Dashboard Widget
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="uc-modern-section uc-modern-container text-left max-w-6xl py-12">
      
      {/* Back button */}
      <Link to="/features" className="text-primary hover:text-primary-hover font-bold inline-flex items-center gap-1.5 text-xs mb-8 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Features Grid
      </Link>

      {/* ========================================================
          1. HERO & OVERVIEW
         ======================================================== */}
      <section className="mb-16">
        <div className="max-w-3xl">
          <span className="text-primary font-extrabold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Interactive Showcase
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mt-4 mb-4 leading-none">
            {data.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {data.overview}
          </p>
        </div>
      </section>

      {/* ========================================================
          2. INTERACTIVE PREVIEW SANDBOX (THE CORE SANDBOX)
         ======================================================== */}
      <section className="mb-20 bg-secondary/10 border border-border/60 rounded-[var(--radius-xl)] p-8 text-center relative overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="max-w-2xl mx-auto text-center mb-8 space-y-2.5">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Interactive Sandbox Preview</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Test the live environment in real-time. Toggle values, push cost logs, or complete schedules below to check system adaptability.
          </p>
        </div>

        {/* The dynamic widget panels render here */}
        <div className="relative z-10 w-full flex justify-center py-2">
          {renderInteractivePreview()}
        </div>
        
        {/* Decorative backdrop blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ========================================================
          3. WORKFLOW ROADMAP
         ======================================================== */}
      <section className="mb-20">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center text-foreground tracking-tight mb-10">How the Workflow Operates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.workflow.map((item, idx) => (
            <div key={idx} className="p-6 bg-card border border-border rounded-[var(--radius-lg)] text-left relative overflow-hidden group hover:border-primary/50 transition-colors">
              <span className="absolute top-2 right-4 text-5xl font-black text-primary/10 select-none group-hover:text-primary/15 transition-colors">{item.step}</span>
              <h4 className="font-extrabold text-sm text-foreground mb-2">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. BENEFITS
         ======================================================== */}
      <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">Core Operating System Benefits</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">Designed to replace student manual entry systems with direct verification pipelines.</p>
          <div className="space-y-4">
            {data.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-2.5 items-start text-left">
                <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 bg-card border border-border/80 rounded-[var(--radius-lg)] text-left shadow-[var(--shadow-sm)] space-y-4 relative overflow-hidden">
          <h4 className="text-xs font-black uppercase tracking-wider text-primary">System Compliance Details</h4>
          <p className="text-[11.5px] text-muted-foreground leading-relaxed">
            Our modules adhere to college administrative verification rules. Direct logs connect student accounts with alumni verifiers and tutor records, locking updates against manual manipulation.
          </p>
          <div className="flex gap-2 items-center text-[10.5px] text-foreground font-bold pt-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Vetted Security Architecture Approved
          </div>
        </div>
      </section>

      {/* ========================================================
          5. STATISTICS
         ======================================================== */}
      <section className="mb-20 py-12 border-y border-border/50 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {data.statistics.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              <strong className="block text-4xl md:text-5xl font-black text-primary tracking-tight">{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. SPECIFIC FAQS
         ======================================================== */}
      <section className="mb-20 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center text-foreground tracking-tight mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {data.faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="border border-border/60 rounded-[var(--radius-md)] overflow-hidden bg-card transition-colors hover:border-primary/40">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex justify-between items-center font-bold text-sm text-foreground cursor-pointer focus:outline-none select-none"
                >
                  <span className="text-[12.5px]">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-250 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-4 bg-secondary/5">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          7. MODULE CTA BANNER
         ======================================================== */}
      <section className="mb-12">
        <div className="p-10 md:p-14 bg-gradient-to-r from-primary via-indigo-600 to-indigo-900 rounded-[var(--radius-xl)] text-center relative overflow-hidden shadow-[var(--shadow-lg)] text-white">
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h3 className="text-xl md:text-3xl font-black tracking-tight">Ready to leverage this module?</h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-md mx-auto">
              Join thousands of university students managing academic tutoring, budgets, schedules, and internship placements.
            </p>
            <div className="flex justify-center gap-3">
              <Link 
                to="/role-selection" 
                className="px-6 py-2.5 bg-white text-primary rounded-[var(--radius-sm)] text-xs font-bold hover:bg-white/90 transition-colors shadow-[var(--shadow-lg)]"
              >
                Log In to Workspace
              </Link>
              <Link 
                to="/features" 
                className="px-6 py-2.5 bg-transparent border border-white/20 hover:bg-white/10 rounded-[var(--radius-sm)] text-xs font-bold transition-all"
              >
                View Other Modules
              </Link>
            </div>
          </div>
          {/* Decorative design elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        </div>
      </section>

      {/* Cyclical Navigation */}
      <div className="border-t border-border/60 pt-6 mt-8 flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        <Link to={`/features/${prevModule}`} className="hover:text-primary flex items-center gap-1 transition-colors">
          ← {prevModule}
        </Link>
        <Link to={`/features/${nextModule}`} className="hover:text-primary flex items-center gap-1 transition-colors">
          {nextModule} →
        </Link>
      </div>

    </div>
  );
}
