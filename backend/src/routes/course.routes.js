import express from "express";
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  addLessonToCourse
} from "../controllers/course.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { courseValidator } from "../validators/course.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

/* public */
router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);

/* admin */
router.post("/", protect, adminOnly, courseValidator, validate, createCourse);
router.post("/:id/lessons", protect, adminOnly, addLessonToCourse);
router.put("/:id", protect, adminOnly, courseValidator, validate, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

export default router;
