import { useEffect, useState } from "react";
import api from "@/services/api";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then(res => setCourses(res.data));
  }, []);

  return (
    <div className="p-6 grid gap-4">
      {courses.map(c => (
        <Link key={c._id} to={`/courses/${c.slug}`}>
          <div className="border p-4 rounded">
            <h2 className="font-bold">{c.title}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
