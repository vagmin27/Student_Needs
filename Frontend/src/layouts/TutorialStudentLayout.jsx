import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TutorialSidebar from "@/components/Tutorials/TutorialSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const TutorialStudentLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[calc(100vh-10rem)]">
      {/* Mobile Header / Trigger */}
      <div className="md:hidden flex items-center justify-between bg-card p-4 rounded-[var(--radius-sm)] border shadow-[var(--shadow-sm)]">
        <span className="font-semibold text-lg">Tutorials Menu</span>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <TutorialSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-1 bg-card rounded-[var(--radius-sm)] border shadow-[var(--shadow-sm)] p-4 md:p-6 overflow-x-hidden min-h-[50vh]">
        <Outlet />
      </div>
    </div>
  );
};

export default TutorialStudentLayout;
