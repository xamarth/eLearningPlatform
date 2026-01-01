import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentHtml: { type: String, required: true },
  videoUrl: { type: String },
  order: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    category: { type: String },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"]
    },
    thumbnailUrl: { type: String },
    lessons: [lessonSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
