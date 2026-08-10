const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export const apiBaseUrl = API_BASE.replace(/\/$/, '');

export function apiUrl(path: string): string {
  const base = apiBaseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure path starts with /api
  const apiPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  return `${base}${apiPath}`;
}