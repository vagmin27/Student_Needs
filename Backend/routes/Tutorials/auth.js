import express from "express";
import { login, getUser, logOut } from "../../controllers/Tutorials/auth.js";

const router = express.Router();

// ✅ LOGIN
router.post("/login", login);

// ✅ GET CURRENT USER (IMPORTANT)
router.get("/user", getUser);

// ✅ LOGOUT
router.post("/logout", logOut);

export default router;