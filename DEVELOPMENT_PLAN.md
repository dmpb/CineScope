# DEVELOPMENT_PLAN — CineScope

## 1) Current State Summary

- `Status`: `In Progress` (proyecto inicial).
- Existe definición de arquitectura, stack, reglas de capa y endpoints en `PROJECT_RULES.md`.
- Existe descripción funcional de alto nivel en `README.md` (home/listados, detalle, búsqueda, ISR, Docker).
- Existe capa de datos TMDb en `src/lib/tmdb.ts` (Phase 1.B). Aún no hay UI de listados/detalles/búsqueda conectada (Phase 2).
- No hay auth (alineado con reglas: frontend-only con API externa).
- Cliente TMDb, UI MVP, tests criticos y pipeline CI base implementados.
- `Assumption`: tampoco existe configuración Docker operativa versionada en este estado inicial.
- Home, Search y Detail ya funcionan con base sólida post-MVP (fases 5-9), incluyendo banner, filas horizontales, cast/similares, trailer y favoritos locales.
- Se planifica una nueva iteración de **UX/UI Master Upgrade** para llevar el producto a experiencia premium (inspiración Netflix + Apple Liquid Glass) sin cambiar arquitectura ni stack.
- `Open question`: la navegación incluye `Series`, pero las reglas actuales solo exigen endpoints de películas.

## 2) Goals (from rules + repo)

- Implementar estructura App Router en `src/` respetando capas: UI -> `lib` -> TMDb.
- Centralizar todas las llamadas TMDb en `src/lib/tmdb.ts` con normalización DTO -> Domain Model.
- Implementar endpoints requeridos: trending, popular, top rated, search y detail.
- Entregar MVP navegable: Home, Movie Detail y Search por `?q=`.
- Garantizar estados `loading`, `empty`, `error` en flujos críticos.
- Ejecutar y validar calidad (lint/type-check/tests) dentro de Docker.
- Evolucionar la navegación global hacia header full-width con comportamiento glass on-scroll y jerarquía visual cinematográfica.
- Rediseñar Hero y bloques intermedios del Home para priorizar contenido destacado, CTAs claros y trailer en modal.
- Consolidar un sistema visual unificado (colores, blur, sombras, tipografía, motion 200-300ms) reutilizable entre Home/Search/Detail.
- Refinar Movie Detail a formato cinematográfico premium (layout, cast horizontal circular, trailer modal-only y validación de similares).
- Mejorar UX global de búsqueda desde header (flujo rápido por URL, con espacio para sugerencias en iteración avanzada).
- Fortalecer polish final de producto: footer profesional, skeletons consistentes, micro-interacciones y optimización de imágenes con `<Image />`.

## 3) Phases

### Phase 1 — Base técnica y arquitectura ✅

- `Status`: `Completed`
- `Execution order`: `Phase 1.A -> Phase 1.B`

#### Phase 1.A — Bootstrap de proyecto y estructura mínima ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — Bootstrap Next.js App Router + Tailwind, Dockerfile/docker-compose, `.env.example`, tipos base y documentación de arranque.
- **Objective**
  - Inicializar la base de Next.js App Router y estructura de carpetas definida por reglas.
- **Definition of done**
  - Estructura creada: `src/app`, `src/components`, `src/lib`, `src/types`.
  - App arranca en Docker y responde en `/`.
  - Sin secretos hardcodeados.
- **Chunks**
  1. **Inicializar proyecto con App Router y Tailwind**
     - Áreas/archivos: `package.json`, `next.config.*`, `src/app/layout.tsx`, `src/app/page.tsx`, config Tailwind.
     - Verificación: `docker compose up --build` inicia correctamente; ruta raíz renderiza.
  2. **Configurar entorno de variables para TMDb**
     - Áreas/archivos: `.env.example`, lectura de `TMDB_BEARER_TOKEN`, `README.md`.
     - Verificación: checklist de seguridad (sin API key en código); falla controlada si falta token.
  3. **Crear contratos iniciales de tipos**
     - Áreas/archivos: `src/types/movie.ts` y tipos mínimos de listas/detalle.
     - Verificación: `npm run type-check` en contenedor sin errores.
- **Risks / dependencies**
  - Credenciales TMDb no disponibles al inicio.
  - Configuración inicial de contenedor para desarrollo (`docker-compose.yml`) debe quedar operativa en esta subfase.

#### Phase 1.B — Capa de datos TMDb y normalización ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — `src/lib/tmdb.ts` con fetch ISR (`revalidate: 60`), mapeo DTO → `Movie`/`SearchResult`, URLs de imagen completas, fallbacks y logs de error sin datos sensibles; `getOptionalTmdbBearerToken` en `env.ts`; ajuste `tsconfig` para no tipar `.next/dev`.
- **Objective**
  - Implementar la capa de acceso a TMDb en un único punto con ISR y mapeos de dominio.
- **Definition of done**
  - `src/lib/tmdb.ts` contiene cliente base y funciones requeridas.
  - Todas las respuestas salen normalizadas y con URLs completas de imágenes.
  - Errores manejados con fallback seguro y logging limitado a errores API.
- **Chunks**
  1. **Implementar cliente base de fetch con revalidación**
     - Áreas/archivos: `src/lib/tmdb.ts`.
     - Verificación: todas las llamadas usan `next: { revalidate: 60 }`.
  2. **Implementar mapeadores DTO -> Domain Model**
     - Áreas/archivos: `src/lib/tmdb.ts`, `src/types/movie.ts`.
     - Verificación: componentes no consumen `poster_path`/`backdrop_path` crudos.
  3. **Implementar funciones por endpoint obligatorio**
     - Áreas/archivos: `src/lib/tmdb.ts`.
     - Verificación: prueba manual por función (`getTrendingMovies`, `getPopularMovies`, `getTopRatedMovies`, `searchMovies`, `getMovieById`).
- **Risks / dependencies**
  - Depende de `Phase 1.A`.
  - Cambios/rate-limit de TMDb.

### Phase 2 — Entrega de flujos UI MVP ✅

- `Status`: `Completed`
- `Execution order`: `Phase 2.A -> Phase 2.B -> Phase 2.C`

#### Phase 2.A — Home con listados reutilizables ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — Home server component conectado a `lib/tmdb.ts`, componentes reutilizables `MovieCard`/`MovieSection`, uso de `<Image />`, y estados `loading`, `empty` y `error` para flujo principal.
- **Objective**
  - Construir Home server-driven con secciones de tendencias, populares y mejor valoradas.
- **Definition of done**
  - `src/app/page.tsx` obtiene datos desde `lib/tmdb.ts`.
  - Componentes reutilizables de card/section/listado funcionando.
  - Estados visuales `loading`, `empty`, `error` definidos.
- **Chunks**
  1. **Implementar composición de Home en Server Component**
     - Áreas/archivos: `src/app/page.tsx`.
     - Verificación: muestra 3 secciones y no realiza fetch directo en componentes UI.
  2. **Implementar componentes reutilizables de listado**
     - Áreas/archivos: `src/components/MovieCard.tsx`, `src/components/MovieSection.tsx` (o equivalentes).
     - Verificación: sin duplicación entre secciones; naming PascalCase; uso de `<Image />`.
  3. **Implementar estados de carga/vacío/error del Home**
     - Áreas/archivos: rutas/segmentos de `app` y componentes asociados.
     - Verificación: checklist visual de 3 estados sin crash.
- **Risks / dependencies**
  - Depende de `Phase 1.B`.

