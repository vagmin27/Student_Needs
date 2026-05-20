import { expensesApiClient } from "../apiClient.js";
import { toast } from "react-hot-toast";

// Centralized API wrapper for Expenses module
export const expensesApi = {
  // Auth
  login: async (data) => {
    return await expensesApiClient.post("/auth/login", data);
  },
  signup: async (data) => {
    return await expensesApiClient.post("/auth/signup", data);
  },

  // Operations
  getUserExpenses: async (userId) => {
    try {
      const response = await expensesApiClient.post("/expenses/allExpenses", { userId });
      const exp = response.data.message.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      return exp;
    } catch (error) {
      return [];
    }
  },

  createExpense: async (expInfo) => {
    try {
      const response = await expensesApiClient.post("/expenses/addExpense", expInfo);
      if (response.data.statusCode !== 200 && response.data.statusCode !== 201) {
        toast.error(`${response.data.message}`);
        return null;
      }
      return response.data;
    } catch (e) {
      return null;
    }
  },

  deleteExpense: async (data) => {
    try {
      const { expenseId, userId } = data;
      const response = await expensesApiClient.post("/expenses/deleteExpense", { expenseId, userId });
      if (response.data.statusCode !== 200 && response.data.statusCode !== 201) {
        toast.error(`${response.data.message}`);
        return null;
      }
      return response.data;
    } catch (error) {
      return null;
    }
  },

  sendEmail: async (sender, data) => {
    try {
      const response = await expensesApiClient.post("/expenses/sendEmail", { recipient: sender, body: data });
      toast.success("Email Sent");
      return response;
    } catch (e) {
      return e.message;
    }
  }
};
