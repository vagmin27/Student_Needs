import { expensesApi } from "../../services/api/expensesApi";

export const getUserExpenses = async (userId) => {
  return await expensesApi.getUserExpenses(userId);
};

export const createExpense = async (expInfo) => {
  return await expensesApi.createExpense(expInfo);
};

export const deleteExpense = async (data) => {
  return await expensesApi.deleteExpense(data);
};

export const sendEmail = async (sender, data) => {
  return await expensesApi.sendEmail(sender, data);
};