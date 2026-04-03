# Historial de versiones

## [1.0.0] — 2026-04-02

Primera versión etiquetada del producto: aplicación web tipo streaming sobre **The Movie Database (TMDb)**, con arquitectura Next.js (App Router), datos en servidor y UI unificada.

### Incluido en esta versión

- **Descubrimiento**: inicio con carruseles y filas (tendencias, populares, géneros, etc.), listados de películas y series.
- **Detalle**: fichas de película y serie con reparto, medios, trailers, proveedores, similares y estados de carga alineados con el diseño.
- **Búsqueda**: búsqueda con filtros y resultados infinitos según parámetros de URL.
- **Favoritos**: marcado local en el navegador con experiencia de hidratación estable.
- **Personas**: ficha de actor/actriz con biografía, filmografía (interpretación y equipo), galerías, enlaces externos y hero de backdrop coherente con el detalle de títulos.
- **Acerca de**: página informativa, stack, atribución TMDb y enlaces opcionales (p. ej. GitHub vía `NEXT_PUBLIC_GITHUB_URL`).
- **Pie y navegación**: barra superior responsive, pie con enlaces en español.
- **Calidad**: tests unitarios, E2E donde aplica, lint y comprobación de tipos.

### Notas técnicas

- API TMDb centralizada en `src/lib/tmdb.ts`, caché `revalidate: 60` según convención del proyecto.
- Variables de entorno documentadas en `.env.example` (`TMDB_BEARER_TOKEN`, etc.).
