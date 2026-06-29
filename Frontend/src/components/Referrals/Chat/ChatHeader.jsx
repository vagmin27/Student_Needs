import React from "react";
import { ArrowLeft, Download, Globe, Briefcase } from "lucide-react";

export function ChatHeader({ 
  participant, 
  currentRole, 
  isOnline, 
  onBack, 
  onDownloadResume 
}) {
  const initials = `${participant?.firstName?.[0] || ""}${participant?.lastName?.[0] || ""}`;

  return (
    <div className="p-4 border-b border-border/40 bg-card/45 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        <button 
          onClick={onBack}
          className="md:hidden p-2 hover:bg-secondary rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Participant Info */}
        <div className="relative flex-shrink-0">
          {participant?.image ? (
            <img
              src={participant.image}
              alt={`${participant.firstName} ${participant.lastName}`}
              className="w-10 h-10 rounded-full border border-border/20 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30 uppercase">
              {initials}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm text-foreground">
            {participant?.firstName} {participant?.lastName}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isOnline ? "Active Now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Quick Actions Header */}
      <div className="flex flex-wrap items-center gap-2">
        {currentRole === "alumni" ? (
          <>
            {/* Alumni Actions */}
            <button 
              onClick={onDownloadResume}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </button>
            {participant?.githubUrl && (
              <a 
                href={participant.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
            {participant?.linkedinUrl && (
              <a 
                href={participant.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold bg-secondary/80 border border-border/50 text-foreground hover:bg-secondary transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
          </>
        ) : (
          <>
            {/* Student Actions */}
            {participant?.company && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] text-[10px] bg-primary/10 border border-primary/20 text-primary font-bold">
                <Briefcase className="w-3 h-3" />
                {participant.company}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