#### Phase 2.B — Movie Detail por ruta dinámica ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — Ruta dinámica `src/app/movie/[id]/page.tsx`, componente reutilizable `MovieDetail`, estado loading por segmento y fallbacks para ID inválido/errores de API/token faltante.
- **Objective**
  - Entregar vista de detalle por `id` con manejo robusto de errores.
- **Definition of done**
  - Ruta `src/app/movie/[id]/page.tsx` funcional.
  - Vista de detalle usa solo datos normalizados.
  - Casos de ID inválido/API error no rompen la UI.
- **Chunks**
  1. **Implementar ruta dinámica de detalle**
     - Áreas/archivos: `src/app/movie/[id]/page.tsx`.
     - Verificación: navegación desde Home a detalle y render correcto por ID.
  2. **Implementar componente de presentación de detalle**
     - Áreas/archivos: `src/components/MovieDetail.tsx` (o equivalente).
     - Verificación: muestra título, overview, rating, fecha e imágenes.
  3. **Implementar fallback de detalle**
     - Áreas/archivos: página dinámica y `lib/tmdb.ts`.
     - Verificación: ID inexistente/fallo API muestra estado de error o vacío definido.
- **Risks / dependencies**
  - Depende de `Phase 2.A` (reuso de UI) y `Phase 1.B` (getMovieById).

#### Phase 2.C — Search por query params ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — `src/app/search/page.tsx` leyendo `?q=` por ruta, `SearchBar` orientada a URL sin persistencia en estado global, resultados reutilizando `MovieSection`/`MovieCard`, y estado loading del segmento.
- **Objective**
  - Implementar búsqueda basada en URL (`?q=`) sin persistencia en estado global.
- **Definition of done**
  - `src/app/search/page.tsx` lee y usa query de ruta.
  - Resultados renderizados con componentes reutilizados.
  - Estados `loading`, `empty`, `error` cubiertos.
- **Chunks**
  1. **Implementar página de búsqueda SSR por query param**
     - Áreas/archivos: `src/app/search/page.tsx`.
     - Verificación: `/search?q=inception` devuelve resultados; `/search?q=` muestra empty state.
  2. **Implementar barra de búsqueda orientada a URL**
     - Áreas/archivos: `src/components/SearchBar.tsx` (si requiere `use client`).
     - Verificación: submit actualiza URL y no guarda resultados en estado local persistente.
  3. **Integrar resultados reutilizando card/listado existente**
     - Áreas/archivos: componentes de `src/components/`.
     - Verificación: sin duplicación de vista entre Home y Search.
- **Risks / dependencies**
  - Depende de `Phase 2.A` y `Phase 1.B`.

### Phase 3 — Calidad mínima y ejecución continua ✅

- `Status`: `Completed`
- `Execution order`: `Phase 3.A -> Phase 3.B`

#### Phase 3.A — Testing de flujos críticos MVP ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — Setup de Vitest + Testing Library + jsdom + MSW base, scripts `test`/`test:watch`, y pruebas criticas para Home, Movie Detail y Search.
- **Objective**
  - Asegurar estabilidad básica de Home, Detail y Search.
- **Definition of done**
  - Existe setup de pruebas y casos críticos definidos.
  - Pruebas ejecutables dentro de Docker.
  - Stack de testing unificado y documentado.
- **Chunks**
  1. **Configurar stack de testing del proyecto**
     - Áreas/archivos: `package.json`, configuración de test (según stack elegido).
     - Verificación: comando de test corre en contenedor y retorna resultado determinístico.
  2. **Implementar pruebas de Home/Detail/Search**
     - Áreas/archivos: suite de tests de UI/rutas críticas.
     - Verificación: cobertura mínima de carga de listados, navegación a detalle y búsqueda vacía/no vacía.
  3. **Definir estrategia de mock/fake para TMDb en tests**
     - Áreas/archivos: utilidades de test y setup global.
     - Verificación: tests no dependen de disponibilidad real de TMDb.
- **Risks / dependencies**
  - Depende de `Phase 2.*` completadas.
  - Dependencia de definir alcance de E2E para no sobredimensionar tiempos de CI.

#### Phase 3.B — Pipeline CI mínima ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-30 — Workflow `.github/workflows/ci.yml` con `lint`, `type-check` y `test`; comandos de calidad documentados en `README.md`.
- **Objective**
  - Automatizar validaciones básicas en cada PR.
- **Definition of done**
  - Workflow CI ejecuta lint, type-check y tests.
  - Fallas bloquean integración.
- **Chunks**
  1. **Implementar workflow de CI**
     - Áreas/archivos: `.github/workflows/*`.
     - Verificación: workflow se dispara en push/PR.
  2. **Integrar comandos de calidad del proyecto**
     - Áreas/archivos: scripts en `package.json` + workflow.
     - Verificación: lint/type-check/test reportan estado correcto.
  3. **Documentar ejecución local equivalente**
     - Áreas/archivos: `README.md`.
     - Verificación: checklist de comandos reproducible por cualquier colaborador.
- **Risks / dependencies**
  - Depende de `Phase 3.A`.
  - Tiempos de CI pueden aumentar sin cachés/configuración posterior.

### Phase 4 — UI polish y hardening ✅

- `Status`: `Completed`
- `Execution order`: `Phase 4.A -> Phase 4.B -> Phase 4.C`

#### Phase 4.A — UI polish del MVP ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Tokens visuales base en `globals.css`, componente reutilizable `StateMessage` para `warning/error/empty`, refinamiento responsive y consistencia visual en Home/Detail/Search, `MovieCard`, `MovieSection`, `MovieDetail` y `SearchBar`.
- **Objective**
  - Mejorar consistencia visual y legibilidad en Home, Detail y Search sin cambiar arquitectura.
- **Definition of done**
  - Espaciado, tipografía y jerarquía visual consistentes entre pantallas.
  - Estados `loading`, `empty` y `error` con estilo uniforme y reusable.
  - Mejoras responsive en mobile/tablet para cards, grillas y detalle.
- **Chunks**
  1. **Unificar tokens visuales base y patrones de feedback**
     - Áreas/archivos: `src/app/globals.css`, componentes de estados UI.
     - Verificación: checklist visual consistente en Home/Detail/Search.
  2. **Refinar layout responsive en vistas principales**
     - Áreas/archivos: `src/app/page.tsx`, `src/app/movie/[id]/page.tsx`, `src/app/search/page.tsx`.
     - Verificación: revisión manual en breakpoints mobile/tablet/desktop.
  3. **Reducir inconsistencias de componentes de contenido**
     - Áreas/archivos: `src/components/MovieCard.tsx`, `src/components/MovieSection.tsx`, `src/components/MovieDetail.tsx`.
     - Verificación: no hay saltos visuales entre listados y detalle.
- **Risks / dependencies**
  - Riesgo bajo de regresiones visuales.
  - Depende de `Phase 2.*` completadas.

#### Phase 4.B — Accesibilidad y UX mínima ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Mejora de semántica de secciones y navegación, foco visible reusable (`focus-ring`), roles/`aria-live` en feedback states, label explícito en búsqueda y revisión de textos alternativos en componentes críticos.
- **Objective**
  - Mejorar accesibilidad básica y navegabilidad sin introducir complejidad innecesaria.
- **Definition of done**
  - Semántica y jerarquía de headings corregidas.
  - Foco visible y navegación por teclado en controles principales.
  - Contraste y textos alternativos revisados en componentes críticos.
