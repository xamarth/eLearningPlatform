import Course from "../models/Course.js";

/* Public: list courses */
export const getCourses = async (req, res) => {
  const courses = await Course.find().select("-lessons");
  res.json(courses);
};

/* Public: get single course */
export const getCourseBySlug = async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json(course);
};

/* Admin: create course */
export const createCourse = async (req, res) => {
  const {
    title,
    description,
    category,
    difficulty,
    price
  } = req.body;

  const course = await Course.create({
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    description,
    category,
    difficulty,
    price
  });

  res.status(201).json(course);
};

/* Admin: update course */
export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
};

/* Admin: delete course */
export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json({ message: "Course deleted" });
};
