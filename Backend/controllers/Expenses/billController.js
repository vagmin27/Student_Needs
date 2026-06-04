import { success, error } from "../../utils/Expenses/handler.js";
import billModel from "../../models/Expenses/billModel.js";
import expenseSettingsModel from "../../models/Expenses/expenseSettingsModel.js";
import expenseModel from "../../models/Expenses/expenseModel.js";
import { Notification } from "../../models/Notification.js";
import { notificationService } from "../../services/NotificationService.js";
import { validateExpenseRequest, createBillSchema } from "../../validations/Expenses/expense.validation.js";

// Helper to determine status dynamically based on current date
const determineStatus = (dueDateStr) => {
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (due.getTime() < today.getTime()) {
    return "Overdue";
  } else if (due.getTime() === today.getTime()) {
    return "Due Today";
  } else {
    return "Upcoming";
  }
};

// Helper to get priority weight for sorting
const getPriorityWeight = (priority) => {
  switch (priority) {
    case "Critical": return 4;
    case "High": return 3;
    case "Medium": return 2;
    case "Low": return 1;
    default: return 2;
  }
};

// Helper to update active bills statuses in bulk
const refreshBillStatuses = async (userId) => {
  const activeBills = await billModel.find({ userId, status: { $ne: "Paid" } });
  for (const bill of activeBills) {
    const newStatus = determineStatus(bill.dueDate);
    if (bill.status !== newStatus) {
      bill.status = newStatus;
      await bill.save();
    }
  }
};

export const createBill = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(createBillSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;
    const status = determineStatus(data.dueDate);

    const bill = await billModel.create({
      userId,
      billName: data.billName,
      amount: Number(data.amount),
      dueDate: new Date(data.dueDate),
      priority: data.priority,
      isRecurring: data.isRecurring,
      recurringType: data.recurringType,
      status,
    });

    const response = success(201, bill);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getBills = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Refresh statuses dynamically on retrieval
    await refreshBillStatuses(userId);

    const bills = await billModel.find({ userId, status: { $ne: "Paid" } });

    // Sort: Critical -> High -> Medium -> Low, then by Due Date ascending
    const sortedBills = bills.sort((a, b) => {
      const weightA = getPriorityWeight(a.priority);
      const weightB = getPriorityWeight(b.priority);
      
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const response = success(200, sortedBills);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const editBill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { isValid, data, errorResponse } = validateExpenseRequest(createBillSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const bill = await billModel.findOne({ _id: id, userId });
    if (!bill) {
      const response = error(404, "Bill not found");
      return res.status(response.statusCode).send(response);
    }

    bill.billName = data.billName;
    bill.amount = Number(data.amount);
    bill.dueDate = new Date(data.dueDate);
    bill.priority = data.priority;
    bill.isRecurring = data.isRecurring;
    bill.recurringType = data.recurringType;
    bill.status = determineStatus(data.dueDate);

    await bill.save();

    const response = success(200, bill);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const bill = await billModel.findOneAndDelete({ _id: id, userId });
    if (!bill) {
      const response = error(404, "Bill not found");
      return res.status(response.statusCode).send(response);
    }

    const response = success(200, "Bill deleted successfully");
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const payBill = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const bill = await billModel.findOne({ _id: id, userId });
    if (!bill) {
      const response = error(404, "Bill not found");
      return res.status(response.statusCode).send(response);
    }

    if (bill.status === "Paid") {
      const response = error(400, "Bill is already paid");
      return res.status(response.statusCode).send(response);
    }

    // Capture old status for notification message
    const oldStatus = bill.status;

    bill.status = "Paid";
    bill.paidDate = new Date();
    await bill.save();

    // Create in-app notification via the global service
    try {
      await notificationService.createAndEmitNotification({
        recipientId: userId,
        type: "EXPENSE",
        title: "Bill Paid",
        message: `✅ ${bill.billName} marked as paid.`,
        link: "/expenses-tracker",
      });
    } catch (notifErr) {
      console.error("Failed to create paid bill notification:", notifErr.message);
    }

    // Handle Recurring Rollover
    if (bill.isRecurring && bill.recurringType !== "None") {
      const nextDue = new Date(bill.dueDate);
      if (bill.recurringType === "Monthly") {
        nextDue.setMonth(nextDue.getMonth() + 1);
      } else if (bill.recurringType === "Quarterly") {
        nextDue.setMonth(nextDue.getMonth() + 3);
      } else if (bill.recurringType === "Semester") {
        nextDue.setMonth(nextDue.getMonth() + 6);
      } else if (bill.recurringType === "Yearly") {
        nextDue.setFullYear(nextDue.getFullYear() + 1);
      }

      await billModel.create({
        userId,
        billName: bill.billName,
        amount: bill.amount,
        dueDate: nextDue,
        priority: bill.priority,
        isRecurring: true,
        recurringType: bill.recurringType,
        status: determineStatus(nextDue),
      });
    }

    const response = success(200, bill);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getBillHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await billModel.find({ userId, status: "Paid" }).sort({ paidDate: -1 });

    const response = success(200, history);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Refresh statuses
    await refreshBillStatuses(userId);

    // Get active bills counts
    const upcomingCount = await billModel.countDocuments({ userId, status: "Upcoming" });
    const dueTodayCount = await billModel.countDocuments({ userId, status: "Due Today" });
    const overdueCount = await billModel.countDocuments({ userId, status: "Overdue" });

    // Get paid this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    
    const paidThisMonthCount = await billModel.countDocuments({
      userId,
      status: "Paid",
      paidDate: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // Get Expense Settings
    const settings = await expenseSettingsModel.findOne({ userId }) || {
      monthlyBudget: 0,
      savingsGoal: 0,
      currency: "INR",
    };

    // Calculate spent in current month
    const monthlyExpenses = await expenseModel.find({
      userId,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    let totalSpent = 0;
    let totalIncome = 0;

    monthlyExpenses.forEach((exp) => {
      if (exp.type === "income") {
        totalIncome += exp.amount;
      } else {
        totalSpent += exp.amount;
      }
    });

    const remainingBudget = settings.monthlyBudget - totalSpent;
    const utilizationPercentage = settings.monthlyBudget > 0 
      ? Math.min(100, Math.round((totalSpent / settings.monthlyBudget) * 100))
      : 0;

    // Projected Month-End Spending
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const projectedSpend = currentDay > 0
      ? Math.round(totalSpent * (daysInMonth / currentDay))
      : totalSpent;

    // Savings Goal Progress
    const currentSavings = totalIncome - totalSpent;

    const summary = {
      upcomingCount,
      dueTodayCount,
      overdueCount,
      paidThisMonthCount,
      monthlyBudget: settings.monthlyBudget,
      totalSpent,
      remainingBudget,
      utilizationPercentage,
      projectedSpend,
      savingsGoal: settings.savingsGoal,
      currentSavings,
      currency: settings.currency,
    };

    const response = success(200, summary);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};
