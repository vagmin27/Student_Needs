import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { getModelByRole, mapOAuthProfileToRole } from "../../utils/Referrals/oauthAdapter.js";

dotenv.config();

const handleSocialAuth = async (profile, targetRole = "student", done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(null, false, { message: "No email returned from provider" });
    }

    const Model = getModelByRole(targetRole);

    // Prevent duplicate creation: Match by providerId first
    let user = null;
    if (profile.id) {
      user = await Model.findOne({ providerId: profile.id });
    }

    // Fallback to email (case-insensitive match)
    if (!user) {
      user = await Model.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    }

    // Role boundaries must remain separate: If email exists in another role, it won't be found here.
    if (user) {
      // User exists in THIS role: update provider and verification status
      user.isVerified = true;
      
      // Update providerId to link the social account
      if (!user.providerId) {
        user.providerId = profile.id;
      }
      
      // Update provider if local or empty
      if (!user.provider || user.provider === "local") {
        user.provider = profile.provider;
      }
      
      // Optionally update profile picture if not set
      if (profile.photos && profile.photos.length > 0) {
        const photoUrl = profile.photos[0].value;
        if (targetRole === "tutor" && (!user.profilePic || user.profilePic.includes("dicebear"))) {
          user.profilePic = photoUrl;
        } else if ((targetRole === "student" || targetRole === "alumni") && (!user.image || user.image.includes("dicebear"))) {
          user.image = photoUrl;
        }
      }
      
      await user.save();
      return done(null, { user, role: targetRole });
    }

    // User does not exist in THIS role, auto-create based on targetRole
    const profileData = await mapOAuthProfileToRole(targetRole, profile, email);
    const newUser = await Model.create(profileData);

    if (targetRole === "alumni" && profileData.college) {
        // College updates handled inside mapOAuthProfileToRole via creation, 
        // but need to push to Alumni array if college existed:
        import("../../models/Referrals/CollegeModel.js").then(({ default: College }) => {
           College.findByIdAndUpdate(profileData.college, { $push: { Alumni: newUser._id } }).exec();
        });
    }

    return done(null, { user: newUser, role: targetRole });
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
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const targetRole = req.query.state || "student";
        return handleSocialAuth(profile, targetRole, done);
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
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
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
        const targetRole = req.query.state || "student";
        return handleSocialAuth(profile, targetRole, done);
      }
    )
  );
}
