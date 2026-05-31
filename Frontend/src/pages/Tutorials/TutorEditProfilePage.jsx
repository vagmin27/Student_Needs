import React from "react";
import Navbar from "../../components/Tutorials/Navbar";
import TutorProfileView from "@/components/profile/TutorProfileView.jsx";

function TutorEditProfilePage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "100px", minHeight: "100vh", paddingBottom: "40px" }}>
        <TutorProfileView />
      </div>
    </>
  );
}

export default TutorEditProfilePage;