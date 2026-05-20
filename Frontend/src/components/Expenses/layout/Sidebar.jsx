import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdSettings,
  MdPieChart,
} from "react-icons/md";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { name: "Dashboard", path: "/expenses-tracker", icon: <MdDashboard size={24} /> },
    {
      name: "Recurring",
      path: "/expenses-tracker/recurring",
      icon: <MdAccountBalanceWallet size={24} />,
    },
    { name: "Analytics", path: "/expenses-tracker/analytics", icon: <MdPieChart size={24} /> },
    { name: "Settings", path: "/expenses-tracker/settings", icon: <MdSettings size={24} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-l-0 rounded-l-none transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex md:flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-center h-24 border-b border-white/10">
          <h1 className="text-2xl font-bold font-mont tracking-wider text-white">
            <span className="text-brand-primary">Fin</span>Track
          </h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems?.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/expenses-tracker"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-200">
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
