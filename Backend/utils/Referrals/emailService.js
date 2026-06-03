import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Base email layout to maintain consistency and a dark, modern MERN platform aesthetic.
 */
const getHtmlLayout = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            background-color: #070b19;
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #f1f5f9;
          }
          .email-container {
            max-width: 580px;
            margin: 40px auto;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            border: 1px solid #312e81;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.05em;
            color: #ffffff;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
            font-size: 16px;
            color: #cbd5e1;
          }
          .footer {
            background-color: #020617;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #1e1b4b;
          }
          .btn-primary {
            display: inline-block;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 700;
            margin: 20px 0;
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          }
          .otp-code {
            display: inline-block;
            font-family: monospace;
            font-size: 38px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #818cf8;
            background-color: #0f172a;
            border: 1px solid #4338ca;
            padding: 16px 24px;
            border-radius: 12px;
            margin: 24px 0;
            text-shadow: 0 0 10px rgba(129, 140, 248, 0.3);
          }
          a {
            color: #818cf8;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>UniConnect</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} UniConnect Student Platform. All rights reserved.</p>
            <p>You received this email because you registered on our platform.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Sends OTP Email for registration verification.
 */
export const sendOtpEmail = async (email, otp) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Verify Your Account</h2>
    <p>Thank you for signing up on UniConnect! To complete your registration and activate your account, please enter the 6-digit One-Time Password (OTP) below on the verification page:</p>
    <div style="text-align: center;">
      <div class="otp-code">${otp}</div>
    </div>
    <p style="color: #94a3b8; font-size: 14px;"><strong>Note:</strong> This OTP is valid for <strong>5 minutes</strong>. If you did not request this verification, please ignore this email or contact support.</p>
  `;
  const html = getHtmlLayout("Verify Your Account - UniConnect", content);

  const mailOptions = {
    from: `"UniConnect Auth" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your UniConnect Account - OTP",
    html,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends a welcome onboarding email.
 */
export const sendWelcomeEmail = async (email, firstName) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Welcome to UniConnect, ${firstName}! 🎉</h2>
    <p>Your account has been successfully verified. We are thrilled to welcome you to UniConnect, the ultimate MERN startup-style student platform.</p>
    <p>Here is what you can do next:</p>
    <ul style="padding-left: 20px; color: #cbd5e1; margin-bottom: 24px;">
      <li style="margin-bottom: 8px;">Explore and book interactive sessions with expert Tutors</li>
      <li style="margin-bottom: 8px;">Track your personal and tutor attendance with detailed analytics</li>
      <li style="margin-bottom: 8px;">Manage your daily student budgets and recurring expenses</li>
      <li style="margin-bottom: 8px;">Apply to internships and get referrals from verified alumni</li>
    </ul>
    <div style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="btn-primary">Log In to Your Dashboard</a>
    </div>
    <p>If you have any questions or feedback, feel free to reply to this email.</p>
  `;
  const html = getHtmlLayout("Welcome to UniConnect!", content);

  const mailOptions = {
    from: `"UniConnect Onboarding" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to UniConnect! 🎉",
    html,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends Forgot Password OTP email.
 */
export const sendResetPasswordEmail = async (email, otp) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Reset Your Password</h2>
    <p>We received a request to reset the password for your UniConnect account. Please enter the 6-digit One-Time Password (OTP) below to complete your reset request:</p>
    <div style="text-align: center;">
      <div class="otp-code">${otp}</div>
    </div>
    <p style="color: #f87171; font-size: 14px;"><strong>This code will expire in 5 minutes.</strong></p>
    <p>If you did not request a password reset, please ignore this email or let us know. Your password will remain unchanged.</p>
  `;
  const html = getHtmlLayout("Reset Your Password - UniConnect", content);

  const mailOptions = {
    from: `"UniConnect Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your UniConnect Password - OTP",
    html,
  };

  return transporter.sendMail(mailOptions);
};
