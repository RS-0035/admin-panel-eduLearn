// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@mail.com" && password === "123") {
      localStorage.setItem("admin", JSON.stringify({ email }));
      navigate("/"); // yoki sizda mavjud dashboard yo‘li
    } else {
      alert("Xato email yoki parol");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Panel - Kirish</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email kiriting"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Kirish</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
