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
      .then((res) => setEnrollments(res.data))
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
          {enrollments.map((enroll) => (
            <div
              key={enroll._id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">
                  {enroll.courseId.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Progress:{" "}
                  {Object.values(enroll.progress || {}).filter(Boolean).length} /{" "}
                  {enroll.courseId.lessons?.length || 0} lessons
                </p>
              </div>

              <Link
                to={`/courses/${enroll.courseId.slug}`}
                className="underline"
              >
                Continue
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
