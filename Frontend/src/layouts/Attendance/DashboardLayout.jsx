import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Attendance/AuthContext";
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
import { FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

const teacherNav = [
  { label: "Dashboard",      to: "/dashboard",      icon: <MdDashboard /> },
  { label: "Attendance",     to: "/attendance",     icon: <MdChecklist /> },
  { label: "Add Student",    to: "/add-student",    icon: <MdPersonAdd /> },
  { label: "Remove Student", to: "/remove-student", icon: <MdPersonRemove /> },
  { label: "Add Subject",    to: "/add-subject",    icon: <MdLibraryBooks /> },
  { label: "Reports",        to: "/reports",        icon: <MdBarChart /> },
];

const studentNav = [
  { label: "My Dashboard",   to: "/student-dashboard", icon: <MdDashboard /> },
];

const DashboardLayout = ({ children, pageTitle }) => {
  const { user, logout, isTeacher } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = isTeacher ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/attendance/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="layout">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 99, display: "none",
          }}
          className="sidebar-overlay"
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
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
          <button className="btn btn-ghost" style={{ width: "100%", gap: 8 }} onClick={handleLogout}>
            <MdLogout size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <MdClose /> : <MdMenu />}
            </button>
            <span className="topbar-title">{pageTitle || "Dashboard"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="topbar-badge">{user?.role}</span>
            <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {initials}
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
