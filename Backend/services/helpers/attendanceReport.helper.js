import fs from "fs";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import officegen from "officegen";
import StudentModel from "../../models/Attendance/Student.js";
import { AppError } from "../../utils/AppError.js";

export const generateCsvData = async (attendanceRecords, startDate, endDate) => {
  const uniqueDates = [
    ...new Set(
      attendanceRecords.map((record) =>
        new Date(record.date).toISOString().split("T")[0]
      )
    ),
  ];

  const studentData = [
    ...new Set(
      attendanceRecords.flatMap((record) =>
        record.attendanceRecords.map((r) => r.studentId)
      )
    ),
  ];

  const filteredStudentData = studentData.filter((student) => student !== null);

  const csvData = filteredStudentData.map((student) => {
    const rowData = {
      Name: student.Name,
      YearOfStudy: student.Year_of_studying || "",
      Gender: student.Gender || "",
    };

    uniqueDates.forEach((date) => {
      const attendanceRecord = attendanceRecords.find(
        (record) => new Date(record.date).toISOString().split("T")[0] === date
      );

      if (attendanceRecord && attendanceRecord.attendanceRecords) {
        const attendance = attendanceRecord.attendanceRecords.find(
          (r) => r.studentId && r.studentId.Name === student.Name
        );
        rowData[date] = attendance ? attendance.attendance : "";
      } else {
        rowData[date] = "";
      }
    });

    return rowData;
  });

  const csvHeader = [
    { id: "Name", title: "Name" },
    { id: "YearOfStudy", title: "Year Of Study" },
    { id: "Gender", title: "Gender" },
    ...uniqueDates.map((date) => ({ id: date, title: date })),
  ];

  const path = `attendance-${Date.now()}-${Math.floor(Math.random() * 1000)}.csv`;
  const csvWriter = createCsvWriter({ path, header: csvHeader });
  await csvWriter.writeRecords(csvData);
  
  return path;
};

export const generateDocxDocument = async (attendanceRecord, dateParam) => {
  const studentDetails = await StudentModel.find({
    _id: {
      $in: attendanceRecord.attendanceRecords.map((record) => record.studentId),
    },
  });

  const presentStudents = studentDetails.filter((studentDetail) =>
    attendanceRecord.attendanceRecords.some(
      (record) =>
        record.studentId.equals(studentDetail._id) &&
        record.attendance === "present"
    )
  );

  const docx = officegen("docx");
  const title = docx.createP();

  title.addText(`Attendance for ${dateParam}`, {
    font_face: "Times New Roman",
    font_size: 14,
    bold: true,
  });

  const table = [
    ["S.No", "Name", "Register Number", "Dept", "Year"],
  ];

  presentStudents.forEach((student, index) => {
    table.push([
      index + 1,
      student.Name,
      student.Register_number,
      student.Branch_of_studying,
      student.Year_of_studying,
    ]);
  });

  docx.createTable(table);
  return docx;
};