- **Chunks**
  1. **Revisar semántica y estructura de encabezados**
     - Áreas/archivos: páginas de Home/Detail/Search.
     - Verificación: checklist manual de semántica por pantalla.
  2. **Mejorar accesibilidad de inputs, links y cards**
     - Áreas/archivos: `src/components/SearchBar.tsx`, `src/components/MovieCard.tsx`, `src/components/MovieDetail.tsx`.
     - Verificación: navegación por teclado y foco visible funcionando.
  3. **Aplicar checklist a11y MVP**
     - Áreas/archivos: componentes y páginas principales.
     - Verificación: checklist de contraste/labels/alt text completado.
- **Risks / dependencies**
  - Riesgo medio de ajustes visuales colaterales.
  - Recomendado después de `Phase 4.A`.

#### Phase 4.C — E2E mínimo de smoke ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Setup de Playwright (`playwright.config.ts`) con modo mock de TMDb para estabilidad, specs smoke de Home->Detail y Search por query param, scripts E2E en `package.json`, documentación en `README.md` e integración en workflow CI.
- **Objective**
  - Añadir validación end-to-end mínima para proteger flujos críticos del MVP.
- **Definition of done**
  - Smoke E2E de Home -> Detail.
  - Smoke E2E de Search con query param.
  - Ejecución E2E integrada al pipeline (o preparada con comando/documentación).
- **Chunks**
  1. **Configurar base de Playwright para el proyecto**
     - Áreas/archivos: config de Playwright y scripts de ejecución.
     - Verificación: comando E2E corre localmente.
  2. **Implementar specs de smoke críticos**
     - Áreas/archivos: tests E2E de Home/Detail/Search.
     - Verificación: escenarios principales pasan de forma estable.
  3. **Integrar ejecución E2E al flujo de calidad**
     - Áreas/archivos: workflow CI y README.
     - Verificación: pipeline ejecuta E2E en rama/PR (o queda habilitado por etapa).
- **Risks / dependencies**
  - Dependencia de estabilidad de datos externos (TMDb).
  - Recomendado definir mocking o criterios flexibles para evitar flakes.

### Phase 5 — Home Experience Enhancement ✅

- `Status`: `Completed`
- `Execution order`: `Phase 5.A -> Phase 5.B -> Phase 5.C`

#### Phase 5.A — Multi-category Home (HIGH PRIORITY) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Integración de `getNowPlayingMovies()` y `getUpcomingMovies()` en `src/lib/tmdb.ts`, actualización de `src/app/page.tsx` para resolver y renderizar 5 secciones server-side (`Trending`, `Popular`, `Top Rated`, `Now Playing`, `Upcoming`), y ajuste de pruebas de Home.
- **Objective**
  - Expandir Home para mostrar múltiples categorías de películas y elevar percepción de producto.
- **Definition of done**
  - Home incluye mínimo 5 secciones: `Trending`, `Popular`, `Top Rated`, `Now Playing`, `Upcoming`.
  - No hay fetch directo en componentes de UI.
- **Chunks**
  1. **Integrar endpoints adicionales de TMDb**
     - Áreas/archivos: `src/lib/tmdb.ts`.
     - Endpoints: `/movie/now_playing`, `/movie/upcoming`.
     - Verificación: existen `getNowPlayingMovies()` y `getUpcomingMovies()` con salida normalizada.
  2. **Actualizar fetch de Home**
     - Áreas/archivos: `src/app/page.tsx`.
     - Verificación: Home resuelve datasets en server component sin romper ISR.
  3. **Renderizar secciones múltiples**
     - Áreas/archivos: composición Home y `src/components/MovieSection.tsx`.
     - Verificación: al menos 5 secciones visibles con estados `loading/empty/error`.
- **Risks / dependencies**
  - Aumento de llamadas API; validar impacto en latencia y caché ISR.
  - Depende de `Phase 1.B` y componentes de listado existentes.

#### Phase 5.B — Featured Banner (CRITICAL UX) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Componente `src/components/Banner.tsx` con `<Image />`, overlays y CTA accesible, selección de destacada desde Home (prioridad `Trending`) e integración en la parte superior de `src/app/page.tsx` con ajuste de tests de Home.
- **Objective**
  - Agregar hero banner destacado para mejorar impacto visual inicial del Home.
- **Definition of done**
  - Banner visible en la parte superior del Home.
  - Usa imagen `backdrop`, muestra título, overview y CTA al detalle.
- **Chunks**
  1. **Seleccionar película destacada**
     - Fuente: resultados de `Trending`.
     - Verificación: selección estable (primer elemento) o aleatoria controlada.
  2. **Crear componente Banner**
     - Áreas/archivos: `src/components/Banner.tsx`.
     - Verificación: uso de `<Image />`, overlay legible y CTA accesible.
  3. **Integrar Banner en Home**
     - Áreas/archivos: `src/app/page.tsx`.
     - Verificación: Banner renderiza antes de las secciones y mantiene responsive.
- **Risks / dependencies**
  - Riesgo de contraste/legibilidad en fondos oscuros; validar a11y visual.
  - Requiere `Phase 5.A` para fuente principal de datos.

#### Phase 5.C — Genre-based Rows (OPTIONAL HIGH VALUE) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Nuevas funciones `getMovieGenres()` y `getMoviesByGenre()` en `src/lib/tmdb.ts` (incluyendo modo mock), integración en `src/app/page.tsx` para render dinámico de al menos 2 filas por género (`Action` y `Comedy`) reutilizando `MovieSection`, y actualización de pruebas de Home.
- **Objective**
  - Añadir filas dinámicas por género para ampliar descubrimiento de contenido.
- **Definition of done**
  - Existen al menos 2 secciones por género (ejemplo: Action, Comedy).
- **Chunks**
  1. **Obtener catálogo de géneros**
  2. **Obtener películas por género**
  3. **Renderizar secciones dinámicas reutilizando componentes existentes**
- **Risks / dependencies**
  - Mayor complejidad de rate-limit y número de requests.
  - Recomendado ejecutar después de `Phase 5.A` y `Phase 5.B`.

### Phase 6 — Search & Navigation UX ✅

- `Status`: `Completed`
- `Execution order`: `Phase 6.A -> Phase 6.B`

#### Phase 6.A — Header Search Integration (HIGH PRIORITY) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Creación de `src/components/Navbar.tsx` con `SearchBar` global, integración en `src/app/layout.tsx`, ajuste de `SearchBar` para tomar query desde URL (`?q=`) y simplificación de `src/app/search/page.tsx` para depender del header compartido.
- **Objective**
  - Mover la búsqueda a un header global visible en todas las páginas.
- **Definition of done**
  - Input de búsqueda visible en Home, Detail y Search.
  - Submit navega a `/search?q=` usando query params.
- **Chunks**
  1. **Crear componente Navbar**
     - Áreas/archivos: `src/components/Navbar.tsx`.
  2. **Integrar `SearchBar` sin estado global**
     - Verificación: mantiene regla de query params y arquitectura server-driven.
  3. **Conectar Navbar en layout**
     - Áreas/archivos: `src/app/layout.tsx`.
     - Verificación: navegación consistente sin duplicar header en páginas.
- **Risks / dependencies**
  - Posibles regresiones visuales entre layouts existentes.
  - Requiere coordinación con estilos de `Phase 4.*`.

#### Phase 6.B — Improve Search Results Page ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Refinamiento de `src/app/search/page.tsx` con metadata visible de conteo de resultados, estructura más clara del bloque de resultados y empty state más expresivo orientado a la consulta; ajuste de pruebas en Search.
- **Objective**
  - Mejorar layout y UX de resultados para claridad y escaneabilidad.
