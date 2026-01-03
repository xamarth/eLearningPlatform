import { body } from "express-validator";

export const courseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("difficulty")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid difficulty"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number"),
];
