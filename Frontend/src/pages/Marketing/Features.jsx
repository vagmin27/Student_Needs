import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Briefcase, 
  ClipboardList, 
  ReceiptText, 
  LayoutDashboard, 
  Users, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  CircleDot
} from "lucide-react";
import { motion } from "framer-motion";

function LaptopFrame({ children }) {
  return (
    <div className="mockup-wrapper w-full max-w-xl mx-auto relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-cyan-500/20 rounded-[var(--radius-lg)] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
      <div className="laptop-mockup relative border border-border/80 rounded-[var(--radius-md)] bg-card shadow-2xl overflow-hidden">
        <div className="bg-muted/60 px-4 py-2 border-b border-border/60 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="p-5 text-[10.5px] text-foreground bg-background/50 backdrop-blur">
          {children}
        </div>
      </div>
      <div className="h-2 w-[85%] mx-auto bg-muted rounded-b-xl border-t border-border/40 shadow-md" />
    </div>
  );
}

function TabletFrame({ children }) {
  return (
    <div className="mockup-wrapper w-full max-w-lg mx-auto relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-[var(--radius-lg)] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000" />
      <div className="tablet-mockup relative border border-border/80 rounded-[var(--radius-lg)] bg-card shadow-2xl overflow-hidden">
        <div className="bg-muted/40 px-4 py-2 border-b border-border/40 flex items-center justify-between">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500/50" />
            <span className="w-2 h-2 rounded-full bg-slate-500/50" />
          </div>
          <span className="text-[8px] font-bold text-muted-foreground">UniConnect Safe Sandbox</span>
        </div>
        <div className="p-4 text-[10px] text-foreground bg-background/40">
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileFrame({ children }) {
  return (
    <div className="mockup-wrapper w-full max-w-[290px] mx-auto relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-rose-500/20 to-amber-500/20 rounded-[var(--radius-lg)] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />
      <div className="mobile-mockup relative border-4 border-slate-800 rounded-[32px] bg-card shadow-2xl overflow-hidden min-h-[440px]">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-10 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-slate-900" />
        </div>
        <div className="p-5 pt-8 text-[10px] text-foreground bg-background/50 min-h-[430px] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

const TutorialsPreview = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <span className="font-bold text-foreground">Verified Tutor Roster</span>
      <span className="text-[9px] text-primary font-bold">Filter By Subject</span>
    </div>
    <div className="space-y-2">
      {[
        { name: "Dr. Marcus Aurelius", sub: "CS-301 Data Algorithms", rating: "5.0 ★", price: "$25/hr" },
        { name: "Sarah Chen", sub: "React & Frontend Architecture", rating: "4.9 ★", price: "$30/hr" }
      ].map((tutor, i) => (
        <div key={i} className="p-2.5 bg-card/65 border border-border rounded-[var(--radius-sm)] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[8px]">{tutor.name[4]}</span>
            <div className="text-left">
              <div className="font-bold text-[9.5px] text-foreground">{tutor.name}</div>
              <div className="text-[8px] text-muted-foreground">{tutor.sub}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[9px] text-emerald-500">{tutor.price}</div>
            <div className="text-[8px] text-amber-500 font-semibold">{tutor.rating}</div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-3 bg-secondary/35 border border-border rounded-[var(--radius-md)] text-left">
      <div className="font-bold text-[9px] mb-1 text-foreground">📅 Next Session: Today 4:30 PM</div>
      <div className="text-[8.5px] text-muted-foreground">Room Link: meet.uniconnect.edu/cs301-marcus</div>
    </div>
  </div>
);

const ReferralsPreview = () => (
  <div className="space-y-4 text-left">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <span className="font-bold text-foreground">Referral Match Feed</span>
      <span className="text-[8px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold">3 Active</span>
    </div>
    <div className="space-y-3">
      {[
        { company: "Stripe", title: "Software Engineer Intern", status: "Referral Approved", date: "Just now" },
        { company: "Google", title: "Associate Product PM", status: "Submitted to Portal", date: "3d ago" }
      ].map((job, i) => (
        <div key={i} className="p-3 bg-card border border-border rounded-[var(--radius-md)] shadow-sm space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-[10px] text-foreground">{job.company}</div>
              <div className="text-[8.5px] text-muted-foreground">{job.title}</div>
            </div>
            <span className="text-[7.5px] text-slate-500">{job.date}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
            <span className="text-[8px] text-cyan-400 font-bold">{job.status}</span>
            <span className="text-[7.5px] bg-secondary/50 px-2 py-0.5 rounded text-foreground font-semibold border border-border/40">Track</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExpensesPreview = () => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center border-b border-border pb-2">
      <span className="font-bold text-foreground">Budget Tracker</span>
      <span className="font-bold text-rose-500">-$240 / $500</span>
    </div>
    <div className="p-2.5 bg-card border border-border rounded-[var(--radius-sm)] text-center">
      <div className="text-[8px] text-muted-foreground uppercase font-bold">Monthly Remaining</div>
      <div className="text-base font-extrabold text-foreground mt-0.5">$260.00</div>
      <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden flex">
        <div className="bg-rose-500 h-full" style={{ width: "48%" }}></div>
      </div>
    </div>
    <div className="space-y-1.5">
      {[
        { label: "Starbucks Cafe (Food)", val: "-$5.80", date: "Today 1:15 PM" },
        { label: "Uber Ride (Transit)", val: "-$14.20", date: "Yesterday" }
      ].map((t, i) => (
        <div key={i} className="flex justify-between items-center p-2 bg-secondary/30 rounded border border-border/30">
          <div>
            <div className="font-bold text-[8.5px] text-foreground">{t.label}</div>
            <div className="text-[7px] text-muted-foreground">{t.date}</div>
          </div>
          <span className="font-bold text-[8.5px] text-rose-500">{t.val}</span>
        </div>
      ))}
    </div>
  </div>
);

const AttendancePreview = () => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <span className="font-bold text-foreground">Class Attendance Matrix</span>
      <span className="text-emerald-500 font-bold uppercase text-[8px] tracking-wider">Safe</span>
    </div>
    <div className="space-y-2">
      {[
        { course: "CS 301 (Algorithms)", attended: "19/20", rate: "95.0%", status: "Good", color: "text-emerald-500" },
        { course: "MATH 310 (Probability)", attended: "14/18", rate: "77.7%", status: "Warning", color: "text-amber-500" }
      ].map((c, i) => (
        <div key={i} className="p-2.5 bg-card/60 border border-border rounded-[var(--radius-sm)] flex items-center justify-between shadow-sm">
          <div>
            <div className="font-bold text-[9px] text-foreground">{c.course}</div>
            <div className="text-[8px] text-muted-foreground">Attended: {c.attended} lectures</div>
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-black ${c.color}`}>{c.rate}</span>
            <div className="text-[7px] text-muted-foreground font-semibold">{c.status} Status</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AlumniPreview = () => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <span className="font-bold text-foreground">Verified Alumni Directory</span>
      <span className="text-[8px] text-muted-foreground">512 Mentors Active</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { name: "Marcus Aurelius", role: "Staff Eng @ Linear", batch: "'18" },
        { name: "Diana Prince", role: "Product Manager @ Stripe", batch: "'20" }
      ].map((alumnus, i) => (
        <div key={i} className="p-2 bg-card border border-border rounded-[var(--radius-sm)] shadow-sm space-y-1">
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[8px]">{alumnus.name[0]}</span>
          <div>
            <div className="font-bold text-[8.5px] text-foreground truncate">{alumnus.name}</div>
            <div className="text-[7.5px] text-muted-foreground truncate">{alumnus.role}</div>
            <div className="text-[6.5px] text-slate-400">Class of {alumnus.batch}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardPreview = () => (
  <div className="space-y-3 text-left">
    <div className="flex justify-between items-center border-b border-border/60 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[8px] font-black">U</span>
        <span className="font-bold text-foreground">Student Workspace</span>
      </div>
      <span className="text-[8px] text-muted-foreground">Alex Rivera (CS)</span>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="p-2 bg-card border border-border rounded-[var(--radius-sm)] text-center">
        <div className="text-[7px] text-muted-foreground uppercase font-bold">Tutorials</div>
        <div className="font-extrabold text-[10px] mt-1 text-foreground">2 Booked</div>
      </div>
      <div className="p-2 bg-card border border-border rounded-[var(--radius-sm)] text-center">
        <div className="text-[7px] text-muted-foreground uppercase font-bold">Attendance</div>
        <div className="font-extrabold text-[10px] mt-1 text-emerald-500">94.2%</div>
      </div>
      <div className="p-2 bg-card border border-border rounded-[var(--radius-sm)] text-center">
        <div className="text-[7px] text-muted-foreground uppercase font-bold">Finances</div>
        <div className="font-extrabold text-[10px] mt-1 text-foreground">$260 Left</div>
      </div>
    </div>
    <div className="p-2.5 bg-secondary/30 border border-border rounded-[var(--radius-sm)] flex justify-between items-center">
      <div>
        <div className="font-bold text-[8.5px] text-foreground">Google PM Referral Approved</div>
        <div className="text-[7.5px] text-muted-foreground">Resume verified. Waiting for scheduler contact.</div>
      </div>
      <span className="text-[7.5px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-black border border-emerald-500/20">Passed</span>
    </div>
  </div>
);

export default function Features() {
  useEffect(() => {
    document.title = "UniConnect Features - Full Module Overview";
  }, []);

  return (
    <div className="uc-modern-section uc-modern-container text-left py-12 md:py-24">
      
      {/* 🚀 PAGE HEADER */}
      <div className="text-center mb-20 max-w-2xl mx-auto space-y-4">
        <span className="text-primary font-extrabold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Modular Capabilities
        </span>
        <h1 className="uc-section-heading mt-4 text-4xl md:text-6xl font-extrabold tracking-tight">
          Modern Solutions for Student Operations
        </h1>
        <p className="uc-subheading max-w-lg mx-auto text-base text-muted-foreground">
          UniConnect replaces fragmented tools with a single premium software ecosystem. Explore the detailed sub-modules below.
        </p>
      </div>

      <div className="space-y-32">
        
        {/* ========================================================
            1. TUTORIALS: TEXT LEFT / MOCKUP RIGHT
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/30/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Academic Match & Tutorials</h2>
            <p className="uc-body-text text-muted-foreground text-sm">
              Connect with top-performing student tutors at your university. Schedule calendar slots, access online code sandbox classrooms, and complete bookings securely in seconds.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0">
              {[
                "Search tutors by specific course codes",
                "Instant live calendar slot scheduler",
                "Built-in chat window and document sharing",
                "Synchronized course study logs"
              ].map((bullet, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link 
                to="/features/tutorials"
                className="uc-btn-primary"
              >
                Deep-Dive into Tutorials <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
          <div>
            <TabletFrame>
              <TutorialsPreview />
            </TabletFrame>
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ========================================================
            2. REFERRALS: MOCKUP LEFT / TEXT RIGHT
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="lg:order-first">
            <MobileFrame>
              <ReferralsPreview />
            </MobileFrame>
          </div>
          <div className="space-y-6 lg:pl-6">
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Alumni Referral Network</h2>
            <p className="uc-body-text text-muted-foreground text-sm">
              Accelerate your corporate internship search. Access exclusive job boards powered by verified alumni working at top tech and finance institutions.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0">
              {[
                "Direct pipeline referral requests",
                "Resume evaluation from alumni verifiers",
                "Private verifier message channels",
                "Real-time interview pipeline tracking"
              ].map((bullet, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link 
                to="/features/referrals"
                className="uc-btn-primary bg-gradient-to-r from-cyan-500 to-indigo-500"
              >
                Explore Referral Systems <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ========================================================
            3. ATTENDANCE: 2-COLUMN LAYOUT
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Class Attendance Tracker</h2>
            <p className="uc-body-text text-muted-foreground text-sm">
              Never get locked out of credits. Monitor your university attendance requirements automatically, log classes with a single tap, and sync lists with tutor classrooms.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">⚠️ 75% Credit Limit Warning</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Triggers automatic warning notifications as attendance drops below required margins.</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">🔄 Attendance Sync</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Tutor bookings automatically update attendance states in the central dashboard databases.</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">📊 Automated Reports</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Download formal PDF report tables representing class logs for university verifications.</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">🏫 Multi-Class Support</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Manage complex block structures and laboratory schedules under one dashboard.</p>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/features/attendance" className="uc-btn-primary bg-gradient-to-r from-emerald-500 to-teal-500">
                Launch Attendance Module <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
          <div>
            <TabletFrame>
              <AttendancePreview />
            </TabletFrame>
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ========================================================
            4. EXPENSES: 2-COLUMN LAYOUT
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm text-rose-500 bg-rose-500/10 border border-rose-500/20">
              <ReceiptText className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Smart Expenses & Budgeting</h2>
            <p className="uc-body-text text-muted-foreground text-sm">
              Control your academic term spending. Map out student category budgets, set strict limits, and visualize remaining allocations using responsive, real-time charts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">💰 Spend Logs</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Log expenses instantly on-the-go categorized by Food, Books, Transit.</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">📊 Analytics</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Responsive category breakdowns showing monthly trends and budget variances.</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-[var(--radius-md)] space-y-1">
                <h4 className="text-xs font-bold text-foreground">🔔 Limit Alerts</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">Receive push notices as specific categories approach customized caps.</p>
              </div>
            </div>
            <div className="pt-4">
              <Link to="/features/expenses" className="uc-btn-primary bg-gradient-to-r from-rose-500 to-amber-500">
                Explore Expenses System <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
          <div>
            <TabletFrame>
              <ExpensesPreview />
            </TabletFrame>
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ========================================================
            5. ALUMNI: TIMELINE
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full">
          <div className="space-y-6 text-left lg:sticky lg:top-24">
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm text-amber-500 bg-amber-500/10 border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Alumni Network Mentorship</h2>
            <p className="uc-body-text text-muted-foreground text-sm">
              Bridge the divide between university and high-paying careers. Match with verified alumni mentors for one-on-one resume consults, mock interviews, and direct corporate refer pathways.
            </p>
            <div className="pt-4">
              <Link 
                to="/features/alumni"
                className="uc-btn-primary bg-gradient-to-r from-amber-500 to-rose-500"
              >
                Access Alumni Network <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8 text-left relative pl-6 border-l border-border/80">
            {[
              {
                step: "01",
                title: "Complete Verified Profile",
                desc: "Provide academic transcripts, verified Github profile links, and highlight technical projects."
              },
              {
                step: "02",
                title: "Search Verified Alumni Directory",
                desc: "Filter mentors by corporate companies (e.g. Stripe, Linear, Vercel) and graduation years."
              },
              {
                step: "03",
                title: "Schedule Consultation Session",
                desc: "Send direct chat requests for resume review, career mapping, or mock interview questions."
              },
              {
                step: "04",
                title: "Approve Corporate Referrals",
                desc: "Once a mentor validates your skills, get submitted to the company's internal fast-track hiring portals."
              }
            ].map((node, i) => (
              <div key={i} className="relative space-y-2">
                {/* marker dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">{node.step}</span>
                  <h4 className="text-sm font-bold text-foreground">{node.title}</h4>
                </div>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed pl-1 max-w-md">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-border/40" />

        {/* ========================================================
            6. DASHBOARD: MOCKUP LEFT / TEXT RIGHT
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <LaptopFrame>
              <DashboardPreview />
            </LaptopFrame>
          </div>
          <div className="space-y-6 lg:pl-6">
            <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shadow-sm text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/30/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">Central Student Dashboard</h2>
            <p className="uc-body-text text-muted-foreground text-sm">
              Your academic operations command center. View upcoming tutor sessions, tracking statistics, remaining monthly budget metrics, and refer statuses on a single responsive screen.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0">
              {[
                "Unified interface for all sub-modules",
                "Class list and tutor room links",
                "Instant system notifications feed",
                "Theme adaptive design systems"
              ].map((bullet, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link 
                to="/features/dashboard"
                className="uc-btn-primary bg-gradient-to-r from-purple-500 to-indigo-500"
              >
                Deep-Dive into Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
