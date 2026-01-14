import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/auth/useAuth";
import CreateCourseForm from "@/components/CreateCourseForm";
import AddLessonForm from "@/components/AddLessonForm";
import EditLessonForm from "@/components/EditLessonForm";
import { Users, BookOpen, Layers, Trash2, Edit2, GripVertical, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";

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
    setCourses(prev => prev.map(c => c._id === updatedCourse._id ? updatedCourse : c));
    setSelectedCourse(updatedCourse);
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Access denied.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-black rounded-full animate-spin" />
          Loading Admin Panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage content, users, and platform settings.</p>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={stats.users} color="bg-blue-50 text-blue-600" />
            <StatCard icon={BookOpen} label="Total Enrollments" value={stats.enrollments} color="bg-green-50 text-green-600" />
            <StatCard icon={Layers} label="Active Courses" value={stats.courses} color="bg-purple-50 text-purple-600" />

            {/* Enrollment breakdown in a small list within a card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Courses</h3>
              <ul className="space-y-2">
                {(stats.courseStats || []).slice(0, 3).map(c => (
                  <li key={c.title} className="flex justify-between text-sm">
                    <span className="truncate max-w-37.5 text-slate-600">{c.title}</span>
                    <span className="font-bold bg-slate-100 px-2 py-0.5 rounded-full text-xs">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Course List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-slate-400" />
              <h2 className="font-bold text-lg">Course Management</h2>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No courses created yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map(course => {
                  const isExpanded = selectedCourse?._id === course._id;
                  const lessons = course.lessons || [];

                  return (
                    <div
                      key={course._id}
                      className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${isExpanded ? 'border-slate-300 shadow-md ring-1 ring-slate-200' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="p-5 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg text-slate-900">{course.title}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${course.price > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                              {course.price > 0 ? `$${course.price}` : 'Free'}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm line-clamp-1">{course.description}</p>
                        </div>

                        <button
                          onClick={() => setSelectedCourse(isExpanded ? null : { ...course, lessons })}
                          className="shrink-0 p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>

                      {/* Expanded Content: Lessons */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-5">

                          <AddLessonForm courseId={course._id} onAdded={handleLessonAdded} />

                          <div className="space-y-3">
                            {lessons.length === 0 && <p className="text-sm text-slate-400 text-center italic py-4">No lessons yet.</p>}

                            {lessons.map(lesson => (
                              <div key={lesson._id}>
                                {editingLesson?._id === lesson._id ? (
                                  <EditLessonForm
                                    courseId={course._id}
                                    lesson={lesson}
                                    onUpdated={(updatedCourse) => {
                                      setCourses(prev => prev.map(c => c._id === updatedCourse._id ? updatedCourse : c));
                                      setSelectedCourse(updatedCourse);
                                      setEditingLesson(null);
                                    }}
                                    onCancel={() => setEditingLesson(null)}
                                  />
                                ) : (
                                  <div className="group flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl hover:shadow-sm transition-all">
                                    <div className="text-slate-300 cursor-grab active:cursor-grabbing">
                                      <GripVertical className="w-4 h-4" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono text-slate-400">Order:</span>
                                      <input
                                        type="number"
                                        value={lesson.order}
                                        className="w-12 text-center text-sm border border-slate-200 rounded px-1 py-0.5 focus:border-black outline-none"
                                        onChange={async (e) => {
                                          const res = await api.put(`/courses/${course._id}/lessons/${lesson._id}`, { order: Number(e.target.value) });
                                          setCourses(prev => prev.map(c => c._id === res.data._id ? res.data : c));
                                          setSelectedCourse(res.data);
                                        }}
                                      />
                                    </div>

                                    <span className="flex-1 font-medium text-slate-700 text-sm truncate">{lesson.title}</span>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => setEditingLesson(lesson)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (!confirm("Delete this lesson?")) return;
                                          const res = await api.delete(`/courses/${course._id}/lessons/${lesson._id}`);
                                          setCourses(prev => prev.map(c => c._id === res.data._id ? res.data : c));
                                          setSelectedCourse(res.data);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Create Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CreateCourseForm onCreated={handleCourseCreated} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon key={Icon} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
