import React, { useContext } from "react";
import AccountSetting from "../../components/Tutorials/AccountSetting";
import Navbar from "../../components/Tutorials/Navbar";

import { LayoutContext } from "@/components/layouts/DashboardLayout";


function AccountSettingPage() {
  const isUnifiedLayout = useContext(LayoutContext);

  return (
    <>
      {!isUnifiedLayout && <Navbar />}


      {isUnifiedLayout ? (
        <AccountSetting />
      ) : (
        <div
          className="flex h-[calc(100vh-100px)] overflow-hidden"
          style={{}}
          data-lenis-prevent="true"
        >

          <div className="flex-1 overflow-y-auto min-h-0 min-w-0">
            <AccountSetting />
          </div>
        </div>
      )}
    </>
  );
}

export default AccountSettingPage;
