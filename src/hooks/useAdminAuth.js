import { useState, useEffect } from 'react';
import { apiFetch } from '../config/api';

export default function useAdminAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const isAuthenticated = Boolean(token);

  async function login(credentials) {
    const data = await apiFetch('/auth/login', { method: 'POST', data: credentials });
    if (data && data.token) {
      setToken(data.token);
      localStorage.setItem('admin_token', data.token);
      // notify other hook instances
      try { window.dispatchEvent(new CustomEvent('admin_token_changed', { detail: data.token })); } catch(e){}
    }
    return data;
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('admin_token');
    try { window.dispatchEvent(new CustomEvent('admin_token_changed', { detail: null })); } catch(e){}
  }

  useEffect(() => {
    function onTokenChange(e) {
      const val = e?.detail ?? null;
      setToken(val);
    }
    function onStorage(e) {
      if (e.key === 'admin_token') {
        setToken(e.newValue);
      }
    }
    window.addEventListener('admin_token_changed', onTokenChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('admin_token_changed', onTokenChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return { token, isAuthenticated, login, logout };
}
