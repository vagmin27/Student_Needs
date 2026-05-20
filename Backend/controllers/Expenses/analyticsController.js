import { success, error } from "../../utils/Expenses/handler.js";
import { AnalyticsService } from "../../services/Expenses/AnalyticsService.js";
import { validateExpenseRequest, analyticsCategorySchema } from "../../validations/Expenses/expense.validation.js";

// 1. category breakdown
export const getCategoryBreakdown = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(analyticsCategorySchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);
    
    const userId = req.user.userId;
    const result = await AnalyticsService.getCategoryBreakdown(userId, data.type);

    const response = success(200, result);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

// 2. monthly trend
export const getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await AnalyticsService.getMonthlyTrend(userId);

    const response = success(200, result);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

// 3. overview cards
export const getOverview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await AnalyticsService.getOverview(userId);

    const response = success(200, result);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getSpendingInsights = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await AnalyticsService.getSpendingInsights(userId);

    const response = success(200, result);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const predictNextMonthExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await AnalyticsService.predictNextMonthExpense(userId);

    const response = success(200, result);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(500, e.message);
    return res.status(response.statusCode).send(response);
  }
};