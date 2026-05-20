import goalModel from "../../models/Expenses/goalModel.js";

export const GoalService = {
  createGoal: async (userId, title, targetAmount, deadline) => {
    const goal = await goalModel.create({
      userId,
      title,
      targetAmount,
      deadline,
    });
    return goal;
  },

  getGoals: async (userId) => {
    const goals = await goalModel.find({ userId });
    return goals;
  },

  updateSavings: async (userId, goalId, amount) => {
    const goal = await goalModel.findById(goalId);
    
    if (!goal) {
      const error = new Error("Goal not found");
      error.statusCode = 404;
      throw error;
    }

    if (goal.userId.toString() !== userId.toString()) {
      const error = new Error("Unauthorized: userId does not match");
      error.statusCode = 403;
      throw error;
    }

    goal.savedAmount += amount;
    await goal.save();

    return goal;
  },
};
