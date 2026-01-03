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
            const completedLessons = Object.values(
              enroll.progress || {}
            ).filter(Boolean).length;

            const total = lessons.length;
            const percent =
              total > 0
                ? Math.round((completedLessons / total) * 100)
                : 0;

            const nextLesson =
              lessons.find(l => !enroll.progress?.[l._id]) ||
              lessons[0];

            return (
              <div
                key={enroll._id}
                className="border rounded p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">
                      {enroll.courseId?.title || "Course"}
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
                    <p className="text-xs text-gray-600 mt-1">
                      {percent}% completed
                    </p>
                  </div>

                  {nextLesson && (
                    <Link
                      to={`/learn/${enroll._id}/${nextLesson._id}`}
                      className="underline"
                    >
                      Continue
                    </Link>
                  )}
                </div>

                {lessons.length > 0 && (
                  <ul className="space-y-1">
                    {lessons.map(lesson => (
                      <li key={lesson._id}>
                        <Link
                          to={`/learn/${enroll._id}/${lesson._id}`}
                          className="text-sm underline"
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
