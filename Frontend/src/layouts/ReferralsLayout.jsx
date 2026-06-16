import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ReferralsSidebar from "@/components/Referrals/ReferralsSidebar";
import Navbar from "@/components/dashboard/Navbar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import GlobalCallListener from "../components/Tutorials/calls/GlobalCallListener";
import { LayoutContext } from "../components/layouts/DashboardLayout";

const ReferralsLayoutContent = () => {
  const { isCollapsed, isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useSidebar();
  const location = useLocation();

  const getDynamicTitle = () => {
    const path = location.pathname;
    if (path.includes("/applied-jobs")) return "Applied Jobs";
    if (path.includes("/browse-jobs")) return "Browse Jobs";
    if (path.includes("/browse-referrals")) return "Browse Referrals";
    if (path.includes("/profile")) return "My Profile";
    if (path.includes("/chat")) return "Referrals Chat";
    return "Referrals";
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
        <ReferralsSidebar className="w-full h-full" />
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-w-0 min-h-0 sidebar-transition ${
          isCollapsed ? "content-collapsed-offset" : "content-expanded-offset"
        }`}
        data-lenis-prevent="true"
      >
        <Navbar
          pageTitle={getDynamicTitle()}
          onMenuClick={toggleMobileMenu}
        />
        <div className="flex-1 min-h-0 overflow-y-auto dashboard-container">
          <div className="max-w-[1600px] mx-auto space-y-space-lg">
            <LayoutContext.Provider value={true}>
              <Outlet />
            </LayoutContext.Provider>
          </div>
        </div>
        <GlobalCallListener />
      </main>
    </div>
  );
};

const ReferralsLayout = () => {
  return (
    <SidebarProvider>
      <ReferralsLayoutContent />
    </SidebarProvider>
  );
};

export default ReferralsLayout;
