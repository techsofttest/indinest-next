const API_URLS = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'http://indinest.test',
  'http://localhost',
  'http://127.0.0.1',
].filter(Boolean) as string[];

export const apiBaseUrl = API_URLS[0] ?? '';

export function apiUrl(path: string): string {
  const base = apiBaseUrl.replace(/\/$/, ''); // Remove trailing slash if any
  const cleanPath = path.startsWith('/api') ? path.substring(4) : path;
  return `${base}${cleanPath}`;
}