import { useState } from "react";
import api from "@/services/api";
import { PlusCircle, Loader2 } from "lucide-react";

export default function CreateCourseForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "beginner",
    price: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/courses", form);
      onCreated(res.data);
      setForm({
        title: "",
        description: "",
        category: "",
        difficulty: "beginner",
        price: 0
      });
    } catch {
      setError("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
        <div className="bg-black/5 p-2 rounded-full">
          <PlusCircle className="w-5 h-5 text-slate-800" />
        </div>
        <h2 className="font-bold text-lg text-slate-900">Create New Course</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input
            name="title"
            placeholder="Course Title"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400 font-medium"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="What is this course about?"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400 resize-none"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="category"
            placeholder="Category (e.g. React)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400"
            value={form.category}
            onChange={handleChange}
            required
          />

          <select
            name="difficulty"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white text-slate-600"
            value={form.difficulty}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              name="price"
              type="number"
              min="0"
              placeholder="Price (0 for free)"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-slate-400"
              value={form.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-2.5 rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Course"}
        </button>
      </form>
    </div>
  );
}