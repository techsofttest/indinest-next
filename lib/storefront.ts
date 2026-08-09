const API_URLS = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'http://indinest.test',
  'http://localhost',
  'http://127.0.0.1',
].filter(Boolean) as string[];

export const storefrontUrl = (path: string) => `${API_URLS[0]}${path}`;

export async function fetchStorefront<T>(path: string): Promise<T | null> {
  const attemptedErrors: unknown[] = [];

  for (const baseUrl of API_URLS) {
    try {
      const base = baseUrl.replace(/\/$/, ''); // Remove trailing slash
      const cleanPath = path.startsWith('/api') ? path.substring(4) : path;
      const url = `${base}${cleanPath}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }

      attemptedErrors.push(new Error(`HTTP ${res.status} from ${url}`));
    } catch (error) {
      attemptedErrors.push(error);
    }
  }

  console.error(`Failed to fetch ${path} from all storefront URLs:`, attemptedErrors);
  return null;
}