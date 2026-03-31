## 🎬 CineScope

CineScope es una aplicación web inspirada en Netflix que permite explorar películas de forma dinámica utilizando datos en tiempo real.

El proyecto está enfocado en ofrecer una experiencia de usuario moderna, rápida y visualmente atractiva, aplicando buenas prácticas de desarrollo frontend, arquitectura limpia y optimización de rendimiento.


## 🚀 Funcionalidades

- 🎥 Navegación por categorías (Tendencias, Populares, Mejor valoradas)
- 🔍 Búsqueda dinámica de películas
- 📄 Vista detallada de cada película
- 🎨 Interfaz moderna inspirada en Netflix
- ⚡ Carga optimizada de datos (ISR)
- 📱 Diseño completamente responsive


## 🧱 Tecnologías

- Next.js (App Router)
- React
- Tailwind CSS
- API de TMDb
- Docker (entorno de desarrollo)


## 🧠 Conceptos clave

Este proyecto demuestra:

- Uso de Server Components en Next.js
- Incremental Static Regeneration (ISR)
- Arquitectura escalable y modular
- Consumo y abstracción de APIs
- Diseño basado en componentes reutilizables


## 🐳 Entorno de desarrollo

El proyecto utiliza Docker para garantizar un entorno de desarrollo consistente y reproducible.

```bash
cp .env.example .env.local
# Edita .env.local y pega tu Read Access Token y (opcional) API Key de TMDb
docker compose up --build
```

Luego abre:

- http://localhost:3000

Variables en `.env.local` (no se suben a git):

- `TMDB_BEARER_TOKEN` (obligatorio para la capa `tmdb`)
- `TMDB_API_KEY` (opcional; la app actual usa solo Bearer)

No hace falta un archivo `.env` aparte: Next.js y Docker usan `.env.local` según las reglas del proyecto.

## ✅ Validaciones de calidad

Ejecuta estos comandos antes de abrir PR:

```bash
docker compose exec web npm run lint
docker compose exec web npm run type-check
docker compose exec web npm run test
```

## 🧪 Smoke E2E (Playwright)

Se incluyen pruebas smoke para los flujos criticos:

- Home -> Detail
- Search con query param

Ejecucion local:

```bash
docker compose build web
docker compose up -d web
docker compose exec web npm run test:e2e:docker
```
