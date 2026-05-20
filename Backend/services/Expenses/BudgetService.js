import mongoose from "mongoose";
import budgetModel from "../../models/Expenses/budgetModel.js";
import expenseModel from "../../models/Expenses/expenseModel.js";

export const BudgetService = {
  createBudget: async (userId, category, limit) => {
    const budget = await budgetModel.create({ userId, category, limit });
    return budget;
  },

  getBudgets: async (userId) => {
    const budgets = await budgetModel.find({ userId });
    return budgets;
  },

  getBudgetStatus: async (userId, category) => {
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

    return {
      limit: budget?.limit || 0,
      spent: totalSpent,
      remaining: (budget?.limit || 0) - totalSpent,
    };
  },
};
