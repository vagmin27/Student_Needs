import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Student from "../../models/Referrals/StudentModel.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import dotenv from "dotenv";

dotenv.config();

const handleSocialAuth = async (profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(null, false, { message: "No email returned from provider" });
    }

    // 1. Search Student DB
    let user = await Student.findOne({ email });
    let role = "student";

    if (!user) {
      // 2. Search Alumni DB
      user = await Alumni.findOne({ email });
      if (user) {
        role = "alumni";
      }
    }

    if (user) {
      // User exists: update provider and verification status
      user.isVerified = true;
      if (user.provider === "local" || !user.provider) {
        user.provider = profile.provider;
      }
      await user.save();
      return done(null, { user, role });
    }

    // 3. User does not exist, auto-create as student
    const displayName = profile.displayName || "User";
    const firstName = profile.name?.givenName || displayName.split(" ")[0];
    const lastName = profile.name?.familyName || displayName.split(" ").slice(1).join(" ") || "Student";
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: true,
      provider: profile.provider,
      accountType: "student",
      image: profile.photos?.[0]?.value || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    return done(null, { user: newUser, role: "student" });
  } catch (error) {
    return done(error, null);
  }
};

// 🔐 GOOGLE STRATEGY
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    "google-student",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/v1/student/auth/google/callback",
        passReqToCallback: false,
      },
      async (accessToken, refreshToken, profile, done) => {
        return handleSocialAuth(profile, done);
      }
    )
  );
}

// 🔐 GITHUB STRATEGY
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    "github-student",
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8000/api/v1/student/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        // GitHub profiles sometimes require fetching email separately
        if (!profile.emails || profile.emails.length === 0) {
          try {
            const res = await fetch("https://api.github.com/user/emails", {
              headers: { Authorization: `token ${accessToken}` },
            });
            const emails = await res.json();
            const primaryEmail = emails.find((e) => e.primary && e.verified)?.email || emails[0]?.email;
            if (primaryEmail) {
              profile.emails = [{ value: primaryEmail }];
            }
          } catch (e) {
            console.error("Failed to fetch Github email:", e.message);
          }
        }
        return handleSocialAuth(profile, done);
      }
    )
  );
}
