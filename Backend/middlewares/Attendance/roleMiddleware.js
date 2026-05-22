// Allow any authenticated user (personal attendance tracker)
export const allowAuthenticated = (req, res, next) => {
  const userId = req.user?._id || req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }
  next();
};

// Legacy: teacher-only (kept for backward compatibility if needed)
export const allowTeacher = (req, res, next) => {
  const userRole = (req.user?.role || req.user?.accountType || "").toLowerCase();
  if (userRole === "teacher" || userRole === "tutor") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Teacher only.",
    });
  }
};

export const allowStudent = (req, res, next) => {
  const userRole = (req.user?.role || req.user?.accountType || "").toLowerCase();
  if (userRole === "student") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Student only.",
    });
  }
};
