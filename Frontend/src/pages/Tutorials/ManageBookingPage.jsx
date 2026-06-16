import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getBookings } from "@/services/api/tutorialsApi.js";
import "../../styles/Tutorials/ManageBook.css";
import { Button } from "@/components/ui/button";
import Navbar from "../../components/Tutorials/Navbar";
import { LayoutContext } from "@/components/layouts/DashboardLayout";


function ManageBookingPage() {
  const isUnifiedLayout = useContext(LayoutContext);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // ✅ FETCH BOOKINGS
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchBookings = async () => {
      try {
        const list = await getBookings();
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setBookings(sorted);
      } catch {
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await API.patch(`/booking/${id}/cancel`);

      setBookings((prev) =>
        prev?.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b)),
      );

      alert("Booking cancelled ✅");
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking ❌");
    }
  };

  // ✅ CHECK UPCOMING
  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  return (
    <>
      {!isUnifiedLayout && <Navbar />}


      <div
        className={isUnifiedLayout ? "" : "mainDivBook h-[calc(100vh-100px)] md:h-screen overflow-y-auto"}
        style={{}}
        data-lenis-prevent={isUnifiedLayout ? "false" : "true"}
      >
        <div className="innerDivBook">
          <h1 className="titleBook">📚 My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="emptyState">
              <h3>No bookings yet 😔</h3>

              <p>Go ahead and book your first class!</p>
            </div>
          ) : (
            bookings?.map((b) => (
              <div className="line1" key={b._id}>
                <div
                  className={`scheduleDivBook ${
                    isUpcoming(b.date) ? "upcoming" : ""
                  }`}
                >
                  {/* LEFT INFO */}
                  <div>
                    <p className="tutorp">👨‍🏫 {b.tutorName}</p>

                    <p className="subjectp">📖 {b.subject}</p>

                    <p className="datep">📅 {b.date}</p>

                    <p className="timep">⏰ {b.time}</p>

                    {/* STATUS */}
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            b.status === "Booked" || b.status === "pending"
                              ? "var(--warning)"
                              : b.status === "upcoming" || b.status === "accepted"
                                ? "var(--info)"
                                : b.status === "in_progress"
                                  ? "var(--success)"
                                  : b.status === "Completed" || b.status === "completed"
                                    ? "var(--success)"
                                    : "var(--danger)",
                          fontWeight: "bold",
                        }}
                      >
                        {b.status || "pending"}
                      </span>
                    </p>

                    {/* UPCOMING */}
                    {isUpcoming(b.date) && (
                      <span
                        style={{
                          marginLeft: "8px",
                        }}
                      >
                        🟢 Upcoming
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="actionButtons">
                    {(b.status === "Booked" || b.status === "pending" || b.status === "upcoming" || b.status === "accepted") && (
                      <div className="flex gap-[10px] mt-[10px] flex-wrap">
                        <Button
                          variant="destructive"
                          onClick={() => cancelBooking(b._id)}
                        >
                          ❌ Cancel Booking
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => navigate(`/tutorials/chat?tutorId=${b.tutorId}`)}
                        >
                          💬 Message Tutor
                        </Button>
                      </div>
                    )}
                    
                    {(b.status === "upcoming" || b.status === "in_progress") && (
                      <div className="mt-[10px]">
                        {b.meetingLinkPublished && b.meetingLink ? (
                          <Button
                            variant="default"
                            className="ml-[10px]"
                            onClick={async () => {
                              if (b.status === "upcoming") {
                                try {
                                  await API.patch(`/booking/${b._id}/status`, { status: "in_progress" });
                                  setBookings((prev) =>
                                    prev?.map((bk) => (bk._id === b._id ? { ...bk, status: "in_progress" } : bk)),
                                  );
                                } catch (err) {
                                  console.error("Failed to update status to in_progress:", err);
                                }
                              }
                              window.open(b.meetingLink, "_blank");
                            }}
                          >
                            🟢 Join Session
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground italic mt-[10px]">
                            Waiting for tutor to publish meeting link
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ManageBookingPage;
