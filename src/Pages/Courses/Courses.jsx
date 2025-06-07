// src/pages/CoursesPage.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Kurslar ro‘yxati</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.title} - {course.instructor}</li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
