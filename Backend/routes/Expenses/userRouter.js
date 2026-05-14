import express from "express";
import {
  loginController,
  logoutController,
  signupContorller,
} from "../controller/userController.js";

const router = express.Router();

router.post("/login", loginController);
router.get("/logout", logoutController);
router.post("/signup", signupContorller);

export default router;