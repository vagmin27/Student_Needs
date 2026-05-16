import { error, success } from "../../utils/Expenses/handler.js";
import { UserService } from "../../services/Expenses/UserService.js";
import { validateExpenseRequest, loginSchema, signupSchema } from "../../validations/Expenses/expense.validation.js";

export const loginController = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(loginSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const userData = await UserService.login(data.email, data.password);

    const response = success(200, userData);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(err.statusCode || 500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const signupController = async (req, res) => {
  try {
    const { isValid, data, errorResponse } = validateExpenseRequest(signupSchema, req.body);
    if (!isValid) return res.status(400).send(errorResponse);

    const result = await UserService.signup(data.username, data.email, data.password);

    const response = success(201, result);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(err.statusCode || 500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const logoutController = async (req, res) => {
  const result = UserService.logout();
  const response = success(200, result);
  return res.status(response.statusCode).send(response);
};