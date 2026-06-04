import { success, error } from "../../utils/Expenses/handler.js";
import expenseSettingsModel from "../../models/Expenses/expenseSettingsModel.js";
import { validateExpenseRequest, expenseSettingsUpdateSchema } from "../../validations/Expenses/expense.validation.js";

export const getExpenseSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    let settings = await expenseSettingsModel.findOne({ userId });
    if (!settings) {
      settings = await expenseSettingsModel.create({
        userId,
        monthlyBudget: 0,
        weeklyBudget: 0,
        dailyBudget: 0,
        currency: "INR",
        savingsGoal: 0,
        categoryLimits: {},
        notificationPreferences: {
          email: true,
          push: true,
          budgetAlerts: true,
          billDueAlerts: true,
          overdueAlerts: true,
          savingsGoalAlerts: true,
        },
        alertThresholds: {
          fifty: true,
          seventyFive: true,
          ninety: true,
          hundred: true,
        }
      });
    }
    const response = success(200, settings);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const updateExpenseSettings = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(expenseSettingsUpdateSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;

    if (!data.allowLimitsExceedBudget && data.categoryLimits) {
      let sum = 0;
      for (const val of Object.values(data.categoryLimits)) {
        sum += Number(val);
      }
      if (sum > data.monthlyBudget) {
        const response = error(400, "Total category limits exceed monthly budget");
        return res.status(response.statusCode).send(response);
      }
    }

    let settings = await expenseSettingsModel.findOne({ userId });
    if (!settings) {
      settings = new expenseSettingsModel({ userId });
    }

    settings.monthlyBudget = data.monthlyBudget;
    settings.weeklyBudget = data.weeklyBudget;
    settings.dailyBudget = data.dailyBudget;
    settings.currency = data.currency;
    settings.savingsGoal = data.savingsGoal;
    settings.categoryLimits = data.categoryLimits;
    if (data.notificationPreferences) {
      settings.notificationPreferences = data.notificationPreferences;
    }
    if (data.alertThresholds) {
      settings.alertThresholds = data.alertThresholds;
    }

    await settings.save();

    const response = success(200, settings);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};
