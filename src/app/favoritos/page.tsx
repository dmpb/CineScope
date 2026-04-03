import type { Metadata } from "next";
import { FavoritesPageClient } from "@/components/FavoritesPageClient";
import { getOptionalTmdbBearerToken } from "@/lib/env";

const site = "CineScope";

export const metadata: Metadata = {
  title: `Mis favoritos | ${site}`,
  description: "Peliculas y series que marcaste como favoritas en CineScope."
};

export default function FavoritosPage() {
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  return (
    <main className="home-cinematic-shell">
      <FavoritesPageClient hasToken={hasToken} />
    </main>
  );
}
