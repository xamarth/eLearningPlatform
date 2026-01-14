import { useState } from "react";
import api from "@/services/api";
import { Save, X, Loader2 } from "lucide-react";

export default function EditLessonForm({ courseId, lesson, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    title: lesson.title,
    contentHtml: lesson.contentHtml,
    order: lesson.order
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.put(`/courses/${courseId}/lessons/${lesson._id}`, form);
    onUpdated(res.data);
    setLoading(false);
  };

  return (
    <form className="mt-3 p-4 bg-white border-2 border-blue-100 rounded-xl shadow-sm space-y-3" onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <input
          name="order"
          type="number"
          className="w-16 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-center"
          value={form.order}
          onChange={handleChange}
        />
        <input
          name="title"
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-medium"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <textarea
        name="contentHtml"
        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-32 font-mono text-sm"
        value={form.contentHtml}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Cancel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
