const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const API_BASE_URL = rawBaseUrl.endsWith('/')
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

export function apiUrl(path = '') {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export { API_BASE_URL };
