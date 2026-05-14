import mongoose from "mongoose";
import budgetModel from "../db/budgetModel.js";
import expenseModel from "../db/expenseModel.js";
import { success, error } from "../utils/handler.js";

export const createBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const userId = req.user.userId;

    const budget = await budgetModel.create({ userId, category, limit });
    const response = success(201, budget);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const budgets = await budgetModel.find({ userId });
    const response = success(200, budgets);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getBudgetStatus = async (req, res) => {
  try {
    const { category } = req.body;
    const userId = req.user.userId;

    const budget = await budgetModel.findOne({ userId, category });

    const spent = await expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          category,
          type: "expense",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalSpent = spent[0]?.total || 0;

    const response = success(200, {
      limit: budget?.limit || 0,
      spent: totalSpent,
      remaining: (budget?.limit || 0) - totalSpent,
    });
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};