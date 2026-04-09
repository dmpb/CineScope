import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/MovieCard";
import { StateMessage } from "@/components/StateMessage";
import type { UiMessages } from "@/lib/ui-i18n";

type MovieSectionProps = {
  title: string;
  /** Si se define, se usa como id del `h2` y de `aria-labelledby` de la seccion (p. ej. favoritos). */
  headingId?: string;
  movies: Movie[];
  emptyMessage: string;
  layout?: "row" | "grid";
  ui: UiMessages;
};

export function MovieSection({ title, headingId, movies, emptyMessage, layout = "row", ui }: MovieSectionProps) {
  const sectionId = `section-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
  const headingDomId = headingId ?? sectionId;
  const isGrid = layout === "grid";
  const listClassName = isGrid
    ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    : "horizontal-scroll-row";
  const itemClassName = isGrid
    ? "min-w-0"
    : "horizontal-scroll-item min-w-[45%] sm:min-w-[31%] md:min-w-[23%] lg:min-w-[19%] xl:min-w-[16%]";
  const listAriaLabel = isGrid ? ui.sectionAriaGrid(title) : ui.sectionAriaRow(title);

  return (
    <section className="space-y-4 sm:space-y-5" aria-labelledby={headingDomId}>
      <h2 id={headingDomId} className="text-xl font-semibold text-zinc-100 sm:text-2xl">
        {title}
      </h2>
      {movies.length > 0 ? (
        <ul className={listClassName} role="list" aria-label={listAriaLabel}>
          {movies.map((movie, index) => (
            <li key={`${movie.mediaType ?? "movie"}-${movie.id}-${index}`} className={itemClassName}>
              <MovieCard movie={movie} ui={ui} />
            </li>
          ))}
        </ul>
      ) : (
        <StateMessage variant="empty">{emptyMessage}</StateMessage>
      )}
    </section>
  );
}
