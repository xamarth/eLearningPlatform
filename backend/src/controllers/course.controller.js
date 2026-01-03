import { validationResult } from "express-validator";
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

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

export const addLessonToCourse = async (req, res) => {
  const { id } = req.params;
  const { title, contentHtml, order } = req.body;

  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.lessons.push({
    title,
    contentHtml,
    order
  });

  await course.save();

  res.status(201).json(course);
};

export const updateLesson = async (req, res) => {
  const { title, contentHtml, order } = req.body;

  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const lesson = course.lessons.id(req.params.lessonId);
  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }

  lesson.title = title;
  lesson.contentHtml = contentHtml;
  lesson.order = order;

  await course.save();
  res.json(course);
};

export const deleteLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.lessons = course.lessons.filter(
    lesson => lesson._id.toString() !== lessonId
  );

  await course.save();
  res.json(course);
};
