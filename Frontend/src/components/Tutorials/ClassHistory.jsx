import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import "../../styles/Tutorials/ClassHistory.css";
import ReviewModal from "./ReviewModal";
import API from "@/services/api/tutorialsApi.js";

/**
 * component that renders user class history
 * @returns Class History JSX
 */
function ClassHistory() {
  const auth = useAuth();
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currTutor, setCurrTutor] = useState({ tutor: "", tutor_lastname: "" });

  /**
   * this function gets the history of the user
   */
  useEffect(() => {
    try {
      const fetchSchedule = async () => {
        const { data: resHistory } = await API.get("/getSchedule");
        const userHistory = resHistory.data.history;
        setHistory([...userHistory]);
      };
      //only fetch schedule if user is logged in
      if (auth.user) {
        fetchSchedule();
      }
    } catch (err) {
      console.error(err);
    }
  }, [auth.user]);

  /**
   * function that renders comment button
   * @returns opens review modal when clicked
   */
  const renderCommentBtn = (i) => {
    return (
      <button
        className="commentBtnHistory"
        onClick={(evt) => {
          evt.preventDefault();
          setModalOpen(true);
          setCurrTutor(i);
        }}
      >
        add review
      </button>
    );
  };

  //function that closes modal when triggered
  const handleModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="mainDivHistory" role="main">
      <div className="innerDivHistory">
        <h1 className="titleHistory">My Class History</h1>
        {history?.map((i, idx) => {
          return (
            <div className="line1" key={`${i.date}_${idx}`}>
              <div className="scheduleDivHistory">
                <p className="datep">
                  <strong>Date :</strong> {i.date}
                </p>
                <p className="timep">
                  <strong>Time :</strong> {i.time}
                </p>
                <p className="tutorp">
                  <strong>Tutor :</strong> {i.tutor}
                </p>
                <p className="subjectp">
                  <strong>Subject :</strong> {i.subject}
                </p>
                <span className="commentBtnSpanHistory">
                  {renderCommentBtn(i)}
                </span>
              </div>
            </div>
          );
        })}
        <div className="reviewModalDiv">
          {modalOpen ? (
            <ReviewModal handleModal={handleModal} currTutor={currTutor} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

ClassHistory.propTypes = {};

export default ClassHistory;
