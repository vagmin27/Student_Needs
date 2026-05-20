import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PricePanel from "./PricePanel";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import "../../styles/Tutorials/AccountSetting.css";
import API from "@/services/api/tutorialsApi.js";

function AccountSetting() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [classCount, setClassCount] = useState(0);

  const alertDel = (e) => {
    e.preventDefault();
    if (window.confirm("Confirm to permanently cancel your account.")) {
      delAC();
    }
  };

  // ✅ FIXED DELETE ACCOUNT API
  const delAC = async () => {
    try {
      const { data } = await API.delete(`/account/deleteAccount/${auth.user?._id}`);
      alert(data.message);

      auth.logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error deleting account");
    }
  };

  return (
    <main className="AccountSetting">
      <h1 className="plan-selection">Select your plan</h1>

      <div className="price-container">
        <PricePanel />

        <div className="select-plan">
          <button
            className="btnAccount"
            onClick={() => setClassCount(classCount + 1)}
          >
            ONE TIMER
          </button>

          <button
            className="btnAccount"
            onClick={() => setClassCount(classCount + 3)}
          >
            BRUSH UP PLAN
          </button>

          <button
            className="btnAccount"
            onClick={() => setClassCount(classCount + 5)}
          >
            PRO PLAN
          </button>
        </div>
      </div>

      <div className="delete-account">
        <button className="delete-button" onClick={alertDel}>
          I would like to delete my account...
        </button>
      </div>
    </main>
  );
}

export default AccountSetting;
