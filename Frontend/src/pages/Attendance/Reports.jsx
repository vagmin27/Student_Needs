import { useState } from "react";
import toast from "react-hot-toast";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import { MdDownload, MdCalendarToday } from "react-icons/md";

function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadReport = async (e) => {
    e.preventDefault();
    if (!start || !end) { toast.error("Please select both start and end dates"); return; }
    if (start > end) { toast.error("Start date cannot be after end date"); return; }

    setLoading(true);
    try {
      const response = await API.get(ATTENDANCE_PATHS.download(start, end), {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_${start}_to_${end}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download report. No data may exist for this range.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Download Reports</h1>
        <p>Export attendance data as a CSV file for any date range</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-title"><MdCalendarToday /> Select Date Range</div>
        <form onSubmit={downloadReport}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {start && end && start <= end && (
            <div
              style={{
                marginTop: 16,
                padding: "10px 14px",
                background: "var(--accent-light)",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                color: "var(--accent)",
              }}
            >
              Downloading report from <strong>{start}</strong> to <strong>{end}</strong>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: 180 }}
            >
              {loading ? (
                <><span className="spinner" /> Downloading...</>
              ) : (
                <><MdDownload size={18} /> Download CSV</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reports;
