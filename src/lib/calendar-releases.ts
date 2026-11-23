import { getMoviesReleasingInMonth, getTvPremieresInMonth } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

export type CalendarDayGroup = {
  dateKey: string;
  movies: Movie[];
  tv: Movie[];
};

export type CalendarDayParts = {
  dateKey: string;
  dayNumber: number;
  weekdayShort: string;
  weekdayLong: string;
  monthShort: string;
};

function monthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function parseYearMonth(param: string | undefined, now = new Date()): { year: number; monthIndex: number } {
  if (param && /^\d{4}-\d{2}$/.test(param)) {
    const [y, m] = param.split("-").map(Number);
    if (y >= 1970 && y <= 2100 && m >= 1 && m <= 12) {
      return { year: y, monthIndex: m - 1 };
    }
  }
  return { year: now.getFullYear(), monthIndex: now.getMonth() };
}

export function shiftYearMonth(year: number, monthIndex: number, delta: number): { year: number; monthIndex: number; param: string } {
  const date = new Date(Date.UTC(year, monthIndex + delta, 1));
  const nextYear = date.getUTCFullYear();
  const nextMonth = date.getUTCMonth();
  return { year: nextYear, monthIndex: nextMonth, param: monthKey(nextYear, nextMonth) };
}

export function formatYearMonthLabel(year: number, monthIndex: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, monthIndex, 1))
  );
}

export function formatCalendarDayParts(dateKey: string, locale: string): CalendarDayParts | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return null;
  }
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    dateKey,
    dayNumber: d,
    weekdayShort: new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(date),
    weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(date),
    monthShort: new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(date)
  };
}

export function groupReleasesByDay(
  movies: Movie[],
  tvShows: Movie[],
  year: number,
  monthIndex: number
): CalendarDayGroup[] {
  const prefix = monthKey(year, monthIndex);
  const byDay = new Map<string, CalendarDayGroup>();

  const ensure = (dateKey: string) => {
    let group = byDay.get(dateKey);
    if (!group) {
      group = { dateKey, movies: [], tv: [] };
      byDay.set(dateKey, group);
    }
    return group;
  };

  for (const movie of movies) {
    const dateKey = movie.releaseDate?.slice(0, 10) ?? "";
    if (!dateKey.startsWith(prefix)) {
      continue;
    }
    ensure(dateKey).movies.push(movie);
  }
  for (const show of tvShows) {
    const dateKey = show.releaseDate?.slice(0, 10) ?? "";
    if (!dateKey.startsWith(prefix)) {
      continue;
    }
    ensure(dateKey).tv.push(show);
  }

  return [...byDay.values()].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

export function summarizeCalendarGroups(groups: CalendarDayGroup[]): {
  movieCount: number;
  tvCount: number;
  dayCount: number;
  totalCount: number;
} {
  let movieCount = 0;
  let tvCount = 0;
  for (const group of groups) {
    movieCount += group.movies.length;
    tvCount += group.tv.length;
  }
  return {
    movieCount,
    tvCount,
    dayCount: groups.length,
    totalCount: movieCount + tvCount
  };
}

/** Carga estrenos del mes vía Discover (películas teatrales + series) y agrupa por día. */
export async function loadCalendarMonthGroups(year: number, monthIndex: number): Promise<CalendarDayGroup[]> {
  const [movies, tvShows] = await Promise.all([
    getMoviesReleasingInMonth(year, monthIndex),
    getTvPremieresInMonth(year, monthIndex)
  ]);
  return groupReleasesByDay(movies, tvShows, year, monthIndex);
}
