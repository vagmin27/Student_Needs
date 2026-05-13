import express from "express";
const router = express.Router();

// Import controllers
import {
    getExternalJobs,
    searchExternalJobs
} from "../controllers/ExternalJobController.js";

// Import middleware
import { auth } from "../middlewares/auth.js";

// ********************************************************************************************************
//                                      External Job routes
// ********************************************************************************************************

// All routes require authentication
router.use(auth);

// Get External Jobs
router.get("/jobs/external", getExternalJobs);

// Search External Jobs
router.get("/jobs/external/search", searchExternalJobs);

export default router;