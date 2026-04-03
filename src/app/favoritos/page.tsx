import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/FavoritesPageClient";
import { getOptionalTmdbBearerToken } from "@/lib/env";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Películas y series que marcaste como favoritas en CineScope (almacenamiento local).",
  openGraph: {
    url: "/favoritos"
  },
  alternates: {
    canonical: "/favoritos"
  }
};

export default function FavoritosPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  return (
    <main className="home-cinematic-shell">
      <FavoritesPageClient hasToken={hasToken} />
    </main>
  );
}
