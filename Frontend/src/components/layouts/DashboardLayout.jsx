import React, { createContext, useContext } from "react";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import GlobalCallListener from "../Tutorials/calls/GlobalCallListener";

export const LayoutContext = createContext(false);

const DashboardLayoutContent = ({ children, pageTitle, role }) => {
  const { isCollapsed, isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useSidebar();
  const location = useLocation();

  const getDynamicTitle = () => {
    if (pageTitle) return pageTitle;
    const path = location.pathname;
    if (path === "/student/dashboard") return "My Dashboard";
    if (path === "/student/attendance") return "Attendance";
    if (path.startsWith("/expenses-tracker")) {
      if (path.includes("/recurring")) return "Recurring Transactions";
      if (path.includes("/analytics")) return "Expenses Analytics";
      if (path.includes("/settings")) return "Expenses Settings";
      return "Expenses Tracker";
    }
    if (path === "/tutorials/home" || path === "/student/tutorials")
      return "Tutorials";
    if (path.startsWith("/tutorials")) {
      if (path.includes("/book") || path.includes("/searchTutor"))
        return "Find a Tutor";
      if (path.includes("/profile/editProfile")) return "Edit Profile";
      if (path.includes("/profile/manageBooking")) return "Manage Bookings";
      if (path.includes("/profile/classHistory")) return "Class History";
      if (path.includes("/profile/accountSettings") || path.includes("/tutor/settings")) return "Account Settings";
      if (path.includes("/profile")) return "Tutorial Profile";
      if (path.includes("/tutorials/online-attendance"))
        return "View Online Attendance";
      if (path.startsWith("/tutorials/attendance")) {
        if (path === "/tutorials/attendance") return "Attendance Management";
        if (path.includes("/subjects")) return "Tutor Subjects";
        if (path.includes("/mark-online")) return "Mark Online Attendance";
        if (path.includes("/dashboard")) return "Attendance Dashboard";
        if (path.includes("/mark")) return "Mark Attendance";
        if (path.includes("/add-student")) return "Add Student";
        if (path.includes("/remove-student")) return "Remove Student";
        if (path.includes("/add-subject")) return "Add Subject";
        if (path.includes("/reports")) return "Attendance Reports";
        return "Attendance Management";
      }
      return "Tutorials";
    }
    if (path.startsWith("/student/referrals")) return "Student Referrals";
    if (path.startsWith("/student/jobs")) return "Browse Jobs";
    if (path.startsWith("/student/profile")) return "My Profile";
    if (path.startsWith("/student/qrcode")) return "My QR Code";
    if (path.startsWith("/student/applied")) return "Applied Jobs";
    if (path.startsWith("/student/interview")) return "Interviews";
    if (path.startsWith("/student/chat")) return "Referrals Chat";
    if (path.startsWith("/alumni/chat")) return "Referrals Chat";
    return "Dashboard";
  };

  return (
    <div className="app-dashboard-layout flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border sidebar-transition flex flex-col ${
          isMobileMenuOpen
            ? "translate-x-0 sidebar-expanded"
            : "-translate-x-full lg:translate-x-0 " + (isCollapsed ? "sidebar-collapsed" : "sidebar-expanded")
        }`}
      >
        <Sidebar className="w-full h-full" role={role} />
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-w-0 min-h-0 sidebar-transition dashboard-background ${
          isCollapsed ? "content-collapsed-offset" : "content-expanded-offset"
        }`}
        data-lenis-prevent="true"
      >
        <Navbar
          pageTitle={getDynamicTitle()}
          onMenuClick={toggleMobileMenu}
        />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="dashboard-container space-y-space-lg">
            {children || <Outlet />}
          </div>
        </div>
        <GlobalCallListener />
      </main>
    </div>
  );
};

const DashboardLayout = ({ children, pageTitle, role = "student" }) => {
  const isNested = useContext(LayoutContext);

  if (isNested) {
    return <>{children || <Outlet />}</>;
  }

  return (
    <SidebarProvider>
      <LayoutContext.Provider value={true}>
        <DashboardLayoutContent pageTitle={pageTitle} role={role}>
          {children}
        </DashboardLayoutContent>
      </LayoutContext.Provider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
