import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/useAuth";
import api from "@/services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/enrollments/me")
      .then(res => setEnrollments(res.data))
      .catch(err => {
        console.error("Failed to load enrollments", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user?.name}
      </h1>

      <h2 className="text-lg font-semibold mb-4">
        Your Courses
      </h2>

      {enrollments.length === 0 ? (
        <p className="text-gray-600">
          You are not enrolled in any courses yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {enrollments.map(enroll => {
            const lessons = enroll.courseId?.lessons || [];

            const progress =
              typeof enroll.progress?.get === "function"
                ? Object.fromEntries(enroll.progress)
                : enroll.progress || {};

            let resumeLesson = null;

            if (enroll.lastLessonId) {
              resumeLesson = lessons.find(
                l => l._id === enroll.lastLessonId
              );
            }

            if (!resumeLesson) {
              resumeLesson = lessons.find(
                l => !progress[l._id]
              );
            }

            if (!resumeLesson && lessons.length > 0) {
              resumeLesson = lessons[0];
            }

            const completedLessons = Object.values(progress).filter(Boolean).length;
            const total = lessons.length;
            const percent = total > 0
              ? Math.round((completedLessons / total) * 100)
              : 0;

            const isCourseCompleted =
              lessons.length > 0 &&
              completedLessons === lessons.length;

            return (
              <div
                key={enroll._id}
                className="border rounded p-4 space-y-3"
              >
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <h3 className="font-bold">
                      <Link
                        to={
                          resumeLesson
                            ? `/learn/${enroll._id}/${resumeLesson._id}`
                            : "#"
                        }
                        className="underline"
                      >
                        {enroll.courseId?.title}
                      </Link>
                      {isCourseCompleted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Completed
                        </span>
                      )}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {completedLessons} / {total} lessons completed
                    </p>

                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                      <div
                        className="bg-black h-2 rounded"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {resumeLesson && (
                    <Link
                      to={`/learn/${enroll._id}/${resumeLesson._id}`}
                      className="underline"
                    >
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
