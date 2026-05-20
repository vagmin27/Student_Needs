import { error, success } from "../../utils/Expenses/handler.js";
import { ExpenseService } from "../../services/Expenses/ExpenseService.js";
import { validateExpenseRequest, createExpenseSchema, deleteExpenseSchema, emailSenderSchema } from "../../validations/Expenses/expense.validation.js";
export const createExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { isValid, data, errorResponse } = validateExpenseRequest(createExpenseSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const newExpense = await ExpenseService.createExpense(data, userId);

    const response = success(201, newExpense);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { isValid, data, errorResponse } = validateExpenseRequest(deleteExpenseSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const msg = await ExpenseService.deleteExpense(data.expenseId, userId);

    const response = success(200, msg);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const expenses = await ExpenseService.getAllExpenses(userId);

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

    const summaryData = await ExpenseService.getSummary(userId);

    const response = success(200, summaryData);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getRecentExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const recent = await ExpenseService.getRecentExpenses(userId);

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

    const categoryData = await ExpenseService.getCategoryExpense(userId);

    const response = success(200, categoryData);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const monthlyData = await ExpenseService.getMonthlyExpenses(userId);

    const response = success(200, monthlyData);
    return res.status(response.statusCode).send(response);
  } catch (e) {
    const response = error(e.statusCode || 500, e.message);
    return res.status(response.statusCode).send(response);
  }
};

export const emailSender = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(emailSenderSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const msg = await ExpenseService.sendEmail(data.recipient, data.body);

    const response = success(201, msg);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(err.statusCode || 401, "Email Is Wrong");
    return res.status(response.statusCode).send(response);
  }
};