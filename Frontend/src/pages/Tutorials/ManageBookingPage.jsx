import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getBookings } from "@/services/api/tutorialsApi.js";
import { Button } from "@/components/ui/button.jsx";
import Navbar from "../../components/Tutorials/Navbar";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import { PremiumCard } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { EmptyState } from "@/components/shared";
import { Calendar, BookOpen, Clock, User, ShieldCheck } from "lucide-react";

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

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "pending";
    if (s === "booked" || s === "pending") return "warning";
    if (s === "upcoming" || s === "accepted") return "info";
    if (s === "in_progress" || s === "completed") return "success";
    return "destructive";
  };

  return (
    <>
      {!isUnifiedLayout && <Navbar />}

      <div
        className={isUnifiedLayout ? "p-6 md:p-8 max-w-4xl mx-auto space-y-6 pb-20" : "container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-100px)] overflow-y-auto pb-20"}
        data-lenis-prevent={isUnifiedLayout ? "false" : "true"}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">📚 My Bookings</h1>
            <Button size="sm" onClick={() => navigate("/tutorials/find")}>
              Book New Session
            </Button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No bookings yet"
                description="Go ahead and find the perfect tutor to book your first class!"
                actionLabel="Find Tutor"
                onAction={() => navigate("/tutorials/find")}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {bookings?.map((b) => (
                <PremiumCard
                  key={b._id}
                  glow={false}
                  hoverEffect={true}
                  className="p-6 border border-[var(--border-color)] bg-[var(--card-bg)]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* LEFT INFO */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
                        <User className="w-5 h-5 text-[var(--accent)]" />
                        <span>👨‍🏫 {b.tutorName}</span>
                        {isUpcoming(b.date) && (
                          <Badge variant="success" className="ml-2 text-[10px]">Upcoming</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[var(--text-secondary)]">
                        <p className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
                          <span>Subject: <strong className="text-[var(--text-primary)] font-semibold">{b.subject}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                          <span>Date: <strong className="text-[var(--text-primary)] font-semibold">{b.date}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                          <span>Time: <strong className="text-[var(--text-primary)] font-semibold">{b.time}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[var(--text-muted)]" />
                          <span>
                            Status: <Badge variant={getStatusBadge(b.status)} className="ml-1 text-[10px]">{b.status || "pending"}</Badge>
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-2 select-none shrink-0 self-end md:self-center">
                      {(b.status === "Booked" || b.status === "pending" || b.status === "upcoming" || b.status === "accepted") && (
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => cancelBooking(b._id)}
                            className="text-xs font-semibold h-9"
                          >
                            Cancel Booking
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/tutorials/chat?tutorId=${b.tutorId}`)}
                            className="text-xs font-semibold h-9"
                          >
                            Message Tutor
                          </Button>
                        </div>
                      )}

                      {(b.status === "upcoming" || b.status === "in_progress") && (
                        <div>
                          {b.meetingLinkPublished && b.meetingLink ? (
                            <Button
                              variant="default"
                              size="sm"
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
                              className="text-xs font-bold h-9"
                            >
                              Join Session
                            </Button>
                          ) : (
                            <p className="text-xs text-[var(--text-muted)] italic font-medium">
                              Waiting for meeting link
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ManageBookingPage;
;
// }


// export default ManageBookingPage;
