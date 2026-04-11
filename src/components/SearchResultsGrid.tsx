import { MovieCard } from "@/components/MovieCard";
import { PersonCard } from "@/components/PersonCard";
import { StateMessage } from "@/components/StateMessage";
import type { UiMessages } from "@/lib/ui-i18n";
import type { Movie, PersonSearchHit, SearchListItem } from "@/types/movie";

function isPersonHit(item: SearchListItem): item is PersonSearchHit {
  return item.mediaType === "person";
}

function searchHitKey(item: SearchListItem, index: number): string {
  if (isPersonHit(item)) {
    return `person-${item.id}-${index}`;
  }
  const m = item as Movie;
  return `${m.mediaType ?? "movie"}-${m.id}-${index}`;
}

type SearchResultsGridProps = {
  title: string;
  items: SearchListItem[];
  emptyMessage: string;
  ui: UiMessages;
};

export function SearchResultsGrid({ title, items, emptyMessage, ui }: SearchResultsGridProps) {
  const sectionId = `search-grid-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  const listClassName =
    "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

  return (
    <section className="space-y-4 sm:space-y-5" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="text-xl font-semibold text-zinc-100 sm:text-2xl">
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className={listClassName} role="list" aria-label={ui.sectionAriaGrid(title)}>
          {items.map((item, index) => (
            <li key={searchHitKey(item, index)} className="min-w-0">
              {isPersonHit(item) ? <PersonCard person={item} ui={ui} /> : <MovieCard movie={item as Movie} ui={ui} />}
            </li>
          ))}
        </ul>
      ) : (
        <StateMessage variant="empty">{emptyMessage}</StateMessage>
      )}
    </section>
  );
}
