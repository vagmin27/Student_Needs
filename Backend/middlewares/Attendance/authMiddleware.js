import jwt from "jsonwebtoken";
import User from "../../models/Attendance/User.js";
import ReferralStudent from "../../models/Referrals/StudentModel.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Tutor from "../../models/Tutorials/Tutor.js";
import { getJwtSecret } from "../../utils/jwtSecret.js";

const buildReqUser = (doc, defaults = {}) => {
  const userObj = doc.toObject ? doc.toObject() : doc;
  const rawRole = (
    userObj.role ||
    userObj.accountType ||
    defaults.role ||
    "student"
  ).toLowerCase();

  return {
    ...userObj,
    _id: userObj._id || userObj.id,
    id: userObj._id || userObj.id,
    role: rawRole,
    accountType: rawRole,
    ...defaults,
  };
};

// ✅ PROTECT ROUTES MIDDLEWARE
const protect = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, getJwtSecret());

    const attendanceUser = await User.findById(decoded.id).select("-password");
    if (attendanceUser) {
      req.user = buildReqUser(attendanceUser);
      return next();
    }

    const referralStudent = await ReferralStudent.findById(decoded.id).select(
      "-password"
    );
    if (referralStudent) {
      req.user = buildReqUser(referralStudent, {
        name: `${referralStudent.firstName || ""} ${referralStudent.lastName || ""}`.trim(),
        authSource: "referrals",
      });
      return next();
    }

    const alumniUser = await Alumni.findById(decoded.id).select("-password");
    if (alumniUser) {
      req.user = buildReqUser(alumniUser, {
        role: "alumni",
        accountType: "alumni",
      });
      return next();
    }

    const tutorUser = await Tutor.findById(decoded.id).select("-password");
    if (tutorUser) {
      req.user = buildReqUser(tutorUser, {
        role: "tutor",
        accountType: "tutor",
      });
      return next();
    }

    if (decoded.id) {
      const jwtRole = (decoded.role || decoded.accountType || "student").toLowerCase();
      req.user = buildReqUser(decoded, {
        _id: decoded.id,
        id: decoded.id,
        role: jwtRole,
        accountType: jwtRole,
      });
      return next();
    }

    return res.status(401).json({
      message: "User not found",
    });
  } catch {
    return res.status(401).json({
      message: "Token failed",
    });
  }
};

export default protect;
