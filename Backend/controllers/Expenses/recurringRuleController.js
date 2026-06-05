import { success, error } from "../../utils/Expenses/handler.js";
import recurringRuleModel from "../../models/Expenses/recurringRuleModel.js";

export const createRecurringRule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, amount, frequency, category, nextDate, isActive } = req.body;

    const rule = await recurringRuleModel.create({
      userId,
      title,
      amount: Number(amount),
      frequency,
      category,
      nextDate: new Date(nextDate),
      isActive: isActive !== false,
    });

    const response = success(201, rule);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const getRecurringRules = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Only return rules that are NOT soft-deleted
    const rules = await recurringRuleModel.find({ userId, isDeleted: { $ne: true } });
    
    const response = success(200, rules);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const updateRecurringRule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, amount, frequency, category, nextDate, isActive } = req.body;

    // Secure ownership lookup
    const rule = await recurringRuleModel.findOne({ _id: id, userId, isDeleted: { $ne: true } });
    if (!rule) {
      const response = error(404, "Recurring rule not found");
      return res.status(response.statusCode).send(response);
    }

    if (title !== undefined) rule.title = title;
    if (amount !== undefined) rule.amount = Number(amount);
    if (frequency !== undefined) rule.frequency = frequency;
    if (category !== undefined) rule.category = category;
    if (nextDate !== undefined) rule.nextDate = new Date(nextDate);
    if (isActive !== undefined) rule.isActive = isActive;

    await rule.save();

    const response = success(200, rule);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const deleteRecurringRule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Secure ownership lookup and soft-delete update
    const rule = await recurringRuleModel.findOneAndUpdate(
      { _id: id, userId, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true }
    );
    if (!rule) {
      const response = error(404, "Recurring rule not found");
      return res.status(response.statusCode).send(response);
    }

    const response = success(200, "Recurring rule deleted successfully");
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};
