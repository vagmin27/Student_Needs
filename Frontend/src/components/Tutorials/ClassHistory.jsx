import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
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
        className="px-4 py-2 text-xs font-bold rounded-[var(--radius-md)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px"
        onClick={(evt) => {
          evt.preventDefault();
          setModalOpen(true);
          setCurrTutor(i);
        }}
      >
        Add Review
      </button>
    );
  };

  //function that closes modal when triggered
  const handleModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" role="main">
      <div className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)]">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
          My Class History
        </h1>
        
        {history.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            No completed classes found in your history.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((i, idx) => (
              <div 
                key={`${i.date}_${idx}`}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:-translate-y-[2px] transition-all duration-200 hover:shadow-[var(--shadow-md)]"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] flex-grow">
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-[var(--text-primary)]">Date:</span> {i.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-[var(--text-primary)]">Time:</span> {i.time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-[var(--text-primary)]">Tutor:</span> {i.tutor} {i.tutor_lastname || ""}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="font-semibold text-[var(--text-primary)]">Subject:</span> {i.subject}
                  </p>
                </div>
                <div className="flex justify-end md:ml-auto">
                  {renderCommentBtn(i)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {modalOpen && (
          <ReviewModal handleModal={handleModal} currTutor={currTutor} />
        )}
      </div>
    </div>
  );
}

ClassHistory.propTypes = {};

export default ClassHistory;
