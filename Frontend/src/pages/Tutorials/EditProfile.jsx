import React from "react";
import EditProfile from "../../components/Tutorials/EditProfile";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";

function EditProfilePage() {
  return (
    <>
      <Navbar />

      <div
        className="flex h-[calc(100vh-100px)] overflow-hidden"
        style={{}}
        data-lenis-prevent="true"
      >
        <SideNav />
        <div className="flex-1 overflow-y-auto min-h-0 min-w-0">
          <EditProfile />
        </div>
      </div>
    </>
  );
}

export default EditProfilePage;
