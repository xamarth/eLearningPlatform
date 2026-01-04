import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function Lesson() {
  const { enrollmentId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!enrollmentId || !lessonId) return;

    const loadLesson = async () => {
      try {
        const res = await api.get("/enrollments/me");

        const enroll = res.data.find(e => e._id === enrollmentId);
        if (!enroll) {
          navigate("/dashboard");
          return;
        }

        const lessons = [...(enroll.courseId.lessons || [])].sort(
          (a, b) => a.order - b.order
        );

        const foundLesson = lessons.find(l => l._id === lessonId);
        if (!foundLesson) {
          navigate("/dashboard");
          return;
        }

        const progress =
          typeof enroll.progress?.get === "function"
            ? Object.fromEntries(enroll.progress)
            : enroll.progress || {};

        await api.put(`/enrollments/${enrollmentId}/last-lesson`, {
          lessonId
        });

        setAllLessons(lessons);
        setLesson(foundLesson);
        setProgressMap(progress);
        setIsCompleted(Boolean(progress[lessonId]));
      } catch (err) {
        console.error("Failed to load lesson", err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [enrollmentId, lessonId, navigate]);

  useEffect(() => {
    if (!lessonId) return;
    setIsCompleted(Boolean(progressMap[lessonId]));
  }, [lessonId, progressMap]);

  const currentIndex = allLessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const markCompleted = async () => {
    if (isCompleted) return;

    await api.put(`/enrollments/${enrollmentId}/progress`, {
      lessonId,
      completed: true
    });

    setProgressMap(prev => ({
      ...prev,
      [lessonId]: true
    }));
    setIsCompleted(true);

    if (nextLesson) {
      navigate(`/learn/${enrollmentId}/${nextLesson._id}`);
    } else {
      navigate("/dashboard");
    }
  };

  if (loading) return <p className="p-6">Loading lesson...</p>;
  if (!lesson) return <p className="p-6">Lesson not found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{lesson.title}</h1>

        <button
          onClick={() => setShowSidebar(s => !s)}
          className="text-sm underline"
        >
          {showSidebar ? "Hide Lessons" : "Show Lessons"}
        </button>
      </div>

      <div className="flex gap-6">
        {showSidebar && (
          <aside className="w-72 shrink-0 border rounded p-3 space-y-2">
            <h3 className="font-semibold text-sm mb-2">Lessons</h3>

            {allLessons.map(l => {
              const completed = Boolean(progressMap[l._id]);
              const isActive = l._id === lessonId;

              return (
                <button
                  key={l._id}
                  onClick={() =>
                    navigate(`/learn/${enrollmentId}/${l._id}`)
                  }
                  className={`block w-full text-left text-sm px-2 py-1 rounded
                    ${isActive
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4">{completed ? "✓" : isActive ? "▶" : ""}</span>
                    <span>{l.order}. {l.title}</span>
                  </span>
                </button>
              );
            })}
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: lesson.contentHtml
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          disabled={!prevLesson}
          onClick={() =>
            prevLesson &&
            navigate(`/learn/${enrollmentId}/${prevLesson._id}`)
          }
          className={`px-4 py-2 rounded ${prevLesson
            ? "border underline"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          ← Previous
        </button>

        <button
          onClick={markCompleted}
          disabled={isCompleted}
          className={`px-6 py-2 rounded ${isCompleted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black text-white"
            }`}
        >
          {isCompleted ? "Completed ✓" : "Mark as Completed"}
        </button>

        <button
          disabled={!nextLesson}
          onClick={() =>
            nextLesson &&
            navigate(`/learn/${enrollmentId}/${nextLesson._id}`)
          }
          className={`px-4 py-2 rounded ${nextLesson
            ? "border underline"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
