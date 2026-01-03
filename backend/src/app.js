import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://elearnplat.vercel.app"],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
