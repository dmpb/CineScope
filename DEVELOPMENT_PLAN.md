# DEVELOPMENT_PLAN — CineScope

## 1) Current State Summary

- `Status`: `In Progress` (proyecto inicial).
- Existe definición de arquitectura, stack, reglas de capa y endpoints en `PROJECT_RULES.md`.
- Existe descripción funcional de alto nivel en `README.md` (home/listados, detalle, búsqueda, ISR, Docker).
- Existe capa de datos TMDb en `src/lib/tmdb.ts` (Phase 1.B). Aún no hay UI de listados/detalles/búsqueda conectada (Phase 2).
- No hay auth (alineado con reglas: frontend-only con API externa).
- Cliente TMDb, UI MVP, tests criticos y pipeline CI base implementados.
- `Assumption`: tampoco existe configuración Docker operativa versionada en este estado inicial.

## 2) Goals (from rules + repo)

- Implementar estructura App Router en `src/` respetando capas: UI -> `lib` -> TMDb.
- Centralizar todas las llamadas TMDb en `src/lib/tmdb.ts` con normalización DTO -> Domain Model.
- Implementar endpoints requeridos: trending, popular, top rated, search y detail.
- Entregar MVP navegable: Home, Movie Detail y Search por `?q=`.
- Garantizar estados `loading`, `empty`, `error` en flujos críticos.
- Ejecutar y validar calidad (lint/type-check/tests) dentro de Docker.

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

### Phase 4 — UI polish y hardening

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

### Phase 5 — Home Experience Enhancement

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

### Phase 6 — Search & Navigation UX

- `Status`: `Pending`
- `Execution order`: `Phase 6.A -> Phase 6.B`

#### Phase 6.A — Header Search Integration (HIGH PRIORITY)

- `Status`: `Pending`
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

#### Phase 6.B — Improve Search Results Page

- `Status`: `Pending`
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

### Phase 7 — Movie Detail Enhancement

- `Status`: `Pending`
- `Execution order`: `Phase 7.A -> Phase 7.B -> Phase 7.C`

#### Phase 7.A — Enriched Movie Metadata (HIGH PRIORITY)

- `Status`: `Pending`
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

#### Phase 7.B — Trailer Integration (HIGH VALUE)

- `Status`: `Pending`
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

#### Phase 7.C — Cast & Similar Movies

- `Status`: `Pending`
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

### Phase 8 — UI/UX Polish (Post-MVP)

- `Status`: `Pending`
- `Execution order`: `Phase 8.A -> Phase 8.B -> Phase 8.C`

#### Phase 8.A — Horizontal Scroll Rows

- `Status`: `Pending`
- **Objective**
  - Convertir listados de secciones en filas con scroll horizontal tipo streaming app.
- **Definition of done**
  - Filas scrollables con `overflow-x` y comportamiento usable en mobile/desktop.

#### Phase 8.B — Hover Effects

- `Status`: `Pending`
- **Objective**
  - Añadir interacciones hover tipo Netflix para mejorar feedback visual.
- **Definition of done**
  - Animación de escala y overlay informativo visible al hover/focus.

#### Phase 8.C — Skeleton Loaders

- `Status`: `Pending`
- **Objective**
  - Sustituir loaders básicos por skeletons para cards y banner.
- **Definition of done**
  - Skeletons consistentes visibles en estados de carga de Home/Search/Detail.

### Phase 9 — Optional Features (Low Priority)

- `Status`: `Pending`
- `Execution order`: `Phase 9.A -> Phase 9.B`

#### Phase 9.A — Favorites (localStorage)

- `Status`: `Pending`
- **Objective**
  - Permitir guardar/eliminar favoritas en cliente sin backend.
- **Definition of done**
  - Toggle de favoritos disponible en `MovieCard`.
  - Persistencia local usando `localStorage`.

#### Phase 9.B — Infinite Scroll (Search)

- `Status`: `Pending`
- **Objective**
  - Cargar más resultados de búsqueda al hacer scroll.
- **Definition of done**
  - Search soporta paginación incremental por scroll con feedback de carga.

### Post-MVP execution priority

1. `Phase 5.A` — Multi-category Home.
2. `Phase 5.B` — Featured Banner.
3. `Phase 6.A` — Header Search Integration.
4. `Phase 7.A` — Enriched Movie Metadata.

### Recommended next subphase

- **`Phase 6.A`** — integrar búsqueda global en header para elevar navegación y descubrimiento en todas las pantallas.

### Alternative paths

- **Prioridad Home premium rápido**: `5.A -> 5.B -> 6.A`.
- **Prioridad profundidad funcional de detalle**: `7.A -> 7.B -> 7.C`.
- **Prioridad polish visual final**: `8.A -> 8.B -> 8.C`.
- **Prioridad exploración opcional**: `9.A -> 9.B` (cuando no comprometa roadmap principal).

### Progress tracking rule

- Actualizar en este mismo archivo el `Status` de cada `Phase` y `Phase X.Y` (`Pending`, `In Progress`, `Completed`, `Blocked`).
- Al cerrar una subfase, agregar opcionalmente una línea `Implemented:` con fecha breve y entregables.

## 4) Out of Scope (for now)

- Backend propio, base de datos y autenticación de usuarios.
- Funciones no requeridas por reglas MVP (favoritos persistentes, perfiles, recomendaciones personalizadas).
- Multi-tenancy (no aplicable según reglas).
- Observabilidad avanzada (tracing/metrics), tuning de performance no crítico y optimizaciones prematuras.
- Internacionalización y accesibilidad avanzada fuera de baseline estándar de Next.js.

## 5) Open Questions

- ¿Se requiere política obligatoria de mocks para TMDb en pruebas y CI, o será opcional por suite?
- ¿Qué cobertura mínima se considera aceptable para aprobar CI en MVP?

## Decisions Confirmed

- No se usará `CURRENT_PHASE.md`; el tracking se mantiene en `DEVELOPMENT_PLAN.md`.
- Se incorpora `docker-compose.yml` en `Phase 1.A`.
- No hay lineamientos de diseño adicionales por ahora.
- No se exige aún política estricta de mocks TMDb.
- **Stack recomendado para este proyecto (oficial propuesto)**:
  - Unit/Integration: **Vitest + Testing Library + `@testing-library/jest-dom`**
  - API mocking en tests: **MSW**
  - E2E crítico (mínimo): **Playwright** (happy paths de Home, Detail, Search)
