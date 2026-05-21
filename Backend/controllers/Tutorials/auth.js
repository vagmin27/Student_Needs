import passport from "passport";
import jwt from "jsonwebtoken";
import Tutor from "../../models/Tutorials/Tutor.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Student from "../../models/Referrals/StudentModel.js";

// 🔐 LOGIN
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Invalid credentials",
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.login(user, (err) => {
        if (err) return next(err);

        req.session.save((err) => {
          if (err) return next(err);

          return res.status(200).json({
            status: "ok",
            user: user,
          });
        });
      });
    });
  })(req, res, next);
};

// ✅ THIS WAS MISSING / WRONG
export const getUser = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }

  // Check tutor session
  if (req.session?.user?.id && req.session?.user?.role === "tutor") {
    try {
      const tutor = await Tutor.findById(req.session.user.id);
      if (tutor) {
        const tutorObj = tutor.toObject();
        tutorObj.role = "tutor";
        return res.status(200).json({ user: tutorObj });
      }
    } catch (e) {
      console.error("Error retrieving tutor profile from session:", e);
    }
  }

  // Check JWT token (for Alumni, Verifier, or any token-based session)
  const authHeader = req.headers.authorization;
  const token = (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null) || req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded.id) {
        const resolvedRole = (decoded.role || decoded.accountType || "student").toLowerCase();
        let dbUser = null;
        if (resolvedRole === "alumni") {
          dbUser = await Alumni.findById(decoded.id).select("-password").populate("college", "name matchingName");
        } else if (resolvedRole === "tutor" || resolvedRole === "teacher") {
          dbUser = await Tutor.findById(decoded.id).select("-password");
        } else {
          dbUser = await Student.findById(decoded.id).select("-password");
        }
        if (dbUser) {
          const userObj = dbUser.toObject();
          userObj.role = resolvedRole;
          userObj.accountType = resolvedRole;
          return res.status(200).json({ user: userObj });
        }
      }
    } catch (err) {
      console.error("Error verifying JWT token in getUser:", err.message);
    }
  }

  return res.status(401).json({ user: null });
};

// 🚪 LOGOUT
export const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });
};