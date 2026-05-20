import { z } from "zod";

// Helper for sending structured validation responses per requirement:
// "Return validation errors in a stable structure like { success: false, message: 'Validation failed', errors: [...] }"
export const validateRequest = (schema, data) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      isValid: false,
      errorResponse: {
        success: false,
        message: "Validation failed",
        errors: parsed.error.errors,
      },
    };
  }
  return { isValid: true, data: parsed.data };
};

export const markAttendanceSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  attendanceData: z.array(
    z.object({
      studentId: z.string().min(1, "Student ID is required"),
      attendance: z.enum(["present", "absent", "late", "excused"]).catch("absent"), // catching generic strings into 'absent' fallback or handle custom statuses. The legacy code uses string matching.
    }).passthrough()
  ).min(1, "Attendance data is required"),
  date: z.string().optional(),
});

export const downloadReportSchema = z.object({
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
});

export const deleteAttendanceSchema = z.object({
  studentId: z.string().optional(),
  register: z.string().optional(),
}).refine((data) => data.studentId || data.register, {
  message: "Either Student ID or Register number is required",
});
