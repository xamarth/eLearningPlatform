import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/auth/useAuth";
import CreateCourseForm from "@/components/CreateCourseForm";
import AddLessonForm from "@/components/AddLessonForm";
import EditLessonForm from "@/components/EditLessonForm";

export default function Admin() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/courses"),
      api.get("/admin/stats")
    ])
      .then(([coursesRes, statsRes]) => {
        setCourses(coursesRes.data);
        setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCourseCreated = (course) => {
    setCourses(prev => [course, ...prev]);
  };

  const handleLessonAdded = (updatedCourse) => {
    setCourses(prev =>
      prev.map(c =>
        c._id === updatedCourse._id ? updatedCourse : c
      )
    );
    setSelectedCourse(updatedCourse);
  };

  if (user?.role !== "admin") {
    return <p className="p-6">Access denied</p>;
  }

  if (loading) {
    return <p className="p-6">Loading admin panel...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Users</p>
            <p className="text-2xl font-bold">{stats.users}</p>
          </div>

          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Enrollments</p>
            <p className="text-2xl font-bold">{stats.enrollments}</p>
          </div>

          <div className="border rounded p-4">
            <p className="text-sm text-gray-500">Courses</p>
            <p className="text-2xl font-bold">{stats.courses}</p>
          </div>
        </div>
      )}

      {stats?.courseStats && (
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">
            Enrollments per Course
          </h2>

          <ul className="space-y-1 text-sm">
            {stats.courseStats.map(c => (
              <li
                key={c.title}
                className="flex justify-between border-b py-1"
              >
                <span>{c.title}</span>
                <span className="font-semibold">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CreateCourseForm onCreated={handleCourseCreated} />

      <div className="grid gap-4">
        {courses.map(course => (
          <div
            key={course._id}
            className="border p-4 rounded space-y-3"
          >
            <h2 className="font-semibold">{course.title}</h2>

            <button
              className="underline text-sm"
              onClick={() =>
                setSelectedCourse({
                  ...course,
                  lessons: course.lessons || []
                })
              }
            >
              Manage Lessons
            </button>

            {selectedCourse?._id === course._id && (
              <>
                <AddLessonForm
                  courseId={course._id}
                  onAdded={handleLessonAdded}
                />

                <div className="space-y-2">
                  {(selectedCourse.lessons || []).map(lesson => (
                    <div
                      key={lesson._id}
                      className="border p-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={lesson.order}
                          className="w-14 border rounded px-1 text-sm"
                          onChange={async (e) => {
                            const res = await api.put(
                              `/courses/${course._id}/lessons/${lesson._id}`,
                              { order: Number(e.target.value) }
                            );

                            setCourses(prev =>
                              prev.map(c =>
                                c._id === res.data._id ? res.data : c
                              )
                            );
                            setSelectedCourse(res.data);
                          }}
                        />
                        <span className="text-sm">{lesson.title}</span>
                      </div>

                      <div className="flex gap-3 text-sm">
                        <button
                          className="underline"
                          onClick={() => setEditingLesson(lesson)}
                        >
                          Edit
                        </button>

                        <button
                          className="underline text-red-600"
                          onClick={async () => {
                            const res = await api.delete(
                              `/courses/${course._id}/lessons/${lesson._id}`
                            );

                            setCourses(prev =>
                              prev.map(c =>
                                c._id === res.data._id ? res.data : c
                              )
                            );

                            setSelectedCourse(res.data);
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {editingLesson?._id === lesson._id && (
                        <EditLessonForm
                          courseId={course._id}
                          lesson={lesson}
                          onUpdated={(updatedCourse) => {
                            setCourses(prev =>
                              prev.map(c =>
                                c._id === updatedCourse._id
                                  ? updatedCourse
                                  : c
                              )
                            );
                            setSelectedCourse(updatedCourse);
                            setEditingLesson(null);
                          }}
                          onCancel={() => setEditingLesson(null)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
