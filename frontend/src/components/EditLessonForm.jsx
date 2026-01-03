import { useState } from "react";
import api from "@/services/api";

export default function EditLessonForm({
  courseId,
  lesson,
  onUpdated,
  onCancel
}) {
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

    const res = await api.put(
      `/courses/${courseId}/lessons/${lesson._id}`,
      form
    );

    onUpdated(res.data);
    setLoading(false);
  };

  return (
    <form className="border p-3 rounded space-y-2" onSubmit={handleSubmit}>
      <input
        name="title"
        className="w-full border p-2 rounded"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="contentHtml"
        className="w-full border p-2 rounded h-24"
        value={form.contentHtml}
        onChange={handleChange}
      />

      <input
        name="order"
        type="number"
        className="w-full border p-2 rounded"
        value={form.order}
        onChange={handleChange}
      />

      <div className="flex gap-2">
        <button className="bg-black text-white px-3 py-1 rounded">
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
