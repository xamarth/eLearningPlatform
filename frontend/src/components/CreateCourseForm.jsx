import { useState } from "react";
import api from "@/services/api";

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
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
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
      setError("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded p-4 space-y-3"
    >
      <h2 className="text-lg font-semibold">
        Create New Course
      </h2>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <input
        name="title"
        placeholder="Course title"
        className="w-full border p-2 rounded"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Course description"
        className="w-full border p-2 rounded"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        name="category"
        placeholder="Category (e.g. Frontend)"
        className="w-full border p-2 rounded"
        value={form.category}
        onChange={handleChange}
        required
      />

      <select
        name="difficulty"
        className="w-full border p-2 rounded"
        value={form.difficulty}
        onChange={handleChange}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <input
        name="price"
        type="number"
        min="0"
        placeholder="Price"
        className="w-full border p-2 rounded"
        value={form.price}
        onChange={handleChange}
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}
