import ReferralStudent from "../../models/Referrals/StudentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId, userId: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const UserService = {
  login: async (email, password) => {
    const user = await ReferralStudent.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user._id);

    return {
      _id: user._id,
      username: user.firstName + " " + user.lastName,
      email: user.email,
      token,
    };
  },

  signup: async (username, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await ReferralStudent.findOne({ email: normalizedEmail });

    if (existingUser) {
      const err = new Error("User already exists");
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Split username into firstName and lastName for the StudentModel
    const nameParts = username.split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "";

    const newUser = await ReferralStudent.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    return {
      message: "User created successfully",
      token,
    };
  },

  logout: () => {
    return "Logged out successfully";
  },
};
