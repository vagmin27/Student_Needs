import mongoose from "mongoose";
import expenseModel from "../db/expenseModel.js";
import userModel from "../db/userModel.js";
import sendEmailWithAttachment from "../utils/emailSend.js";
import { error, success } from "../utils/handler.js";

export const createExpense = async (req, res) => {
  try {
    let { amount, category, date, title, type, paymentMethod, note } = req.body;

    const userId = req.user.userId;

    if (!amount || !category || !date || !userId) {
      const response = error(400, "Required fields missing");
      return res.status(response.statusCode).send(response);
    }

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

    const response = success(201, newExpense);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.body;
    const userId = req.user.userId;

    if (!expenseId) {
      const response = error(400, "ExpenseId required");
      return res.status(response.statusCode).send(response);
    }

    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      const response = error(404, "Expense not found");
      return res.status(response.statusCode).send(response);
    }

    // Additional ownership check (middleware already verifies)
    if (expense.userId.toString() !== userId.toString()) {
      const response = error(403, "Unauthorized: userId does not match");
      return res.status(response.statusCode).send(response);
    }

    await expenseModel.findByIdAndDelete(expenseId);
    const response = success(200, "Expense deleted");
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const expenses = await expenseModel.find({ userId }).sort({ date: -1 });

    const response = success(200, expenses);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

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

    const response = success(200, {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalTransactions: expenses.length,
    });
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getRecentExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const recent = await expenseModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const response = success(200, recent);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getCategoryExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categoryData = await expenseModel.aggregate([
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

    const response = success(200, categoryData);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const monthlyData = await expenseModel.aggregate([
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

    const response = success(200, monthlyData);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const emailSender = (req, res) => {
  try {
    const { recipient, body } = req.body;
    sendEmailWithAttachment(recipient, body);
    const response = success(201, "Email Sent");
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(401, "Email Is Wrong");
    return res.status(response.statusCode).send(response);
  }
};