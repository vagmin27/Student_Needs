import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      accountType: user.accountType || "student",
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Access Token expires in 15 minutes
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Refresh Token expires in 7 days
  );
}

async function handleAuthSuccess(user, res, message) {
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in database for rotation and tracking
  user.refreshToken = refreshToken;
  await user.save();

  let userObj = user.toObject();
  userObj.password = undefined;
  userObj.otp = undefined;
  userObj.otpExpiry = undefined;
  userObj.refreshToken = undefined;
  userObj.token = token;

  const isProduction = process.env.NODE_ENV === "production";

  // httpOnly Cookie Options
  const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  res.cookie("token", token, accessCookieOptions);

  return res.status(200).json({
    success: true,
    token,
    refreshToken,
    user: userObj,
    message,
  });
}

export {
  generateToken,
  generateRefreshToken,
  handleAuthSuccess,
};