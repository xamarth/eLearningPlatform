import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const getMetrics = async (req, res) => {
  const users = await User.countDocuments();
  const courses = await Course.countDocuments();
  const enrollments = await Enrollment.countDocuments();

  res.json({
    users,
    courses,
    enrollments
  });
};
