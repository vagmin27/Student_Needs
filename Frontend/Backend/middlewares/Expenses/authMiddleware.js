import jwt from "jsonwebtoken";
import { error } from "../../utils/Expenses/handler.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const response = error(401, "No token provided");
      return res.status(response.statusCode).send(response);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Normalize user ID to support unified auth (Referrals/Attendance use id, Expenses uses userId)
    const unifiedUserId = decoded.userId || decoded.id;
    
    if (!unifiedUserId) {
        const response = error(401, "Invalid token payload");
        return res.status(response.statusCode).send(response);
    }

    // Attach userId to request object for Expenses controllers to use
    req.user = { ...decoded, userId: unifiedUserId };

    // Security: Ownership Validation
    const requestedUserId = req.body.userId || req.query.userId || req.params.userId;
    
    if (requestedUserId && requestedUserId.toString() !== unifiedUserId.toString()) {
      const response = error(403, "Access denied: You can only access your own data");
      return res.status(response.statusCode).send(response);
    }

    next();
  } catch (err) {
    const response = error(401, "Invalid or expired token");
    return res.status(response.statusCode).send(response);
  }
};