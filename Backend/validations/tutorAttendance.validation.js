import { z } from "zod";
import { validateRequest } from "./attendance.validation.js";

export { validateRequest };

const normalizeQueryString = (value) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const requiredSubjectSchema = z.preprocess(
  (value) => {
    const normalized = normalizeQueryString(value);
    if (typeof normalized !== "string") return normalized;
    return normalized.trim();
  },
  z.string().min(1, "Subject is required")
);

const optionalSessionTimeSchema = z.preprocess(
  (value) => {
    const normalized = normalizeQueryString(value);
    if (typeof normalized !== "string") return normalized;
    const trimmed = normalized.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().optional()
);

const optionalDateSchema = z.preprocess(
  (value) => {
    const normalized = normalizeQueryString(value);
    if (typeof normalized !== "string") return normalized;
    const trimmed = normalized.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$|^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional()
);

export const sessionQuerySchema = z.object({
  date: optionalDateSchema,
  subject: requiredSubjectSchema,
  sessionTime: optionalSessionTimeSchema,
});

export const markSessionSchema = z.object({
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$|^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  subject: requiredSubjectSchema,
  sessionTime: optionalSessionTimeSchema,
  records: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["present", "absent"]),
      }),
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
  subject: requiredSubjectSchema,
});
