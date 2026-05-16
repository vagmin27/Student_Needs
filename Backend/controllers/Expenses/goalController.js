import { success, error } from "../../utils/Expenses/handler.js";
import { GoalService } from "../../services/Expenses/GoalService.js";
import { validateExpenseRequest, goalCreateSchema, goalUpdateSavingsSchema } from "../../validations/Expenses/expense.validation.js";

export const createGoal = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(goalCreateSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;
    const goal = await GoalService.createGoal(userId, data.title, data.targetAmount, data.deadline);
    
    const response = success(201, goal);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const goals = await GoalService.getGoals(userId);
    
    const response = success(200, goals);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const updateSavings = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(goalUpdateSavingsSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;
    const goal = await GoalService.updateSavings(userId, data.goalId, data.amount);

    const response = success(200, goal);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};