const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

/**
 * Returns a public URL for use in <img src> or similar asset references.
 */
export const storefrontUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

export async function fetchStorefront<T>(path: string): Promise<T | null> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  const url = `${API_BASE}${apiPath}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
    console.error(`fetchStorefront: HTTP ${res.status} from ${url}`);
  } catch (error) {
    console.error(`fetchStorefront: Failed to fetch ${url}:`, error);
  }
  return null;
}