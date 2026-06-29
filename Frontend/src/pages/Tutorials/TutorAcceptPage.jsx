import React, { useEffect, useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/EmptyState";

function TutorAcceptPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkInputs, setLinkInputs] = useState({});
  const [editingLink, setEditingLink] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/booking/for-tutor");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/booking/${id}/status`, { status });

      setBookings((prev) =>
        prev?.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const publishMeetingLink = async (id, link) => {
    if (!link || !link.trim().startsWith("http")) {
      alert("Please enter a valid HTTP/HTTPS URL");
      return;
    }
    try {
      const res = await API.patch(`/booking/${id}/meeting-link`, { meetingLink: link });
      setBookings((prev) =>
        prev?.map((b) => (b._id === id ? { ...b, ...res.data.booking } : b))
      );
      setEditingLink((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Publish link failed:", err);
      alert(err.response?.data?.msg || "Failed to publish link");
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Manage Requests" role="tutor">
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-[var(--text-secondary)] animate-pulse">Loading requests... ⏳</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Manage Requests" role="tutor">
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            📥 Student Booking Requests
          </h1>
        </div>

        {bookings.length === 0 ? (
          <EmptyState 
            title="No requests pending" 
            description="You don't have any student booking requests at the moment."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between space-y-4 hover:shadow-[var(--shadow-md)] transition-all duration-200"
              >
                <div>
                  <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3 mb-3">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {b.subject}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        b.status === "Booked" || b.status === "pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-955/40 dark:text-amber-400"
                          : b.status === "upcoming" || b.status === "accepted"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-955/40 dark:text-blue-400"
                            : b.status === "in_progress"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-955/40 dark:text-purple-400"
                              : b.status === "Completed" || b.status === "completed"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-955/40 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-955/40 dark:text-rose-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">Date:</span> {b.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">Time:</span> {b.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">Student ID:</span> {b.userId}
                    </p>
                  </div>
                </div>

                {(b.status === "Booked" || b.status === "pending") && (
                  <div className="flex gap-3 pt-3 border-t border-[var(--border-color)]/50">
                    <Button size="sm" className="text-xs h-8 px-3" onClick={() => updateStatus(b._id, "upcoming")}>✅ Accept</Button>
                    <Button size="sm" variant="destructive" className="text-xs h-8 px-3" onClick={() => updateStatus(b._id, "declined")}>❌ Reject</Button>
                  </div>
                )}

                {(b.status === "upcoming" || b.status === "accepted") && (
                  <div className="mt-2 p-3.5 border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)]/20 space-y-2.5">
                    <p className="font-semibold text-xs text-[var(--text-primary)]">Meeting Link:</p>
                    
                    {b.meetingLinkPublished && !editingLink[b._id] ? (
                      <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
                        <div className="flex items-center gap-2 truncate flex-grow">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                            ✅ Published:
                          </span>
                          <a href={b.meetingLink} target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:underline truncate max-w-[150px] font-medium">
                            {b.meetingLink}
                          </a>
                        </div>
                        <Button size="xs" variant="outline" className="h-7 text-xs px-2.5 shrink-0" onClick={() => {
                          setLinkInputs(prev => ({ ...prev, [b._id]: b.meetingLink }));
                          setEditingLink(prev => ({ ...prev, [b._id]: true }));
                        }}>
                          Edit Link
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          placeholder="https://meet.google.com/..."
                          className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] placeholder:text-[var(--text-muted)]"
                          value={linkInputs[b._id] !== undefined ? linkInputs[b._id] : (b.meetingLink || "")}
                          onChange={(e) => setLinkInputs(prev => ({ ...prev, [b._id]: e.target.value }))}
                        />
                        <Button size="sm" className="h-8 text-xs font-semibold shrink-0" onClick={() => publishMeetingLink(b._id, linkInputs[b._id] !== undefined ? linkInputs[b._id] : b.meetingLink)}>
                          {b.meetingLinkPublished ? "Update Link" : "Publish Link"}
                        </Button>
                        {b.meetingLinkPublished && (
                          <Button size="sm" variant="ghost" className="h-8 text-xs shrink-0" onClick={() => setEditingLink(prev => ({ ...prev, [b._id]: false }))}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-4">
          <Button variant="outline" className="text-xs h-9" onClick={() => navigate("/tutorials/tutor/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TutorAcceptPage;
