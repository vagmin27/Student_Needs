import React, { useEffect } from "react";
import { Briefcase, Target, Heart, Compass } from "lucide-react";

export default function Careers() {
  useEffect(() => {
    document.title = "Careers - Join the UniConnect Startup Team";
  }, []);

  return (
    <div className="container px-6 py-12 max-w-4xl mx-auto text-left">
      <div className="uc-section-header text-center mb-16 max-w-xl mx-auto">
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Careers</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-4">Join UniConnect</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We are building the operating system for student success. Join us in shaping how students match with academic resources and transition into career roles.
        </p>
      </div>

      {/* Culture Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)]">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 text-primary flex items-center justify-center mb-4"><Target className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground mb-2">Impact-Driven Mission</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">We focus on building tools that solve real frictions in university life: tutoring, attendance checks, and referrals.</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)]">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4"><Heart className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground mb-2">Team Culture</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">We foster collaborative growth, flat hierarchies, and flexible hours so team members perform at their absolute best.</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)]">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4"><Compass className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground mb-2">Continuous Learning</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">We support tech research, blockchain explorations, and regular hackathons to extend our platform limits.</p>
        </div>
      </section>

      {/* 🚀 FUTURE OPENINGS */}
      <section className="p-8 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">Future Openings & Opportunities</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
          Although we do not have active openings today, we are always on the lookout for talented engineering interns, designers, and community leads.
        </p>
        <span className="inline-block px-4 py-1.5 bg-secondary text-primary font-bold rounded-[var(--radius-sm)] border border-border/80 text-[10px] uppercase tracking-wider select-none">
          No positions currently open • check back later
        </span>
      </section>
    </div>
  );
}
