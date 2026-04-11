/**
 * Textos de UI alineados con el codigo TMDb de la cookie (`es-ES`, `es-MX` → español; `en-US` → inglés).
 * Sin dependencias de Next: valido en cliente y servidor.
 */

export type UiMessages = {
  intlLocale: string;
  navAriaLabel: string;
  navHome: string;
  navMovies: string;
  navSeries: string;
  navFavorites: string;
  footerNavAria: string;
  footerAbout: string;
  searchFormAria: string;
  searchInputLabel: string;
  searchPlaceholder: string;
  languageSrLabel: string;
  languageAriaLabel: string;
  genreTitle: (name: string) => string;
  genreEmpty: (name: string) => string;
  genreEmptySeries: (name: string) => string;
  genreResultsMovies: string;
  genreResultsTv: string;
  genreRailAriaMovies: string;
  genreRailAriaSeries: string;
  genreBrowseHint: string;
  genreRailScrollPrev: string;
  genreRailScrollNext: string;
  sectionTrendingMovies: string;
  emptyTrendingMovies: string;
  sectionTrendingTv: string;
  emptyTrendingTv: string;
  sectionPopularMovies: string;
  emptyPopularMovies: string;
  sectionPopularTv: string;
  emptyPopularTv: string;
  sectionTopRatedMovies: string;
  emptyTopRatedMovies: string;
  sectionTopRatedTv: string;
  emptyTopRatedTv: string;
  sectionNowPlaying: string;
  emptyNowPlaying: string;
  sectionAiringTodayTv: string;
  emptyAiringTodayTv: string;
  sectionUpcoming: string;
  emptyUpcoming: string;
  sectionOnTheAirTv: string;
  emptyOnTheAirTv: string;
  featuredWeekPick: string;
  featuredMoviesRec: string;
  featuredSeriesRec: string;
  favoritesStripFeatured: string;
  tokenWarningBefore: string;
  tokenWarningAfter: string;
  errorLoadTmdb: string;
  emptyNoResults: string;
  errorLoadMovies: string;
  emptyNoMovies: string;
  errorLoadSeries: string;
  emptyNoSeries: string;
  searchEmptyPrompt: string;
  searchErrorTv: string;
  searchErrorMovie: string;
  searchErrorPerson: string;
  searchErrorAll: string;
  searchFetchError: (kindPhrase: string) => string;
  searchHeading: string;
  searchMatchesSection: string;
  metaSearchTitle: string;
  metaSearchDescription: string;
  metaSearchTitleWithQuery: (query: string) => string;
  metaSearchDescriptionWithQuery: (query: string, typeNote: string) => string;
  searchTypeNoteMovie: string;
  searchTypeNoteTv: string;
  searchTypeNotePerson: string;
  searchTypeNoteAll: string;
  filtersFormAria: string;
  filterContentTypeGroup: string;
  filterTypeLabel: string;
  filterTypeAll: string;
  filterTypeAllTitle: string;
  filterTypeMovie: string;
  filterTypeMovieTitle: string;
  filterTypeTv: string;
  filterTypeTvTitle: string;
  filterTypePerson: string;
  filterTypePersonTitle: string;
  filterYearLabel: string;
  filterYearAny: string;
  filterMinVoteLabel: string;
  filterMinVoteAny: string;
  filterApply: string;
  filterClear: string;
  searchResultsFor: (query: string) => string;
  searchResultCount: string;
  searchResultCountPlural: string;
  searchShownWithFilters: string;
  searchLocalFilter: string;
  searchGridView: string;
  searchPageOf: (current: number, total: number) => string;
  searchPageCurrent: (current: number) => string;
  searchSuggestionsTitle: string;
  searchSuggestion1: string;
  searchSuggestion2: string;
  searchSuggestion3: string;
  searchGoMovies: string;
  searchGoSeries: string;
  searchRetryLoad: string;
  searchLoadingMore: string;
  searchLoadMore: string;
  searchEmptyMovie: (query: string) => string;
  searchEmptyTv: (query: string) => string;
  searchEmptyPerson: (query: string) => string;
  searchEmptyAll: (query: string) => string;
  searchNextPageError: string;
  searchLoadMoreError: string;
  searchAnnounceError: (message: string) => string;
  searchAnnounceFiltered: (visible: number, queryLabel: string) => string;
  searchAnnounceDefault: (visible: number, total: number, queryLabel: string) => string;
  searchQueryFallback: string;
  favoriteAdd: (title: string) => string;
  favoriteRemove: (title: string) => string;
  featuredStripDefaultLabel: string;
  featuredStripOverviewFallback: string;
  featuredStripSeeDetail: string;
  featuredStripImageAlt: (title: string) => string;
  untitled: string;
  sectionAriaRow: (sectionTitle: string) => string;
  sectionAriaGrid: (sectionTitle: string) => string;
  carouselAria: string;
  carouselPickFeatured: string;
  carouselGoToSlide: (indexOneBased: number, total: number) => string;
  carouselFeaturedMovie: string;
  carouselFeaturedTv: string;
  carouselSeeDetail: string;
  carouselOverviewFallbackMovie: string;
  carouselOverviewFallbackTv: string;
  carouselRuntimeNA: string;
  carouselGenreNA: string;
  trailerWatch: string;
  trailerClose: string;
  trailerDialogTitle: (title: string) => string;
  cardSeeDetailAria: (kind: "movie" | "tv" | "person", title: string) => string;
  cardPosterAlt: (title: string) => string;
  cardPosterMissing: string;
  cardPersonDepartmentNA: string;
  cardPersonProfileAlt: (name: string) => string;
  cardPersonPhotoMissing: string;
  cardOverviewMissing: string;
  cardRuntimeNA: string;
  cardYearNA: string;
  cardKindMovie: string;
  cardKindTv: string;
  favoritesTitle: string;
  favoritesIntro: string;
  favoritesFutureNote: string;
  favoritesTitleSingular: string;
  favoritesTitlePlural: string;
  favoritesCountMoviesSeries: (movies: number, series: number) => string;
  favoritesPendingLoad: (count: number) => string;
  favoritesDiscoverNavAria: string;
  favoritesExploreMovies: string;
  favoritesExploreSeries: string;
  favoritesSearch: string;
  favoritesControlsAria: string;
  favoritesFilterLabel: string;
  favoritesFilterAll: string;
  favoritesFilterMovies: string;
  favoritesFilterTv: string;
  favoritesSortLabel: string;
  favoritesSortSaved: string;
  favoritesSortTitle: string;
  favoritesSortRating: string;
  favoritesSortRelease: string;
  favoritesExportJson: string;
  favoritesShareList: string;
  favoritesShareTitle: string;
  favoritesShareCopied: string;
  favoritesLoadError: string;
  favoritesEmptyLoadError: string;
  favoritesEmptyFilter: string;
  favoritesEmptyNone: string;
  favoritesSectionTitle: string;
  metaHomeTitle: string;
  metaMoviesTitle: string;
  metaMoviesDescription: string;
  metaSeriesTitle: string;
  metaSeriesDescription: string;
  metaFavoritesTitle: string;
  metaFavoritesDescription: string;
  detailNotAvailable: string;
  detailUnknownDate: string;
  detailReleaseTheater: string;
  detailFirstAir: string;
  detailRatingSr: string;
  detailNavMovie: string;
  detailNavTv: string;
  detailNavSummary: string;
  detailNavCast: string;
  detailNavFacts: string;
  detailNavMedia: string;
  detailNavSimilar: string;
  detailOriginalTitle: string;
  detailGenres: string;
  detailSeasons: string;
  detailEpisodes: string;
  detailDuration: string;
  detailDurationEpisode: string;
  detailAiredOn: string;
  detailLanguage: string;
  detailVotes: string;
  detailStatus: string;
  detailPopularity: string;
  detailCountries: string;
  detailLastAired: string;
  detailCreators: string;
  detailDirectors: string;
  detailWriters: string;
  detailOverviewFallbackMovie: string;
  detailOverviewFallbackTv: string;
  detailWatchMovie: string;
  detailWatchTv: string;
  detailSeeSimilar: string;
  detailNoCast: string;
  detailWatchSubscription: string;
  detailWatchRent: string;
  detailWatchBuy: string;
  detailNoProviders: string;
  detailMediaHeading: string;
  detailMediaGalleryMovie: string;
  detailMediaGalleryTv: string;
  detailBackdropMissing: string;
  detailPosterMissing: string;
  detailBackdropAlt: (title: string) => string;
  detailPosterAlt: (title: string) => string;
  detailBreadcrumbSeries: string;
  detailVotesNone: string;
  detailMigas: string;
  similarMoviesTitle: (title: string) => string;
  similarMoviesEmpty: string;
  similarTvTitle: (title: string) => string;
  similarTvEmpty: string;
  movieInvalidId: string;
  movieLoadError: string;
  tvInvalidId: string;
  tvLoadError: string;
  metaMovieNotFoundTitle: string;
  metaMovieNotFoundDesc: string;
  metaMovieUnavailableTitle: string;
  metaMovieUnavailableDesc: string;
  metaTvNotFoundTitle: string;
  metaTvNotFoundDesc: string;
  metaTvUnavailableTitle: string;
  metaTvUnavailableDesc: string;
  metaMovieFallbackDescription: (title: string) => string;
  metaTvFallbackDescription: (title: string) => string;
};

