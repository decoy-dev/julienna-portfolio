const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path with the deploy base. External URLs, mailto:, tel: and bare hashes pass through. */
export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
