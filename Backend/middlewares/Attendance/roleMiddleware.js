// ✅ ALLOW ONLY TEACHERS
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


// ✅ ALLOW ONLY STUDENTS
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