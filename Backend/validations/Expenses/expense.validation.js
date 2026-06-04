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

export const expenseSettingsUpdateSchema = z.object({
  monthlyBudget: z.coerce.number().min(0, "Monthly Budget cannot be negative"),
  weeklyBudget: z.coerce.number().min(0, "Weekly Budget cannot be negative").optional().default(0),
  dailyBudget: z.coerce.number().min(0, "Daily Budget cannot be negative").optional().default(0),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  savingsGoal: z.coerce.number().min(0, "Savings goal cannot be negative").optional().default(0),
  categoryLimits: z.record(z.coerce.number().min(0)).optional().default({}),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    budgetAlerts: z.boolean().default(true),
    billDueAlerts: z.boolean().default(true),
    overdueAlerts: z.boolean().default(true),
    savingsGoalAlerts: z.boolean().default(true),
  }).optional(),
  alertThresholds: z.object({
    fifty: z.boolean().default(true),
    seventyFive: z.boolean().default(true),
    ninety: z.boolean().default(true),
    hundred: z.boolean().default(true),
  }).optional(),
  allowLimitsExceedBudget: z.boolean().optional().default(false),
});

export const createBillSchema = z.object({
  billName: z.string().min(1, "Bill Name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  dueDate: z.string().min(1, "Due Date is required"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional().default("Medium"),
  isRecurring: z.boolean().optional().default(false),
  recurringType: z.enum(["None", "Monthly", "Quarterly", "Semester", "Yearly"]).optional().default("None"),
});

