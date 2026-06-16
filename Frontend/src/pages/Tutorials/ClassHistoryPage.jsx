import React, { useContext } from "react";
import Navbar from "../../components/Tutorials/Navbar";

import ClassHistory from "../../components/Tutorials/ClassHistory";
import { LayoutContext } from "@/components/layouts/DashboardLayout";


function ClassHistoryPage() {
  const isUnifiedLayout = useContext(LayoutContext);

  return (
    <>
      {!isUnifiedLayout && <Navbar />}


      {isUnifiedLayout ? (
        <ClassHistory />
      ) : (
        <div
          className="flex h-[calc(100vh-100px)] md:h-screen overflow-hidden"
          style={{}}
          data-lenis-prevent="true"
        >

          <div className="flex-1 overflow-y-auto min-h-0 min-w-0">
            <ClassHistory />
          </div>
        </div>
      )}
    </>
  );
}

export default ClassHistoryPage;
