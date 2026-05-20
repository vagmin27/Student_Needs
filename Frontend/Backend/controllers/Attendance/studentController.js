import StudentModel from "../../models/Attendance/Student.js";
import AttendanceModel from "../../models/Attendance/Attendance.js";
import User from "../../models/Attendance/User.js";
import bcrypt from "bcryptjs";

// ✅ GET ALL STUDENTS
export const getStudents = async (req, res) => {
  try {
    const students = await StudentModel.find({});

    res.status(200).json(students);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};


// ✅ ADD STUDENT
export const addStudent = async (req, res) => {
  try {
    const {
      Name,
      Register_number,
      Year_of_studying,
      Branch_of_studying,
      Date_of_Birth,
      Gender,
      Community,
      Minority_Community,
      Blood_Group,
      Aadhar_number,
      Mobile_number,
      Email_id,
    } = req.body;

    // Check if student already exists
    const existingStudent = await StudentModel.findOne({ Register_number });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this register number already exists",
      });
    }

    // Create User account for student
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Register_number, salt);

    const user = await User.create({
      name: Name,
      email: Register_number, // Use register number as email for simplicity
      password: hashedPassword,
      role: "student",
    });

    const student = new StudentModel({
      Name,
      Register_number,
      Year_of_studying,
      Branch_of_studying,
      Date_of_Birth,
      Gender,
      Community,
      Minority_Community,
      Blood_Group,
      Aadhar_number,
      Mobile_number,
      Email_id,
      userId: user._id,
    });

    await student.save();

    res.status(201).json({
      message: "Student Added Successfully",
      student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add student",
    });
  }
};


// ✅ GET SINGLE STUDENT
export const getSingleStudent = async (
  req,
  res
) => {
  try {
    const { registerNumber } = req.params;

    const student = await StudentModel.findOne({
      Register_number: registerNumber,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching student",
    });
  }
};


// ✅ DELETE STUDENT
export const deleteStudent = async (
  req,
  res
) => {
  try {
    const { registerNumber } = req.params;

    // ✅ FIND STUDENT
    const student =
      await StudentModel.findOne({
        Register_number:
          registerNumber,
      });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ✅ REMOVE STUDENT FROM ATTENDANCE
    await AttendanceModel.updateMany(
      {},
      {
        $pull: {
          attendanceRecords: {
            studentId: student._id,
          },
        },
      }
    );

    // ✅ DELETE STUDENT
    await StudentModel.findByIdAndDelete(
      student._id
    );

    res.status(200).json({
      message:
        "Student deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Error deleting student",
    });
  }
};