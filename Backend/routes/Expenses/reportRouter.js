import express from "express";
import { downloadPDFReport, downloadCSVReport } from "../../controllers/Expenses/reportController.js";
import { verifyToken } from "../../middlewares/Expenses/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/pdf", downloadPDFReport);
router.get("/csv", downloadCSVReport);

export default router;
