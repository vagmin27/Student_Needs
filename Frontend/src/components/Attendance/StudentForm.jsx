import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/Attendance/api";
import { MdPersonAdd } from "react-icons/md";

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
      await API.post("/form/insert", formData);
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
    <form onSubmit={submitForm}>
      <div className="card-title"><MdPersonAdd /> Student Information</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
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
          <label className="form-label">Register Number *</label>
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
          <label className="form-label">Year of Study</label>
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
          <label className="form-label">Branch / Department</label>
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
          <label className="form-label">Gender</label>
          <select name="Gender" className="form-select" value={formData.Gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Mobile Number</label>
          <input
            type="text"
            name="Mobile_number"
            className="form-input"
            placeholder="10-digit mobile number"
            value={formData.Mobile_number}
            onChange={handleChange}
          />
        </div>
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">Email Address</label>
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

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160 }}>
          {loading ? <><span className="spinner" /> Adding...</> : <><MdPersonAdd /> Add Student</>}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;