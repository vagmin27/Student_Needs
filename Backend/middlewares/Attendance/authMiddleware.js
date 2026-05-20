import jwt from "jsonwebtoken";
import User from "../../models/Attendance/User.js";


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

      // GET USER WITHOUT PASSWORD
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      const userObj = user.toObject ? user.toObject() : user;
      const rawRole = (userObj.role || userObj.accountType || "student").toLowerCase();
      
      req.user = {
        ...userObj,
        id: userObj._id,
        role: rawRole,
        accountType: rawRole,
      };

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