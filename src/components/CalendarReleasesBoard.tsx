import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import {
  formatCalendarDayParts,
  formatYearMonthLabel,
  shiftYearMonth,
  summarizeCalendarGroups,
  type CalendarDayGroup
} from "@/lib/calendar-releases";
import type { UiMessages } from "@/lib/ui-i18n";
import type { Movie } from "@/types/movie";

type CalendarReleasesBoardProps = {
  ui: UiMessages;
  year: number;
  monthIndex: number;
  groups: CalendarDayGroup[];
};

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={`block shrink-0 ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MediaRail({
  title,
  movies,
  ui,
  tone
}: {
  title: string;
  movies: Movie[];
  ui: UiMessages;
  tone: "movie" | "tv";
}) {
  if (movies.length === 0) {
    return null;
  }
  const badgeClass =
    tone === "movie"
      ? "border-red-500/35 bg-red-950/35 text-red-100"
      : "border-sky-500/35 bg-sky-950/35 text-sky-100";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badgeClass}`}>
          {title}
        </span>
        <span className="text-xs text-zinc-500">{movies.length}</span>
      </div>
      <ul
        className="horizontal-scroll-row"
        role="list"
        aria-label={ui.sectionAriaRow(title)}
      >
        {movies.map((movie, index) => (
          <li
            key={`${movie.mediaType ?? tone}-${movie.id}-${index}`}
            className="horizontal-scroll-item w-[42%] min-w-[42%] max-w-[42%] sm:w-[28%] sm:min-w-[28%] sm:max-w-[28%] md:w-[22%] md:min-w-[22%] md:max-w-[22%] lg:w-[18%] lg:min-w-[18%] lg:max-w-[18%] xl:w-[15%] xl:min-w-[15%] xl:max-w-[15%] [&>*]:h-full [&>*]:w-full"
          >
            <MovieCard movie={movie} ui={ui} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CalendarReleasesBoard({ ui, year, monthIndex, groups }: CalendarReleasesBoardProps) {
  const label = formatYearMonthLabel(year, monthIndex, ui.intlLocale);
  const prev = shiftYearMonth(year, monthIndex, -1);
  const next = shiftYearMonth(year, monthIndex, 1);
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIndex;
  const currentParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const summary = summarizeCalendarGroups(groups);

  const navButtonClass =
    "focus-ring premium-transition inline-flex h-11 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-950/55 px-3 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900/80";

  return (
    <div className="space-y-8 sm:space-y-10">
      <header
        className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-red-950/25 px-5 py-6 shadow-lg shadow-black/20 sm:px-8 sm:py-8"
        aria-labelledby="estrenos-page-title"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-950/40 p-2 text-red-300">
                <CalendarIcon className="h-6 w-6" />
              </span>
              <div className="min-w-0 space-y-2">
                <h1 id="estrenos-page-title" className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                  {ui.calendarTitle}
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">{ui.calendarSubtitle}</p>
              </div>
            </div>

            {summary.totalCount > 0 ? (
              <p className="text-sm text-zinc-300 sm:text-right">
                <span className="font-semibold text-zinc-100">
                  {ui.calendarDayTitles(summary.totalCount)}
                </span>
                <span className="mt-1 block text-xs text-zinc-500">
                  {ui.calendarStatsLine(summary.movieCount, summary.tvCount, summary.dayCount)}
                </span>
              </p>
            ) : null}
          </div>

          <div
            role="navigation"
            aria-label={ui.calendarMonthNavAria}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-800/70 bg-black/25 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-3.5"
          >
            <Link href={`/estrenos?mes=${prev.param}`} className={navButtonClass} aria-label={ui.calendarPrevMonth}>
              <span aria-hidden="true" className="mr-1 text-zinc-400">
                ←
              </span>
              {ui.calendarPrevMonth}
            </Link>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-lg font-semibold capitalize tracking-tight text-zinc-50 sm:text-xl">{label}</p>
              {!isCurrentMonth ? (
                <Link
                  href={`/estrenos?mes=${currentParam}`}
                  className="focus-ring premium-transition text-xs font-medium text-red-300 hover:text-red-200"
                >
                  {ui.calendarBackToToday}
                </Link>
              ) : (
                <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                  {ui.navCalendar}
                </span>
              )}
            </div>

            <Link href={`/estrenos?mes=${next.param}`} className={navButtonClass} aria-label={ui.calendarNextMonth}>
              {ui.calendarNextMonth}
              <span aria-hidden="true" className="ml-1 text-zinc-400">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative space-y-6 sm:space-y-8">
        <div
          className="pointer-events-none absolute bottom-0 left-[1.35rem] top-2 hidden w-px bg-gradient-to-b from-red-500/50 via-zinc-700/60 to-transparent sm:block"
          aria-hidden="true"
        />

        {groups.map((group) => {
          const parts = formatCalendarDayParts(group.dateKey, ui.intlLocale);
          const total = group.movies.length + group.tv.length;
          return (
            <section
              key={group.dateKey}
              id={`day-${group.dateKey}`}
              className="anchor-target relative grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"
            >
              <div className="relative flex sm:flex-col sm:items-start">
                <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/35 bg-red-950 text-lg font-semibold text-red-100 shadow-lg shadow-black/30 ring-4 ring-zinc-950 sm:h-14 sm:w-14 sm:text-xl">
                    {parts?.dayNumber ?? group.dateKey.slice(-2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold capitalize text-zinc-100">
                      {parts?.weekdayLong ?? group.dateKey}
                    </p>
                    <p className="text-xs capitalize text-zinc-500">
                      {parts ? `${parts.weekdayShort} · ${parts.monthShort}` : group.dateKey}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                      {ui.calendarDayTitles(total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-surface-soft space-y-5 rounded-2xl border border-zinc-800/70 p-4 sm:p-5">
                <MediaRail title={ui.calendarMoviesHeading} movies={group.movies} ui={ui} tone="movie" />
                <MediaRail title={ui.calendarTvHeading} movies={group.tv} ui={ui} tone="tv" />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
