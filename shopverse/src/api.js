const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = {
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const body =
    options.body === undefined || typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body,
    });
  } catch {
    throw new Error('Cannot connect to the ShopVerse API. Check that the backend is running.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}
