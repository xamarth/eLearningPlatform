import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import AuthModal from "@/components/AuthModal";
import { BookOpen, CheckCircle, Zap } from "lucide-react";

export default function Landing() {
  const { user, logout } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="text-lg font-bold tracking-tight">E-Learning</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-black transition-colors">
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="text-slate-600 hover:text-black transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={logout} className="text-red-600 hover:text-red-700 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthMode("login")} className="text-slate-600 hover:text-black transition-colors">
                  Log in
                </button>
                <button
                  onClick={() => setAuthMode("signup")}
                  className="bg-black text-white px-5 py-2 rounded-full hover:bg-slate-800 transition-all hover:shadow-lg"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-20 pb-1 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            New Courses Added
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Master new skills <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-700 to-slate-400">
              at your own pace.
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            High-quality curriculum designed for modern developers. Track your progress, earn certificates, and advance your career.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200"
            >
              Browse Courses
            </Link>
            {!user && (
              <button
                onClick={() => setAuthMode("signup")}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-5xl mx-auto mt-10 grid md:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: "Expert Content", desc: "Curriculum crafted by industry veterans." },
            { icon: CheckCircle, title: "Progress Tracking", desc: "Save your spot and visualize your growth." },
            { icon: Zap, title: "Interactive Learning", desc: "Quizzes and challenges to test your knowledge." }
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <f.icon className="w-10 h-10 mb-4 text-slate-700" />
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
    </div>
  );
}