- **Definition of done**
  - Grid optimizada en breakpoints.
  - Conteo de resultados visible y consistente.
  - Empty state más expresivo y reutilizable.
- **Chunks**
  1. **Agregar metadata de resultados**
  2. **Refinar layout de grilla y espaciado**
  3. **Mejorar UI del empty state**
- **Risks / dependencies**
  - Riesgo bajo de ajustes visuales colaterales en `Search`.

### Phase 7 — Movie Detail Enhancement ✅

- `Status`: `Completed`
- `Execution order`: `Phase 7.A -> Phase 7.B -> Phase 7.C`

#### Phase 7.A — Enriched Movie Metadata (HIGH PRIORITY) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Extensión de `Movie` en `src/types/movie.ts` con `genres`, `runtime`, `language`, `voteCount`; actualización del mapeo TMDb en `src/lib/tmdb.ts` (incluido modo mock) para normalizar metadata enriquecida de `/movie/{id}`; render de metadata en `src/components/MovieDetail.tsx` y ajuste de pruebas de Detail/Home/Search.
- **Objective**
  - Expandir información del detalle con metadata clave de película.
- **Definition of done**
  - Detail muestra `genres`, `runtime`, `language` y `vote count`.
- **Chunks**
  1. **Extender consumo del endpoint `/movie/{id}`**
  2. **Actualizar Domain Model y tipos en `src/types/movie.ts`**
  3. **Renderizar metadata enriquecida en `src/components/MovieDetail.tsx`**
- **Risks / dependencies**
  - Cambios en contrato de tipos pueden requerir ajustes de tests.
  - Depende de mantener normalización en `src/lib/tmdb.ts`.

#### Phase 7.B — Trailer Integration (HIGH VALUE) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Nueva función `getMovieTrailerById()` en `src/lib/tmdb.ts` consumiendo `/movie/{id}/videos` con selección determinística de trailer en YouTube (incluye fallback/mock), integración en `src/app/movie/[id]/page.tsx` y embebido seguro en `src/components/MovieDetail.tsx` con render condicional.
- **Objective**
  - Mostrar trailer principal de la película para enriquecer la experiencia.
- **Definition of done**
  - Trailer visible inline o en modal cuando exista fuente compatible.
- **Chunks**
  1. **Consumir `/movie/{id}/videos` desde `src/lib/tmdb.ts`**
  2. **Seleccionar trailer de YouTube con criterio determinístico**
  3. **Embebido seguro del player en UI**
- **Risks / dependencies**
  - Dependencia de disponibilidad de videos por película.
  - Considerar fallback explícito si no hay trailer.

#### Phase 7.C — Cast & Similar Movies ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Implementación de `getMovieCastById()` y `getSimilarMoviesById()` en `src/lib/tmdb.ts` (incluyendo mock/fallback), render de cast principal en `src/components/MovieDetail.tsx` y sección de películas similares en `src/app/movie/[id]/page.tsx` reutilizando `MovieSection`.
- **Objective**
  - Añadir contexto de reparto y películas relacionadas en la vista de detalle.
- **Definition of done**
  - Lista de cast visible.
  - Sección de `similar movies` renderizada.
- **Chunks**
  1. **Consumir `/movie/{id}/credits`**
  2. **Consumir `/movie/{id}/similar`**
  3. **Renderizar secciones reutilizando `MovieCard`/`MovieSection`**
- **Risks / dependencies**
  - Aumento de requests por página de detalle.
  - Requiere estrategia de fallback para datasets vacíos.

### Phase 8 — UI/UX Polish (Post-MVP) ✅

- `Status`: `Completed`
- `Execution order`: `Phase 8.A -> Phase 8.B -> Phase 8.C`

#### Phase 8.A — Horizontal Scroll Rows ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Conversión de listados a filas horizontales con `overflow-x` en `src/components/MovieSection.tsx` y estilos base reutilizables en `src/app/globals.css`.
- **Objective**
  - Convertir listados de secciones en filas con scroll horizontal tipo streaming app.
- **Definition of done**
  - Filas scrollables con `overflow-x` y comportamiento usable en mobile/desktop.

#### Phase 8.B — Hover Effects ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Mejora de interacciones en `src/components/MovieCard.tsx` con escala/levantamiento, sombreado y overlay informativo visible en hover/focus.
- **Objective**
  - Añadir interacciones hover tipo Netflix para mejorar feedback visual.
- **Definition of done**
  - Animación de escala y overlay informativo visible al hover/focus.

#### Phase 8.C — Skeleton Loaders ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Reemplazo de loaders por skeletons consistentes de banner y cards en `src/app/loading.tsx`, `src/app/search/loading.tsx` y `src/app/movie/[id]/loading.tsx` usando estilos compartidos.
- **Objective**
  - Sustituir loaders básicos por skeletons para cards y banner.
- **Definition of done**
  - Skeletons consistentes visibles en estados de carga de Home/Search/Detail.

### Phase 9 — Optional Features (Low Priority) ✅

- `Status`: `Completed`
- `Execution order`: `Phase 9.A -> Phase 9.B`

#### Phase 9.A — Favorites (localStorage) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Botón de favorito en `src/components/FavoriteButton.tsx` con persistencia en `localStorage` (`cinescope:favorites`) e integración en `src/components/MovieCard.tsx` para agregar/quitar películas.
- **Objective**
  - Permitir guardar/eliminar favoritas en cliente sin backend.
- **Definition of done**
  - Toggle de favoritos disponible en `MovieCard`.
  - Persistencia local usando `localStorage`.

#### Phase 9.B — Infinite Scroll (Search) ✅

- `Status`: `Completed`
- `Implemented`: 2026-03-31 — Infinite scroll en Search con `src/components/SearchResultsInfinite.tsx` + `IntersectionObserver`, soporte de paginación en `searchMovies(query, page)` y endpoint interno `src/app/api/search/route.ts` para cargar más resultados por scroll.
- **Objective**
  - Cargar más resultados de búsqueda al hacer scroll.
- **Definition of done**
  - Search soporta paginación incremental por scroll con feedback de carga.

### Phase 10 — Premium Layout & Visual System (Netflix + Liquid Glass) ✅

- `Status`: `Completed`
- `Execution order`: `Phase 10.A -> Phase 10.B -> Phase 10.C`

#### Phase 10.A — Global Header Redesign (CRITICAL) ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — `src/components/Navbar.tsx` migrado a client component con layout izquierda/centro/derecha (logo, links `Home/Peliculas/Series` placeholder), estado visual translúcido -> sólido con blur al scroll, y variante compacta de búsqueda en header vía `src/components/SearchBar.tsx`.
- **Objective**
  - Rediseñar el header global a patrón premium (logo izquierda, navegación centro, búsqueda derecha) con comportamiento translúcido inicial y solid+blur al scroll.
- **Definition of done**
  - Header presente y consistente en Home, Detail y Search.
  - Navegación visible: `Home`, `Películas`, `Series` (si `Series` no está implementado, queda explícito como placeholder no funcional).
  - Transición suave en scroll (`opacity`, `backdrop-blur`, color de fondo) sin parpadeos.
- **Chunks**
  1. **Refactor de estructura del header**
     - Áreas/archivos: `src/components/Navbar.tsx`, `src/app/layout.tsx`.
     - Verificación: jerarquía izquierda/centro/derecha renderiza correctamente en desktop y mobile.
  2. **Aplicar estado visual on-scroll**
     - Áreas/archivos: `src/components/Navbar.tsx`, `src/app/globals.css`.
     - Verificación: al hacer scroll, cambia de transparente a sólido con blur y transición fluida.
  3. **Integrar búsqueda mínima en header**
     - Áreas/archivos: `src/components/SearchBar.tsx`, `src/components/Navbar.tsx`.
     - Verificación: Enter navega a `/search?q=...` manteniendo regla de query params.
