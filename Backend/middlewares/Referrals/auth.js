import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/StudentModel.js";

dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      (req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization").split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("Decoded User:", decode); // ✅ useful log
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token is invalid" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
};