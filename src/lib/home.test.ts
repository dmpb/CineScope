import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import { getHomeData, selectHomeStripMovies, type HomeData } from "@/lib/home";

vi.mock("@/lib/tmdb", () => ({
  getAiringTodayTv: vi.fn(),
  getMovieById: vi.fn(),
  getMovieGenres: vi.fn(),
  getMovieTrailerById: vi.fn(),
  getMoviesByGenre: vi.fn(),
  getNowPlayingMovies: vi.fn(),
  getOnTheAirTv: vi.fn(),
  getPopularMovies: vi.fn(),
  getPopularTv: vi.fn(),
  getTopRatedMovies: vi.fn(),
  getTopRatedTv: vi.fn(),
  getTrendingMovies: vi.fn(),
  getTrendingTv: vi.fn(),
  getTvById: vi.fn(),
  getTvTrailerById: vi.fn(),
  getUpcomingMovies: vi.fn()
}));

import {
  getAiringTodayTv,
  getMovieById,
  getMovieGenres,
  getMovieTrailerById,
  getMoviesByGenre,
  getNowPlayingMovies,
  getOnTheAirTv,
  getPopularMovies,
  getPopularTv,
  getTopRatedMovies,
  getTopRatedTv,
  getTrendingMovies,
  getTrendingTv,
  getTvById,
  getTvTrailerById,
  getUpcomingMovies
} from "@/lib/tmdb";

const movieFixture: Movie = {
  id: 1,
  title: "Inception",
  originalTitle: "Inception",
  tagline: "Your mind is the scene of the crime.",
  overview: "Dreams.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.2,
  releaseDate: "2010-07-16",
  status: "Released",
  productionCountries: ["United States"],
  genres: ["Action"],
  runtime: 148,
  language: "en",
  popularity: 88,
  voteCount: 12000
};

describe("home orchestration", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps rendering partial datasets when one fails", async () => {
    vi.mocked(getTrendingMovies).mockResolvedValue([movieFixture]);
    vi.mocked(getPopularMovies).mockRejectedValue(new Error("popular failed"));
    vi.mocked(getTopRatedMovies).mockResolvedValue([]);
    vi.mocked(getNowPlayingMovies).mockResolvedValue([]);
    vi.mocked(getUpcomingMovies).mockResolvedValue([]);
    vi.mocked(getMovieGenres).mockResolvedValue([
      { id: 28, name: "Action" },
      { id: 35, name: "Comedy" }
    ]);
    vi.mocked(getTrendingTv).mockResolvedValue([]);
    vi.mocked(getPopularTv).mockResolvedValue([]);
    vi.mocked(getTopRatedTv).mockResolvedValue([]);
    vi.mocked(getOnTheAirTv).mockResolvedValue([]);
    vi.mocked(getAiringTodayTv).mockResolvedValue([]);
    vi.mocked(getMoviesByGenre).mockResolvedValue([]);
    vi.mocked(getMovieTrailerById).mockResolvedValue(null);
    vi.mocked(getMovieById).mockResolvedValue(movieFixture);
    vi.mocked(getTvTrailerById).mockResolvedValue(null);
    vi.mocked(getTvById).mockResolvedValue(null);

    const data = await getHomeData();

    expect(data.trending).toHaveLength(1);
    expect(data.popular).toHaveLength(0);
    expect(data.hasError).toBe(true);
  });

  it("uses deterministic genre selection order", async () => {
    vi.mocked(getTrendingMovies).mockResolvedValue([]);
    vi.mocked(getPopularMovies).mockResolvedValue([]);
    vi.mocked(getTopRatedMovies).mockResolvedValue([]);
    vi.mocked(getNowPlayingMovies).mockResolvedValue([]);
    vi.mocked(getUpcomingMovies).mockResolvedValue([]);
    vi.mocked(getTrendingTv).mockResolvedValue([]);
    vi.mocked(getPopularTv).mockResolvedValue([]);
    vi.mocked(getTopRatedTv).mockResolvedValue([]);
    vi.mocked(getOnTheAirTv).mockResolvedValue([]);
    vi.mocked(getAiringTodayTv).mockResolvedValue([]);
    vi.mocked(getMovieGenres).mockResolvedValue([
      { id: 99, name: "Documentary" },
      { id: 35, name: "Comedy" },
      { id: 99, name: "Documentary Duplicate" }
    ]);
    vi.mocked(getMoviesByGenre).mockResolvedValue([]);

    await getHomeData();

    expect(vi.mocked(getMoviesByGenre).mock.calls[0]?.[0]).toBe(35);
    expect(vi.mocked(getMoviesByGenre).mock.calls[1]?.[0]).toBe(99);
  });

  it("dedupes strip movies preserving order", () => {
    const data: HomeData = {
      trending: [movieFixture, { ...movieFixture, id: 2 }],
      popular: [{ ...movieFixture, id: 3 }],
      topRated: [{ ...movieFixture, id: 3 }],
      nowPlaying: [{ ...movieFixture, id: 4 }],
      upcoming: [{ ...movieFixture, id: 5 }],
      trendingTv: [{ ...movieFixture, id: 6, mediaType: "tv" }],
      popularTv: [{ ...movieFixture, id: 7, mediaType: "tv" }],
      topRatedTv: [{ ...movieFixture, id: 7, mediaType: "tv" }],
      onTheAirTv: [{ ...movieFixture, id: 8, mediaType: "tv" }],
      airingTodayTv: [{ ...movieFixture, id: 9, mediaType: "tv" }],
      genreSections: [],
      featuredSlides: [{ movie: movieFixture, trailerUrl: null }],
      hasError: false
    };

    const stripMovies = selectHomeStripMovies(data);
    expect(stripMovies.map((movie) => movie.id)).toEqual([3, 7, 4, 9, 5, 8, 2]);
  });
});
