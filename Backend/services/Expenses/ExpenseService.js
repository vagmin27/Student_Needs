import mongoose from "mongoose";
import expenseModel from "../../models/Expenses/expenseModel.js";
import sendEmailWithAttachment from "../../utils/Expenses/emailSend.js";
import { AppError } from "../../utils/AppError.js";

// Service layer shell for Expenses module
export class ExpenseService {
  static async createExpense(data, userId) {
    const { amount, category, date, title, type, paymentMethod, note } = data;

    const newExpense = await expenseModel.create({
      amount,
      category,
      date,
      userId,
      title: title || category,
      type: type || "expense",
      paymentMethod: paymentMethod || "UPI",
      note: note || "",
    });

    return newExpense;
  }

  static async deleteExpense(expenseId, userId) {
    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    if (expense.userId.toString() !== userId.toString()) {
      throw new AppError("Unauthorized: userId does not match", 403);
    }

    await expenseModel.findByIdAndDelete(expenseId);
    return "Expense deleted";
  }
  static async getAllExpenses(userId) {
    return await expenseModel.find({ userId }).sort({ date: -1 });
  }

  static async getRecentExpenses(userId) {
    return await expenseModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);
  }

  static async getSummary(userId) {
    const expenses = await expenseModel.find({ userId });

    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((item) => {
      if (item.type === "income") {
        totalIncome += item.amount;
      } else {
        totalExpense += item.amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalTransactions: expenses.length,
    };
  }

  static async getCategoryExpense(userId) {
    return await expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
  }

  static async getMonthlyExpenses(userId) {
    return await expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  static async sendEmail(recipient, body) {
    try {
      await sendEmailWithAttachment(recipient, body);
      return "Email Sent";
    } catch (err) {
      throw new AppError("Email Is Wrong", 401);
    }
  }
}
