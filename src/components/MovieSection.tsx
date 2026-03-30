import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/MovieCard";

type MovieSectionProps = {
  title: string;
  movies: Movie[];
  emptyMessage: string;
};

export function MovieSection({ title, movies, emptyMessage }: MovieSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-zinc-100">{title}</h2>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-6 text-sm text-zinc-300">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
