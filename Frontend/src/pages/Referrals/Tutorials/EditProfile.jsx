import React from "react";
import EditProfile from "../../components/Tutorials/EditProfile";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";

function EditProfilePage() {
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
        <EditProfile />
      </div>
    </>
  );
}

export default EditProfilePage;