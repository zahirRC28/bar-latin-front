import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth';
import '../styles/admin.css';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(loginData);
      setMsg('Login exitoso');
      navigate('/admin');
    } catch (err) {
      setMsg(err?.message || 'Error en login');
    }
  }

  return (
    <div className="admin-panel">
      <h2>Login</h2>
      {msg && <div style={{ marginBottom: 12 }}>{msg}</div>}
      <form className="login-form" onSubmit={handleLogin}>
        <h3>Iniciar sesión</h3>
        <div>
          <label>Email</label>
          <input value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
          <button type="submit">Login</button>
          <button type="button" className="secondary" onClick={() => { setLoginData({ email:'', password:'' }); setMsg(null); }}>Limpiar</button>
          <button type="button" className="secondary" onClick={() => navigate('/')}>Volver</button>
        </div>
      </form>
    </div>
  );
}