- **Risks / dependencies**
  - Dependencia de `Phase 6.A` (header ya integrado).
  - Riesgo de contraste en imágenes claras del hero; requiere validación de legibilidad.
  - `Open question`: definir comportamiento exacto del link `Series` bajo restricciones actuales de endpoints.

#### Phase 10.B — Unified Visual Design Tokens ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Tokens premium centralizados en `src/app/globals.css` (near-black, accent rojo, glass surfaces y motion base 250ms), adopción en componentes clave (`Navbar`, `SearchBar`, `Banner`, `MovieCard`, `MovieDetail`, `StateMessage`) y unificación de transiciones/feedback visual.
- **Objective**
  - Formalizar sistema visual premium compartido para evitar estilos aislados y mantener consistencia.
- **Definition of done**
  - Tokens base documentados e implementados en estilos globales (fondo near-black, accent rojo, surfaces glass).
  - Tipografía y jerarquía de títulos/textos consistente entre páginas.
  - Motion base 200-300ms aplicada en componentes interactivos clave.
- **Chunks**
  1. **Definir tokens de color y superficies**
     - Áreas/archivos: `src/app/globals.css`.
     - Verificación: variables/utilidades reutilizadas por Home, Detail, Search y Navbar.
  2. **Estandarizar componentes glass reutilizables**
     - Áreas/archivos: `src/components/*` (botones, overlays, contenedores de estado).
     - Verificación: botones/overlays comparten bordes, opacidad y blur de forma uniforme.
  3. **Alinear transiciones y feedback visual**
     - Áreas/archivos: `src/components/MovieCard.tsx`, `src/components/MovieDetail.tsx`, `src/components/Banner.tsx`.
     - Verificación: duración/easing consistente; no hay animaciones abruptas.
- **Risks / dependencies**
  - Riesgo de regresión visual transversal.
  - Depende de la estructura base ya estabilizada en `Phase 4.*` y `Phase 8.*`.

#### Phase 10.C — Footer profesional de bajo peso visual ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Nuevo componente `src/components/Footer.tsx` con branding discreto + links `About` y `GitHub`, integración global en `src/app/layout.tsx` y ajuste de jerarquía visual para cierre de página sin competir con contenido.
- **Objective**
  - Añadir cierre de experiencia con footer mínimo y profesional, sin competir con contenido.
- **Definition of done**
  - Footer visible al final de páginas principales.
  - Incluye nombre/logo, enlace a GitHub y About.
  - Estética dark minimal con baja prominencia.
- **Chunks**
  1. **Crear componente Footer reusable**
     - Áreas/archivos: `src/components/Footer.tsx`.
     - Verificación: componente renderiza contenido requerido con estructura semántica.
  2. **Integrar footer en layout global**
     - Áreas/archivos: `src/app/layout.tsx`.
     - Verificación: aparece en Home/Search/Detail sin romper layout existente.
  3. **Ajustar contraste y spacing**
     - Áreas/archivos: `src/app/globals.css`.
     - Verificación: lectura clara y baja carga visual en desktop/mobile.
- **Risks / dependencies**
  - Riesgo bajo; depende de completar baseline visual de `Phase 10.B`.

### Phase 11 — Cinematic Home Composition ✅

- `Status`: `Completed`
- `Execution order`: `Phase 11.A -> Phase 11.B -> Phase 11.C`

#### Phase 11.A — Hero Banner v2 (CRITICAL COMPONENT) ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Refactor de `src/components/Banner.tsx` a hero cinematografico full-width (~72vh) con metadata (rating, duracion, generos), CTA `Ver detalle` y CTA `Ver trailer` por modal reusable en `src/components/TrailerModal.tsx`; integración de trailer desde Home con `getMovieTrailerById`.
- **Objective**
  - Evolucionar hero a formato cinematográfico full-width (70-90vh), metadata clave y acciones primarias con trailer modal.
- **Definition of done**
  - Hero usa backdrop full-width con gradient overlay legible.
  - Muestra título, rating, duración y géneros, además de descripción corta.
  - CTAs `Ver Trailer` y `Ver Detalle` operativas; trailer abre modal (no inline).
- **Chunks**
  1. **Extender modelo de datos para hero**
     - Áreas/archivos: `src/lib/tmdb.ts`, `src/types/movie.ts`.
     - Verificación: hero recibe metadata completa sin consumir DTO crudo en UI.
  2. **Refactor de `Banner` a Hero premium**
     - Áreas/archivos: `src/components/Banner.tsx` (o nuevo `HeroBanner.tsx`), `src/app/page.tsx`.
     - Verificación: altura, overlay, bloques de contenido y CTAs respetan layout objetivo.
  3. **Modal de trailer reutilizable**
     - Áreas/archivos: `src/components/*` (modal y trigger), `src/app/page.tsx`.
     - Verificación: abre/cierra correctamente, accesible por teclado, bloqueo de scroll y foco seguro.
- **Risks / dependencies**
  - Dependencia de `Phase 7.B` (fuente de trailers).
  - Riesgo de rendimiento por assets grandes de hero; coordinar con `Phase 14.B`.

#### Phase 11.B — Interleaved Featured Mini-Banners ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Nuevo componente reusable `src/components/FeaturedStrip.tsx` e insercion intercalada en Home (`Hero -> Rows -> Strips -> Rows`) con fallback seguro para omitir strips cuando no hay dataset disponible.
- **Objective**
  - Intercalar mini-banners full-width entre filas de contenido para destacar títulos puntuales.
- **Definition of done**
  - Home alterna rows y mini-banners destacados sin romper ritmo visual.
  - Mini-banners son reutilizables y configurables por dataset.
- **Chunks**
  1. **Diseñar componente FeaturedStrip**
     - Áreas/archivos: `src/components/FeaturedStrip.tsx`.
     - Verificación: componente soporta imagen, título corto y CTA.
  2. **Definir estrategia de inserción entre secciones**
     - Áreas/archivos: `src/app/page.tsx`.
     - Verificación: estructura final mantiene orden lógico (`Hero -> Rows -> Strips -> Rows`).
  3. **Manejo de fallback de datos**
     - Áreas/archivos: `src/lib/tmdb.ts`, componentes Home.
     - Verificación: si falta dataset para strip, se omite sin romper layout.
- **Risks / dependencies**
  - Riesgo de exceso visual si se abusa de strips.
  - Depende de `Phase 5.A` (múltiples categorías) y `Phase 11.A`.

#### Phase 11.C — Full-width Rails & Spacing Consistency ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Home migra a layout cinematic full-width en `src/app/page.tsx` con nuevos tokens/containers (`home-cinematic-shell`, `home-content-container`, `home-content-stack`) definidos en `src/app/globals.css`, normalizando gutters y ritmo vertical por breakpoint.
- **Objective**
  - Consolidar composición Home en ancho completo con ritmo de espaciado consistente entre hero, rows y strips.
- **Definition of done**
  - No hay boxed layout principal.
  - Separaciones verticales consistentes y escalables por breakpoint.
  - El contenido mantiene enfoque cinematográfico y legible.
