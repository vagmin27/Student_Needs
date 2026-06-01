import React, { useContext } from "react";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";
import Profile from "../../components/Tutorials/Profile";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";

function ProfilePage() {
  const isUnifiedLayout = useContext(LayoutContext);

  return (
    <>
      {!isUnifiedLayout && <Navbar />}
      {isUnifiedLayout && <BackToStudentDashboard />}

      <div
        className="flex h-[calc(100vh-100px)] md:h-screen overflow-hidden"
        style={{
          paddingTop: isUnifiedLayout ? "0" : "0",
        }}
        data-lenis-prevent="true"
      >
        <SideNav />
        <div className="flex-1 overflow-y-auto min-h-0 min-w-0">
          <Profile />
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
