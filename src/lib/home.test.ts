import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import { getHomeData, selectHomeStripMovies, type HomeData } from "@/lib/home";

vi.mock("@/lib/tmdb", () => ({
  getMovieById: vi.fn(),
  getMovieGenres: vi.fn(),
  getMovieTrailerById: vi.fn(),
  getMoviesByGenre: vi.fn(),
  getNowPlayingMovies: vi.fn(),
  getPopularMovies: vi.fn(),
  getTopRatedMovies: vi.fn(),
  getTrendingMovies: vi.fn(),
  getUpcomingMovies: vi.fn()
}));

import {
  getMovieById,
  getMovieGenres,
  getMovieTrailerById,
  getMoviesByGenre,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
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
    vi.mocked(getMoviesByGenre).mockResolvedValue([]);
    vi.mocked(getMovieTrailerById).mockResolvedValue(null);
    vi.mocked(getMovieById).mockResolvedValue(movieFixture);

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
      genreSections: [],
      featuredMovie: movieFixture,
      featuredTrailerUrl: null,
      hasError: false
    };

    const stripMovies = selectHomeStripMovies(data);
    expect(stripMovies.map((movie) => movie.id)).toEqual([3, 4, 5, 2]);
  });
});
