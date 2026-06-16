import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/Attendance/api";
import { MdLibraryAdd, MdCheckCircle } from "react-icons/md";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton } from "../../components/dashboard/shared/Primitives";

function AddSubject() {
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    department: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addSubject = async (e) => {
    e.preventDefault();
    if (!formData.subjectName.trim() || !formData.subjectCode.trim()) {
      toast.error("Subject name and code are required");
      return;
    }
    setLoading(true);
    try {
      await API.post("/subjects/subjects", formData);
      toast.success("Subject added successfully!");
      setFormData({ subjectName: "", subjectCode: "", department: "", year: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout className="attendance-module">
      <div className="page-header">
        <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Add Subject</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new subject to the system for attendance tracking</p>
      </div>

      <SectionContainer>
        <div className="max-w-[560px]">
          <PremiumCard hoverEffect={false}>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
              <MdLibraryAdd className="text-[var(--primary)]" /> Subject Details
            </h3>
            <form onSubmit={addSubject} className="space-y-4">
              <div className="form-group">
                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Subject Name *</label>
                <input name="subjectName" className="form-input" placeholder="e.g. Data Structures" value={formData.subjectName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Subject Code *</label>
                <input name="subjectCode" className="form-input" placeholder="e.g. CS301" value={formData.subjectCode} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Department</label>
                <input name="department" className="form-input" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Year</label>
                <input name="year" className="form-input" placeholder="e.g. 2nd Year" value={formData.year} onChange={handleChange} />
              </div>
              <div className="flex justify-end pt-4">
                <PremiumButton
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  leftIcon={MdCheckCircle}
                  className="min-w-[160px]"
                >
                  Add Subject
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </div>
      </SectionContainer>
    </PageLayout>
  );
}

export default AddSubject;
