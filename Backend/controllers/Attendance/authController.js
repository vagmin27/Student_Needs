import jwt from "jsonwebtoken";
import User from "../../models/Attendance/User.js";


// ✅ GENERATE JWT TOKEN
const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// ✅ REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // CHECK EMPTY FIELDS
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // RESPONSE
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id, user.role),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // CHECK USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // CHECK PASSWORD
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // RESPONSE
    res.status(200).json({
      message: "Login successful",

      token: generateToken(user._id, user.role),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};