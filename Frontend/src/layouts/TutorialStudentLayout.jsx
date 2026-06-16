import React from "react";
import { Outlet } from "react-router-dom";
import TutorialSidebar from "@/components/Tutorials/TutorialSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

const TutorialStudentLayoutContent = () => {
  const { isCollapsed, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useSidebar();

  return (
    <div className="flex flex-col lg:flex-row gap-space-lg h-full min-h-[calc(100vh-10rem)] relative max-w-[1600px] mx-auto w-full px-space-md md:px-space-lg">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/50 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Header / Trigger */}
      <div className="md:hidden flex items-center justify-between bg-[var(--card-bg)] p-space-md rounded-[var(--radius-md)] border border-[var(--border-color)] shadow-sm">
        <span className="font-semibold text-lg">Tutorials Menu</span>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[var(--card-bg)] border-r border-[var(--border-color)] sidebar-transition flex flex-col lg:relative lg:translate-x-0 lg:z-0 lg:border-r-0 lg:bg-transparent ${
          isMobileMenuOpen
            ? "translate-x-0 sidebar-expanded"
            : "-translate-x-full lg:translate-x-0 " + (isCollapsed ? "sidebar-collapsed" : "sidebar-expanded")
        }`}
      >
        <TutorialSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-[var(--card-bg)] rounded-[var(--radius-md)] border border-[var(--border-color)] shadow-sm p-space-md md:p-space-lg overflow-x-hidden min-h-[50vh]">
        <Outlet />
      </div>
    </div>
  );
};

const TutorialStudentLayout = () => {
  return (
    <SidebarProvider>
      <TutorialStudentLayoutContent />
    </SidebarProvider>
  );
};

export default TutorialStudentLayout;
