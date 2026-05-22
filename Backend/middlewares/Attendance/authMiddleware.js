import jwt from "jsonwebtoken";
import User from "../../models/Attendance/User.js";
import ReferralStudent from "../../models/Referrals/StudentModel.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Tutor from "../../models/Tutorials/Tutor.js";


// ✅ PROTECT ROUTES MIDDLEWARE
const protect = async (req, res, next) => {
  let token;

  try {

    // CHECK AUTH HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      // GET TOKEN
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // GET ATTENDANCE USER WITHOUT PASSWORD
      const attendanceUser = await User.findById(decoded.id).select("-password");

      if (attendanceUser) {
        req.user = attendanceUser;
        return next();
      }

      if (decoded.accountType) {
        const referralStudent = await ReferralStudent.findById(decoded.id).select("-password");

        if (referralStudent) {
          req.user = {
            _id: referralStudent._id,
            id: referralStudent._id,
            name: `${referralStudent.firstName || ""} ${referralStudent.lastName || ""}`.trim(),
            email: referralStudent.email,
            role: referralStudent.accountType?.toLowerCase(),
            accountType: referralStudent.accountType,
            authSource: "referrals",
          };
          return next();
        }
      }

      return res.status(401).json({
        message: "User not found",
      });
      // GET USER WITHOUT PASSWORD
      let user = null;
      try {
        user = await User.findById(decoded.id).select("-password");
        if (!user) {
          user = await ReferralStudent.findById(decoded.id).select("-password");
        }
        if (!user) {
          user = await Alumni.findById(decoded.id).select("-password");
        }
        if (!user) {
          user = await Tutor.findById(decoded.id).select("-password");
        }
      } catch (err) {
        console.error("DB lookup failed in authMiddleware", err);
      }

      if (user) {
        const userObj = user.toObject ? user.toObject() : user;
        const rawRole = (userObj.role || userObj.accountType || "student").toLowerCase();
        
        req.user = {
          ...userObj,
          id: userObj._id || userObj.id,
          role: rawRole,
          accountType: rawRole,
        };
      }

      if (!req.user) {
        const rawRole = (decoded.role || decoded.accountType || "student").toLowerCase();
        req.user = {
          ...decoded,
          role: rawRole,
          accountType: rawRole,
        };
      }

      next();

    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
    });
  }
};

export default protect;
