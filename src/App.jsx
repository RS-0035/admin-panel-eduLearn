import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CourseForm from "./Pages/CourseForm/CourseForm";
import Courses from "./Pages/Courses/Courses";
import Teachers from "./Pages/Teachers/Teachers";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="courses" element={<Courses />} />
        <Route path="add-course" element={<CourseForm />} />
        <Route path="teachers" element={<Teachers />} />
        <Route
          index
          element={<p style={{ padding: 20 }}>Xush kelibsiz! Bo‘limni tanlang.</p>}
        />
      </Route>

      <Route path="*" element={<p style={{ padding: 20 }}>404 sahifa topilmadi</p>} />
    </Routes>
  );
}

export default App;