- **Chunks**
  1. **Ajustar contenedores y gutters globales**
     - Áreas/archivos: `src/app/page.tsx`, `src/app/globals.css`.
     - Verificación: inspección visual en mobile/tablet/desktop.
  2. **Normalizar márgenes y paddings entre secciones**
     - Áreas/archivos: componentes Home (`MovieSection`, hero, strips).
     - Verificación: no hay saltos abruptos de spacing.
  3. **Revalidar responsive end-to-end**
     - Áreas/archivos: Home + componentes asociados.
     - Verificación: smoke visual en breakpoints críticos.
- **Risks / dependencies**
  - Riesgo bajo-medio de regresiones visuales en layouts existentes.
  - Requiere `Phase 11.A` y `Phase 11.B`.

### Phase 12 — Rows & Search Premium UX ✅

- `Status`: `Completed`
- `Execution order`: `Phase 12.A -> Phase 12.B`

#### Phase 12.A — Netflix-style Rows Interaction Upgrade ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Rails horizontales refinadas con `scroll-snap` + inercia touch (`src/app/globals.css`, `src/components/MovieSection.tsx`), y `MovieCard` con overlay enriquecido (rating/año + glow sutil + transición uniforme) manteniendo foco por teclado.
- **Objective**
  - Perfeccionar filas horizontales con interacción premium: snap opcional, hover enriquecido y overlay informativo.
- **Definition of done**
  - Scroll horizontal usable con inercia adecuada en touch.
  - Hover/focus muestra título + rating + glow sutil.
  - Interacción no rompe accesibilidad por teclado.
- **Chunks**
  1. **Refinar comportamiento de carruseles**
     - Áreas/archivos: `src/components/MovieSection.tsx`, `src/app/globals.css`.
     - Verificación: scroll y snap (si se activa) funcionan sin bloquear usabilidad.
  2. **Enriquecer overlay de `MovieCard`**
     - Áreas/archivos: `src/components/MovieCard.tsx`.
     - Verificación: overlay muestra datos mínimos y transición suave.
  3. **Ajustar estado hover/focus coherente con tokens**
     - Áreas/archivos: `src/components/MovieCard.tsx`, estilos globales.
     - Verificación: contraste y legibilidad correctos en fondos variados.
- **Risks / dependencies**
  - Dependencia de `Phase 8.A` y `Phase 8.B`.
  - Riesgo de sobre-animación; controlar para mantener foco en contenido.

#### Phase 12.B — Global Search UX Enhancement ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — `SearchBar` global refinado con expansión en foco, icono de búsqueda en variante compacta, limpieza rápida (`Borrar/Limpiar`) y soporte `Escape`, manteniendo navegación por URL (`/search?q=`) como source of truth en Home/Detail/Search.
- **Objective**
  - Mejorar experiencia de búsqueda desde header para flujo rápido y consistente en toda la app.
- **Definition of done**
  - Input de búsqueda minimal integrado en header, con opción de expansión en foco.
  - Submit siempre navega por URL (`/search?q=...`).
  - `Advanced (optional)`: base preparada para sugerencias con debounce sin romper reglas de capa.
- **Chunks**
  1. **Refinar interacción del input global**
     - Áreas/archivos: `src/components/SearchBar.tsx`, `src/components/Navbar.tsx`.
     - Verificación: foco, envío y limpieza funcionan en Home/Detail/Search.
  2. **Asegurar coherencia de query param como source of truth**
     - Áreas/archivos: `src/app/search/page.tsx`, `src/components/SearchBar.tsx`.
     - Verificación: refresh y navegación atrás/adelante conservan estado por URL.
  3. **Preparación opcional para sugerencias**
     - Áreas/archivos: `src/components/SearchBar.tsx`, `src/lib/tmdb.ts` (si aplica endpoint ya existente de search).
     - Verificación: debounce documentado/implementado sin llamadas directas API desde UI.
- **Risks / dependencies**
  - Riesgo de complejidad en modo sugerencias (opcional).
  - Depende de `Phase 10.A` y `Phase 6.*`.

### Phase 13 — Cinematic Detail Experience v2 ✅

- `Status`: `Completed`
- `Execution order`: `Phase 13.A -> Phase 13.B`

#### Phase 13.A — Detail Layout Overhaul + Trailer Modal-Only ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — `src/components/MovieDetail.tsx` rediseñado a layout cinematográfico con backdrop dominante full-width, composición poster izquierda + metadata derecha, sección de cast en rail horizontal circular y trailer migrado a `TrailerModal` (sin iframe inline). En `src/app/movie/[id]/page.tsx` se removió el bloque de back link del detalle.
- **Objective**
  - Convertir la página de detalle a experiencia cinematográfica premium con backdrop dominante y composición poster+metadata+acciones.
- **Definition of done**
  - Fondo full-width con gradient overlay oscuro.
  - Layout principal: poster a la izquierda, metadata y descripción a la derecha.
  - Botón `Back to Home` removido del bloque principal.
  - Trailer visible solo por modal (no embebido por defecto).
- **Chunks**
  1. **Rediseñar layout de detalle**
     - Áreas/archivos: `src/app/movie/[id]/page.tsx`, `src/components/MovieDetail.tsx`.
     - Verificación: estructura visual cumple patrón cinematográfico en desktop/mobile.
  2. **Migrar trailer a interacción modal-only**
     - Áreas/archivos: `src/components/MovieDetail.tsx`, componente modal compartido.
     - Verificación: no hay trailer inline; modal abre/cierra correctamente.
  3. **Refinar sección de cast horizontal circular**
     - Áreas/archivos: `src/components/MovieDetail.tsx`.
     - Verificación: avatars circulares con hover/focus mostrando actor/personaje.
- **Risks / dependencies**
  - Depende de `Phase 7.A`, `Phase 7.B` y `Phase 7.C`.
  - Riesgo medio de regresión visual/espaciado por alta densidad de contenido.

#### Phase 13.B — Similar Movies Correctness Hardening ✅

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Hardening de similares en `src/lib/tmdb.ts` con normalización (`normalizeSimilarMovies`) para filtrar duplicados/self-ID/IDs inválidos y mantener consistencia del endpoint oficial `/movie/{id}/similar`; fallback de UI reforzado en `src/app/movie/[id]/page.tsx` y cobertura adicional en `src/app/movie/[id]/page.test.tsx` para caso de lista vacía.
- **Objective**
  - Asegurar y blindar la lógica de similares para mantener relevancia funcional y consistencia con TMDb.
- **Definition of done**
  - Similar movies siguen endpoint oficial `/movie/{id}/similar`.
  - Existe validación de contratos y fallback cuando la API retorne resultados pobres o vacíos.
  - Cobertura de pruebas para proteger este flujo.
- **Chunks**
  1. **Auditar implementación y normalización de similares**
     - Áreas/archivos: `src/lib/tmdb.ts`, `src/types/movie.ts`.
     - Verificación: no se usa endpoint alterno ni mezcla de datasets no relacionados.
  2. **Refinar presentación y criterio de fallback**
     - Áreas/archivos: `src/app/movie/[id]/page.tsx`, `src/components/MovieSection.tsx`.
     - Verificación: sección similar nunca rompe UI y comunica estado vacío de forma clara.
  3. **Agregar/ajustar pruebas de contrato y UI**
     - Áreas/archivos: tests unit/integration/E2E de detail.
     - Verificación: casos con dataset similar presente y vacío cubiertos en CI.
- **Risks / dependencies**
  - Dependencia de variabilidad real del dataset TMDb.
  - Riesgo de falsos positivos en pruebas si no se controla mocking.

### Phase 14 — Premium Polish, Performance & Micro-interactions

- `Status`: `Completed`
- `Execution order`: `Phase 14.A -> Phase 14.B -> Phase 14.C`

