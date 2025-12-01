import axios from 'axios';

const env = import.meta.env || {};
// During dev prefer relative '/api' so the Vite proxy handles requests.
const base = (env.DEV) ? '' : ((env.VITE_REACT_BASE_URL) || (env.REACT_BASE_URL) || (env.VITE_API_BASE_URL) || '');
const apiClient = axios.create({
  baseURL: base ? base.replace(/\/$/, '') + '/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;