// middleware/authMiddleware.js

/**
 * 🔐 Check if ANY user is logged in (Passport-based)
 */
export const isAuthenticated = (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login",
      });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in auth middleware",
    });
  }
};

/**
 * 👨‍🎓 Check if Student (Passport-based)
 */
export const isStudent = (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login",
      });
    }

    const userRole = (req.user?.role || req.user?.accountType || "").toLowerCase();
    if (!req.user || userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students allowed",
      });
    }

    next();
  } catch (error) {
    console.error("Student Role Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in student middleware",
    });
  }
};

/**
 * 👨‍🏫 Check if Tutor (Manual session-based)
 */
export const isTutor = (req, res, next) => {
  try {
    const sessionUser = req.session?.user || req.user;
    const userRole = (sessionUser?.role || sessionUser?.accountType || "").toLowerCase();
    if (userRole !== "tutor" && userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only tutors allowed",
      });
    }

    next();
  } catch (error) {
    console.error("Tutor Role Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in tutor middleware",
    });
  }
};

/**
 * 🔥 Role-based Authorization (separates Passport and manual session)
 */
export const authorizeRole = (role) => {
  return (req, res, next) => {
    try {
      const targetRole = role.toLowerCase();
      if (targetRole === "student") {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized: Please login",
          });
        }
        const userRole = (req.user?.role || req.user?.accountType || "").toLowerCase();
        if (!req.user || userRole !== "student") {
          return res.status(403).json({
            success: false,
            message: "Forbidden: Only students allowed",
          });
        }
      } else if (targetRole === "tutor" || targetRole === "teacher") {
        const sessionUser = req.session?.user || req.user;
        const userRole = (sessionUser?.role || sessionUser?.accountType || "").toLowerCase();
        if (userRole !== "tutor" && userRole !== "teacher") {
          return res.status(403).json({
            success: false,
            message: "Forbidden: Only tutors allowed",
          });
        }
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error in role middleware",
      });
    }
  };
};