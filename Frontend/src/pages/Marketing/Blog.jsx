import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function Blog() {
  useEffect(() => {
    document.title = "UniConnect Blog - Student Insights & Tech Updates";
  }, []);

  return (
    <div className="container px-6 py-24 max-w-xl mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-4">UniConnect Startup Blog</h1>
      <p className="text-xs text-muted-foreground leading-relaxed mb-8">
        We are preparing articles, engineering writeups, study tips, and referral strategies. Stay tuned for insights from our student and alumni developer team.
      </p>
      
      <div className="p-4 bg-secondary/35 border border-border/80 rounded-[var(--radius-md)] mb-8 select-none">
        <span className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
          🚀 coming soon • updates launching next week
        </span>
      </div>

      <Link to="/" className="text-primary hover:text-primary-hover font-semibold inline-flex items-center gap-1.5 text-xs">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Page
      </Link>
    </div>
  );
}
