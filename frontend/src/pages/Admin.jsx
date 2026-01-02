import api from "@/services/api";
import { useEffect, useState } from "react";

export default function Admin() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then(res => setCourses(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {courses.map(c => (
        <div key={c._id} className="border p-4 mb-2 rounded">
          {c.title}
        </div>
      ))}
    </div>
  );
}
