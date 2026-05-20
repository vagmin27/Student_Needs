// ✅ ALLOW ONLY TEACHERS
export const allowTeacher = (req, res, next) => {

  if (req.user && req.user.role === "teacher") {
    next();

  } else {
    return res.status(403).json({
      message: "Access denied. Teacher only.",
    });
  }
};


// ✅ ALLOW ONLY STUDENTS
export const allowStudent = (req, res, next) => {

  if (req.user && req.user.role === "student") {
    next();

  } else {
    return res.status(403).json({
      message: "Access denied. Student only.",
    });
  }
};