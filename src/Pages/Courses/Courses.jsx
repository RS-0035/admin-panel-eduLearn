// src/pages/Courses.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./Courses.css";

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

  const handleView = (id) => {
    alert("Ko‘rish: " + id);
  };

  const handleEdit = (id) => {
    alert("Tahrirlash: " + id);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Rostdan ham o‘chirmoqchimisiz?");
    if (confirm) {
      alert("O‘chirish: " + id);
      // Firestore o‘chirish funksiyasini shu yerga yozasiz
    }
  };

  return (
    <div className="courses-container">
      <h2 className="courses-title">📚 Kurslar ro‘yxati</h2>
      <div className="course-list">
        {courses.map(course => (
          <div className="course-card" key={course.id}>
            <h3>{course.title}</h3>
            <p>👨‍🏫 O‘qituvchi: {course.instructor}</p>
            <p>⏳ Davomiyligi: {course.duration}</p>
            <p>📈 Daraja: {course.level}</p>
            <div className="course-actions">
              <button className="view" onClick={() => handleView(course.id)}>View</button>
              <button className="edit" onClick={() => handleEdit(course.id)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(course.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
