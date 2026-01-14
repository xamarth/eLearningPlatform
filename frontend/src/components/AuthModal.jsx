import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { X } from "lucide-react";

export default function AuthModal({ mode, onClose }) {
  const { login, signup } = useAuth();
  const [currentMode, setCurrentMode] = useState(mode);
  const isLogin = currentMode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form);
      onClose();
    } catch { setError("Authentication failed. Please check credentials."); }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-sm text-slate-500 mt-2">Enter your details below to continue.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                name="name"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <input
            name="email"
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-transform active:scale-95 shadow-lg shadow-slate-200">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setCurrentMode(isLogin ? "signup" : "login")} className="font-semibold text-black hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
