import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { sidebarData } from "./sidebarData";
import { LayoutContext } from "../layouts/DashboardLayout";

function SideNav() {
  const isNested = useContext(LayoutContext);

  if (isNested) {
    return null;
  }

  return (
    <div role="complementary" className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] h-screen py-6 px-4 shrink-0 select-none">
      <div>
        <ul className="flex flex-col gap-1.5 list-none">
          {sidebarData?.map((item, index) => {
            return (
              <li key={index} className="w-full">
                <Link 
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/80 hover:text-[var(--text-primary)] transition-all"
                >
                  <span className="w-5 h-5 text-[var(--text-muted)] shrink-0 flex items-center justify-center">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

SideNav.propTypes = {};

export default SideNav;