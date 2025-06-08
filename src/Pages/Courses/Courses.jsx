import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import "./Courses.css";
import CourseCardModal from "../../components/CourseCardModal/CourseCardModal";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(data);
      } catch (error) {
        alert("Ma'lumotlar yuklanishda xatolik yuz berdi: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (id) => {
    const course = courses.find((c) => c.id === id);
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Rostdan ham o‘chirmoqchimisiz?");

    if (confirmDelete) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, "courses", id));
        // setShow(true);
        alert("Kurs muvaffaqiyatli o'chirildi!");
        setTimeout(() => setShow(false), 3000);
        setCourses((prev) => prev.filter((course) => course.id !== id));
      } catch (error) {
        alert("Xatolik yuz berdi: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddBtn = () => {
    setIsLoading(true); // Loaderni ko‘rsat
    setSelectedCourse(null); // Yangi kurs uchun formani tozalash
    setShowModal(true); // Modalni och

    // Loaderni 300ms ichida o‘chirish — modal ochilgandek bo‘lib ko‘rinadi
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleModalClose = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  return (
    <div className="courses-container">
      {show ? (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Here is a gentle confirmation that your action was successful.
        </Alert>
      ) : (
        ""
      )}
      <div className="course-header-section">
        <h2 className="courses-title">📚 Kurslar ro‘yxati</h2>

        <button className="add-course-btn" onClick={handleAddBtn}>
          ➕ Kurs qo‘shish
        </button>
      </div>
      <CourseCardModal
        showModal={showModal}
        onClose={handleModalClose}
        existingData={selectedCourse}
      />
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <div className="course-list">
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <h3>{course.title}</h3>
              <p>👨‍🏫 O‘qituvchi: {course.instructor}</p>
              <p>⏳ Davomiyligi: {course.duration}</p>
              <p>📈 Daraja: {course.level}</p>
              <div className="course-actions">
                <button className="edit" onClick={() => handleEdit(course.id)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
