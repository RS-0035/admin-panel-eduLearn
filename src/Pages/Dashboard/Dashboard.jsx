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
          <li
            className={location.pathname === "/courses" ? "active" : ""}
            onClick={() => navigate("/courses")}
          >
            📚 Kurslar
          </li>
          <li
            className={location.pathname === "/teachers" ? "active" : ""}
            onClick={() => navigate("/teachers")}
          >
            👩‍🏫 O‘qituvchilar
          </li>
          <li onClick={logout}>🚪 Chiqish</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <section className="dashboard-main">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
