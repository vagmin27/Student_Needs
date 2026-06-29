import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import { Button } from "../ui/button";

function StudentTable({ students, attendanceData, handleAttendance }) {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-muted)] bg-[var(--card-bg)]/40 rounded-[var(--radius-lg)] border border-[var(--border-color)]">
        <p>No students found</p>
      </div>
    );
  }

  const handleBulkMark = (status) => {
    students.forEach((s) => handleAttendance(s._id, status));
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions bar */}
      <div className="flex flex-wrap gap-2 items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <span className="text-xs text-[var(--text-muted)] font-medium">Bulk Actions:</span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleBulkMark("present")}
            className="text-[var(--success)] border-[var(--success)]/20 hover:bg-[var(--success-bg)]"
          >
            Mark All Present
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleBulkMark("absent")}
            className="text-[var(--danger)] border-[var(--danger)]/20 hover:bg-[var(--danger-bg)]"
          >
            Mark All Absent
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleBulkMark(undefined)}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <div className="table-wrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">#</TableHead>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Register No.</TableHead>
              <TableHead scope="col">Branch</TableHead>
              <TableHead scope="col" className="text-right">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((student, i) => (
              <TableRow key={student._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-medium text-[var(--text-primary)]">{student.Name}</TableCell>
                <TableCell className="text-[var(--text-secondary)]">{student.Register_number}</TableCell>
                <TableCell className="text-[var(--text-secondary)]">{student.Branch_of_studying || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant={attendanceData[student._id] === "present" ? "success" : "outline"}
                      size="sm"
                      onClick={() => handleAttendance(student._id, "present")}
                      aria-label={`Mark ${student.Name} present`}
                    >
                      Present
                    </Button>
                    <Button
                      type="button"
                      variant={attendanceData[student._id] === "absent" ? "danger" : "outline"}
                      size="sm"
                      onClick={() => handleAttendance(student._id, "absent")}
                      aria-label={`Mark ${student.Name} absent`}
                    >
                      Absent
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default StudentTable;