import type { Metadata } from "next";
import { cache } from "react";
import { PersonDetail } from "@/components/PersonDetail";
import { StateMessage } from "@/components/StateMessage";
import { getOptionalTmdbBearerToken } from "@/lib/env";
import type { PersonExternalIds } from "@/types/person";
import {
  getPersonById,
  getPersonCombinedCreditsById,
  getPersonExternalIdsById,
  getPersonProfileImagesById,
  getPersonTaggedImagesById,
  resolvePersonHeroBackdropUrl
} from "@/lib/tmdb";

type PersonPageProps = {
  params: Promise<{ id: string }>;
};

function parsePersonId(idParam: string): number | null {
  const parsed = Number(idParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

const getPersonByIdCached = cache(async (id: number) => getPersonById(id));

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  const personId = parsePersonId(idParam);
  if (!personId) {
    return {
      title: "Persona — CineScope",
      description: "Ficha de actor o actriz en CineScope."
    };
  }

  const person = await getPersonByIdCached(personId);
  if (!person) {
    return {
      title: "Persona no disponible — CineScope",
      description: "No se pudo cargar esta persona."
    };
  }

  const bio = person.biography.trim();
  const description =
    bio.length > 0
      ? bio.length > 160
        ? `${bio.slice(0, 160)}…`
        : bio
      : `${person.name}. Filmografía, biografía y datos de The Movie Database (TMDb) en CineScope.`;

  return {
    title: `${person.name} — CineScope`,
    description,
    openGraph: {
      title: person.name,
      description
    }
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id: idParam } = await params;
  const personId = parsePersonId(idParam);
  const hasToken = Boolean(getOptionalTmdbBearerToken());

  const emptyExternal: PersonExternalIds = {
    imdbId: "",
    facebookId: "",
    instagramId: "",
    twitterId: "",
    youtubeId: "",
    freebaseId: "",
    freebaseMid: "",
    tvrageId: "",
    wikidataId: ""
  };

  const [person, credits, profileImages, taggedImages, externalIds] = personId
    ? await Promise.all([
        getPersonByIdCached(personId),
        getPersonCombinedCreditsById(personId),
        getPersonProfileImagesById(personId),
        getPersonTaggedImagesById(personId),
        getPersonExternalIdsById(personId)
      ])
    : [null, { cast: [], crew: [] }, [], [], emptyExternal];

  const heroBackdropUrl = person ? await resolvePersonHeroBackdropUrl(credits) : null;

  return (
    <main className="-mt-28 lg:-mt-20 home-cinematic-shell">
      {(!hasToken || !personId || (personId && !person)) && (
        <div className="home-content-container space-y-4 pt-6">
          {!hasToken && (
            <StateMessage variant="warning">
              Falta configurar <code>TMDB_BEARER_TOKEN</code> en <code>.env.local</code>.
            </StateMessage>
          )}

          {!personId && <StateMessage variant="empty">El ID de la persona no es válido.</StateMessage>}

          {personId && !person && (
            <StateMessage variant="error">
              No se pudo cargar la ficha solicitada. Puede no existir o no estar disponible en TMDb.
            </StateMessage>
          )}
        </div>
      )}

      {person && (
        <PersonDetail
          person={person}
          credits={credits}
          profileImages={profileImages}
          taggedImages={taggedImages}
          externalIds={externalIds}
          heroBackdropUrl={heroBackdropUrl}
        />
      )}
    </main>
  );
}
