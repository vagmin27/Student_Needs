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
      req.user = await User.findById(decoded.id).select("-password");

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