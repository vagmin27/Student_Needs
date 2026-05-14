import userModel from "../db/userModel.js";
import { error, success } from "../utils/handler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      const response = error(404, "User not found");
      return res.status(response.statusCode).send(response);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const response = error(401, "Invalid credentials");
      return res.status(response.statusCode).send(response);
    }

    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    };

    const response = success(200, userData);
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const signupContorller = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      const response = error(409, "User already exists");
      return res.status(response.statusCode).send(response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    const response = success(201, {
      message: "User created successfully",
      token,
    });
    return res.status(response.statusCode).send(response);
  } catch (err) {
    const response = error(500, err.message);
    return res.status(response.statusCode).send(response);
  }
};

export const logoutController = async (req, res) => {
  const response = success(200, "Logged out successfully");
  return res.status(response.statusCode).send(response);
};