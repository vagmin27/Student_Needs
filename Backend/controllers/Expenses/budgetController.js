import { success, error } from "../../utils/Expenses/handler.js";
import { BudgetService } from "../../services/Expenses/BudgetService.js";
import { validateExpenseRequest, budgetCreateSchema, budgetStatusSchema } from "../../validations/Expenses/expense.validation.js";

export const createBudget = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(budgetCreateSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;
    const budget = await BudgetService.createBudget(userId, data.category, data.limit);
    
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
    const budgets = await BudgetService.getBudgets(userId);
    
    const response = success(200, budgets);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getBudgetStatus = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(budgetStatusSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;
    const status = await BudgetService.getBudgetStatus(userId, data.category);

    const response = success(200, status);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};