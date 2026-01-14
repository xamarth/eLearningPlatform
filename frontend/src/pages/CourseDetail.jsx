import { useAuth } from "@/auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Check, ShieldCheck, Globe } from "lucide-react";

export default function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourse(res.data);
        if (user) {
          const myEnrollments = await api.get("/enrollments/me");
          setEnrolled(myEnrollments.data.some(e => e.courseId._id === res.data._id));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    load();
  }, [slug, user]);

  const handleEnroll = async () => {
    if (!user) { alert("Please login first"); return; } // Simplified for brevity
    await api.post("/enrollments", { courseId: course._id });
    navigate("/dashboard");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course) return <p className="p-10">Course not found</p>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header / Hero */}
      <div className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm">{course.category}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{course.title}</h1>
            <p className="text-lg text-slate-300 max-w-xl">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-slate-400 pt-4">
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> English</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Certified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start gap-2 text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Comprehensive curriculum covering key aspects.</span>
                </div>
              ))}
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 no-underline">Description</h2>
            <p className="text-slate-600 leading-relaxed">{course.description} (Extended description would go here...)</p>
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="md:col-span-1">
          <div className="sticky top-8 border border-slate-200 rounded-2xl p-6 shadow-xl bg-white">
            <div className="mb-6">
              <span className="text-3xl font-bold">{course.price > 0 ? `$${course.price}` : "Free"}</span>
            </div>

            {user ? (
              enrolled ? (
                <button onClick={() => navigate("/dashboard")} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Go to Dashboard
                </button>
              ) : (
                <button onClick={handleEnroll} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                  Enroll Now
                </button>
              )
            ) : (
              <p className="text-sm text-center text-slate-500 bg-slate-50 py-3 rounded-lg border border-slate-100">
                Login to enroll
              </p>
            )}

            <p className="text-xs text-center text-slate-400 mt-4">30-Day Money-Back Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
