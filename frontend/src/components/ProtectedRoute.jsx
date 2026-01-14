import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  return children;
}
