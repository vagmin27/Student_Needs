import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/Attendance/api";
import { MdPersonAdd } from "react-icons/md";
import { PremiumButton } from "../dashboard/shared/Primitives";

function StudentForm({ refreshStudents }) {
  const [formData, setFormData] = useState({
    Name: "",
    Register_number: "",
    Year_of_studying: "",
    Branch_of_studying: "",
    Gender: "",
    Mobile_number: "",
    Email_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData.Name.trim() || !formData.Register_number.trim()) {
      toast.error("Name and Register Number are required");
      return;
    }
    setLoading(true);
    try {
      await API.post("/students/form/insert", formData);
      toast.success("Student added successfully!");
      setFormData({
        Name: "",
        Register_number: "",
        Year_of_studying: "",
        Branch_of_studying: "",
        Gender: "",
        Mobile_number: "",
        Email_id: "",
      });
      if (refreshStudents) refreshStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitForm} className="space-y-md">
      <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
        <MdPersonAdd className="text-[var(--primary)]" /> Student Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <div className="form-group">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Full Name *</label>
          <input
            type="text"
            name="Name"
            className="form-input"
            placeholder="Student full name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Register Number *</label>
          <input
            type="text"
            name="Register_number"
            className="form-input"
            placeholder="e.g. CS2021001"
            value={formData.Register_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Year of Study</label>
          <input
            type="text"
            name="Year_of_studying"
            className="form-input"
            placeholder="e.g. 2nd Year"
            value={formData.Year_of_studying}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Branch / Department</label>
          <input
            type="text"
            name="Branch_of_studying"
            className="form-input"
            placeholder="e.g. Computer Science"
            value={formData.Branch_of_studying}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Gender</label>
          <select name="Gender" className="form-select" value={formData.Gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Mobile Number</label>
          <input
            type="text"
            name="Mobile_number"
            className="form-input"
            placeholder="10-digit mobile number"
            value={formData.Mobile_number}
            onChange={handleChange}
          />
        </div>
        <div className="form-group sm:col-span-2">
          <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Email Address</label>
          <input
            type="email"
            name="Email_id"
            className="form-input"
            placeholder="student@example.com"
            value={formData.Email_id}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <PremiumButton
          type="submit"
          variant="primary"
          isLoading={loading}
          leftIcon={MdPersonAdd}
          className="min-w-[160px]"
        >
          Add Student
        </PremiumButton>
      </div>
    </form>
  );
}

export default StudentForm;
