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
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <li key={movie.id}>
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
