import Image from "next/image";
import Link from "next/link";
import type {
  PersonCastCredit,
  PersonCombinedCredits,
  PersonCrewCredit,
  PersonDetail as PersonDetailModel,
  PersonExternalIds,
  PersonProfileImage,
  PersonTaggedImage
} from "@/types/person";

type PersonDetailProps = {
  person: PersonDetailModel;
  credits: PersonCombinedCredits;
  profileImages: PersonProfileImage[];
  taggedImages: PersonTaggedImage[];
  externalIds: PersonExternalIds;
  /** Backdrop horizontal (película/serie); resuelto en servidor. */
  heroBackdropUrl: string | null;
};

function formatDisplayDate(iso: string): string {
  const t = iso.trim();
  if (!t) {
    return "";
  }
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) {
    return t;
  }
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

function mediaHref(mediaType: "movie" | "tv", mediaId: number): string {
  return mediaType === "tv" ? `/tv/${mediaId}` : `/movie/${mediaId}`;
}

function CastCreditRow({ credit }: { credit: PersonCastCredit }) {
  const href = mediaHref(credit.mediaType, credit.mediaId);
  const year =
    credit.releaseDate.length >= 4
      ? credit.releaseDate.slice(0, 4)
      : credit.releaseDate || "—";

  return (
    <li>
      <Link
        href={href}
        className="focus-ring premium-transition group flex gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3 transition-colors hover:border-zinc-600/60 hover:bg-zinc-900/50 sm:gap-4 sm:p-4"
      >
        <div className="relative h-[72px] w-[48px] shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 sm:h-[84px] sm:w-[56px]">
          {credit.posterPath ? (
            <Image src={credit.posterPath} alt="" fill className="object-cover" sizes="56px" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-zinc-600">N/A</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-semibold text-zinc-100 group-hover:text-white">{credit.title}</span>
            <span className="text-xs text-zinc-500">{year}</span>
            <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              {credit.mediaType === "tv" ? "Serie" : "Película"}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            <span className="text-zinc-500">Como </span>
            {credit.character}
          </p>
          {credit.voteAverage > 0 && (
            <p className="mt-1 text-xs text-zinc-500">
              Valoración TMDb: {credit.voteAverage.toFixed(1)}
              {credit.popularity > 0 ? ` · Popularidad ${credit.popularity.toFixed(1)}` : ""}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

function CrewCreditRow({ credit }: { credit: PersonCrewCredit }) {
  const href = mediaHref(credit.mediaType, credit.mediaId);
  const year =
    credit.releaseDate.length >= 4
      ? credit.releaseDate.slice(0, 4)
      : credit.releaseDate || "—";

  return (
    <li>
      <Link
        href={href}
        className="focus-ring premium-transition group flex gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3 transition-colors hover:border-zinc-600/60 hover:bg-zinc-900/50 sm:gap-4 sm:p-4"
      >
        <div className="relative h-[72px] w-[48px] shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 sm:h-[84px] sm:w-[56px]">
          {credit.posterPath ? (
            <Image src={credit.posterPath} alt="" fill className="object-cover" sizes="56px" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-zinc-600">N/A</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-semibold text-zinc-100 group-hover:text-white">{credit.title}</span>
            <span className="text-xs text-zinc-500">{year}</span>
            <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
              {credit.mediaType === "tv" ? "Serie" : "Película"}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            <span className="text-zinc-500">{credit.department}</span>
            {" · "}
            {credit.job}
          </p>
        </div>
      </Link>
    </li>
  );
}

function ExternalLinksBlock({
  person,
  externalIds
}: {
  person: PersonDetailModel;
  externalIds: PersonExternalIds;
}) {
  const imdb = person.imdbId.trim() || externalIds.imdbId.trim();
  const links: Array<{ label: string; href: string }> = [];

  if (imdb) {
    links.push({ label: "IMDb", href: `https://www.imdb.com/name/${imdb}` });
  }
  if (externalIds.facebookId.trim()) {
    links.push({ label: "Facebook", href: `https://www.facebook.com/${externalIds.facebookId}` });
  }
  if (externalIds.instagramId.trim()) {
    links.push({ label: "Instagram", href: `https://www.instagram.com/${externalIds.instagramId}/` });
  }
  if (externalIds.twitterId.trim()) {
    links.push({ label: "X (Twitter)", href: `https://twitter.com/${externalIds.twitterId}` });
  }
  if (externalIds.youtubeId.trim()) {
    links.push({ label: "YouTube", href: `https://www.youtube.com/${externalIds.youtubeId}` });
  }
  if (externalIds.wikidataId.trim()) {
    links.push({ label: "Wikidata", href: `https://www.wikidata.org/wiki/${externalIds.wikidataId}` });
  }

  const homepage = person.homepage.trim();
  if (homepage) {
    const url = /^https?:\/\//i.test(homepage) ? homepage : `https://${homepage}`;
    links.unshift({ label: "Web oficial", href: url });
  }

  if (links.length === 0) {
    return <p className="text-sm text-zinc-500">No hay enlaces externos registrados en TMDb.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((item) => (
        <li key={`${item.label}-${item.href}`}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring premium-transition inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-900/60 px-3 py-1.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:text-white"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PersonDetail({
  person,
  credits,
  profileImages,
  taggedImages,
  externalIds,
  heroBackdropUrl
}: PersonDetailProps) {
  const name = person.name;
  const taggedFallback =
    taggedImages.find((img) => img.aspectRatio >= 1)?.filePath ?? taggedImages[0]?.filePath ?? null;
  const heroBackdrop = heroBackdropUrl || taggedFallback;
  const popularityText =
    person.popularity > 0 ? new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(person.popularity) : "—";
  const bioParagraphs = person.biography
    ? person.biography.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <article className="relative min-h-[72vh] overflow-hidden bg-zinc-950">
      {/*
        Banda superior en proporción 16:9 (alto = min(56.25vw, 78vh)): encaja con backdrops TMDb y evita
        el recorte agresivo de object-cover en todo el alto de la vista (como en detalle película/serie).
      */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[min(56.25vw,78vh)] w-full overflow-hidden bg-zinc-900">
        {heroBackdrop ? (
          <>
            <Image
              src={heroBackdrop}
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/78 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        )}
      </div>

      <div className="relative z-10 flex min-h-[72vh] w-full flex-col px-4 pb-12 pt-28 sm:px-6 lg:px-10 lg:pt-24">
        <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-zinc-400">
          <span className="text-zinc-500">Persona</span>
          <span aria-hidden="true" className="text-zinc-600">
            /
          </span>
          <span className="max-w-[min(100%,36rem)] truncate text-zinc-300">{name}</span>
        </nav>

        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12 xl:max-w-[1200px]">
          <div className="mx-auto w-full max-w-[260px] lg:mx-0">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900 shadow-2xl shadow-black/60">
              {person.profilePath ? (
                <Image src={person.profilePath} alt={`Retrato de ${name}`} fill className="object-cover" sizes="280px" priority />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
                  Sin foto de perfil
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              {person.adult && (
                <span className="inline-block rounded-md border border-amber-700/50 bg-amber-950/40 px-2 py-0.5 text-xs font-medium text-amber-200">
                  Contenido para adultos (marca TMDb)
                </span>
              )}
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">{name}</h1>
              {person.knownForDepartment && (
                <p className="text-sm font-medium text-red-400/90">{person.knownForDepartment}</p>
              )}
            </div>

            <nav
              aria-label="Secciones de la ficha de persona"
              className="flex flex-wrap gap-2 text-xs text-zinc-300"
            >
              <a
                href="#person-bio"
                className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400"
              >
                Biografía
              </a>
              <a
                href="#person-cast"
                className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400"
              >
                Interpretación ({credits.cast.length})
              </a>
              <a
                href="#person-crew"
                className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400"
              >
                Equipo ({credits.crew.length})
              </a>
              <a
                href="#person-profiles"
                className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400"
              >
                Fotos perfil ({profileImages.length})
              </a>
              <a
                href="#person-tagged"
                className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400"
              >
                En rodaje ({taggedImages.length})
              </a>
              <a
                href="#person-links"
                className="focus-ring premium-transition rounded-full border border-zinc-600/70 px-3 py-1 hover:border-zinc-400"
              >
                Enlaces
              </a>
            </nav>

            <dl className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Popularidad TMDb</dt>
                <dd>{popularityText}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Género</dt>
                <dd>{person.genderLabel}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Nacimiento</dt>
                <dd>{formatDisplayDate(person.birthday) || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Fallecimiento</dt>
                <dd>{formatDisplayDate(person.deathday) || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Lugar de nacimiento</dt>
                <dd>{person.placeOfBirth || "—"}</dd>
              </div>
            </dl>

            {person.alsoKnownAs.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">También conocido/a como</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {person.alsoKnownAs.map((alias) => (
                    <li
                      key={alias}
                      className="rounded-full border border-zinc-700/80 bg-black/30 px-3 py-1 text-xs text-zinc-300"
                    >
                      {alias}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-zinc-800/80 bg-zinc-950">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-10 xl:max-w-[1200px]">
          <section id="person-bio" className="anchor-target space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">Biografía</h2>
            {bioParagraphs.length > 0 ? (
              <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                {bioParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No hay biografía disponible en TMDb para este perfil.</p>
            )}
          </section>

          <section id="person-cast" className="anchor-target space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
              Filmografía — interpretación
              <span className="ml-2 text-sm font-normal text-zinc-500">({credits.cast.length})</span>
            </h2>
            {credits.cast.length > 0 ? (
              <ul className="space-y-2">
                {credits.cast.map((c) => (
                  <CastCreditRow key={c.creditId} credit={c} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">Sin créditos como intérprete.</p>
            )}
          </section>

          <section id="person-crew" className="anchor-target space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">
              Filmografía — equipo y otros
              <span className="ml-2 text-sm font-normal text-zinc-500">({credits.crew.length})</span>
            </h2>
            {credits.crew.length > 0 ? (
              <ul className="space-y-2">
                {credits.crew.map((c) => (
                  <CrewCreditRow key={`${c.creditId}-${c.mediaType}-${c.mediaId}`} credit={c} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">Sin créditos de equipo registrados.</p>
            )}
          </section>

          <section id="person-profiles" className="anchor-target space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">Fotos de perfil</h2>
            {profileImages.length > 0 ? (
              <div
                className="horizontal-scroll-row"
                role="list"
                aria-label="Galería de fotos de perfil desde TMDb"
              >
                {profileImages.map((img, idx) => (
                  <div
                    key={`${img.filePath}-${idx}`}
                    className="horizontal-scroll-item w-[42vw] max-w-[200px] shrink-0"
                    role="listitem"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                      <Image
                        src={img.filePath}
                        alt={`Foto de perfil ${idx + 1}${img.width ? ` (${img.width}×${img.height})` : ""}`}
                        fill
                        className="object-cover"
                        sizes="200px"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-1 text-center text-[10px] text-zinc-500">
                      {img.voteCount > 0 ? `Votos: ${img.voteCount}` : "TMDb"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No hay imágenes de perfil adicionales.</p>
            )}
          </section>

          <section id="person-tagged" className="anchor-target space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">Imágenes en contexto (rodaje)</h2>
            {taggedImages.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {taggedImages.map((img, idx) => (
                  <li key={`${img.filePath}-${idx}`} className="space-y-2">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                      <Image
                        src={img.filePath}
                        alt={`Imagen de ${img.mediaTitle}`}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 45vw, 25vw"
                        loading="lazy"
                      />
                    </div>
                    <Link
                      href={mediaHref(img.mediaType, img.mediaId)}
                      className="focus-ring line-clamp-2 text-xs font-medium text-zinc-400 hover:text-zinc-100"
                    >
                      {img.mediaTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-500">No hay imágenes etiquetadas en medios.</p>
            )}
          </section>

          <section id="person-links" className="anchor-target space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">Enlaces</h2>
            <ExternalLinksBlock person={person} externalIds={externalIds} />
            {(externalIds.freebaseId ||
              externalIds.freebaseMid ||
              externalIds.tvrageId ||
              externalIds.youtubeId) && (
              <div className="rounded-xl border border-dashed border-zinc-800/90 bg-zinc-950/50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Identificadores (TMDb)</h3>
                <dl className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
                  {externalIds.freebaseMid.trim() && (
                    <div>
                      <dt className="text-zinc-600">Freebase MID</dt>
                      <dd className="font-mono text-[11px] text-zinc-300">{externalIds.freebaseMid}</dd>
                    </div>
                  )}
                  {externalIds.freebaseId.trim() && (
                    <div>
                      <dt className="text-zinc-600">Freebase ID</dt>
                      <dd className="font-mono text-[11px] text-zinc-300">{externalIds.freebaseId}</dd>
                    </div>
                  )}
                  {externalIds.tvrageId.trim() && (
                    <div>
                      <dt className="text-zinc-600">TVRage ID</dt>
                      <dd className="font-mono text-[11px] text-zinc-300">{externalIds.tvrageId}</dd>
                    </div>
                  )}
                  {externalIds.youtubeId.trim() && (
                    <div>
                      <dt className="text-zinc-600">YouTube</dt>
                      <dd className="font-mono text-[11px] text-zinc-300">{externalIds.youtubeId}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
