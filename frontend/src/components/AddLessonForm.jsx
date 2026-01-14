import { useState } from "react";
import api from "@/services/api";
import { Plus, Loader2 } from "lucide-react";

export default function AddLessonForm({ courseId, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    contentHtml: "",
    order: 1
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/courses/${courseId}/lessons`, form);
      onAdded(res.data);
      setForm({ title: "", contentHtml: "", order: 1 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
        Add New Lesson
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input
            name="order"
            type="number"
            min="1"
            placeholder="#"
            className="w-16 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-center"
            value={form.order}
            onChange={handleChange}
          />
          <input
            name="title"
            placeholder="Lesson Title"
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="contentHtml"
          placeholder="Lesson content (HTML supported)"
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-32 font-mono text-sm"
          value={form.contentHtml}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end">
          <button
            disabled={loading}
            className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            {loading ? "Adding..." : "Add Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}