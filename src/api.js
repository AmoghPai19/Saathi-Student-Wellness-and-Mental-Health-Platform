import axios from 'axios';

const env = import.meta.env || {};
// Canonical variable: VITE_API_URL should be the backend origin (no trailing /api)
const configured = env.VITE_API_URL || env.VITE_BACKEND_URL || env.VITE_API_BASE_URL || env.REACT_BASE_URL || env.VITE_REACT_BASE_URL || '';

// Prefer configured remote API even in dev when provided; otherwise use Vite proxy in dev
const origin = configured || (env.DEV ? '' : '');

function withApiPrefix(originBase) {
  if (!originBase) return '/api';
  const cleaned = String(originBase).replace(/\/$/, '');
  return /\/api$/i.test(cleaned) ? cleaned : `${cleaned}/api`;
}

const apiClient = axios.create({
  baseURL: withApiPrefix(origin),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;