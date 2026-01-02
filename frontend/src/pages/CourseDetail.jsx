import { useAuth } from "@/auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourse(res.data);

        if (user) {
          const myEnrollments = await api.get("/enrollments/me");
          setEnrolled(
            myEnrollments.data.some(
              e => e.courseId._id === res.data._id
            )
          );
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, user]);

  const handleEnroll = async () => {
    await api.post("/enrollments", { courseId: course._id });
    navigate("/dashboard");
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (!course) return <p className="p-6">Course not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-6 text-gray-600">{course.description}</p>

      {user ? (
        enrolled ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="border px-6 py-3 rounded"
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            className="bg-black text-white px-6 py-3 rounded"
          >
            Enroll Now
          </button>
        )
      ) : (
        <p className="text-sm text-gray-500">
          Login to enroll in this course
        </p>
      )}
    </div>
  );
}
