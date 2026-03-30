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
docker compose up --build
```

Luego abre:

- http://localhost:3000

Variables requeridas en `.env.local`:

- `TMDB_BEARER_TOKEN`
