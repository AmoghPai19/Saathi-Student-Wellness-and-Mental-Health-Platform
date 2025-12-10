const env = import.meta.env as any;
// In dev prefer relative paths so Vite dev server proxy handles /api requests.
// In production use the configured VITE_REACT_BASE_URL (or other fallbacks).
export const API_BASE = env.DEV
  ? ''
  : (env.VITE_REACT_BASE_URL as string) || (env.REACT_BASE_URL as string) || (env.VITE_API_BASE_URL as string) || '';

export function joinUrl(path: string) {
  if (!path) return API_BASE;
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE.replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  console.log(base ? `${base}/${p}` : `/${p}`);
  return base ? `${base}/${p}` : `/${p}`;
}

export async function apiFetch(input: RequestInfo | string, init?: RequestInit) {
  const url = typeof input === 'string' ? joinUrl(input) : input;
  return fetch(url as RequestInfo, init);
}

export default apiFetch;
