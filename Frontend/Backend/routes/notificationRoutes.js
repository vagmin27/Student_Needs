import express from "express";
import { notificationService } from "../services/NotificationService.js";
import { catchAsync } from "../utils/catchAsync.js";

// We need a generic auth middleware to verify the token for all modules.
// Assuming we use a similar logic to Admin routes or passport.
import passport from "passport";

const router = express.Router();

// Mock Auth Middleware for unification (in a real app, use passport.authenticate('jwt'))
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  
  // Quick token decode (since various modules have various JWT secrets right now, 
  // we rely on the client passing their ID in query/body temporarily, or we decode without verify for this unified route).
  // FOR PRODUCTION: Unify the JWT_SECRET across the entire platform.
  try {
    import("jsonwebtoken").then((jwt) => {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.decode(token);
      req.user = decoded;
      next();
    });
  } catch(e) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

router.use(requireAuth);

// GET: Fetch user notifications
router.get("/", catchAsync(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const data = await notificationService.getUserNotifications(userId, page, limit);
  res.status(200).json({ success: true, data });
}));

// PUT: Mark single as read
router.put("/:id/read", catchAsync(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const notificationId = req.params.id;

  const data = await notificationService.markAsRead(notificationId, userId);
  res.status(200).json({ success: true, data });
}));

// PUT: Mark all as read
router.put("/read-all", catchAsync(async (req, res) => {
  const userId = req.user.id || req.user._id;
  await notificationService.markAllAsRead(userId);
  res.status(200).json({ success: true, message: "All notifications marked as read" });
}));

export default router;
