import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

export const getUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
};

export const getAllEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate("userId", "name email")
    .populate("courseId", "title");

  res.json(enrollments);
};

export const getAdminStats = async (req, res) => {
  const usersCount = await User.countDocuments();
  const enrollments = await Enrollment.find().populate("courseId", "title");

  const coursesMap = {};

  enrollments.forEach(enroll => {
    const title = enroll.courseId?.title || "Unknown";
    coursesMap[title] = (coursesMap[title] || 0) + 1;
  });

  const courseStats = Object.entries(coursesMap).map(
    ([title, count]) => ({ title, count })
  );

  res.json({
    users: usersCount,
    enrollments: enrollments.length,
    courses: courseStats.length,
    courseStats
  });
};
