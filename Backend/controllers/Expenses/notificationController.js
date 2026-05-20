import { success, error } from "../../utils/Expenses/handler.js";
import { NotificationService } from "../../services/Expenses/NotificationService.js";
import { validateExpenseRequest, notificationSettingsSchema } from "../../validations/Expenses/expense.validation.js";

export const updateSettings = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(notificationSettingsSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userId = req.user.userId;
    const settings = await NotificationService.updateSettings(userId, data);

    const response = success(200, settings);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};