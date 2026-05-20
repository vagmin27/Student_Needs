import React from "react";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";
import ClassHistory from "../../components/Tutorials/ClassHistory";

function ClassHistoryPage() {
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
        <ClassHistory />
      </div>
    </>
  );
}

export default ClassHistoryPage;