#### Phase 14.A — Skeletons & Loading Experience Upgrade

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Skeletons de Home/Detail/Search actualizados para reflejar layout real cinematográfico (`src/app/loading.tsx`, `src/app/movie/[id]/loading.tsx`, `src/app/search/loading.tsx`) con hero/rails/cast placeholders contextuales.
- **Objective**
  - Mejorar percepción de velocidad con skeletons más contextuales y coherentes con diseño premium.
- **Definition of done**
  - Estados de carga de Home/Detail/Search muestran skeletons alineados al layout real.
  - No hay loaders de texto genérico en flujos principales.
- **Chunks**
  1. **Refinar skeleton del hero y rows**
     - Áreas/archivos: `src/app/loading.tsx`, componentes de skeleton.
     - Verificación: estructura de carga refleja hero + rails.
  2. **Refinar skeleton de detail**
     - Áreas/archivos: `src/app/movie/[id]/loading.tsx`.
     - Verificación: poster/metadata/cast skeleton coherente.
  3. **Refinar skeleton de search**
     - Áreas/archivos: `src/app/search/loading.tsx`.
     - Verificación: resultados y metadata de búsqueda representados.
- **Risks / dependencies**
  - Riesgo bajo; depende de layouts finales de `Phase 11` y `Phase 13`.

#### Phase 14.B — Image Performance & Rendering Efficiency

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Optimización de imágenes en componentes de alta densidad visual con estrategia explícita de carga (`loading="lazy"` en `MovieCard`, `FeaturedStrip`, `CastScroller`) y ajuste de skeletons para reducir percepción de blocking render en first paint.
- **Objective**
  - Optimizar carga de imágenes y rendering sin sacrificar calidad visual cinematográfica.
- **Definition of done**
  - Uso consistente de `<Image />` con tamaños/prioridades correctas por contexto.
  - Lazy loading aplicado en cards no críticas.
  - Mejoras verificables en Web Vitals percibidos (LCP/CLS en entornos de prueba).
- **Chunks**
  1. **Auditar uso de `<Image />` en componentes críticos**
     - Áreas/archivos: `src/components/Banner.tsx`, `src/components/MovieCard.tsx`, `src/components/MovieDetail.tsx`.
     - Verificación: atributos `sizes`, `priority`, placeholders y `loading` definidos según contexto.
  2. **Ajustar estrategias de carga por viewport**
     - Áreas/archivos: componentes de Home/Detail/Search.
     - Verificación: imágenes fuera de viewport no bloquean render principal.
  3. **Validar impacto de performance**
     - Áreas/archivos: scripts/guías de verificación en docs o QA checklist.
     - Verificación: comparación antes/después en métricas básicas de carga.
- **Risks / dependencies**
  - Riesgo medio por trade-offs entre calidad visual y peso de imagen.
  - Depende de `Phase 10.B` y `Phase 11.A`.

#### Phase 14.C — Micro-interactions & Favorites UX Polish

- `Status`: `Completed`
- `Implemented`: 2026-04-01 — Pulido de micro-interacciones de favoritos en `src/components/FavoriteButton.tsx` (estados visuales activo/inactivo, transición premium, feedback de escala al toggle y sincronización por evento `storage` entre contextos).
- **Objective**
  - Dar acabado premium en interacciones pequeñas (botones, hover, feedback de favorito) para sensación de producto final.
- **Definition of done**
  - Botones principales muestran feedback táctil/visual consistente.
  - Favoritos tiene estados claros (activo/inactivo) y transición suave.
  - No se introducen patrones nuevos fuera del sistema visual definido.
- **Chunks**
  1. **Unificar feedback de botones y CTAs**
     - Áreas/archivos: `src/components/*` (CTA hero, acciones detail, búsqueda).
     - Verificación: animaciones y estados active/hover/focus consistentes.
  2. **Pulir interacción de favoritos**
     - Áreas/archivos: `src/components/FavoriteButton.tsx`, `src/components/MovieCard.tsx`.
     - Verificación: cambio de estado inmediato, accesible y persistente en `localStorage`.
  3. **QA de coherencia micro-interaction cross-page**
     - Áreas/archivos: Home/Detail/Search.
     - Verificación: checklist de micro-interacciones completado sin inconsistencias.
- **Risks / dependencies**
  - Riesgo bajo-medio de sobrecarga visual.
  - Depende de `Phase 9.A` y `Phase 10.B`.

### Phase 15 — Detail Experience Expansion (Post-14)

- `Status`: `Pending`
- `Execution order`: `Phase 15.A -> Phase 15.B -> Phase 15.C -> Phase 15.D -> Phase 15.E`

#### Phase 15.A — Detail CTAs & In-page Navigation

- `Status`: `Pending`
- **Objective**
  - Aumentar usabilidad en detalle con CTAs contextuales y navegación interna rápida.
- **Definition of done**
  - Existe CTA para saltar a sección de similares desde el hero de detalle.
  - Favoritos disponible también en página de detalle (además de cards).
  - Navegación interna no rompe accesibilidad ni foco.
- **Chunks**
  1. **Agregar CTA de salto a similares**
     - Áreas/archivos: `src/components/MovieDetail.tsx`, `src/app/movie/[id]/page.tsx`.
     - Verificación: click desplaza a sección de similares en misma página.
  2. **Integrar favoritos en detail**
     - Áreas/archivos: `src/components/MovieDetail.tsx`, `src/components/FavoriteButton.tsx`.
     - Verificación: toggle de favorito consistente con estado en cards.
  3. **Ajustes a11y para navegación interna**
     - Áreas/archivos: `src/components/MovieDetail.tsx`.
     - Verificación: foco/lectura por teclado correctos al usar CTAs.
- **Risks / dependencies**
  - Depende de `Phase 9.A` (favoritos).
  - Riesgo bajo de duplicidad visual de acciones si no se jerarquiza CTA principal.

#### Phase 15.B — Credits Enrichment (Director, Writer, Crew Highlights)

- `Status`: `Pending`
- **Objective**
  - Enriquecer ficha de detalle con información de crew relevante (dirección/guion).
- **Definition of done**
  - Se muestran director(es) y guionista(s) principales cuando existan.
  - Fallback claro cuando TMDb no retorne datos de crew.
  - Sin consumo directo de DTO en UI.
- **Chunks**
  1. **Extender data layer para crew**
     - Áreas/archivos: `src/lib/tmdb.ts`, `src/types/movie.ts`.
     - Verificación: función de detalle devuelve crew normalizado.
  2. **Render de créditos clave en detail**
     - Áreas/archivos: `src/components/MovieDetail.tsx`.
     - Verificación: bloques Director/Guion visibles y legibles.
  3. **Pruebas de contrato y UI**
     - Áreas/archivos: tests de detail.
     - Verificación: casos con y sin crew cubiertos.
- **Risks / dependencies**
  - Depende de estabilidad del endpoint de créditos de TMDb.
  - Riesgo medio de sobrecargar la ficha con metadata secundaria.

#### Phase 15.C — Watch Providers & Availability Context

- `Status`: `Pending`
- **Objective**
  - Añadir contexto de disponibilidad (plataformas) para elevar valor práctico del detalle.
- **Definition of done**
  - Sección “Dónde verla” visible cuando existan providers.
  - Se comunica claramente cuando no hay proveedores para región objetivo.
  - Implementación mantiene fallback por región configurable.
