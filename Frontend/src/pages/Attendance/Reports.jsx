import { useState } from "react";
import toast from "react-hot-toast";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import { MdDownload, MdCalendarToday } from "react-icons/md";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton } from "../../components/dashboard/shared/Primitives";

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
    <PageLayout className="attendance-module">
      <div className="page-header">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Download Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Export attendance data as a CSV file for any date range</p>
      </div>

      <SectionContainer>
        <div className="max-w-lg">
          <PremiumCard hoverEffect={false}>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
              <MdCalendarToday className="text-[var(--primary)]" /> Select Date Range
            </h3>
            <form onSubmit={downloadReport}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              </div>

              {start && end && start <= end && (
                <div className="mt-4 p-3 bg-[var(--primary)]/5 text-[var(--primary)] text-sm rounded-[var(--radius-md)] border border-[var(--primary)]/10 font-medium">
                  Downloading report from <strong>{start}</strong> to <strong>{end}</strong>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <PremiumButton
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  leftIcon={MdDownload}
                  className="min-w-[180px]"
                >
                  Download CSV
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}

export default Reports;
