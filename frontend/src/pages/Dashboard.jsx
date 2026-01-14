import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/useAuth";
import api from "@/services/api";
import { PlayCircle, Award, Clock } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/enrollments/me")
      .then(res => setEnrollments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name} 👋</h1>
          <p className="text-slate-500 mt-2">Here is an overview of your learning progress.</p>
        </header>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No courses yet</h3>
            <p className="text-slate-500 mb-6">Start your journey by enrolling in a course.</p>
            <Link to="/courses" className="inline-flex px-6 py-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors">
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(enroll => {
              const lessons = enroll.courseId?.lessons || [];
              const progress = typeof enroll.progress?.get === "function" ? Object.fromEntries(enroll.progress) : enroll.progress || {};

              // Logic to find resume lesson
              let resumeLesson = enroll.lastLessonId ? lessons.find(l => l._id === enroll.lastLessonId) : null;
              if (!resumeLesson) resumeLesson = lessons.find(l => !progress[l._id]);
              if (!resumeLesson && lessons.length > 0) resumeLesson = lessons[0];

              const completedCount = Object.values(progress).filter(Boolean).length;
              const total = lessons.length;
              const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
              const isCompleted = total > 0 && completedCount === total;

              return (
                <div key={enroll._id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                        {isCompleted ? "Completed" : "In Progress"}
                      </span>
                      {percent > 0 && <span className="text-xs font-mono text-slate-400">{percent}%</span>}
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2 mb-2">
                      {enroll.courseId?.title}
                    </h3>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                      <div className="bg-black h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {completedCount} / {total} lessons
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {resumeLesson ? (
                      <Link
                        to={`/learn/${enroll._id}/${resumeLesson._id}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium group-hover:bg-blue-600 transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        {percent === 0 ? "Start Learning" : "Continue"}
                      </Link>
                    ) : (
                      <button disabled className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
                        Course Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
