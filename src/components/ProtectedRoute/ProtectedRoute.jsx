// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  return admin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
