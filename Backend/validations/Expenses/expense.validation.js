import { z } from "zod";

// Helper for sending structured validation responses compatible with Expenses legacy handler
// Legacy response format: { status: "error", statusCode: 400, message: ... }
export const validateExpenseRequest = (schema, data) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      isValid: false,
      errorResponse: {
        status: "error",
        statusCode: 400,
        message: parsed.error.errors,
      },
    };
  }
  return { isValid: true, data: parsed.data };
};

export const createExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  title: z.string().optional(),
  type: z.enum(["income", "expense"]).optional(),
  paymentMethod: z.enum(["Cash", "UPI", "Card", "Bank"]).optional(),
  note: z.string().optional(),
});

export const deleteExpenseSchema = z.object({
  expenseId: z.string().min(1, "ExpenseId is required"),
});

export const emailSenderSchema = z.object({
  recipient: z.string().email("Invalid email format"),
  body: z.any().optional(), // Preserving loose structure for arbitrary data parsing in legacy util
});

export const analyticsCategorySchema = z.object({
  type: z.enum(["income", "expense"]).optional().default("expense"),
});

export const budgetCreateSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limit: z.coerce.number().positive("Limit must be positive"),
});

export const budgetStatusSchema = z.object({
  category: z.string().min(1, "Category is required"),
});

export const goalCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  targetAmount: z.coerce.number().positive("Target amount must be positive"),
  deadline: z.string().min(1, "Deadline is required"),
});

export const goalUpdateSavingsSchema = z.object({
  goalId: z.string().min(1, "GoalId is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
});

export const notificationSettingsSchema = z.object({
  reminderEnabled: z.boolean().optional(),
  reminderType: z.string().optional(),
  reminderTime: z.string().optional(),
  monthlyReportEnabled: z.boolean().optional(),
});

export const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
