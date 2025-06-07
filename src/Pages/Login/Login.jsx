// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@mail.com" && password === "123") {
      localStorage.setItem("admin", JSON.stringify({ email }));
      navigate("/");
    } else {
      alert("Xato email yoki parol");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Panel - Kirish</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <button type="submit">Kirish</button>
      </form>
    </div>
  );
};

export default Login;
