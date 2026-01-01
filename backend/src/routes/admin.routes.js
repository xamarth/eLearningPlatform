import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { getUsers, getAllEnrollments } from "../controllers/admin.controller.js";
import { getMetrics } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);
router.get("/enrollments", protect, adminOnly, getAllEnrollments);
router.get("/reports", protect, adminOnly, getMetrics);

export default router;
