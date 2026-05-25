import React, { useState, createContext, useContext } from "react";
import Sidebar from "../dashboard/Sidebar";
import Navbar from "../dashboard/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export const LayoutContext = createContext(false);

const DashboardLayout = ({ children, pageTitle, role = "student" }) => {
  const isNested = useContext(LayoutContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (isNested) {
    return <>{children || <Outlet />}</>;
  }

  const getDynamicTitle = () => {
    if (pageTitle) return pageTitle;
    const path = location.pathname;
    if (path === "/student/dashboard") return "My Dashboard";
    if (path.startsWith("/expenses-tracker")) {
      if (path.includes("/recurring")) return "Recurring Transactions";
      if (path.includes("/analytics")) return "Expenses Analytics";
      if (path.includes("/settings")) return "Expenses Settings";
      return "Expenses Tracker";
    }
    if (path.startsWith("/tutorials")) {
      if (path.includes("/searchTutor") || path.includes("/book")) return "Find a Tutor";
      if (path.includes("/profile/editProfile")) return "Edit Profile";
      if (path.includes("/profile/manageBooking")) return "Manage Bookings";
      if (path.includes("/profile/classHistory")) return "Class History";
      if (path.includes("/profile/accountSettings")) return "Account Settings";
      if (path.includes("/profile")) return "Tutorial Profile";
      if (path.startsWith("/tutorials/attendance")) {
        if (path === "/tutorials/attendance") return "Attendance Management";
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
    return "Dashboard";
  };

  return (
    <LayoutContext.Provider value={true}>
      <div className="flex min-h-screen w-full bg-background">
        {/* Mobile Sidebar overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar className="w-full" role={role} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            pageTitle={getDynamicTitle()}
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default DashboardLayout;
