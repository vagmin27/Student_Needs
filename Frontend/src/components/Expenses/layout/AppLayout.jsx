import React, { useState } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { ArrowLeft } from "lucide-react";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!localStorage.getItem("User")) {
    return <Navigate to="/expenses-tracker/login" />;
  }

  return (
    <div
      className="expenses-layout font-inter relative h-screen overflow-hidden flex flex-col md:flex-row"
      data-lenis-prevent="true"
    >
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="expenses-main flex flex-col flex-1 min-h-0">
        <TopNavbar setIsSidebarOpen={setIsSidebarOpen} />

        <div className="expenses-content flex-1 overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </main>

      {/* Floating Back to Dashboard FAB */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          to="/student/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border border-white/10 dark:border-cyan-500/20 text-slate-300 hover:text-white shadow-lg hover:shadow-cyan-500/10 hover:scale-105 transition-all duration-300 text-sm font-semibold cursor-pointer"
          title="Back to Student Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-400" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default AppLayout;
