import React from "react";
import AccountSetting from "../../components/Tutorials/AccountSetting";
import Navbar from "../../components/Tutorials/Navbar";
import SideNav from "@/components/Tutorials/SideNav";

function AccountSettingPage() {
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
        <AccountSetting />
      </div>
    </>
  );
}

export default AccountSettingPage;