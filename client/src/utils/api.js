const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('qa_token');
export const setAuthToken = (token) => localStorage.setItem('qa_token', token);
export const removeAuthToken = () => localStorage.removeItem('qa_token');

export const getCurrentUser = () => {
  const user = localStorage.getItem('qa_user');
  return user ? JSON.parse(user) : null;
};
export const setCurrentUser = (user) => localStorage.setItem('qa_user', JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem('qa_user');

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    removeAuthToken();
    removeCurrentUser();
    window.location.reload();
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Server error');
  }
  return res.json();
};
