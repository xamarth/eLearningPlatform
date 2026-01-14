import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ChevronLeft, ChevronRight, CheckCircle, Menu, X, Play } from "lucide-react";

export default function Lesson() {
  const { enrollmentId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // ... (Keep existing useEffect logic for data fetching exactly as is) ...
  useEffect(() => {
    if (!enrollmentId || !lessonId) return;
    const loadLesson = async () => {
      try {
        const res = await api.get("/enrollments/me");
        const enroll = res.data.find(e => e._id === enrollmentId);
        if (!enroll) { navigate("/dashboard"); return; }
        const lessons = [...(enroll.courseId.lessons || [])].sort((a, b) => a.order - b.order);
        const foundLesson = lessons.find(l => l._id === lessonId);
        if (!foundLesson) { navigate("/dashboard"); return; }
        const progress = typeof enroll.progress?.get === "function" ? Object.fromEntries(enroll.progress) : enroll.progress || {};
        await api.put(`/enrollments/${enrollmentId}/last-lesson`, { lessonId });
        setAllLessons(lessons);
        setLesson(foundLesson);
        setProgressMap(progress);
        setIsCompleted(Boolean(progress[lessonId]));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    loadLesson();
  }, [enrollmentId, lessonId, navigate]);

  useEffect(() => {
    if (!lessonId) return;
    setIsCompleted(Boolean(progressMap[lessonId]));
  }, [lessonId, progressMap]);

  // Logic Helpers
  const currentIndex = allLessons.findIndex(l => l._id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markCompleted = async () => {
    if (isCompleted) return;
    await api.put(`/enrollments/${enrollmentId}/progress`, { lessonId, completed: true });
    setProgressMap(prev => ({ ...prev, [lessonId]: true }));
    setIsCompleted(true);
    if (nextLesson) navigate(`/learn/${enrollmentId}/${nextLesson._id}`);
    else navigate("/dashboard");
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" /></div>;
  if (!lesson) return <p className="p-6">Lesson not found</p>;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b flex items-center justify-between px-4 shrink-0 bg-white z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-slate-500 hover:text-black flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <h1 className="font-semibold text-slate-900 truncate max-w-md">{lesson.title}</h1>
        </div>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-slate-100 rounded-md lg:hidden"
        >
          {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${showSidebar ? "w-80 translate-x-0" : "w-0 -translate-x-full opacity-0"} 
            transition-all duration-300 border-r bg-slate-50 flex flex-col shrink-0 absolute lg:relative z-10 h-full
          `}
        >
          <div className="p-4 border-b bg-slate-50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Content</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {allLessons.map((l, idx) => {
              const completed = Boolean(progressMap[l._id]);
              const isActive = l._id === lessonId;
              return (
                <button
                  key={l._id}
                  onClick={() => navigate(`/learn/${enrollmentId}/${l._id}`)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 text-sm rounded-lg text-left transition-colors
                    ${isActive ? "bg-white shadow-sm border border-slate-200 text-blue-600 font-medium" : "text-slate-600 hover:bg-slate-100"}
                  `}
                >
                  <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${completed ? 'bg-green-500 border-green-500 text-white' : isActive ? 'border-blue-500 text-blue-500' : 'border-slate-300 text-slate-400'}`}>
                    {completed ? <CheckCircle className="w-3 h-3" /> : (isActive ? <Play className="w-2 h-2 fill-current" /> : idx + 1)}
                  </div>
                  <span className="truncate">{l.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white relative scroll-smooth">
          <div className="max-w-3xl mx-auto px-8 py-12">

            {/* Typography Plugin Class: prose */}
            <div className="prose prose-slate prose-lg max-w-none mb-16">
              <h1>{lesson.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: lesson.contentHtml }} />
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between border-t pt-8 mt-8">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && navigate(`/learn/${enrollmentId}/${prevLesson._id}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!prevLesson ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:text-black'}`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={markCompleted}
                disabled={isCompleted}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all
                  ${isCompleted
                    ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                    : "bg-black text-white hover:bg-slate-800 hover:shadow-md"
                  }
                `}
              >
                {isCompleted ? <>Completed <CheckCircle className="w-4 h-4" /></> : "Mark as Completed"}
              </button>

              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && navigate(`/learn/${enrollmentId}/${nextLesson._id}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!nextLesson ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100 hover:text-black'}`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
