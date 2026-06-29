import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getSchedule } from "@/services/api/tutorialsApi.js";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import EmptyState from "@/components/ui/EmptyState";

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
    // The backend now determines if a slot can be safely deleted based on the active booking status.
    // We defer the validation to the API endpoint to ensure up-to-date business logic.

    if (!window.confirm("Delete this slot? This cannot be undone.")) return;

    try {
      await API.delete(`/tutor/schedule/${slotId}`);

      setSchedule((prev) =>
        prev?.filter((s) => s._id !== slotId)
      );

      toast.success("Slot deleted ✅");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || err.response?.data?.message || "Error deleting slot ❌");
    }
  };

  return (
    <DashboardLayout pageTitle="My Schedule" role="tutor">
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">📅 My Schedule</h1>
          <Button 
            onClick={() => navigate("/tutorials/tutor/availability")}
            className="text-xs font-semibold h-9"
          >
            + Add Availability
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm text-[var(--text-secondary)] animate-pulse">Loading schedule... ⏳</p>
          </div>
        ) : schedule.length === 0 ? (
          <EmptyState 
            title="No slots scheduled" 
            description="You have not set any availability slots. Click 'Add Availability' to get started." 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedule.map((item, index) => (
              <div 
                key={item._id || index} 
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between space-y-4 hover:shadow-[var(--shadow-md)] transition-all duration-200"
              >
                <div>
                  <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3 mb-3">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {item.subject || item.subjects?.[0] || "General Subject"}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.bookingCount > 0 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" 
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}>
                      {item.bookingCount > 0 ? `👥 ${item.bookingCount} enrolled` : "⏳ Available"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">Date:</span> {item.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">Time:</span> {item.time}
                    </p>
                    {item.tutor && (
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-primary)]">Tutor:</span> {item.tutor}
                      </p>
                    )}
                  </div>
                </div>

                {[
                  "Booked",
                  "pending",
                  "accepted",
                  "upcoming",
                  "in_progress",
                ].includes(item.bookingStatus) || item.bookingCount > 0 ? (
                  <div className="border-t border-[var(--border-color)] pt-3 mt-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Paste Zoom / Google Meet link"
                        value={item.meetingLink || ""}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[index].meetingLink = e.target.value;
                          setSchedule(updated);
                        }}
                        className="flex-grow p-2 text-xs rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)]/20 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] placeholder:text-[var(--text-muted)]"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={async () => {
                          try {
                            await API.post("/tutor/save-link", {
                              slotId: item._id,
                              link: item.meetingLink,
                            });

                            toast.success("Link saved ✅");
                          } catch (err) {
                            console.error(err);
                            toast.error("Error saving link ❌");
                          }
                        }}
                      >
                        Save Link
                      </Button>
                    </div>

                    {item.meetingLink && (
                      <div className="text-xs mt-2.5 flex gap-3">
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--primary)] hover:underline font-semibold flex items-center gap-1"
                        >
                          🚀 Join Class
                        </a>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(item.meetingLink);
                            toast.success("Link copied!");
                          }}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
                        >
                          📋 Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="pt-2 border-t border-[var(--border-color)]/50 flex gap-2 justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => deleteSlot(item._id)}
                  >
                    🗑️ Delete
                  </Button>
                  
                  {item.studentId && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs h-8 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/80"
                      onClick={() => navigate(`/tutorials/chat?studentId=${item.studentId}`)}
                    >
                      💬 Message
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TutorSchedulePage;
