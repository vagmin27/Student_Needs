import React, { useEffect } from "react";
import { Check } from "lucide-react";

const versionsData = [
  {
    version: "v1.2",
    title: "Tutor Chat Integration",
    date: "June 2026",
    color: "bg-primary border-primary",
    changes: [
      "Integrated Tutor Chat directly as a sub-module of Tutorials",
      "Added seen/delivered message tracking states",
      "Removed standalone sidebar chat references for integrated UX",
      "Auto conversation creation from tutor profile clicks"
    ]
  },
  {
    version: "v1.1",
    title: "Referrals & Placements Hub",
    date: "April 2026",
    color: "bg-[var(--primary)] border-[var(--primary)]/30",
    changes: [
      "Created Alumni registration and company validation portals",
      "Added referral posting and resume upload check pipelines",
      "Implemented JWT security check checks for role auth profiles"
    ]
  },
  {
    version: "v1.0",
    title: "Core Platform Launch",
    date: "February 2026",
    color: "bg-emerald-500 border-emerald-500",
    changes: [
      "Launched student dashboard overview",
      "Released Tutorials bookings and calendar sync checklists",
      "Implemented attendance threshold metrics tracking checks"
    ]
  }
];

export default function Updates() {
  useEffect(() => {
    document.title = "UniConnect Updates - Release Version Timeline";
  }, []);

  return (
    <div className="container px-6 py-12 max-w-3xl mx-auto text-left">
      <div className="uc-section-header text-center mb-16 max-w-xl mx-auto">
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Release Log</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-4">Version Evolution</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Follow our release updates as we roll out integrations, chat rooms, and referral channels.
        </p>
      </div>

      <div className="timeline-items relative pl-8 border-l border-border/80 space-y-12">
        {versionsData.map((ver, idx) => (
          <div key={ver.version} className="timeline-item relative">
            {/* Version Badge timeline badge */}
            <div className={`absolute -left-[54px] top-0 w-[42px] h-[22px] rounded-full border-2 border-card text-[9px] font-black text-white flex items-center justify-center ${ver.color} shadow-[var(--shadow-sm)] select-none`}>
              {ver.version}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-1.5">
              <h3 className="text-lg font-bold text-foreground leading-none">{ver.title}</h3>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{ver.date}</span>
            </div>

            <ul className="space-y-2.5 pl-0 list-none">
              {ver.changes.map((change, cIdx) => (
                <li key={cIdx} className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
