import React, { useState, useEffect } from "react";
import studyImg from "../../assets/images/study2.jpg";
import "../../styles/Tutorials/TutorAvailability.css";
import { useNavigate } from "react-router-dom";
import { saveTutorAvailability, getTutorProfile } from "@/services/api/tutorialsApi.js";
import Navbar from "../../components/Tutorials/Navbar";

function TutorAvailability() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const res = await getTutorProfile();

        if (!res.data?.profile) {
          navigate("/login/tutor");
          return;
        }
      } catch (err) {
        console.error("Not authenticated");
        navigate("/login/tutor");
      }
    };

    fetchTutorProfile();
  }, [navigate]);

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
      <Navbar />

      <div
        className="availability-page"
        style={{
          paddingTop: "120px",
          minHeight: "100vh",
        }}
      >
        <div className="availability-container">
          
          {/* LEFT */}
          <div className="availability-left">
            <h2>Set Your Availability</h2>

            <img src={studyImg} alt="study" />
          </div>

          {/* RIGHT */}
          <div className="availability-right">
            <form
              onSubmit={handleSubmit}
              className="availability-form"
            >
              {/* SUBJECTS */}
              <div>
                <h4>Add Subjects</h4>

                <input
                  type="text"
                  placeholder="Enter subject (Java, AI...)"
                  value={subjectInput}
                  onChange={(e) =>
                    setSubjectInput(e.target.value)
                  }
                  className="availability-input"
                />

                <button
                  type="button"
                  onClick={addSubject}
                  className="add-btn"
                >
                  Add Subject
                </button>

                <div className="tag-container">
                  {subjects?.map((sub, index) => (
                    <span key={index} className="tag">
                      {sub}

                      <button
                        type="button"
                        onClick={() => removeSubject(sub)}
                      >
                        ❌
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* TIME SLOT */}
              <div>
                <h4>Add Time Slot</h4>

                {(() => {
                  const today =
                    new Date().toISOString().split("T")[0];

                  return (
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) =>
                        setDate(e.target.value)
                      }
                      className="availability-input"
                    />
                  );
                })()}

                <input
                  type="time"
                  value={time}
                  onChange={(e) =>
                    setTime(e.target.value)
                  }
                  className="availability-input"
                />

                <button
                  type="button"
                  onClick={addSlot}
                  className="add-btn"
                >
                  Add Slot
                </button>

                <div className="tag-container">
                  {slots?.map((slot, index) => (
                    <span key={index} className="tag">
                      {slot}

                      <button
                        type="button"
                        onClick={() => removeSlot(slot)}
                      >
                        ❌
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="save-btn"
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
