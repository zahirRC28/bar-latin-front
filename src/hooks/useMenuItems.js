import { useState, useCallback } from 'react';
import { apiFetch } from '../config/api';

export default function useMenuItems(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  async function createMenuItem(item) {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('name', item.name);
      form.append('description', item.description || '');
      form.append('price', item.price ?? '');
      if (item.imageFile) form.append('image', item.imageFile);
      if (item.categoryId) form.append('categoryId', item.categoryId);

      const res = await apiFetch('/items', { method: 'POST', data: form, token, isForm: true });
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/items', { method: 'GET' });
      setItems(Array.isArray(res) ? res : []);
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }, []);

  async function deleteMenuItem(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/items/${id}`, { method: 'DELETE', token });
      setItems(prev => prev.filter(i => String(i.id || i._id) !== String(id)));
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  async function updateMenuItem(id, item) {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (item.imageFile) {
        const form = new FormData();
        if (item.name) form.append('name', item.name);
        if (item.description) form.append('description', item.description);
        if (item.price) form.append('price', item.price);
        if (item.categoryId) form.append('categoryId', item.categoryId);
        form.append('image', item.imageFile);
        res = await apiFetch(`/items/${id}`, { method: 'PUT', data: form, token, isForm: true });
      } else {
        const payload = { name: item.name, description: item.description, price: item.price };
        res = await apiFetch(`/items/${id}`, { method: 'PUT', data: payload, token });
      }
      // optimistic update
      setItems(prev => prev.map(i => (String(i.id || i._id) === String(id) ? { ...i, ...res } : i)));
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  return { items, createMenuItem, fetchMenuItems, deleteMenuItem, updateMenuItem, loading, error };
}
