import SubjectModel from "../../models/Attendance/Subject.js";


// ✅ ADD SUBJECT
export const addSubject = async (req, res) => {
  try {
    const {
      subjectName,
      subjectCode,
      department,
      year,
    } = req.body;

    const subject = new SubjectModel({
      subjectName,
      subjectCode,
      department,
      year,
    });

    await subject.save();

    res.status(201).json({
      message: "Subject Added",
      subject,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error adding subject",
    });
  }
};


// ✅ GET SUBJECTS
export const getSubjects = async (req, res) => {
  try {
    const subjects = await SubjectModel.find();

    res.status(200).json(subjects);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error fetching subjects",
    });
  }
};