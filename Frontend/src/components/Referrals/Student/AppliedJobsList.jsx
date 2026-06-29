import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { CandidateTable } from "../shared/CandidateTable.jsx";

export function AppliedJobsList({ applications = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-card rounded-[var(--radius-lg)] p-12 border border-border/50 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Loading Applications...
        </h3>
        <p className="text-muted-foreground">
          Fetching your job applications
        </p>
      </div>
    );
  }

  // Pre-process applications for the CandidateTable mapping
  const mappedCandidates = applications?.map((app) => ({
    ...app,
    studentName: "Me", // From student perspective, they are the candidate
    company: app.opportunity?.postedBy?.company || app.alumni?.company || "Unknown Company",
    role: app.opportunity?.jobTitle || "Role Specified",
    status: app.status,
    stage: app.stage || app.interviewStage || "applied",
  })) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <CandidateTable
        candidates={mappedCandidates}
        onActionClick={(app) => {
          navigate(`/referrals/chat?chatId=${app.chatId || ""}`);
        }}
        actionLabel="Chat"
        emptyMessage="You haven't applied to any referral opportunities yet. Browse available opportunities and start applying!"
      />
    </div>
  );
}