const ES: UiMessages = {
  intlLocale: "es-ES",
  navAriaLabel: "Navegación principal",
  navHome: "Inicio",
  navMovies: "Películas",
  navSeries: "Series",
  navFavorites: "Favoritos",
  footerNavAria: "Enlaces del pie",
  footerAbout: "Acerca de",
  searchFormAria: "Buscar películas",
  searchInputLabel: "Buscar película por título",
  searchPlaceholder: "Busca una película…",
  languageSrLabel: "Idioma del contenido (TMDb)",
  languageAriaLabel: "Idioma del contenido",
  genreTitle: (name) => `Género: ${name}`,
  genreEmpty: (name) => `No hay películas para el género ${name} en este momento.`,
  genreEmptySeries: (name) => `No hay series para el género ${name} en este momento.`,
  genreResultsMovies: "Películas en esta categoría",
  genreResultsTv: "Series en esta categoría",
  genreRailAriaMovies: "Categorías de películas",
  genreRailAriaSeries: "Categorías de series",
  genreBrowseHint: "Desliza para ver más categorías",
  genreRailScrollPrev: "Ver categorías anteriores",
  genreRailScrollNext: "Ver categorías siguientes",
  sectionTrendingMovies: "Tendencias de películas",
  emptyTrendingMovies: "No hay películas en tendencia para mostrar en este momento.",
  sectionTrendingTv: "Series en tendencia",
  emptyTrendingTv: "No hay series en tendencia para mostrar por ahora.",
  sectionPopularMovies: "Películas populares",
  emptyPopularMovies: "No se encontraron películas populares en este momento.",
  sectionPopularTv: "Series populares",
  emptyPopularTv: "No se encontraron series populares en este momento.",
  sectionTopRatedMovies: "Películas mejor valoradas",
  emptyTopRatedMovies: "No hay películas mejor valoradas para mostrar.",
  sectionTopRatedTv: "Series mejor valoradas",
  emptyTopRatedTv: "No hay series mejor valoradas para mostrar.",
  sectionNowPlaying: "En cartelera",
  emptyNowPlaying: "No hay películas en cartelera disponibles en este momento.",
  sectionAiringTodayTv: "Series emitiendo hoy",
  emptyAiringTodayTv: "No hay episodios en emisión para hoy.",
  sectionUpcoming: "Próximamente",
  emptyUpcoming: "No hay próximos lanzamientos para mostrar.",
  sectionOnTheAirTv: "Series en emisión",
  emptyOnTheAirTv: "No hay series en emisión disponibles en este momento.",
  featuredWeekPick: "Selección de la semana",
  featuredMoviesRec: "Recomendación de películas",
  featuredSeriesRec: "Recomendación de series",
  favoritesStripFeatured: "Destacado de tu lista",
  tokenWarningBefore: "Falta configurar ",
  tokenWarningAfter: " en .env.local.",
  errorLoadTmdb: "Ocurrió un error al cargar datos de TMDb. Intenta nuevamente en unos segundos.",
  emptyNoResults: "No hay resultados para mostrar por ahora.",
  errorLoadMovies: "Ocurrió un error al cargar películas desde TMDb. Intenta nuevamente en unos segundos.",
  emptyNoMovies: "No hay películas para mostrar por ahora.",
  errorLoadSeries: "Ocurrió un error al cargar series desde TMDb. Intenta nuevamente en unos segundos.",
  emptyNoSeries: "No hay series para mostrar por ahora.",
  searchEmptyPrompt: "Ingresa un término para comenzar la búsqueda.",
  searchErrorTv: "series",
  searchErrorMovie: "películas",
  searchErrorPerson: "personas",
  searchErrorAll: "películas, series o personas",
  searchFetchError: (kind) => `Ocurrió un error al buscar ${kind}. Intenta nuevamente.`,
  searchHeading: "Búsqueda",
  searchMatchesSection: "Coincidencias",
  metaSearchTitle: "Búsqueda",
  metaSearchDescription: "Busca películas, series y personas con filtros por tipo, año y valoración.",
  metaSearchTitleWithQuery: (query) => `"${query}"`,
  metaSearchDescriptionWithQuery: (query, typeNote) => `Resultados para «${query}»${typeNote} en CineScope.`,
  searchTypeNoteMovie: " (solo películas)",
  searchTypeNoteTv: " (solo series)",
  searchTypeNotePerson: " (solo personas)",
  searchTypeNoteAll: "",
  filtersFormAria: "Filtros de resultados de búsqueda",
  filterContentTypeGroup: "Tipo de contenido",
  filterTypeLabel: "Tipo",
  filterTypeAll: "Todo",
  filterTypeAllTitle: "Películas, series y personas",
  filterTypeMovie: "Películas",
  filterTypeMovieTitle: "Solo películas",
  filterTypeTv: "Series",
  filterTypeTvTitle: "Solo series",
  filterTypePerson: "Personas",
  filterTypePersonTitle: "Solo personas",
  filterYearLabel: "Año",
  filterYearAny: "Cualquiera",
  filterMinVoteLabel: "Valoración mín.",
  filterMinVoteAny: "Cualquiera",
  filterApply: "Aplicar",
  filterClear: "Limpiar",
  searchResultsFor: (query) => `Resultados para "${query}"`,
  searchResultCount: "resultado",
  searchResultCountPlural: "resultados",
  searchShownWithFilters: " mostrados",
  searchLocalFilter: "Filtro local · ",
  searchGridView: "Vista en grid · ",
  searchPageOf: (c, t) => `Página ${c} de ${t}`,
  searchPageCurrent: (c) => `Página ${c}`,
  searchSuggestionsTitle: "Sugerencias de búsqueda",
  searchSuggestion1: "Prueba sin acentos o con el título original.",
  searchSuggestion2: "Usa menos palabras y evita signos especiales.",
  searchSuggestion3: "Ajusta los filtros o explora películas y series desde el menú.",
  searchGoMovies: "Ver películas",
  searchGoSeries: "Ver series",
  searchRetryLoad: "Reintentar carga",
  searchLoadingMore: "Cargando más resultados…",
  searchLoadMore: "Cargar más resultados",
  searchEmptyMovie: (q) =>
    `No se encontraron películas para "${q}". Intenta con menos palabras, el título original o un término más general.`,
  searchEmptyTv: (q) =>
    `No se encontraron series para "${q}". Prueba el título original o un término más corto.`,
  searchEmptyPerson: (q) =>
    `No se encontraron personas para "${q}". Prueba el nombre completo o un apellido.`,
  searchEmptyAll: (q) =>
    `No se encontraron películas, series ni personas para "${q}". Intenta con menos palabras o un término más general.`,
  searchNextPageError: "No se pudo cargar la siguiente página.",
  searchLoadMoreError: "No se pudieron cargar más resultados.",
  searchAnnounceError: (msg) => `Error: ${msg}`,
  searchAnnounceFiltered: (n, q) => `${n} resultados visibles con filtros para ${q}.`,
  searchAnnounceDefault: (shown, total, q) => `Mostrando ${shown} de ${total} resultados para ${q}.`,
  searchQueryFallback: "búsqueda",
  favoriteAdd: (title) => `Añadir ${title} a favoritos`,
  favoriteRemove: (title) => `Quitar ${title} de favoritos`,
  featuredStripDefaultLabel: "Recomendación destacada",
  featuredStripOverviewFallback: "Descubre más de este título destacado.",
  featuredStripSeeDetail: "Ver detalle",
  featuredStripImageAlt: (title) => `Imagen destacada de ${title}`,
  untitled: "Sin título",
  sectionAriaRow: (t) => `Fila de títulos: ${t}`,
  sectionAriaGrid: (t) => `Grid de títulos: ${t}`,
  carouselAria: "Destacados",
  carouselPickFeatured: "Seleccionar destacado",
  carouselGoToSlide: (i, t) => `Ir al destacado ${i} de ${t}`,
  carouselFeaturedMovie: "Película destacada",
  carouselFeaturedTv: "Serie destacada",
  carouselSeeDetail: "Ver detalle",
  carouselOverviewFallbackMovie: "Sin sinopsis disponible para esta película.",
  carouselOverviewFallbackTv: "Sin sinopsis disponible para esta serie.",
  carouselRuntimeNA: "Duración N/D",
  carouselGenreNA: "Género N/D",
  trailerWatch: "Ver tráiler",
  trailerClose: "Cerrar",
  trailerDialogTitle: (title) => `Tráiler de ${title}`,
  cardSeeDetailAria: (kind, title) =>
    kind === "person"
      ? `Ver ficha de la persona ${title}`
      : `Ver detalle de ${kind === "tv" ? "serie" : "película"} ${title}`,
  cardPosterAlt: (title) => `Póster de ${title}`,
  cardPosterMissing: "Póster no disponible",
  cardPersonDepartmentNA: "Créditos N/D",
  cardPersonProfileAlt: (name) => `Foto de ${name}`,
  cardPersonPhotoMissing: "Foto no disponible",
  cardOverviewMissing: "Sinopsis no disponible.",
  cardRuntimeNA: "Duración N/D",
  cardYearNA: "N/D",
  cardKindMovie: "película",
  cardKindTv: "serie",
  favoritesTitle: "Mis favoritos",
  favoritesIntro:
    "Los títulos se guardan en este dispositivo (navegador) y los datos se obtienen de ",
  favoritesFutureNote: ". En el futuro podrás sincronizar o cambiar idioma desde tu cuenta.",
  favoritesTitleSingular: "título",
  favoritesTitlePlural: "títulos",
  favoritesCountMoviesSeries: (m, s) => `${m} películas · ${s} series`,
  favoritesPendingLoad: (n) =>
    `${n} guardados en este dispositivo; pendiente de cargar desde TMDb.`,
  favoritesDiscoverNavAria: "Descubrir contenido",
  favoritesExploreMovies: "Explorar películas",
  favoritesExploreSeries: "Explorar series",
  favoritesSearch: "Buscar",
  favoritesControlsAria: "Ordenar, filtrar y exportar favoritos",
  favoritesFilterLabel: "Tipo",
  favoritesFilterAll: "Todos",
  favoritesFilterMovies: "Solo películas",
  favoritesFilterTv: "Solo series",
  favoritesSortLabel: "Orden",
  favoritesSortSaved: "Orden guardado",
  favoritesSortTitle: "Título (A-Z)",
  favoritesSortRating: "Valoración (mayor)",
  favoritesSortRelease: "Fecha de estreno",
  favoritesExportJson: "Exportar JSON",
  favoritesShareList: "Compartir lista",
  favoritesShareTitle: "Mis favoritos — CineScope",
  favoritesShareCopied: "Lista copiada al portapapeles.",
  favoritesLoadError: "Ocurrió un error al cargar tus favoritos desde TMDb. Intenta nuevamente en unos segundos.",
  favoritesEmptyLoadError:
    "Tienes favoritos guardados pero no se pudieron cargar desde TMDb. Revisa la conexión o el token, o vuelve a añadirlos.",
  favoritesEmptyFilter: "No hay títulos con este filtro. Prueba «Todos» u otro orden.",
  favoritesEmptyNone: "Aún no tienes favoritos. Usa la estrella en las tarjetas o en la ficha de película o serie.",
  favoritesSectionTitle: "Títulos en tu lista",
  metaHomeTitle: "Inicio",
  metaMoviesTitle: "Películas",
  metaMoviesDescription:
    "Descubre películas en CineScope: carruseles, tendencias, géneros y datos en tiempo real desde TMDb.",
  metaSeriesTitle: "Series",
  metaSeriesDescription:
    "Explora series en CineScope: populares, en emisión, top y más con información actualizada desde TMDb.",
  metaFavoritesTitle: "Mis favoritos",
  metaFavoritesDescription:
    "Películas y series que marcaste como favoritas en CineScope (almacenamiento local).",
  detailNotAvailable: "No disponible",
  detailUnknownDate: "Fecha desconocida",
  detailReleaseTheater: "Fecha de estreno",
  detailFirstAir: "Primera emisión",
  detailRatingSr: "Calificación",
  detailNavMovie: "Navegación interna de detalle de película",
  detailNavTv: "Navegación interna de detalle de serie",
  detailNavSummary: "Resumen",
  detailNavCast: "Reparto",
  detailNavFacts: "Datos",
  detailNavMedia: "Medios",
  detailNavSimilar: "Similares",
  detailOriginalTitle: "Título original:",
  detailGenres: "Géneros",
  detailSeasons: "Temporadas",
  detailEpisodes: "Episodios",
  detailDuration: "Duración",
  detailDurationEpisode: "Duración por episodio",
  detailAiredOn: "Emisión en",
  detailLanguage: "Idioma",
  detailVotes: "Votos",
  detailStatus: "Estado",
  detailPopularity: "Popularidad",
  detailCountries: "Países de producción",
  detailLastAired: "Última emisión",
  detailCreators: "Creadores",
  detailDirectors: "Dirección",
  detailWriters: "Guión",
  detailOverviewFallbackMovie: "No hay sinopsis disponible para esta película.",
  detailOverviewFallbackTv: "No hay sinopsis disponible para esta serie.",
  detailWatchMovie: "Dónde verla",
  detailWatchTv: "Dónde ver",
  detailSeeSimilar: "Ver similares",
  detailNoCast: "No hay información de reparto disponible.",
  detailWatchSubscription: "Suscripción:",
  detailWatchRent: "Alquiler:",
  detailWatchBuy: "Compra:",
  detailNoProviders: "No hay proveedores disponibles para la región configurada.",
  detailMediaHeading: "Medios",
  detailMediaGalleryMovie: "Galería de imágenes de la película",
  detailMediaGalleryTv: "Galería de imágenes de la serie",
  detailBackdropMissing: "Fondo no disponible",
  detailPosterMissing: "Póster no disponible",
  detailBackdropAlt: (title) => `Fondo de ${title}`,
  detailPosterAlt: (title) => `Póster de ${title}`,
  detailBreadcrumbSeries: "Series",
  detailVotesNone: "Sin votos",
  detailMigas: "Migas de pan",
  similarMoviesTitle: (title) => `Similares a "${title}"`,
  similarMoviesEmpty: "No se encontraron películas similares relevantes para este título.",
  similarTvTitle: (title) => `Similares a "${title}"`,
  similarTvEmpty: "No se encontraron series similares relevantes para este título.",
  movieInvalidId: "El ID de la película no es válido.",
  movieLoadError: "No se pudo cargar la película solicitada. Puede no existir o estar temporalmente no disponible.",
  tvInvalidId: "El ID de la serie no es válido.",
  tvLoadError: "No se pudo cargar la serie solicitada. Puede no existir o estar temporalmente no disponible.",
  metaMovieNotFoundTitle: "Película no encontrada",
  metaMovieNotFoundDesc: "El identificador de la película no es válido.",
  metaMovieUnavailableTitle: "Película no disponible",
  metaMovieUnavailableDesc: "No se pudo cargar esta película o no existe en TMDb.",
  metaTvNotFoundTitle: "Serie no encontrada",
  metaTvNotFoundDesc: "El identificador de la serie no es válido.",
  metaTvUnavailableTitle: "Serie no disponible",
  metaTvUnavailableDesc: "No se pudo cargar esta serie o no existe en TMDb.",
  metaMovieFallbackDescription: (title) =>
    `${title}. Ficha, reparto, trailers y títulos similares en CineScope.`,
  metaTvFallbackDescription: (title) =>
    `${title}. Ficha, reparto, trailers y títulos similares en CineScope.`
};

