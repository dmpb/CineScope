"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
import type { TvSeasonDetail, TvSeasonSummary } from "@/types/movie";

type TvSeasonsPanelProps = {
  tvId: number;
  seasons: TvSeasonSummary[];
  initialSeason: TvSeasonDetail | null;
};

export function TvSeasonsPanel({ tvId, seasons, initialSeason }: TvSeasonsPanelProps) {
  const ui = useUiMessages();
  const orderedSeasons = useMemo(
    () => [...seasons].sort((a, b) => a.seasonNumber - b.seasonNumber),
    [seasons]
  );
  const defaultSeasonNumber =
    initialSeason?.seasonNumber ?? orderedSeasons[0]?.seasonNumber ?? 1;
  const [seasonNumber, setSeasonNumber] = useState(defaultSeasonNumber);
  const [seasonDetail, setSeasonDetail] = useState<TvSeasonDetail | null>(initialSeason);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seasonNumber === initialSeason?.seasonNumber && initialSeason) {
      setSeasonDetail(initialSeason);
      return;
    }

    let cancelled = false;
    async function loadSeason() {
      setLoading(true);
      try {
        const response = await fetch(`/api/tv/${tvId}/season/${seasonNumber}`);
        if (!response.ok) {
          throw new Error("season fetch failed");
        }
        const data = (await response.json()) as { season?: TvSeasonDetail | null };
        if (!cancelled) {
          setSeasonDetail(data.season ?? null);
        }
      } catch {
        if (!cancelled) {
          setSeasonDetail(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void loadSeason();
    return () => {
      cancelled = true;
    };
  }, [tvId, seasonNumber, initialSeason]);

  if (orderedSeasons.length === 0) {
    return null;
  }

  const episodes = seasonDetail?.episodes ?? [];

  return (
    <section id="detail-seasons" className="anchor-target space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">{ui.seasonsHeading}</h2>
        <label className="flex flex-col gap-1 text-xs text-zinc-400">
          <span className="sr-only">{ui.seasonsHeading}</span>
          <select
            value={seasonNumber}
            onChange={(e) => setSeasonNumber(Number(e.target.value))}
            className="focus-ring cursor-pointer rounded-md border border-zinc-700/80 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100"
          >
            {orderedSeasons.map((season) => (
              <option key={season.seasonNumber} value={season.seasonNumber}>
                {ui.seasonLabel(season.seasonNumber)}
                {season.episodeCount > 0 ? ` · ${season.episodeCount}` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton-shimmer h-16 w-full rounded-lg" />
          <div className="skeleton-shimmer h-16 w-full rounded-lg" />
        </div>
      ) : episodes.length === 0 ? (
        <p className="text-sm text-zinc-400">{ui.seasonEpisodesEmpty}</p>
      ) : (
        <ul className="space-y-3">
          {episodes.map((episode) => (
            <li
              key={episode.id}
              className="flex gap-3 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3"
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-zinc-800">
                {episode.stillPath ? (
                  <Image
                    src={episode.stillPath}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-medium text-zinc-100">
                  <span className="text-zinc-500">
                    S{episode.seasonNumber}E{episode.episodeNumber}
                  </span>{" "}
                  {episode.name || ui.seasonEpisodeUntitled}
                </p>
                {episode.airDate ? <p className="text-xs text-zinc-500">{episode.airDate}</p> : null}
                {episode.overview ? (
                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-400">{episode.overview}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
