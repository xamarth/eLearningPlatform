import { useState } from "react";
import api from "@/services/api";

export default function AddLessonForm({ courseId, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    contentHtml: "",
    order: 1
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(
        `/courses/${courseId}/lessons`,
        form
      );
      onAdded(res.data);
      setForm({
        title: "",
        contentHtml: "",
        order: 1
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded p-4 space-y-3"
    >
      <h3 className="font-semibold">Add Lesson</h3>

      <input
        name="title"
        placeholder="Lesson title"
        className="w-full border p-2 rounded"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="contentHtml"
        placeholder="Lesson content"
        className="w-full border p-2 rounded"
        value={form.contentHtml}
        onChange={handleChange}
        required
      />

      <input
        name="order"
        type="number"
        min="1"
        className="w-full border p-2 rounded"
        value={form.order}
        onChange={handleChange}
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Lesson"}
      </button>
    </form>
  );
}
