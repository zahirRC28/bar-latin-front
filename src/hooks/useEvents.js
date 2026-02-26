import { useState, useCallback } from 'react';
import { apiFetch } from '../config/api';

export default function useEvents(token) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  async function createEvent(event) {
    setLoading(true);
    setError(null);
    try {
      if (!event.imageFile) throw { message: 'Event image is required' };

      const form = new FormData();
      form.append('title', event.title);
      form.append('description', event.description || '');
      form.append('date', event.date || '');
      form.append('media', event.imageFile);

      const res = await apiFetch('/events', { method: 'POST', data: form, token, isForm: true });
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/events', { method: 'GET' });
      setItems(Array.isArray(res) ? res : []);
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }, []);

  async function deleteEvent(id) {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/events/${id}`, { method: 'DELETE', token });
      setItems(prev => prev.filter(i => String(i.id || i._id) !== String(id)));
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  async function updateEvent(id, event) {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (event.imageFile) {
        const form = new FormData();
        if (event.title) form.append('title', event.title);
        if (event.description) form.append('description', event.description);
        if (event.date) form.append('date', event.date);
        form.append('media', event.imageFile);
        res = await apiFetch(`/events/${id}`, { method: 'PUT', data: form, token, isForm: true });
      } else {
        const payload = { title: event.title, description: event.description, date: event.date };
        res = await apiFetch(`/events/${id}`, { method: 'PUT', data: payload, token });
      }
      setItems(prev => prev.map(i => (String(i.id || i._id) === String(id) ? { ...i, ...res } : i)));
      setLoading(false);
      return res;
    } catch (e) {
      setError(e);
      setLoading(false);
      throw e;
    }
  }

  return { items, createEvent, fetchEvents, deleteEvent, updateEvent, loading, error };
}
