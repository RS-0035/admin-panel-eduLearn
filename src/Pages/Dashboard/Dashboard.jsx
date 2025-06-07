import { useNavigate, Outlet } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">🎓 Admin Panel</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/courses")}>📚 Kurslar</li>
          <li onClick={() => navigate("/add-course")}>➕ Kurs qo‘shish</li>
          <li onClick={() => navigate("/teachers")}>👩‍🏫 O‘qituvchilar</li>
          <li onClick={logout}>🚪 Chiqish</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </header>
        <section className="dashboard-main">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
