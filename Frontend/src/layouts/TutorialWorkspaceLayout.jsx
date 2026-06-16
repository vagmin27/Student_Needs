import React from "react";
import { Outlet } from "react-router-dom";
import TutorialSidebar from "@/components/Tutorials/TutorialSidebar";
import TutorialTopbar from "@/components/Tutorials/TutorialTopbar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import GlobalCallListener from "../components/Tutorials/calls/GlobalCallListener";

const WorkspaceContent = () => {
  const { isCollapsed, isMobileMenuOpen, closeMobileMenu } = useSidebar();

  return (
    <div className="font-sans relative h-screen overflow-hidden flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] animate-fade-in" data-lenis-prevent="true">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[var(--bg-primary)]/50 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[var(--card-bg)] border-r border-[var(--border-color)] sidebar-transition flex flex-col ${
          isMobileMenuOpen
            ? "translate-x-0 sidebar-expanded"
            : "-translate-x-full lg:translate-x-0 " + (isCollapsed ? "sidebar-collapsed" : "sidebar-expanded")
        }`}
      >
        <TutorialSidebar />
      </aside>

      {/* Main Content */}
      <main
        className={`flex flex-col flex-1 min-h-0 sidebar-transition ${
          isCollapsed ? "content-collapsed-offset" : "content-expanded-offset"
        }`}
      >
        <TutorialTopbar />

        <div className="flex-1 overflow-y-auto min-h-0 bg-[var(--bg-secondary)] p-space-md md:p-space-lg">
          <div className="max-w-[1600px] mx-auto w-full space-y-space-lg">
            <Outlet />
          </div>
        </div>
        <GlobalCallListener />
      </main>
    </div>
  );
};

const TutorialWorkspaceLayout = () => {
  return (
    <SidebarProvider>
      <WorkspaceContent />
    </SidebarProvider>
  );
};

export default TutorialWorkspaceLayout;