const EN: UiMessages = {
  intlLocale: "en-US",
  navAriaLabel: "Main navigation",
  navHome: "Home",
  navMovies: "Movies",
  navSeries: "TV shows",
  navFavorites: "Favorites",
  footerNavAria: "Footer links",
  footerAbout: "About",
  searchFormAria: "Search movies and TV",
  searchInputLabel: "Search by title",
  searchPlaceholder: "Search for a title…",
  languageSrLabel: "Content language (TMDb)",
  languageAriaLabel: "Content language",
  genreTitle: (name) => `Genre: ${name}`,
  genreEmpty: (name) => `No movies for genre ${name} right now.`,
  genreEmptySeries: (name) => `No TV shows for genre ${name} right now.`,
  genreResultsMovies: "Movies in this category",
  genreResultsTv: "TV shows in this category",
  genreRailAriaMovies: "Movie categories",
  genreRailAriaSeries: "TV categories",
  genreBrowseHint: "Swipe to see more categories",
  genreRailScrollPrev: "Show previous categories",
  genreRailScrollNext: "Show next categories",
  sectionTrendingMovies: "Trending movies",
  emptyTrendingMovies: "No trending movies to show right now.",
  sectionTrendingTv: "Trending TV shows",
  emptyTrendingTv: "No trending TV shows to show right now.",
  sectionPopularMovies: "Popular movies",
  emptyPopularMovies: "No popular movies found right now.",
  sectionPopularTv: "Popular TV shows",
  emptyPopularTv: "No popular TV shows found right now.",
  sectionTopRatedMovies: "Top rated movies",
  emptyTopRatedMovies: "No top rated movies to show.",
  sectionTopRatedTv: "Top rated TV shows",
  emptyTopRatedTv: "No top rated TV shows to show.",
  sectionNowPlaying: "Now playing",
  emptyNowPlaying: "No movies in theaters available right now.",
  sectionAiringTodayTv: "Airing today",
  emptyAiringTodayTv: "No episodes airing today.",
  sectionUpcoming: "Coming soon",
  emptyUpcoming: "No upcoming releases to show.",
  sectionOnTheAirTv: "On the air",
  emptyOnTheAirTv: "No TV shows on the air available right now.",
  featuredWeekPick: "Pick of the week",
  featuredMoviesRec: "Movie picks",
  featuredSeriesRec: "TV picks",
  favoritesStripFeatured: "Featured from your list",
  tokenWarningBefore: "Please set ",
  tokenWarningAfter: " in .env.local.",
  errorLoadTmdb: "Could not load data from TMDb. Try again in a few seconds.",
  emptyNoResults: "Nothing to show for now.",
  errorLoadMovies: "Could not load movies from TMDb. Try again in a few seconds.",
  emptyNoMovies: "No movies to show for now.",
  errorLoadSeries: "Could not load TV shows from TMDb. Try again in a few seconds.",
  emptyNoSeries: "No TV shows to show for now.",
  searchEmptyPrompt: "Enter a search term to get started.",
  searchErrorTv: "TV shows",
  searchErrorMovie: "movies",
  searchErrorPerson: "people",
  searchErrorAll: "movies, TV shows, or people",
  searchFetchError: (kind) => `Something went wrong while searching ${kind}. Please try again.`,
  searchHeading: "Search",
  searchMatchesSection: "Matches",
  metaSearchTitle: "Search",
  metaSearchDescription: "Search movies, TV shows, and people with filters by type, year, and rating.",
  metaSearchTitleWithQuery: (query) => `"${query}"`,
  metaSearchDescriptionWithQuery: (query, typeNote) => `Results for “${query}”${typeNote} on CineScope.`,
  searchTypeNoteMovie: " (movies only)",
  searchTypeNoteTv: " (TV only)",
  searchTypeNotePerson: " (people only)",
  searchTypeNoteAll: "",
  filtersFormAria: "Search result filters",
  filterContentTypeGroup: "Content type",
  filterTypeLabel: "Type",
  filterTypeAll: "All",
  filterTypeAllTitle: "Movies, TV, and people",
  filterTypeMovie: "Movies",
  filterTypeMovieTitle: "Movies only",
  filterTypeTv: "TV shows",
  filterTypeTvTitle: "TV only",
  filterTypePerson: "People",
  filterTypePersonTitle: "People only",
  filterYearLabel: "Year",
  filterYearAny: "Any",
  filterMinVoteLabel: "Min. rating",
  filterMinVoteAny: "Any",
  filterApply: "Apply",
  filterClear: "Clear",
  searchResultsFor: (query) => `Results for “${query}”`,
  searchResultCount: "result",
  searchResultCountPlural: "results",
  searchShownWithFilters: " shown",
  searchLocalFilter: "Local filter · ",
  searchGridView: "Grid view · ",
  searchPageOf: (c, t) => `Page ${c} of ${t}`,
  searchPageCurrent: (c) => `Page ${c}`,
  searchSuggestionsTitle: "Search tips",
  searchSuggestion1: "Try without accents or use the original title.",
  searchSuggestion2: "Use fewer words and avoid special characters.",
  searchSuggestion3: "Adjust filters or browse movies and TV from the menu.",
  searchGoMovies: "Browse movies",
  searchGoSeries: "Browse TV shows",
  searchRetryLoad: "Retry",
  searchLoadingMore: "Loading more…",
  searchLoadMore: "Load more",
  searchEmptyMovie: (q) =>
    `No movies found for “${q}”. Try fewer words, the original title, or a broader term.`,
  searchEmptyTv: (q) =>
    `No TV shows found for “${q}”. Try the original title or a shorter term.`,
  searchEmptyPerson: (q) =>
    `No people found for “${q}”. Try a full name or last name.`,
  searchEmptyAll: (q) =>
    `No movies, TV shows, or people found for “${q}”. Try fewer words or a broader term.`,
  searchNextPageError: "Could not load the next page.",
  searchLoadMoreError: "Could not load more results.",
  searchAnnounceError: (msg) => `Error: ${msg}`,
  searchAnnounceFiltered: (n, q) => `${n} visible results with filters for ${q}.`,
  searchAnnounceDefault: (shown, total, q) => `Showing ${shown} of ${total} results for ${q}.`,
  searchQueryFallback: "search",
  favoriteAdd: (title) => `Add ${title} to favorites`,
  favoriteRemove: (title) => `Remove ${title} from favorites`,
  featuredStripDefaultLabel: "Featured pick",
  featuredStripOverviewFallback: "Discover more about this highlight.",
  featuredStripSeeDetail: "View details",
  featuredStripImageAlt: (title) => `Featured image for ${title}`,
  untitled: "Untitled",
  sectionAriaRow: (t) => `Title row: ${t}`,
  sectionAriaGrid: (t) => `Title grid: ${t}`,
  carouselAria: "Featured",
  carouselPickFeatured: "Choose featured slide",
  carouselGoToSlide: (i, t) => `Go to featured slide ${i} of ${t}`,
  carouselFeaturedMovie: "Featured movie",
  carouselFeaturedTv: "Featured TV show",
  carouselSeeDetail: "Open details",
  carouselOverviewFallbackMovie: "No overview available for this movie.",
  carouselOverviewFallbackTv: "No overview available for this show.",
  carouselRuntimeNA: "Runtime N/A",
  carouselGenreNA: "Genre N/A",
  trailerWatch: "Watch trailer",
  trailerClose: "Close",
  trailerDialogTitle: (title) => `Trailer: ${title}`,
  cardSeeDetailAria: (kind, title) =>
    kind === "person"
      ? `View person profile for ${title}`
      : `View ${kind === "tv" ? "TV show" : "movie"} details for ${title}`,
  cardPosterAlt: (title) => `Poster for ${title}`,
  cardPosterMissing: "No poster",
  cardPersonDepartmentNA: "Department N/A",
  cardPersonProfileAlt: (name) => `Photo of ${name}`,
  cardPersonPhotoMissing: "No photo",
  cardOverviewMissing: "No overview available.",
  cardRuntimeNA: "Runtime N/A",
  cardYearNA: "N/A",
  cardKindMovie: "movie",
  cardKindTv: "TV show",
  favoritesTitle: "My favorites",
  favoritesIntro: "Titles are saved on this device (browser) and data comes from ",
  favoritesFutureNote: ". In the future you may sync or change language from your account.",
  favoritesTitleSingular: "title",
  favoritesTitlePlural: "titles",
  favoritesCountMoviesSeries: (m, s) => `${m} movies · ${s} TV shows`,
  favoritesPendingLoad: (n) => `${n} saved on this device; waiting to load from TMDb.`,
  favoritesDiscoverNavAria: "Discover content",
  favoritesExploreMovies: "Explore movies",
  favoritesExploreSeries: "Explore TV shows",
  favoritesSearch: "Search",
  favoritesControlsAria: "Sort, filter, and export favorites",
  favoritesFilterLabel: "Type",
  favoritesFilterAll: "All",
  favoritesFilterMovies: "Movies only",
  favoritesFilterTv: "TV only",
  favoritesSortLabel: "Sort",
  favoritesSortSaved: "Saved order",
  favoritesSortTitle: "Title (A-Z)",
  favoritesSortRating: "Rating (high first)",
  favoritesSortRelease: "Release date",
  favoritesExportJson: "Export JSON",
  favoritesShareList: "Share list",
  favoritesShareTitle: "My favorites — CineScope",
  favoritesShareCopied: "List copied to clipboard.",
  favoritesLoadError: "Could not load your favorites from TMDb. Try again in a few seconds.",
  favoritesEmptyLoadError:
    "You have saved favorites but they could not be loaded from TMDb. Check your connection or token, or add them again.",
  favoritesEmptyFilter: "No titles match this filter. Try “All” or another sort order.",
  favoritesEmptyNone: "No favorites yet. Use the star on cards or on movie and TV detail pages.",
  favoritesSectionTitle: "Titles in your list",
  metaHomeTitle: "Home",
  metaMoviesTitle: "Movies",
  metaMoviesDescription:
    "Discover movies on CineScope: carousels, trends, genres, and live data from TMDb.",
  metaSeriesTitle: "TV shows",
  metaSeriesDescription:
    "Explore TV shows on CineScope: popular, on the air, top rated, and more from TMDb.",
  metaFavoritesTitle: "My favorites",
  metaFavoritesDescription: "Movies and TV shows you starred in CineScope (saved locally).",
  detailNotAvailable: "Not available",
  detailUnknownDate: "Unknown date",
  detailReleaseTheater: "Release date",
  detailFirstAir: "First aired",
  detailRatingSr: "Rating",
  detailNavMovie: "Movie detail navigation",
  detailNavTv: "TV show detail navigation",
  detailNavSummary: "Summary",
  detailNavCast: "Cast",
  detailNavFacts: "Facts",
  detailNavMedia: "Media",
  detailNavSimilar: "Similar",
  detailOriginalTitle: "Original title:",
  detailGenres: "Genres",
  detailSeasons: "Seasons",
  detailEpisodes: "Episodes",
  detailDuration: "Runtime",
  detailDurationEpisode: "Episode runtime",
  detailAiredOn: "Aired on",
  detailLanguage: "Language",
  detailVotes: "Votes",
  detailStatus: "Status",
  detailPopularity: "Popularity",
  detailCountries: "Production countries",
  detailLastAired: "Last aired",
  detailCreators: "Creators",
  detailDirectors: "Directed by",
  detailWriters: "Written by",
  detailOverviewFallbackMovie: "No overview available for this movie.",
  detailOverviewFallbackTv: "No overview available for this TV show.",
  detailWatchMovie: "Where to watch",
  detailWatchTv: "Where to watch",
  detailSeeSimilar: "See similar",
  detailNoCast: "No cast information available.",
  detailWatchSubscription: "Stream:",
  detailWatchRent: "Rent:",
  detailWatchBuy: "Buy:",
  detailNoProviders: "No providers available for the configured region.",
  detailMediaHeading: "Media",
  detailMediaGalleryMovie: "Movie image gallery",
  detailMediaGalleryTv: "TV show image gallery",
  detailBackdropMissing: "Backdrop unavailable",
  detailPosterMissing: "Poster unavailable",
  detailBackdropAlt: (title) => `Backdrop for ${title}`,
  detailPosterAlt: (title) => `Poster for ${title}`,
  detailBreadcrumbSeries: "TV shows",
  detailVotesNone: "No votes",
  detailMigas: "Breadcrumb",
  similarMoviesTitle: (title) => `Similar to “${title}”`,
  similarMoviesEmpty: "No similar movies found for this title.",
  similarTvTitle: (title) => `Similar to “${title}”`,
  similarTvEmpty: "No similar TV shows found for this title.",
  movieInvalidId: "The movie ID is not valid.",
  movieLoadError: "Could not load this movie. It may not exist or be temporarily unavailable.",
  tvInvalidId: "The TV show ID is not valid.",
  tvLoadError: "Could not load this TV show. It may not exist or be temporarily unavailable.",
  metaMovieNotFoundTitle: "Movie not found",
  metaMovieNotFoundDesc: "The movie identifier is not valid.",
  metaMovieUnavailableTitle: "Movie unavailable",
  metaMovieUnavailableDesc: "This movie could not be loaded or does not exist on TMDb.",
  metaTvNotFoundTitle: "TV show not found",
  metaTvNotFoundDesc: "The TV show identifier is not valid.",
  metaTvUnavailableTitle: "TV show unavailable",
  metaTvUnavailableDesc: "This TV show could not be loaded or does not exist on TMDb.",
  metaMovieFallbackDescription: (title) =>
    `${title}. Details, cast, trailers, and similar titles on CineScope.`,
  metaTvFallbackDescription: (title) =>
    `${title}. Details, cast, trailers, and similar shows on CineScope.`
};

/** Inglés solo para `en-US`; `es-ES` y `es-MX` comparten copy en español. */
export function getUiMessages(tmdbLanguageCode: string): UiMessages {
  return tmdbLanguageCode === "en-US" ? EN : ES;
}
