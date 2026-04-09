import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/FavoritesPageClient";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const code = await resolveTmdbLanguageForRequest();
  const ui = getUiMessages(code);
  return {
    title: ui.metaFavoritesTitle,
    description: ui.metaFavoritesDescription,
    openGraph: {
      url: "/favoritos"
    },
    alternates: {
      canonical: "/favoritos"
    }
  };
}

export default function FavoritosPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  return (
    <main className="home-cinematic-shell">
      <FavoritesPageClient hasToken={hasToken} />
    </main>
  );
}