- **Chunks**
  1. **Integrar endpoint de providers**
     - Áreas/archivos: `src/lib/tmdb.ts`, `src/types/movie.ts`.
     - Verificación: providers normalizados por región.
  2. **Render de providers en detail**
     - Áreas/archivos: `src/components/MovieDetail.tsx`.
     - Verificación: logos/nombres y estado vacío consistentes.
  3. **Definir región base y fallback**
     - Áreas/archivos: `src/lib/env.ts`, `src/lib/tmdb.ts`.
     - Verificación: comportamiento determinista con región sin resultados.
- **Risks / dependencies**
  - Depende de cobertura real de providers en TMDb por país.
  - Riesgo de inconsistencias entre entornos si no se fija región default.

#### Phase 15.D — Media Gallery (Backdrops & Stills)

- `Status`: `Pending`
- **Objective**
  - Mejorar inmersión visual del detalle con galería horizontal de imágenes.
- **Definition of done**
  - Galería de backdrops/stills visible bajo hero.
  - Scroll horizontal usable en touch/trackpad y teclado.
  - Lazy loading aplicado para no penalizar render inicial.
- **Chunks**
  1. **Agregar fetching de imágenes de película**
     - Áreas/archivos: `src/lib/tmdb.ts`, `src/types/movie.ts`.
     - Verificación: dataset de galería normalizado.
  2. **Crear componente de galería reusable**
     - Áreas/archivos: `src/components/*` (ej. `MovieMediaGallery.tsx`).
     - Verificación: render robusto con fallback vacío.
  3. **Integrar galería en página de detalle**
     - Áreas/archivos: `src/app/movie/[id]/page.tsx`, `src/components/MovieDetail.tsx`.
     - Verificación: layout mantiene ritmo visual y legibilidad.
- **Risks / dependencies**
  - Riesgo medio de peso visual y de red si no se limita número de imágenes.
  - Depende de `Phase 14.B` para optimización de carga.

#### Phase 15.E — Detail Information Architecture (Tabs/Sections)

- `Status`: `Pending`
- **Objective**
  - Organizar densidad de información de detalle con arquitectura escalable por secciones.
- **Definition of done**
  - Bloques de detalle agrupados en secciones claras (`Resumen`, `Cast`, `Datos`, `Media`).
  - Navegación de secciones usable en mobile y desktop.
  - No se degrada accesibilidad ni SEO semántico.
- **Chunks**
  1. **Diseñar IA de bloques de detalle**
     - Áreas/archivos: `src/components/MovieDetail.tsx`.
     - Verificación: jerarquía clara y mantenible.
  2. **Implementar tabs/anchors progresivas**
     - Áreas/archivos: `src/components/MovieDetail.tsx`, estilos globales.
     - Verificación: interacción consistente sin dependencia de estado global.
  3. **QA de legibilidad y accesibilidad**
     - Áreas/archivos: tests y revisión manual.
     - Verificación: foco, orden de lectura y navegación por teclado correctos.
- **Risks / dependencies**
  - Riesgo medio de complejidad de UI si no se limita alcance inicial.
  - Depende de `Phase 15.B`, `15.C` y `15.D`.

### Post-MVP execution priority

1. `Phase 10.B` — Unified Visual Design Tokens (base visual compartida).
2. `Phase 11.A` — Hero Banner v2 (componente crítico de impacto).
3. `Phase 13.A` — Detail Layout Overhaul + Trailer Modal-Only.
4. `Phase 12.A` — Netflix-style Rows Interaction Upgrade.
5. `Phase 10.C` — Footer profesional.
6. `Phase 11.B` — Interleaved Featured Mini-Banners.
7. `Phase 11.C` — Full-width Rails & Spacing Consistency.
8. `Phase 12.B` — Global Search UX Enhancement.
9. `Phase 13.B` — Similar Movies Correctness Hardening.
10. `Phase 14.A` — Skeletons & Loading Experience Upgrade.
11. `Phase 14.B` — Image Performance & Rendering Efficiency.
12. `Phase 14.C` — Micro-interactions & Favorites UX Polish.
13. `Phase 15.A` — Detail CTAs & In-page Navigation.
14. `Phase 15.B` — Credits Enrichment (Director, Writer, Crew Highlights).
15. `Phase 15.C` — Watch Providers & Availability Context.
16. `Phase 15.D` — Media Gallery (Backdrops & Stills).
17. `Phase 15.E` — Detail Information Architecture (Tabs/Sections).

### Recommended next subphase

- **`Phase 15.A — Detail CTAs & In-page Navigation`**: siguiente incremento de producto para mejorar navegación contextual en la vista de detalle.

### Alternative paths

- **Ruta UI foundation-first (recomendada)**: `10.A -> 10.B -> 11.A`.
- **Ruta Home-first visual impact**: `11.A -> 11.B -> 11.C -> 12.A`.
- **Ruta Detail premium-first**: `13.A -> 13.B -> 14.A`.
- **Ruta búsqueda avanzada**: `10.A -> 12.B` (sugerencias en modo opcional si no compromete tiempos).
- **Ruta performance & finishing**: `14.A -> 14.B -> 14.C` al cierre de la iteración.

### Execution order note

- Mantener ejecución estrictamente incremental: completar primero fundamentos transversales (`Phase 10.*`) antes de extender Home/Detail/Search.
- Cada subfase está diseñada para ejecutarse en 1-2 interacciones, con validación explícita por chunk.
- Si surgen bloqueos de alcance (por ejemplo `Series`), registrar como `Open question` sin romper secuencia.

### Progress tracking rule

- Actualizar en este mismo archivo el `Status` de cada `Phase` y `Phase X.Y` (`Pending`, `In Progress`, `Completed`, `Blocked`).
- Al cerrar una subfase, agregar opcionalmente una línea `Implemented:` con fecha breve y entregables.

## 4) Out of Scope (for now)

- Backend propio, base de datos y autenticación de usuarios.
- Funciones no requeridas por reglas MVP (favoritos persistentes, perfiles, recomendaciones personalizadas).
- Multi-tenancy (no aplicable según reglas).
- Observabilidad avanzada (tracing/metrics), tuning de performance no crítico y optimizaciones prematuras.
- Internacionalización y accesibilidad avanzada fuera de baseline estándar de Next.js.
- Incorporar nuevas fuentes de datos o proveedores distintos de TMDb.
- Introducir librerías de UI externas para reemplazar Tailwind o cambiar stack de rendering.
- Implementar dominio completo de `Series/TV` mientras no se aprueben endpoints y modelos específicos.

## 5) Open Questions

- ¿Se requiere política obligatoria de mocks para TMDb en pruebas y CI, o será opcional por suite?
- ¿Qué cobertura mínima se considera aceptable para aprobar CI en MVP?
- ¿`Series` en el header será placeholder visual temporal o se habilitará en una iteración con endpoints TV dedicados?
- ¿El modal de trailer debe ser componente compartido único entre Home y Detail o se permite variante por contexto?
- ¿Se prioriza implementación de sugerencias de búsqueda en esta iteración o queda en backlog opcional?

## Decisions Confirmed

- No se usará `CURRENT_PHASE.md`; el tracking se mantiene en `DEVELOPMENT_PLAN.md`.
- Se incorpora `docker-compose.yml` en `Phase 1.A`.
- No hay lineamientos de diseño adicionales por ahora.
- No se exige aún política estricta de mocks TMDb.
- **Stack recomendado para este proyecto (oficial propuesto)**:
  - Unit/Integration: **Vitest + Testing Library + `@testing-library/jest-dom`**
  - API mocking en tests: **MSW**
  - E2E crítico (mínimo): **Playwright** (happy paths de Home, Detail, Search)
