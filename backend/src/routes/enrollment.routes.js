import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  setLastLesson,
  updateProgress
} from "../controllers/enrollment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, enrollInCourse);
router.get("/me", protect, getMyEnrollments);
router.put("/:id/progress", protect, updateProgress);
router.put("/:id/last-lesson", protect, setLastLesson);

export default router;
