import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/Attendance/api";
import { MdPersonAdd } from "react-icons/md";
import { Button } from "../ui/button";
import { FormGroup, FormLabel } from "../ui/form";
import { PremiumInput } from "../ui/input";
import { Select } from "../ui/select";

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
    <form onSubmit={submitForm} className="space-y-4">
      <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
        <MdPersonAdd className="text-[var(--accent)]" /> Student Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormGroup>
          <FormLabel required>Full Name</FormLabel>
          <PremiumInput
            type="text"
            name="Name"
            placeholder="Student full name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel required>Register Number</FormLabel>
          <PremiumInput
            type="text"
            name="Register_number"
            placeholder="e.g. CS2021001"
            value={formData.Register_number}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Year of Study</FormLabel>
          <PremiumInput
            type="text"
            name="Year_of_studying"
            placeholder="e.g. 2nd Year"
            value={formData.Year_of_studying}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Branch / Department</FormLabel>
          <PremiumInput
            type="text"
            name="Branch_of_studying"
            placeholder="e.g. Computer Science"
            value={formData.Branch_of_studying}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Gender</FormLabel>
          <Select
            name="Gender"
            value={formData.Gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <FormLabel>Mobile Number</FormLabel>
          <PremiumInput
            type="text"
            name="Mobile_number"
            placeholder="10-digit mobile number"
            value={formData.Mobile_number}
            onChange={handleChange}
          />
        </FormGroup>

        <div className="sm:col-span-2">
          <FormGroup>
            <FormLabel>Email Address</FormLabel>
            <PremiumInput
              type="email"
              name="Email_id"
              placeholder="student@example.com"
              value={formData.Email_id}
              onChange={handleChange}
            />
          </FormGroup>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          leftIcon={MdPersonAdd}
          className="min-w-[160px]"
        >
          Add Student
        </Button>
      </div>
    </form>
  );
}

export default StudentForm;
