import React from "react";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";
import Profile from "../../components/Tutorials/Profile";

function ProfilePage() {
  return (
    <>
      <Navbar />

      <div
        className="flex"
        style={{
          paddingTop: "100px",
          minHeight: "100vh",
        }}
      >
        <SideNav />
        <Profile />
      </div>
    </>
  );
}

export default ProfilePage;