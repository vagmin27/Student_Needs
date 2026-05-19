import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Tutorials/TutorSchedule.css";
import teachingImg from "../../assets/images/Teaching.jpg";
import API, { getSchedule } from "@/services/api/tutorialsApi.js";
import Navbar from "../../components/Tutorials/Navbar";

function TutorSchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getSchedule();
        setSchedule(res.data.data?.schedule || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const deleteSlot = async (slotId) => {
    if (!window.confirm("Delete this slot? This cannot be undone.")) return;

    try {
      await API.delete(`/tutor/schedule/${slotId}`);

      setSchedule((prev) =>
        prev?.filter((s) => s._id !== slotId)
      );

      alert("Slot deleted ✅");
    } catch (err) {
      console.error(err);
      alert("Error deleting slot ❌");
    }
  };

  return (
    <>
      <Navbar />

      <div className="schedule-page">

        {/* TITLE */}
        <div className="schedule-navbar">
          <h2>📅 My Schedule</h2>
        </div>

        {/* DASHBOARD BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 40px 0 40px",
          }}
        >
          <button
            onClick={() => navigate("/tutorials/tutor/dashboard")}
            style={{
              background: "#ff7a2f",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            🏠 Dashboard
          </button>
        </div>

        {/* MAIN */}
        <div className="schedule-container">

          {/* LEFT IMAGE */}
          <div className="schedule-left">
            <img src={teachingImg} alt="teaching" />
          </div>

          {/* RIGHT */}
          <div className="schedule-right">

            {loading ? (
              <p>Loading schedule... ⏳</p>
            ) : schedule.length === 0 ? (
              <p>No schedule found ❌</p>
            ) : (
              schedule?.map((item, index) => (
                <div key={index} className="schedule-card">

                  <div className="slot-info">
                    <p>
                      <strong>📅 Date:</strong> {item.date}
                    </p>

                    <p>
                      <strong>⏰ Time:</strong> {item.time}
                    </p>

                    <p>
                      <strong>📖 Subject:</strong>{" "}
                      {item.subject || item.subjects || "N/A"}
                    </p>

                    {item.tutor && (
                      <p>
                        <strong>👨‍🏫 Tutor:</strong> {item.tutor}
                      </p>
                    )}

                    <p>
                      <strong>Status:</strong>{" "}
                      {item.isBooked ? "✅ Booked" : "⏳ Available"}
                    </p>
                  </div>

                  <div className="link-section">

                    <input
                      type="text"
                      placeholder="Paste Zoom / Google Meet link"
                      value={item.meetingLink || ""}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].meetingLink = e.target.value;
                        setSchedule(updated);
                      }}
                      className="link-input"
                    />

                    <button
                      className="save-link-btn"
                      onClick={async () => {
                        try {
                          await API.post("/tutor/save-link", {
                            slotTime: `${item.date} - ${item.time}`,
                            link: item.meetingLink,
                          });

                          alert("Link saved ✅");
                        } catch (err) {
                          console.error(err);
                          alert("Error ❌");
                        }
                      }}
                    >
                      Save Link
                    </button>

                    {item.meetingLink && (
                      <p>
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Join Class 🚀
                        </a>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSlot(item._id)}
                    style={{
                      marginTop: "10px",
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    🗑️ Delete Slot
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TutorSchedulePage;
