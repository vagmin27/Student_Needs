import myDB from "../../db/Tutorials/myDB.js";
import { hashPassword } from "../../utils/Tutorials/passwordUtilities.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const pendingRegistrations = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail", // or your SMTP service
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const redirectReg = (req, res) => {
  res.status(200).redirect("/api/register");
};

export const requestOtp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkExistUser = await myDB.getUsers(email);

    if (checkExistUser) {
      return res.status(400).json({
        message: "User email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    const otp = crypto.randomInt(100000, 999999).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    pendingRegistrations.set(email, {
      otp,
      hashedPassword,
      expiresAt,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent to your email",
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = pendingRegistrations.get(email);

    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found",
      });
    }

    if (new Date() > pending.expiresAt) {
      pendingRegistrations.delete(email);
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (otp !== pending.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await myDB.createUser(email, pending.hashedPassword);

    pendingRegistrations.delete(email);

    res.status(201).json({
      message: "Successfully registered!",
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const pending = pendingRegistrations.get(email);

    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    pending.otp = otp;
    pending.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your New OTP for Registration",
      text: `Your new OTP is: ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "New OTP sent to your email",
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};