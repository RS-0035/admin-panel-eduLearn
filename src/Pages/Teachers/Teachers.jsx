// src/pages/TeachersPage.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const snapshot = await getDocs(collection(db, "teachers"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeachers(data);
    };

    fetchTeachers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>👩‍🏫 O‘qituvchilar ro‘yxati</h2>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            {teacher.name} - {teacher.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teachers;
