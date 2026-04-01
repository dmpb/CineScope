import Image from "next/image";
import { CastScroller } from "@/components/CastScroller";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MovieMediaGallery } from "@/components/MovieMediaGallery";
import { TrailerModal } from "@/components/TrailerModal";
import type { CastMember, CrewHighlights, Movie, WatchProvider } from "@/types/movie";

type MovieDetailProps = {
  movie: Movie;
  trailerUrl?: string | null;
  cast?: CastMember[];
  crew?: CrewHighlights;
  providers?: WatchProvider[];
  mediaImages?: string[];
};

export function MovieDetail({
  movie,
  trailerUrl = null,
  cast = [],
  crew = { directors: [], writers: [] },
  providers = [],
  mediaImages = []
}: MovieDetailProps) {
  const movieTitle = movie.title || "Sin titulo";
  const originalTitleText = movie.originalTitle && movie.originalTitle !== movieTitle ? movie.originalTitle : null;
  const taglineText = movie.tagline?.trim() || null;
  const genresText = movie.genres.length > 0 ? movie.genres.join(", ") : "No disponible";
  const runtimeText = movie.runtime > 0 ? `${movie.runtime} min` : "No disponible";
  const languageText = movie.language ? movie.language.toUpperCase() : "No disponible";
  const voteCountText = movie.voteCount > 0 ? new Intl.NumberFormat("es-ES").format(movie.voteCount) : "Sin votos";
  const popularityText = typeof movie.popularity === "number" && movie.popularity > 0 ? movie.popularity.toFixed(1) : "No disponible";
  const statusText = movie.status?.trim() || "No disponible";
  const countriesText =
    Array.isArray(movie.productionCountries) && movie.productionCountries.length > 0
      ? movie.productionCountries.join(", ")
      : "No disponible";
  const imageSrc = movie.backdropPath || movie.posterPath;
  const directorsText = crew.directors.length > 0 ? crew.directors.join(", ") : "No disponible";
  const writersText = crew.writers.length > 0 ? crew.writers.join(", ") : "No disponible";
  const providersByCategory = {
    flatrate: providers.filter((provider) => provider.category === "flatrate"),
    rent: providers.filter((provider) => provider.category === "rent"),
    buy: providers.filter((provider) => provider.category === "buy")
  };

  return (
    <article className="relative min-h-[72vh] overflow-hidden bg-zinc-900">
      {imageSrc ? (
        <Image src={imageSrc} alt={`Backdrop de ${movieTitle}`} fill className="object-cover" priority sizes="100vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">Backdrop no disponible</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/78 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

      <div className="relative z-10 flex min-h-[72vh] w-full items-end px-4 pb-10 pt-24 sm:px-6 lg:px-10">
        <div className="grid w-full gap-6 md:grid-cols-[280px_1fr]">
          <div className="relative mx-auto aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-800 shadow-xl shadow-black/50">
            {movie.posterPath ? (
              <Image src={movie.posterPath} alt={`Poster de ${movieTitle}`} fill className="object-cover" sizes="280px" />
            ) : (
              <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">Poster no disponible</div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-5 overflow-hidden">
            <nav aria-label="Navegacion interna de detalle" className="flex flex-wrap gap-2 text-xs text-zinc-300">
              <a href="#detail-summary" className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400">
                Resumen
              </a>
              <a href="#detail-cast" className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400">
                Cast
              </a>
              <a href="#detail-data" className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400">
                Datos
              </a>
              <a href="#detail-media" className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400">
                Media
              </a>
              <a href="#similar-movies" className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400">
                Similares
              </a>
            </nav>
            <h1 className="text-3xl font-semibold text-zinc-100 sm:text-4xl lg:text-5xl">{movieTitle}</h1>
            {originalTitleText && <p className="text-sm text-zinc-300">Titulo original: {originalTitleText}</p>}
            {taglineText && <p className="text-sm italic text-zinc-300">"{taglineText}"</p>}
            <section id="detail-summary" className="anchor-target space-y-4">
            <dl className="text-sm text-zinc-300">
              <div className="flex flex-wrap items-center gap-2">
                <dt className="sr-only">Fecha de estreno</dt>
                <dd>{movie.releaseDate || "Fecha desconocida"}</dd>
                <span aria-hidden="true">·</span>
                <dt className="sr-only">Calificacion</dt>
                <dd>⭐ {movie.rating.toFixed(1)}</dd>
              </div>
            </dl>
              <dl id="detail-data" className="anchor-target grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
              <div>
                <dt className="text-zinc-400">Generos</dt>
                <dd>{genresText}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Duracion</dt>
                <dd>{runtimeText}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Idioma</dt>
                <dd>{languageText}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Votos</dt>
                <dd>{voteCountText}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Estado</dt>
                <dd>{statusText}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Popularidad</dt>
                <dd>{popularityText}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-400">Paises de produccion</dt>
                <dd>{countriesText}</dd>
              </div>
                <div className="sm:col-span-2">
                  <dt className="text-zinc-400">Direccion</dt>
                  <dd>{directorsText}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-zinc-400">Guion</dt>
                  <dd>{writersText}</dd>
                </div>
            </dl>
            <p className="w-full text-sm leading-relaxed text-zinc-200 sm:text-base">
              {movie.overview || "No hay sinopsis disponible para esta pelicula."}
            </p>
            <div className="flex flex-wrap gap-3">
              <TrailerModal trailerUrl={trailerUrl} movieTitle={movieTitle} />
              <FavoriteButton movieId={movie.id} movieTitle={movieTitle} variant="inline" />
              <a
                href="#similar-movies"
                className="focus-ring premium-transition inline-flex items-center rounded-lg border border-zinc-500/70 bg-black/35 px-4 py-2.5 text-sm font-medium text-zinc-100 hover:border-zinc-300 hover:bg-black/55"
              >
                Ver similares
              </a>
            </div>
            </section>
            <section id="detail-cast" className="anchor-target space-y-2">
              {cast.length > 0 ? (
                <CastScroller cast={cast} />
              ) : (
                <p className="text-sm text-zinc-400">No hay informacion de cast disponible.</p>
              )}
            </section>
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Donde verla</h2>
              {providers.length > 0 ? (
                <div className="space-y-2 text-sm text-zinc-300">
                  {providersByCategory.flatrate.length > 0 && (
                    <p>
                      <span className="text-zinc-400">Suscripcion:</span>{" "}
                      {providersByCategory.flatrate.map((provider) => provider.name).join(", ")}
                    </p>
                  )}
                  {providersByCategory.rent.length > 0 && (
                    <p>
                      <span className="text-zinc-400">Renta:</span> {providersByCategory.rent.map((provider) => provider.name).join(", ")}
                    </p>
                  )}
                  {providersByCategory.buy.length > 0 && (
                    <p>
                      <span className="text-zinc-400">Compra:</span> {providersByCategory.buy.map((provider) => provider.name).join(", ")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">No hay proveedores disponibles para la region configurada.</p>
              )}
            </section>
            <section id="detail-media" className="anchor-target space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Media</h2>
              <MovieMediaGallery images={mediaImages} />
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
