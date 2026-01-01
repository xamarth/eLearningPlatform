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
