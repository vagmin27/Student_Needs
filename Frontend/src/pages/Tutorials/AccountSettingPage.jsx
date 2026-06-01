import React from "react";
import AccountSetting from "../../components/Tutorials/AccountSetting";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";

function AccountSettingPage() {
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
          <AccountSetting />
        </div>
      </div>
    </>
  );
}

export default AccountSettingPage;
