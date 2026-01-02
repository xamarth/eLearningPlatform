import { useState } from "react";
import { useAuth } from "@/auth/useAuth";

export default function AuthModal({ mode, onClose }) {
  const { login, signup } = useAuth();
  const [currentMode, setCurrentMode] = useState(mode);
  const isLogin = currentMode === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signup(form);
      }
      onClose();
    } catch {
      setError("Authentication failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded p-6 space-y-4">
        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setCurrentMode("signup")}
                className="underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setCurrentMode("login")}
                className="underline"
              >
                Login
              </button>
            </>
          )}
        </p>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
