const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'auspify-lms-token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api(path, { token = getToken(), body, ...options } = {}) {
  const headers = {
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: body === undefined || typeof body === 'string' ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot connect to the LMS API. Check that the backend is running.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}
