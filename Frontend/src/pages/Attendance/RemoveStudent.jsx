import { useState } from "react";
import toast from "react-hot-toast";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import { MdDeleteForever, MdWarning } from "react-icons/md";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton } from "../../components/dashboard/shared/Primitives";

function RemoveStudent() {
  const [register, setRegister] = useState("");
  const [loading, setLoading] = useState(false);

  const removeStudent = async (e) => {
    e.preventDefault();
    if (!register.trim()) { toast.error("Please enter a register number"); return; }
    setLoading(true);
    try {
      await API.delete(ATTENDANCE_PATHS.studentByRegister(register));
      await API.delete(`/students/remove/delete/${register}`);
      toast.success("Student removed successfully");
      setRegister("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Remove Student</h1>
        <p className="text-sm text-muted-foreground mt-1">Permanently delete a student and their attendance records</p>
      </div>

      <SectionContainer>
        <div className="max-w-md">
          <PremiumCard hoverEffect={false}>
            <div className="bg-[var(--danger-bg)] border border-[var(--danger)]/20 rounded-[var(--radius-md)] p-4 flex items-start gap-3 mb-6">
              <MdWarning size={20} className="text-[var(--danger)] shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--danger)] font-medium">
                <strong>Warning:</strong> This action is irreversible. The student's record and all
                their attendance data will be permanently deleted.
              </div>
            </div>

            <form onSubmit={removeStudent}>
              <div className="form-group">
                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Register Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter student register number"
                  value={register}
                  onChange={(e) => setRegister(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-6">
                <PremiumButton
                  type="submit"
                  variant="destructive"
                  isLoading={loading}
                  leftIcon={MdDeleteForever}
                  className="min-w-[160px]"
                >
                  Remove Student
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}

export default RemoveStudent;
