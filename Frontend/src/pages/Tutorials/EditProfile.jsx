import React, { useContext } from "react";
import EditProfile from "../../components/Tutorials/EditProfile";
import Navbar from "../../components/Tutorials/Navbar";

import { LayoutContext } from "@/components/layouts/DashboardLayout";


function EditProfilePage() {
  const isUnifiedLayout = useContext(LayoutContext);

  return (
    <>
      {!isUnifiedLayout && <Navbar />}


      {isUnifiedLayout ? (
        <EditProfile />
      ) : (
        <div
          className="flex h-[calc(100vh-100px)] overflow-hidden"
          style={{}}
          data-lenis-prevent="true"
        >

          <div className="flex-1 overflow-y-auto min-h-0 min-w-0">
            <EditProfile />
          </div>
        </div>
      )}
    </>
  );
}

export default EditProfilePage;
