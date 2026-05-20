import passport from "passport";

// 🔐 LOGIN
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Invalid credentials",
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.login(user, (err) => {
        if (err) return next(err);

        req.session.save((err) => {
          if (err) return next(err);

          return res.status(200).json({
            status: "ok",
            user: user,
          });
        });
      });
    });
  })(req, res, next);
};

// ✅ THIS WAS MISSING / WRONG
export const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }

  return res.status(401).json({ user: null });
};

// 🚪 LOGOUT
export const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });
};