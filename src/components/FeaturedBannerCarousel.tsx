"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
import { TrailerModal } from "@/components/TrailerModal";
import type { FeaturedSlide } from "@/lib/home";

type FeaturedBannerCarouselProps = {
  slides: FeaturedSlide[];
  autoPlayMs?: number;
};

export function FeaturedBannerCarousel({ slides, autoPlayMs = 8000 }: FeaturedBannerCarouselProps) {
  const ui = useUiMessages();
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = slides.length;
  const safeIndex = count > 0 ? Math.min(activeIndex, count - 1) : 0;

  useEffect(() => {
    setActiveIndex((prev) => (count > 0 ? Math.min(prev, count - 1) : 0));
  }, [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (count <= 0) return;
      const next = ((index % count) + count) % count;
      setActiveIndex(next);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || reduceMotion) {
      return;
    }
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [count, autoPlayMs, reduceMotion, safeIndex]);

  if (count === 0) {
    return null;
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={ui.carouselAria}
      className="relative h-[620px] overflow-hidden"
    >
      <div className="relative h-[620px] w-full">
        {slides.map((slide, index) => {
          const movie = slide.movie;
          const movieTitle = movie.title || ui.untitled;
          const isTv = movie.mediaType === "tv";
          const movieOverview =
            movie.overview || (isTv ? ui.carouselOverviewFallbackTv : ui.carouselOverviewFallbackMovie);
          const imageSrc = movie.backdropPath || movie.posterPath;
          const runtimeText = movie.runtime > 0 ? `${movie.runtime} min` : ui.carouselRuntimeNA;
          const genresText =
            movie.genres.length > 0 ? movie.genres.slice(0, 3).join(" · ") : ui.carouselGenreNA;
          const isActive = index === safeIndex;
          const titleId = `featured-banner-title-${index}`;

          return (
            <div
              key={`${movie.mediaType ?? "movie"}-${movie.id}-${index}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 premium-transition ${
                isActive ? "z-[1] opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              style={{ transitionProperty: "opacity", transitionDuration: reduceMotion ? "0ms" : "700ms" }}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <div className="h-full w-full bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/30 to-transparent" />

              <div className="home-content-container relative z-10 flex h-full items-end pb-12">
                <div className="max-w-3xl space-y-4 sm:space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
                    {isTv ? ui.carouselFeaturedTv : ui.carouselFeaturedMovie}
                  </p>
                  <h2
                    id={titleId}
                    className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl"
                  >
                    {movieTitle}
                  </h2>
                  <p className="text-sm text-zinc-200 sm:text-base">
                    ⭐ {movie.rating.toFixed(1)} · {runtimeText} · {genresText}
                  </p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-200 sm:max-w-2xl sm:text-base">
                    {movieOverview}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <TrailerModal trailerUrl={slide.trailerUrl} movieTitle={movieTitle} />
                    <Link
                      href={isTv ? `/tv/${movie.id}` : `/movie/${movie.id}`}
                      className="focus-ring premium-transition accent-button inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg shadow-red-950/40"
                    >
                      {ui.carouselSeeDetail}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {count > 1 && (
          <div
            className="absolute bottom-8 right-6 z-20 flex items-center gap-2 sm:right-10 lg:right-14"
            role="tablist"
            aria-label={ui.carouselPickFeatured}
          >
            {slides.map((slide, index) => {
              const isActive = index === safeIndex;
              return (
                <button
                  key={`dot-${slide.movie.mediaType ?? "movie"}-${slide.movie.id}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={ui.carouselGoToSlide(index + 1, count)}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(index)}
                  className={`focus-ring h-2.5 w-2.5 rounded-full premium-transition ${
                    isActive ? "scale-110 bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]" : "bg-white/35 hover:bg-white/60"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
