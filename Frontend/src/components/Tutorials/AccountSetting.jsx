import React from "react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { ThemePreference } from "@/components/ThemePreference.jsx";
import StudentProfileView from "@/components/profile/StudentProfileView.jsx";
import TutorProfileView from "@/components/profile/TutorProfileView.jsx";
import AlumniProfileView from "@/components/profile/AlumniProfileView.jsx";

function AccountSetting() {
  const { user } = useAuth();
  const role = (user?.role || user?.accountType || "student").toLowerCase();

  return (
    <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in-up">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold font-mont text-foreground tracking-tight flex items-center gap-3">
          <span className="text-brand-primary">Settings</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your theme preferences and account profile information.
        </p>
      </div>

      {/* Global Theme Preference Section */}
      <div className="glass-panel p-6 bg-card border border-border rounded-xl">
        <ThemePreference
          variant="inline"
          title="Theme Preference"
          description="Choose between Light and Dark mode styles. Syncs across the platform."
        />
      </div>

      {/* Profile Management Section */}
      <div className="glass-panel p-6 bg-card border border-border rounded-xl">
        {role === "student" && <StudentProfileView />}
        {(role === "tutor" || role === "teacher") && <TutorProfileView />}
        {role === "alumni" && <AlumniProfileView />}
      </div>
    </main>
  );
}

export default AccountSetting;
