import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

/* enroll user into a course */
export const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const enrollment = await Enrollment.create({
    userId: req.user._id,
    courseId
  });

  res.status(201).json(enrollment);
};

/* get logged in users enrollments */
export const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({
    userId: req.user._id
  }).populate("courseId");

  res.json(enrollments);
};

/* update lesson progress */
export const updateProgress = async (req, res) => {
  const { lessonId, completed } = req.body;

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }

  if (!enrollment.userId.equals(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  enrollment.progress.set(lessonId, completed);
  await enrollment.save();

  res.json(enrollment);
};
