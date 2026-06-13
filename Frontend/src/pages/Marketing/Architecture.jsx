import React, { useEffect } from "react";
import { Server, Database, Monitor, Zap } from "lucide-react";

export default function Architecture() {
  useEffect(() => {
    document.title = "Platform Architecture - UniConnect System Design";
  }, []);

  return (
    <div className="container px-6 py-12 max-w-4xl mx-auto text-left">
      <div className="uc-section-header text-center mb-16 max-w-xl mx-auto">
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">System Design</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-4">Platform Architecture</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          UniConnect deploys a modern three-tier web application architecture. Explore how client requests, database calls, and websocket packets interact.
        </p>
      </div>

      {/* 🚀 VISUAL DIAGRAM FLOWCHART */}
      <section className="p-8 bg-card border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] mb-16 text-center">
        <h2 className="text-base font-bold text-foreground mb-8">System Data Flow</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 max-w-2xl mx-auto">
          {/* Frontend */}
          <div className="p-4 bg-secondary/60 border border-border rounded-[var(--radius-md)] w-36 text-center flex flex-col items-center gap-2">
            <Monitor className="w-6 h-6 text-primary" />
            <strong className="text-xs text-foreground block">Frontend</strong>
            <span className="text-[9px] text-muted-foreground">React • Tailwind CSS</span>
          </div>

          <div className="text-primary font-black text-xs select-none md:rotate-0 rotate-90">→</div>

          {/* API Server */}
          <div className="p-4 bg-secondary/60 border border-border rounded-[var(--radius-md)] w-36 text-center flex flex-col items-center gap-2">
            <Server className="w-6 h-6 text-[var(--primary)]" />
            <strong className="text-xs text-foreground block">API Layer</strong>
            <span className="text-[9px] text-muted-foreground">Express • Node.js</span>
          </div>

          <div className="text-[var(--primary)] font-black text-xs select-none md:rotate-0 rotate-90">→</div>

          {/* Database */}
          <div className="p-4 bg-secondary/60 border border-border rounded-[var(--radius-md)] w-36 text-center flex flex-col items-center gap-2">
            <Database className="w-6 h-6 text-emerald-500" />
            <strong className="text-xs text-foreground block">MongoDB</strong>
            <span className="text-[9px] text-muted-foreground">Mongoose schemas</span>
          </div>

          <div className="text-emerald-500 font-black text-xs select-none md:rotate-0 rotate-90">↓</div>

          {/* Socket.io */}
          <div className="p-4 bg-secondary/60 border border-border rounded-[var(--radius-md)] w-36 text-center flex flex-col items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <strong className="text-xs text-foreground block">Socket.io</strong>
            <span className="text-[9px] text-muted-foreground">Real-time chat alerts</span>
          </div>
        </div>
      </section>

      {/* Detailed Flow Lists */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-foreground">Core Module Data Pipelines</h2>
        
        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)]">
          <h3 className="font-bold text-sm text-primary mb-2">📚 Tutorials workflow</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Students query tutor listings via standard REST calls. Selecting slot schedules posts booking entries to MongoDB. The tutor accepts the session from their portal, triggering a background schedule update that updates the student calendar overview.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)]">
          <h3 className="font-bold text-sm text-[var(--primary)] mb-2">💼 Placement Referrals workflow</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Alumni post career listings. Students upload resume documents which validate profiles. Selecting referral slots flags notifications to the alumnus verifier. Endorsements route through corporate networks.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)]">
          <h3 className="font-bold text-sm text-emerald-500 mb-2">💬 Socket.io Real-time Chat workflow</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Open messaging windows establish TCP sockets. Typing status triggers event pulses to the partner client. Sent receipts update states, writing dialog data in message collections.
          </p>
        </div>
      </section>
    </div>
  );
}
