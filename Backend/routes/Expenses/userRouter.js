import express from "express";
import {
  loginController,
  logoutController,
  signupController,
} from "../../controllers/Expenses/userController.js";

const router = express.Router();

router.post("/login", loginController);
router.get("/logout", logoutController);
router.post("/signup", signupController);

export default router;