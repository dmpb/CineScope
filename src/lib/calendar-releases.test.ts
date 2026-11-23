import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatCalendarDayParts,
  groupReleasesByDay,
  loadCalendarMonthGroups,
  parseYearMonth,
  shiftYearMonth,
  summarizeCalendarGroups
} from "@/lib/calendar-releases";
import type { Movie } from "@/types/movie";

vi.mock("@/lib/tmdb", () => ({
  getMoviesReleasingInMonth: vi.fn(),
  getTvPremieresInMonth: vi.fn()
}));

import { getMoviesReleasingInMonth, getTvPremieresInMonth } from "@/lib/tmdb";

const base = (overrides: Partial<Movie>): Movie => ({
  id: 1,
  title: "A",
  overview: "",
  posterPath: "",
  backdropPath: "",
  rating: 7,
  releaseDate: "2026-11-15",
  genres: [],
  runtime: 0,
  language: "",
  voteCount: 0,
  ...overrides
});

describe("calendar-releases", () => {
  beforeEach(() => {
    vi.mocked(getMoviesReleasingInMonth).mockReset();
    vi.mocked(getTvPremieresInMonth).mockReset();
  });

  it("parseYearMonth acepta YYYY-MM válido", () => {
    expect(parseYearMonth("2026-03")).toEqual({ year: 2026, monthIndex: 2 });
  });

  it("shiftYearMonth cruza de año", () => {
    expect(shiftYearMonth(2026, 0, -1)).toEqual({ year: 2025, monthIndex: 11, param: "2025-12" });
  });

  it("groupReleasesByDay filtra por mes", () => {
    const groups = groupReleasesByDay(
      [base({ id: 1, releaseDate: "2026-11-10" }), base({ id: 2, releaseDate: "2026-10-01" })],
      [base({ id: 3, mediaType: "tv", releaseDate: "2026-11-10" })],
      2026,
      10
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]?.dateKey).toBe("2026-11-10");
    expect(groups[0]?.movies).toHaveLength(1);
    expect(groups[0]?.tv).toHaveLength(1);
  });

  it("formatCalendarDayParts extrae día y weekday", () => {
    const parts = formatCalendarDayParts("2026-11-10", "es-ES");
    expect(parts?.dayNumber).toBe(10);
    expect(parts?.weekdayLong.length).toBeGreaterThan(0);
  });

  it("summarizeCalendarGroups cuenta totales", () => {
    const groups = groupReleasesByDay(
      [base({ id: 1, releaseDate: "2026-11-10" })],
      [base({ id: 2, mediaType: "tv", releaseDate: "2026-11-11" })],
      2026,
      10
    );
    expect(summarizeCalendarGroups(groups)).toEqual({
      movieCount: 1,
      tvCount: 1,
      dayCount: 2,
      totalCount: 2
    });
  });

  it("loadCalendarMonthGroups pide el mes y agrupa por día", async () => {
    vi.mocked(getMoviesReleasingInMonth).mockResolvedValue([
      base({ id: 1003596, title: "Vengadores: Doomsday", releaseDate: "2026-12-18" })
    ]);
    vi.mocked(getTvPremieresInMonth).mockResolvedValue([
      base({ id: 9, mediaType: "tv", title: "Serie", releaseDate: "2026-12-18" })
    ]);

    const groups = await loadCalendarMonthGroups(2026, 11);
    expect(getMoviesReleasingInMonth).toHaveBeenCalledWith(2026, 11);
    expect(getTvPremieresInMonth).toHaveBeenCalledWith(2026, 11);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.dateKey).toBe("2026-12-18");
    expect(groups[0]?.movies).toHaveLength(1);
    expect(groups[0]?.tv).toHaveLength(1);
  });
});
