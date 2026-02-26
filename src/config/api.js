export const API_BASE = import.meta.env.VITE_API_BASE;

async function parseResponse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function apiFetch(path, { method = 'GET', data = null, token = null, isForm = false, extraHeaders = {} } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = { ...extraHeaders };
  let body = null;

  if (data && !isForm) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  } else if (data && isForm) {
    body = data; // FormData
  }

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { method, headers, body });
  const parsed = await parseResponse(res);
  if (!res.ok) throw parsed;
  return parsed;
}

