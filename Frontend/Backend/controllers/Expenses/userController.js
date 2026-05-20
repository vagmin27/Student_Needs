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
    console.error("Expenses Login Error:", err);
    // Determine status code safely, defaulting to 500
    const statusCode = err.statusCode || (err.message.includes("not found") ? 404 : err.message.includes("Invalid") ? 401 : 500);
    const response = error(statusCode, err.message || "Internal server error during login");
    return res.status(statusCode).send(response);
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
    console.error("Expenses Signup Error:", err);
    const statusCode = err.statusCode || (err.message.includes("already exists") ? 409 : 500);
    const response = error(statusCode, err.message || "Internal server error during signup");
    return res.status(statusCode).send(response);
  }
};

export const logoutController = async (req, res) => {
  const result = UserService.logout();
  const response = success(200, result);
  return res.status(response.statusCode).send(response);
};