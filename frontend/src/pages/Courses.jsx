import { useEffect, useState } from "react";
import api from "@/services/api";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses").then(res => setCourses(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500">Loading catalog...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
            <p className="text-slate-500 mt-1">Upgrade your skills with our premium selection.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <Link key={c._id} to={`/courses/${c.slug}`} className="group block h-full">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col">
                {/* Decorative placeholder since we lack real images */}
                <div className={`h-40 w-full bg-linear-to-br ${getGradient(c.category)}`}></div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{c.category || "General"}</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wide flex items-center gap-1">
                      <BarChart className="w-3 h-3" /> {c.difficulty}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{c.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{c.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="font-bold text-slate-900">
                      {c.price > 0 ? `$${c.price}` : "Free"}
                    </span>
                    <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper to generate consistent colors based on string length
function getGradient(str = "") {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-orange-400 to-red-500",
    "from-green-400 to-emerald-600",
    "from-slate-700 to-black"
  ];
  return gradients[str.length % gradients.length];
}
