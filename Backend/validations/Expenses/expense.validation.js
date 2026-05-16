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
