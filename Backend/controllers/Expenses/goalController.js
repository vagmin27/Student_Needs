import goalModel from "../db/goalModel.js";
import { success, error } from "../utils/handler.js";

export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;
    const userId = req.user.userId;

    const goal = await goalModel.create({
      userId,
      title,
      targetAmount,
      deadline,
    });
    const response = success(201, goal);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goals = await goalModel.find({ userId });
    const response = success(200, goals);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const updateSavings = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    const userId = req.user.userId;

    const goal = await goalModel.findById(goalId);
    if (!goal) {
      const response = error(404, "Goal not found");
      return res.status(response.statusCode).send(response);
    }

    // Additional ownership check (middleware already verifies)
    if (goal.userId.toString() !== userId.toString()) {
      const response = error(403, "Unauthorized: userId does not match");
      return res.status(response.statusCode).send(response);
    }

    goal.savedAmount += amount;
    await goal.save();

    const response = success(200, goal);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};