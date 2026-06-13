import React from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { ArrowLeft } from "lucide-react";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

const AppLayoutContent = () => {
  const { isCollapsed, isMobileMenuOpen, closeMobileMenu } = useSidebar();

  return (
    <div
      className="expenses-layout font-inter relative h-screen overflow-hidden flex flex-col md:flex-row bg-background text-foreground animate-fade-in"
      data-lenis-prevent="true"
    >
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/50 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border sidebar-transition flex flex-col ${
          isMobileMenuOpen
            ? "translate-x-0 sidebar-expanded"
            : "-translate-x-full md:translate-x-0 " + (isCollapsed ? "sidebar-collapsed" : "sidebar-expanded")
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main
        className={`expenses-main flex flex-col flex-1 min-h-0 sidebar-transition ${
          isCollapsed ? "content-collapsed-offset" : "content-expanded-offset"
        }`}
      >
        <TopNavbar />

        <div className="expenses-content flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </main>

      {/* Floating Back to Dashboard FAB */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          to="/student/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border border-white/10 dark:border-cyan-500/20 text-muted-foreground hover:text-white shadow-[var(--shadow-lg)] hover:shadow-cyan-500/10 hover:scale-105 transition-all duration-300 text-sm font-semibold cursor-pointer"
          title="Back to Student Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--primary)]" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

const AppLayout = () => {
  if (!localStorage.getItem("User")) {
    return <Navigate to="/expenses-tracker/login" />;
  }

  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
