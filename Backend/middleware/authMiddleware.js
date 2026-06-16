import jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/jwtSecret.js";

/**
 * 🔒 Unified Authentication Middleware for Students and Tutors
 * Supports:
 * 1. Bearer Token in Authorization Header (JWT)
 * 2. Token in HTTP Cookies (JWT)
 * 3. Passport Sessions (req.isAuthenticated())
 * 4. Tutor Express Sessions (req.session.user)
 */
export const chatAuth = async (req, res, next) => {
  try {
    // 1. Check Authorization Header for JWT
    const authHeader = req.headers.authorization;
    let token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    // 2. Check Cookie for JWT
    if (!token) {
      token = req.cookies?.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, getJwtSecret());
        const role = (decoded.role || decoded.accountType || "student").toLowerCase();
        
        req.user = {
          id: decoded.id || decoded.userId || decoded._id,
          role: role,
          accountType: role,
        };
        return next();
      } catch (err) {
        // Token is invalid/expired, proceed to fallback session check
      }
    }

    // 3. Fallback to Passport Session (mostly students)
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      const role = (req.user.role || req.user.accountType || "student").toLowerCase();
      req.user = {
        id: req.user._id,
        role: role,
        accountType: role,
        email: req.user.email || req.user.user,
      };
      return next();
    }

    // 4. Fallback to Tutor Session (express-session)
    if (req.session?.user?.id) {
      const role = (req.session.user.role || "tutor").toLowerCase();
      req.user = {
        id: req.session.user.id,
        role: role,
        accountType: role,
        email: req.session.user.email,
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: No valid session or token found. Please login.",
    });
  } catch (error) {
    console.error("🔥 Chat Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

/**
 * 👮 Role Verification helper
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const role = req.user.role.toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowed.includes(role) && !(role === 'teacher' && normalizedAllowed.includes('tutor'))) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of these roles: [${allowedRoles.join(", ")}]`,
      });
    }
    next();
  };
};
