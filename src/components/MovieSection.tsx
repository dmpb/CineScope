import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/MovieCard";
import { StateMessage } from "@/components/StateMessage";

type MovieSectionProps = {
  title: string;
  movies: Movie[];
  emptyMessage: string;
};

export function MovieSection({ title, movies, emptyMessage }: MovieSectionProps) {
  const sectionId = `section-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <section className="space-y-4 sm:space-y-5" aria-labelledby={sectionId}>
      <h2 id={sectionId} className="text-xl font-semibold text-zinc-100 sm:text-2xl">
        {title}
      </h2>
      {movies.length > 0 ? (
        <ul className="horizontal-scroll-row" role="list" aria-label={`Fila de peliculas: ${title}`}>
          {movies.map((movie) => (
            <li key={movie.id} className="horizontal-scroll-item min-w-[45%] sm:min-w-[31%] md:min-w-[23%] lg:min-w-[19%] xl:min-w-[16%]">
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <StateMessage variant="empty">{emptyMessage}</StateMessage>
      )}
    </section>
  );
}
