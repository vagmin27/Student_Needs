import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import {
  MdOutlineSchool,
  MdDashboard,
  MdChecklist,
  MdPersonAdd,
  MdPersonRemove,
  MdLibraryBooks,
  MdBarChart,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import toast from "react-hot-toast";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";

const teacherNav = [
  { label: "Dashboard",      to: "/attendance/dashboard",      icon: <MdDashboard /> },
  { label: "Attendance",     to: "/attendance/attendance",     icon: <MdChecklist /> },
  { label: "Add Student",    to: "/attendance/add-student",    icon: <MdPersonAdd /> },
  { label: "Remove Student", to: "/attendance/remove-student", icon: <MdPersonRemove /> },
  { label: "Add Subject",    to: "/attendance/add-subject",    icon: <MdLibraryBooks /> },
  { label: "Reports",        to: "/attendance/reports",        icon: <MdBarChart /> },
];

const studentNav = [
  { label: "My Dashboard",   to: "/student/dashboard", icon: <MdDashboard /> },
];

const DashboardLayoutContent = ({ children, pageTitle }) => {
  const { user, logout, isTeacher } = useAuth();
  const navigate = useNavigate();
  const { isCollapsed, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useSidebar();

  const navItems = isTeacher ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/attendance/login");
  };

  const initials = user?.name
    ? user.name.split(" ")?.map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="layout">
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99] sidebar-overlay"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <MdOutlineSchool color="#fff" size={20} />
            </div>
            <div>
              <div className="sidebar-brand-name">AttendEase</div>
              <div className="sidebar-brand-sub">
                {isTeacher ? "Teacher Portal" : "Student Portal"}
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems?.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 text-[var(--text-secondary)] hover:bg-[var(--neutral-bg)]/20"
            onClick={handleLogout}
          >
            <MdLogout size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
            </button>
            <span className="topbar-title">{pageTitle || "Dashboard"}</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="topbar-badge">{user?.role}</span>
            <div className="user-avatar w-8 h-8 text-[12px] flex items-center justify-center rounded-full bg-[var(--accent)] text-white">
              {initials}
            </div>
          </div>
        </header>

        <main className="page-content p-0">
          <div className="max-w-[1600px] mx-auto w-full p-space-md md:p-space-lg space-y-space-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children, pageTitle }) => {
  return (
    <SidebarProvider>
      <DashboardLayoutContent pageTitle={pageTitle}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;
