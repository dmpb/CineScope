export const SITE_NAME = "CineScope";

/** Descripción por defecto para meta tags y Open Graph (páginas sin descripción propia). */
export const SITE_DEFAULT_DESCRIPTION =
  "Explora películas y series con datos en tiempo real de The Movie Database (TMDb): tendencias, búsqueda, favoritos y fichas detalladas.";

/**
 * URL canónica del sitio (producción o preview). Usada en `metadataBase`, sitemap y robots.
 * Definir `NEXT_PUBLIC_SITE_URL` en `.env.local` (p. ej. https://tudominio.com).
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && /^https?:\/\//i.test(raw)) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

/**
 * URL pública del repositorio. Opcional: definir `NEXT_PUBLIC_GITHUB_URL` en `.env.local`.
 */
export function getPublicGithubUrl(): string {
  const raw = process.env.NEXT_PUBLIC_GITHUB_URL?.trim();
  return raw && /^https?:\/\//i.test(raw) ? raw : "https://github.com";
}
