import React, { useEffect } from "react";
import { Shield, Lock, Key, EyeOff } from "lucide-react";

export default function Security() {
  useEffect(() => {
    document.title = "Security & Privacy - UniConnect Platform";
  }, []);

  return (
    <div className="container px-6 py-12 max-w-4xl mx-auto text-left">
      <div className="uc-section-header text-center mb-16 max-w-xl mx-auto">
        <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Security</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mt-4 mb-4">Security & Privacy Protocols</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          UniConnect places data protection at the core of all operations. Discover the standards we utilize to secure student budgets, chat rooms, and profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)] space-y-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 text-primary flex items-center justify-center"><Key className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground">JWT Authentication</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All user sessions are validated via JSON Web Tokens (JWT). Tokens are stored in secure HTTP-only cookies to eliminate Cross-Site Scripting (XSS) vulnerability vectors.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)] space-y-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center"><Lock className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground">Password Hashing</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Password credentials are hashed using the bcrypt algorithm with a work factor of 10 prior to database storage, ensuring database breaches never compromise raw passwords.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)] space-y-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground">Protected Routes</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Frontend router views are guarded by React check hooks that verify authenticated states. Non-authenticated users are immediately redirected back to login flows.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-[var(--radius-md)] space-y-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-cyan-400/10 text-cyan-400 flex items-center justify-center"><EyeOff className="w-5 h-5" /></div>
          <h3 className="font-bold text-sm text-foreground">Role-Based Access (RBAC)</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Access to specific backend models (e.g. Tutor availability calendar slots, alumni referrals tracking, expense budget lines) is strictly gated using Student/Tutor/Alumni role checks.
          </p>
        </div>
      </div>
    </div>
  );
}
