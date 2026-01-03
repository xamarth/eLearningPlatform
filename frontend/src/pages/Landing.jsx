import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import AuthModal from "@/components/AuthModal";

export default function Landing() {
  const { user, logout } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 border-b">
        <h1 className="text-xl font-bold">E-Learning</h1>

        <div className="space-x-3">
          {user ? (
            <>
              <Link to="/dashboard" className="underline">
                Dashboard
              </Link>
              <button onClick={logout} className="underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAuthMode("login")}
                className="underline"
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Sign Up
              </button>
            </>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="underline">
              Admin
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-bold mb-4">
          Learn Skills That Matter
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl">
          High-quality courses. Track your progress. Learn at your own pace.
        </p>

        <div className="space-x-4">
          <Link
            to="/courses"
            className="border px-6 py-3 rounded"
          >
            Browse Courses
          </Link>

          {!user && (
            <button
              onClick={() => setAuthMode("signup")}
              className="bg-black text-white px-6 py-3 rounded"
            >
              Get Started
            </button>
          )}
        </div>
      </main>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
        />
      )}
    </div>
  );
}
