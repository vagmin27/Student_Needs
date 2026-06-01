import passport from "passport";
import jwt from "jsonwebtoken";
import Tutor from "../../models/Tutorials/Tutor.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Student from "../../models/Referrals/StudentModel.js";
import { getJwtSecret } from "../../utils/jwtSecret.js";

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

const resolveUserFromToken = async (token) => {
  const decoded = jwt.verify(token, getJwtSecret());
  if (!decoded?.id) return null;

  const resolvedRole = (decoded.role || decoded.accountType || "student").toLowerCase();
  let dbUser = null;

  if (resolvedRole === "alumni") {
    dbUser = await Alumni.findById(decoded.id)
      .select("-password")
      .populate("college", "name matchingName")
      .lean();
  } else if (resolvedRole === "tutor" || resolvedRole === "teacher") {
    dbUser = await Tutor.findById(decoded.id).select("-password").lean();
  } else {
    dbUser = await Student.findById(decoded.id).select("-password").lean();
  }

  if (!dbUser) return null;

  return {
    ...dbUser,
    role: resolvedRole,
    accountType: resolvedRole,
  };
};

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

export const getUser = async (req, res) => {
  try {
    const token = getBearerToken(req) || req.cookies?.token;

    if (token) {
      try {
        const dbUser = await resolveUserFromToken(token);
        if (dbUser) {
          return res.status(200).json({ user: dbUser });
        }
      } catch (err) {
        if (err.name !== "JsonWebTokenError" && err.name !== "TokenExpiredError") {
          console.error("Error verifying JWT token in getUser:", err.message);
        }
      }
    }

    if (req.isAuthenticated()) {
      return res.status(200).json({ user: req.user });
    }

    if (req.session?.user?.id && req.session?.user?.role === "tutor") {
      const tutor = await Tutor.findById(req.session.user.id).select("-password").lean();
      if (tutor) {
        const sessionToken = jwt.sign(
          { id: tutor._id, role: "tutor" },
          getJwtSecret(),
          { expiresIn: "7d" }
        );
        return res.status(200).json({
          user: { ...tutor, role: "tutor", accountType: "tutor" },
          token: sessionToken,
        });
      }
    }

    return res.status(401).json({ user: null });
  } catch (e) {
    console.error("getUser error:", e.message);
    return res.status(500).json({ user: null, message: "Failed to load user" });
  }
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
