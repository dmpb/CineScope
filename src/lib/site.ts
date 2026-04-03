export const SITE_NAME = "CineScope";

/**
 * URL pública del repositorio. Opcional: definir `NEXT_PUBLIC_GITHUB_URL` en `.env.local`.
 */
export function getPublicGithubUrl(): string {
  const raw = process.env.NEXT_PUBLIC_GITHUB_URL?.trim();
  return raw && /^https?:\/\//i.test(raw) ? raw : "https://github.com";
}
