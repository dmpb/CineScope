import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Movie } from "@/types/movie";
import TvPage, { generateMetadata } from "@/app/tv/[id]/page";

vi.mock("@/lib/env", () => ({
  getOptionalTmdbBearerToken: vi.fn()
}));

vi.mock("@/lib/tmdb", () => ({
  getTvById: vi.fn(),
  getTvTrailerById: vi.fn(),
  getTvCastById: vi.fn(),
  getTvCrewHighlightsById: vi.fn(),
  getTvWatchProvidersById: vi.fn(),
  getTvImagesById: vi.fn(),
  getSimilarTvById: vi.fn()
}));

import { getOptionalTmdbBearerToken } from "@/lib/env";
import {
  getSimilarTvById,
  getTvById,
  getTvCastById,
  getTvCrewHighlightsById,
  getTvImagesById,
  getTvTrailerById,
  getTvWatchProvidersById
} from "@/lib/tmdb";

const tvFixture: Movie = {
  id: 1399,
  mediaType: "tv",
  title: "Game of Thrones",
  overview: "Noble families fight for the throne.",
  posterPath: "https://image.tmdb.org/t/p/original/a.jpg",
  backdropPath: "https://image.tmdb.org/t/p/original/b.jpg",
  rating: 8.4,
  releaseDate: "2011-04-17",
  genres: ["Drama"],
  runtime: 57,
  language: "en",
  voteCount: 24000,
  creators: ["David Benioff", "D. B. Weiss"],
  numberOfSeasons: 8,
  numberOfEpisodes: 73,
  networkNames: ["HBO"],
  lastAirDate: "2019-05-19",
  episodeRunTimes: [57]
};

describe("TV detail page", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders tv detail for valid id", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getTvById).mockResolvedValue(tvFixture);
    vi.mocked(getTvTrailerById).mockResolvedValue("https://www.youtube.com/embed/test");
    vi.mocked(getTvCastById).mockResolvedValue([
      {
        id: 7,
        name: "Emilia Clarke",
        character: "Daenerys Targaryen",
        profilePath: "https://image.tmdb.org/t/p/original/m.jpg"
      }
    ]);
    vi.mocked(getTvCrewHighlightsById).mockResolvedValue({
      directors: [],
      writers: ["George R. R. Martin"]
    });
    vi.mocked(getTvWatchProvidersById).mockResolvedValue([
      { id: 8, name: "HBO Max", logoPath: "https://image.tmdb.org/t/p/original/a.png", category: "flatrate" }
    ]);
    vi.mocked(getTvImagesById).mockResolvedValue(["https://image.tmdb.org/t/p/original/c.jpg"]);
    vi.mocked(getSimilarTvById).mockResolvedValue([
      {
        ...tvFixture,
        id: 1396,
        title: "Breaking Bad"
      }
    ]);

    render(await TvPage({ params: Promise.resolve({ id: "1399" }) }));

    expect(screen.getByRole("heading", { level: 1, name: "Game of Thrones" })).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    expect(screen.getByText("57 min")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver trailer" })).toBeInTheDocument();
    expect(screen.getByText("George R. R. Martin")).toBeInTheDocument();
    expect(screen.getByText(/David Benioff/)).toBeInTheDocument();
    expect(screen.getByText("HBO Max")).toBeInTheDocument();
    expect(screen.getByText("Emilia Clarke")).toBeInTheDocument();
    expect(screen.getByText('Similares a "Game of Thrones"')).toBeInTheDocument();
    expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navegacion interna de detalle de serie" })).toBeInTheDocument();
    const seriesCrumb = screen.getByRole("link", { name: "Series" });
    expect(seriesCrumb).toHaveAttribute("href", "/series");
  });

  it("generateMetadata returns title and description when show exists", async () => {
    vi.mocked(getTvById).mockResolvedValue(tvFixture);
    const meta = await generateMetadata({ params: Promise.resolve({ id: "1399" }) });
    expect(meta.title).toBe("Game of Thrones — CineScope");
    expect(typeof meta.description).toBe("string");
    expect(meta.description).toContain("Noble families");
  });

  it("generateMetadata handles invalid id", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ id: "0" }) });
    expect(meta.title).toBe("Serie — CineScope");
  });

  it("shows token warning when token is missing", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue(null);
    vi.mocked(getTvById).mockResolvedValue(tvFixture);
    vi.mocked(getTvTrailerById).mockResolvedValue(null);
    vi.mocked(getTvCastById).mockResolvedValue([]);
    vi.mocked(getTvCrewHighlightsById).mockResolvedValue({ directors: [], writers: [] });
    vi.mocked(getTvWatchProvidersById).mockResolvedValue([]);
    vi.mocked(getTvImagesById).mockResolvedValue([]);
    vi.mocked(getSimilarTvById).mockResolvedValue([]);

    render(await TvPage({ params: Promise.resolve({ id: "1399" }) }));

    expect(screen.getByText(/Falta configurar/)).toBeInTheDocument();
  });

  it("shows load error when API returns no show", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getTvById).mockResolvedValue(null);
    vi.mocked(getTvTrailerById).mockResolvedValue(null);
    vi.mocked(getTvCastById).mockResolvedValue([]);
    vi.mocked(getTvCrewHighlightsById).mockResolvedValue({ directors: [], writers: [] });
    vi.mocked(getTvWatchProvidersById).mockResolvedValue([]);
    vi.mocked(getTvImagesById).mockResolvedValue([]);
    vi.mocked(getSimilarTvById).mockResolvedValue([]);

    render(await TvPage({ params: Promise.resolve({ id: "1399" }) }));

    expect(screen.getByText(/No se pudo cargar la serie solicitada/i)).toBeInTheDocument();
  });

  it("shows empty similar message when related list is empty", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");
    vi.mocked(getTvById).mockResolvedValue(tvFixture);
    vi.mocked(getTvTrailerById).mockResolvedValue(null);
    vi.mocked(getTvCastById).mockResolvedValue([]);
    vi.mocked(getTvCrewHighlightsById).mockResolvedValue({ directors: [], writers: [] });
    vi.mocked(getTvWatchProvidersById).mockResolvedValue([]);
    vi.mocked(getTvImagesById).mockResolvedValue([]);
    vi.mocked(getSimilarTvById).mockResolvedValue([]);

    render(await TvPage({ params: Promise.resolve({ id: "1399" }) }));

    expect(screen.getByText(/No se encontraron series similares relevantes/i)).toBeInTheDocument();
  });

  it("shows invalid id fallback", async () => {
    vi.mocked(getOptionalTmdbBearerToken).mockReturnValue("token");

    render(await TvPage({ params: Promise.resolve({ id: "abc" }) }));

    expect(screen.getByText(/no es valido/i)).toBeInTheDocument();
  });
});
