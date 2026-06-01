import { z } from "zod";
import { validateRequest } from "./attendance.validation.js";

export { validateRequest };

export const sessionQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  subject: z.string().min(1, "Subject is required"),
  sessionTime: z.string().optional(),
});

export const markSessionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  subject: z.string().min(1, "Subject is required"),
  sessionTime: z.string().optional(),
  records: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["present", "absent"]),
      })
    )
    .min(1, "At least one student record is required"),
});

export const studentHistoryQuerySchema = z.object({
  tutorId: z.string().optional(),
  subject: z.string().optional(),
});

export const tutorSubjectBodySchema = z.object({
  subjectName: z.string().min(1, "Subject name is required").max(120),
});

export const enrolledQuerySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
});
