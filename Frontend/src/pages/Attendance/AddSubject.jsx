import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/Attendance/api";
import { MdLibraryAdd, MdCheckCircle } from "react-icons/md";

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
    <div className="attendance-module">
      <div className="page-header">
        <h1>Add Subject</h1>
        <p>Add a new subject to the system for attendance tracking</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-title"><MdLibraryAdd /> Subject Details</div>
        <form onSubmit={addSubject}>
          <div className="form-group">
            <label className="form-label">Subject Name *</label>
            <input name="subjectName" className="form-input" placeholder="e.g. Data Structures" value={formData.subjectName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Subject Code *</label>
            <input name="subjectCode" className="form-input" placeholder="e.g. CS301" value={formData.subjectCode} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input name="department" className="form-input" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input name="year" className="form-input" placeholder="e.g. 2nd Year" value={formData.year} onChange={handleChange} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 160 }}>
              {loading ? <><span className="spinner" /> Adding...</> : <><MdCheckCircle /> Add Subject</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubject;
