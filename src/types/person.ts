/** Crédito como intérprete (película o serie). */
export interface PersonCastCredit {
  creditId: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  backdropPath: string;
  character: string;
  overview: string;
  voteAverage: number;
  popularity: number;
  /** Fecha de estreno o primera emisión (para ordenar). */
  releaseDate: string;
  episodeCount: number;
}

/** Crédito de equipo (dirección, producción, etc.). */
export interface PersonCrewCredit {
  creditId: string;
  mediaType: "movie" | "tv";
  mediaId: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  backdropPath: string;
  job: string;
  department: string;
  overview: string;
  voteAverage: number;
  popularity: number;
  releaseDate: string;
}

export interface PersonProfileImage {
  filePath: string;
  aspectRatio: number;
  height: number;
  width: number;
  voteAverage: number;
  voteCount: number;
}

export interface PersonTaggedImage {
  filePath: string;
  aspectRatio: number;
  height: number;
  width: number;
  mediaType: "movie" | "tv";
  mediaId: number;
  mediaTitle: string;
}

export interface PersonExternalIds {
  imdbId: string;
  facebookId: string;
  instagramId: string;
  twitterId: string;
  youtubeId: string;
  freebaseId: string;
  freebaseMid: string;
  tvrageId: string;
  wikidataId: string;
}

/** Ficha normalizada de persona (GET /person/{id}). */
export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  alsoKnownAs: string[];
  birthday: string;
  deathday: string;
  genderLabel: string;
  placeOfBirth: string;
  homepage: string;
  adult: boolean;
  knownForDepartment: string;
  popularity: number;
  profilePath: string;
  imdbId: string;
}

export interface PersonCombinedCredits {
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export interface PersonFullPayload {
  detail: PersonDetail | null;
  credits: PersonCombinedCredits;
  profileImages: PersonProfileImage[];
  taggedImages: PersonTaggedImage[];
  externalIds: PersonExternalIds;
}
