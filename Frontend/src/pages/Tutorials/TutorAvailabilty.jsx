import React, { useState, useEffect, useContext } from "react";
import studyImg from "../../assets/images/study2.jpg";
import { useNavigate } from "react-router-dom";
import { saveTutorAvailability } from "@/services/api/tutorialsApi.js";
import Navbar from "../../components/Tutorials/Navbar";
import { LayoutContext } from "@/components/layouts/DashboardLayout";

function TutorAvailability() {
  const isUnifiedLayout = useContext(LayoutContext);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);

  // ✅ Add Subject
  const addSubject = () => {
    if (subjectInput.trim() === "") return;

    if (!subjects.includes(subjectInput)) {
      setSubjects([...subjects, subjectInput]);
    }

    setSubjectInput("");
  };

  // ❌ Remove Subject
  const removeSubject = (sub) => {
    setSubjects(subjects?.filter((s) => s !== sub));
  };

  // ✅ Add Slot
  const addSlot = () => {
    if (!date || !time) {
      alert("Select date and time ❌");
      return;
    }

    const newSlot = `${date} - ${time}`;

    setSlots([...slots, newSlot]);

    setDate("");
    setTime("");
  };

  // ❌ Remove Slot
  const removeSlot = (slot) => {
    setSlots(slots?.filter((s) => s !== slot));
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subjects.length === 0 || slots.length === 0) {
      alert("Add at least one subject and time slot ❌");
      return;
    }

    const data = {
      subjects,
      timeSlots: slots,
    };

    try {
      await saveTutorAvailability(data);

      alert("Availability saved ✅");

      navigate("/tutorials/tutor/schedule");
    } catch (err) {
      console.error(err);
      alert("Error saving data ❌");
    }
  };

  return (
    <>
      {!isUnifiedLayout && <Navbar />}

      <div
        className={isUnifiedLayout ? "py-4 md:py-8" : "min-h-screen bg-[var(--bg-primary)] py-8 px-4 overflow-y-auto"}
        data-lenis-prevent={isUnifiedLayout ? "false" : "true"}
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto px-4">
          {/* LEFT */}
          <div className="flex-1 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
              Set Your Availability
            </h2>

            <img 
              src={studyImg} 
              alt="study" 
              className="w-[280px] md:w-[320px] max-w-full rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* RIGHT */}
          <div className="flex-1 w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] p-6 md:p-8 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SUBJECTS */}
              <div>
                <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Add Subjects</h4>

                <input
                  type="text"
                  placeholder="Enter subject (Java, AI...)"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full p-3 mb-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all placeholder:text-[var(--text-muted)] text-sm"
                />

                <button 
                  type="button" 
                  onClick={addSubject} 
                  className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] transition-all mb-4"
                >
                  Add Subject
                </button>

                <div className="flex flex-wrap gap-2 mb-4">
                  {subjects?.map((sub, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-full text-xs font-medium"
                    >
                      {sub}
                      <button 
                        type="button" 
                        onClick={() => removeSubject(sub)}
                        className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors focus:outline-none"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* TIME SLOT */}
              <div>
                <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Add Time Slot</h4>

                {(() => {
                  const today = new Date().toISOString().split("T")[0];

                  return (
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 mb-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                    />
                  );
                })()}

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 mb-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-transparent transition-all text-sm"
                />

                <button 
                  type="button" 
                  onClick={addSlot} 
                  className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] transition-all mb-4"
                >
                  Add Slot
                </button>

                <div className="flex flex-wrap gap-2 mb-4">
                  {slots?.map((slot, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-full text-xs font-medium"
                    >
                      {slot}
                      <button 
                        type="button" 
                        onClick={() => removeSlot(slot)}
                        className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors focus:outline-none"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 px-4 font-bold text-sm text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[var(--radius-md)] transition-all duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px]"
              >
                Save Availability
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default TutorAvailability;
