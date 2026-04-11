import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import SeriesPage from "@/app/series/page";
import type { SeriesPageData } from "@/lib/home";

vi.mock("@/lib/tmdb-language-server", () => ({
  resolveTmdbLanguageForRequest: vi.fn().mockResolvedValue("es-ES")
}));

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/home", () => ({
  getSeriesPageData: vi.fn(),
  buildSeriesRowSections: vi.fn(),
  selectSeriesStripMovies: vi.fn()
}));

vi.mock("@/lib/tmdb", () => ({
  getTvGenres: vi.fn().mockResolvedValue([
    { id: 18, name: "Drama" },
    { id: 10765, name: "Sci-Fi & Fantasy" }
  ])
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import { buildSeriesRowSections, getSeriesPageData, selectSeriesStripMovies } from "@/lib/home";

const seriesFixture: Movie = {
  id: 1399,
  mediaType: "tv",
  title: "Game of Thrones",
  overview: "Noble families fight for the throne.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.4,
  releaseDate: "2011-04-17",
  genres: [],
  runtime: 57,
  language: "en",
  voteCount: 1000
};

const seriesPageDataFixture: SeriesPageData = {
  trendingTv: [seriesFixture],
  popularTv: [],
  topRatedTv: [],
  onTheAirTv: [],
  airingTodayTv: [],
  featuredSlides: [{ movie: seriesFixture, trailerUrl: "https://www.youtube.com/embed/KPLWWIOCOOQ" }],
  hasError: false
};

describe("SeriesPage", () => {
  it("renders series content", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getSeriesPageData).mockResolvedValue(seriesPageDataFixture);
    vi.mocked(buildSeriesRowSections).mockReturnValue([
      {
        key: "trending-tv",
        title: "Series en tendencia",
        movies: [seriesFixture],
        emptyMessage: "No hay series en tendencia para mostrar por ahora."
      }
    ]);
    vi.mocked(selectSeriesStripMovies).mockReturnValue([]);

    render(await SeriesPage());

    expect(screen.getByText("Serie destacada")).toBeInTheDocument();
    expect(screen.getByText("Series en tendencia")).toBeInTheDocument();
  });

  it("shows warning when token is missing", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue(null);
    vi.mocked(getSeriesPageData).mockResolvedValue({ ...seriesPageDataFixture, featuredSlides: [], trendingTv: [] });
    vi.mocked(buildSeriesRowSections).mockReturnValue([]);
    vi.mocked(selectSeriesStripMovies).mockReturnValue([]);

    render(await SeriesPage());
    expect(screen.getByText(/Falta configurar/)).toBeInTheDocument();
  });
});
