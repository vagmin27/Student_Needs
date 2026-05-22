import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import myDB from "../../db/Tutorials/myDB.js";
import User from "../../models/Tutorials/user.js";
import { comparePassword } from "../../utils/Tutorials/passwordUtilities.js";

// 🔐 LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await myDB.getUsers(email);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// ✅ SAVE USER ID IN SESSION
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// ✅ GET USER FROM DB
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();

    if (!user) return done(null, false);

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});