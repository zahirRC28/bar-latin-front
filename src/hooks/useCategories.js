import { useState, useCallback } from 'react';
import { apiFetch } from '../config/api';

export default function useCategories(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/categories', { method: 'GET' });
      setItems(Array.isArray(res) ? res : []);
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }, []);

  async function createCategory(category) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/categories', { method: 'POST', data: category, token });
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  async function updateCategory(id, category) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/categories/${id}`, { method: 'PUT', data: category, token });
      setItems(prev => prev.map(c => (String(c.id || c._id) === String(id) ? { ...c, ...res } : c)));
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  async function deleteCategory(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/categories/${id}`, { method: 'DELETE', token });
      setItems(prev => prev.filter(i => String(i.id || i._id) !== String(id)));
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  return { items, fetchCategories, createCategory, updateCategory, deleteCategory, loading, error };
}
