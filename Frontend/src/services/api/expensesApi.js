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
  },

  // Settings APIs
  getSettings: async () => {
    try {
      const response = await expensesApiClient.get("/expense-settings");
      return response.data.message;
    } catch (e) {
      return null;
    }
  },
  updateSettings: async (settingsData) => {
    try {
      const response = await expensesApiClient.put("/expense-settings", settingsData);
      return response.data;
    } catch (e) {
      return e.response?.data || { success: false, message: e.message };
    }
  },

  // Bills APIs
  getBills: async () => {
    try {
      const response = await expensesApiClient.get("/bills");
      return response.data.message || [];
    } catch (e) {
      return [];
    }
  },
  createBill: async (billData) => {
    try {
      const response = await expensesApiClient.post("/bills", billData);
      return response.data;
    } catch (e) {
      return e.response?.data || { success: false, message: e.message };
    }
  },
  updateBill: async (id, billData) => {
    try {
      const response = await expensesApiClient.put(`/bills/${id}`, billData);
      return response.data;
    } catch (e) {
      return e.response?.data || { success: false, message: e.message };
    }
  },
  deleteBill: async (id) => {
    try {
      const response = await expensesApiClient.delete(`/bills/${id}`);
      return response.data;
    } catch (e) {
      return e.response?.data || { success: false, message: e.message };
    }
  },
  payBill: async (id) => {
    try {
      const response = await expensesApiClient.patch(`/bills/${id}/pay`);
      return response.data;
    } catch (e) {
      return e.response?.data || { success: false, message: e.message };
    }
  },
  getBillHistory: async () => {
    try {
      const response = await expensesApiClient.get("/bill-history");
      return response.data.message || [];
    } catch (e) {
      return [];
    }
  },
  getDashboardSummary: async () => {
    try {
      const response = await expensesApiClient.get("/dashboard/expense-summary");
      return response.data.message;
    } catch (e) {
      return null;
    }
  },
  downloadReportPDF: async () => {
    try {
      const response = await expensesApiClient.get("/reports/pdf", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly_expense_report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      toast.error("Failed to download PDF report");
    }
  },
  downloadReportCSV: async () => {
    try {
      const response = await expensesApiClient.get("/reports/csv", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly_expense_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      toast.error("Failed to download CSV report");
    }
  }
};

