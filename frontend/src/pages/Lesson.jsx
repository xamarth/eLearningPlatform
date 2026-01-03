import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function Lesson() {
  const { enrollmentId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const res = await api.get("/enrollments/me");

        const enroll = res.data.find(e => e._id === enrollmentId);
        
        if (!enroll) {
          navigate("/dashboard");
          return;
        }

        const foundLesson = enroll.courseId.lessons.find(
          l => l._id === lessonId
        );

        if (!foundLesson) {
          navigate("/dashboard");
          return;
        }

        setLesson(foundLesson);
      } catch (err) {
        console.error("Failed to load lesson", err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [enrollmentId, lessonId, navigate]);

  const markCompleted = async () => {
    await api.put(`/enrollments/${enrollmentId}/progress`, {
      lessonId,
      completed: true
    });

    navigate("/dashboard");
  };

  if (loading) {
    return <p className="p-6">Loading lesson...</p>;
  }

  if (!lesson) {
    return <p className="p-6">Lesson not found</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: lesson.contentHtml
        }}
      />

      <button
        onClick={markCompleted}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Mark as Completed
      </button>
    </div>
  );
}
