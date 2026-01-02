import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Lesson() {
  const { enrollmentId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    api.get(`/enrollments/me`).then(res => {
      const enrollment = res.data.find(e => e._id === enrollmentId);
      const found = enrollment.courseId.lessons.find(
        l => l._id === lessonId
      );
      setLesson(found);
    });
  }, [enrollmentId, lessonId]);

  const markComplete = async () => {
    await api.put(`/enrollments/${enrollmentId}/progress`, {
      lessonId,
      completed: true
    });
  };

  if (!lesson) return <p>Loading…</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{lesson.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
      />
      <button
        onClick={markComplete}
        className="mt-6 border px-4 py-2 rounded"
      >
        Mark Complete
      </button>
    </div>
  );
}
