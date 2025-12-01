const env = import.meta.env as any;
// Prefer a single canonical variable: VITE_API_URL should be the backend origin (no trailing /api)
// e.g. VITE_API_URL=https://saathi-backend.example.com
// During dev, leave empty to use the Vite proxy for relative /api requests.
const configured =
  (env.VITE_API_URL as string) ||
  (env.VITE_BACKEND_URL as string) ||
  (env.VITE_API_BASE_URL as string) ||
  (env.REACT_BASE_URL as string) ||
  (env.VITE_REACT_BASE_URL as string) ||
  '';

// Prefer configured remote API even in dev when provided; otherwise use Vite proxy in dev
export const API_BASE = configured || (env.DEV ? '' : '');

export function joinUrl(path: string) {
  if (!path) return API_BASE;
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE.replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  return base ? `${base}/${p}` : `/${p}`;
}

export async function apiFetch(input: RequestInfo | string, init?: RequestInit) {
  const url = typeof input === 'string' ? joinUrl(input) : input;
  return fetch(url as RequestInfo, init);
}

export default apiFetch;
