import jwt from "jsonwebtoken";
import { error } from "../utils/handler.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response = error(401, "No token provided");
      return res.status(response.statusCode).send(response);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach userId to request object
    req.user = decoded;

    // Security: Ownership Validation
    // If request contains userId, it MUST match the token's userId
    const requestedUserId = req.body.userId || req.query.userId || req.params.userId;
    
    if (requestedUserId && requestedUserId.toString() !== decoded.userId.toString()) {
      const response = error(403, "Access denied: You can only access your own data");
      return res.status(response.statusCode).send(response);
    }

    next();
  } catch (err) {
    const response = error(401, "Invalid or expired token");
    return res.status(response.statusCode).send(response);
  }
};