import type { Metadata } from "next";
import { CalendarReleasesBoard } from "@/components/CalendarReleasesBoard";
import { StateMessage } from "@/components/StateMessage";
import { loadCalendarMonthGroups, parseYearMonth, type CalendarDayGroup } from "@/lib/calendar-releases";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import { resolveTmdbLanguageForRequest } from "@/lib/tmdb-language-server";
import { getUiMessages } from "@/lib/ui-i18n";

type EstrenosPageProps = {
  searchParams: Promise<{ mes?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  return {
    title: ui.calendarTitle,
    description: ui.calendarSubtitle,
    alternates: { canonical: "/estrenos" },
    openGraph: { url: "/estrenos", title: ui.calendarTitle, description: ui.calendarSubtitle }
  };
}

export default async function EstrenosPage({ searchParams }: EstrenosPageProps) {
  const { mes } = await searchParams;
  const ui = getUiMessages(await resolveTmdbLanguageForRequest());
  const hasToken = Boolean(getOptionalTmdbBearerToken());
  const { year, monthIndex } = parseYearMonth(mes);

  let groups: CalendarDayGroup[] = [];
  let loadError = false;
  try {
    groups = await loadCalendarMonthGroups(year, monthIndex);
  } catch {
    loadError = true;
  }

  return (
    <main className="home-cinematic-shell">
      <div className="home-content-container home-content-stack">
        {!hasToken && (
          <StateMessage variant="warning">
            {ui.tokenWarningBefore}
            <code>TMDB_BEARER_TOKEN</code>
            {ui.tokenWarningAfter}
          </StateMessage>
        )}

        {loadError && <StateMessage variant="error">{ui.errorLoadTmdb}</StateMessage>}

        {!loadError ? (
          groups.length === 0 ? (
            <>
              <CalendarReleasesBoard ui={ui} year={year} monthIndex={monthIndex} groups={[]} />
              <StateMessage variant="empty">{ui.calendarEmptyMonth}</StateMessage>
            </>
          ) : (
            <CalendarReleasesBoard ui={ui} year={year} monthIndex={monthIndex} groups={groups} />
          )
        ) : (
          <CalendarReleasesBoard ui={ui} year={year} monthIndex={monthIndex} groups={[]} />
        )}
      </div>
    </main>
  );
}
