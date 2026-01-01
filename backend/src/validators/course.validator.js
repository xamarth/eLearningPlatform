import { body } from "express-validator";

export const courseValidator = [
  body("title").notEmpty(),
  body("slug").notEmpty(),
  body("description").notEmpty(),
  body("difficulty")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
];
