import { z } from "zod";
import { validateRequest } from "./attendance.validation.js";

export { validateRequest };

export const createSubjectSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required").max(120),
});

export const updateSubjectSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required").max(120),
});

export const markRecordSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  status: z.enum(["present", "absent"]),
});

export const updateRecordSchema = z
  .object({
    subjectId: z.string().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
      .optional(),
    status: z.enum(["present", "absent"]).optional(),
  })
  .refine((data) => data.subjectId || data.date || data.status, {
    message: "At least one field must be provided",
  });

export const recordsQuerySchema = z.object({
  subjectId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
