# 🧠 PROJECT_RULES.md — CineScope

---

# 1. Project Overview

CineScope is a **frontend web application** inspired by Netflix, designed to allow users to browse, search, and explore movies using real-time data from an external API.

Type of application:

* Frontend application (Server-driven SPA)
* Portfolio-level project

Purpose:

* Demonstrate modern frontend architecture
* Showcase API consumption and UI/UX design
* Apply best practices in Next.js and React

---

# 2. Architecture Type (REQUIRED)

**Server-driven SPA (Next.js App Router)**

Justification:

* Uses Next.js Server Components
* Data is fetched on the server and rendered to the client
* Combines SSR/ISR with SPA-like navigation

---

# 3. Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend

* None (external API only)

### Environment

* Docker
* Node.js

---

# 4. External API Specification (CRITICAL)

The project MUST use The Movie Database (TMDb) API as the only data source.

Base URL:
https://api.themoviedb.org/3

Authentication:

* Use Bearer Token (API Key)
* Store in `.env.local`

Required Endpoints:

* GET `/trending/movie/week`
* GET `/movie/popular`
* GET `/movie/top_rated`
* GET `/search/movie?query={query}`
* GET `/movie/{id}`

Image Base URL:
https://image.tmdb.org/t/p/original

---

## API Rules

* All API calls MUST be implemented in `/lib/tmdb.ts`
* Do NOT call APIs directly from components
* Always handle loading, empty, and error states
* Normalize API responses before using them in UI

---

# 5. API Response Modeling (CRITICAL)

All API responses MUST be transformed into internal models.

Do NOT use raw API responses in components.

### Example Model: Movie

* id: number
* title: string
* overview: string
* posterPath: string
* backdropPath: string
* rating: number
* releaseDate: string

---

## DTO vs Domain Model

* DTO = raw TMDb response
* Domain Model = normalized structure

All transformations MUST happen in `/lib/tmdb.ts`

---

# 6. Image Handling Rules

All image paths MUST be constructed using:

https://image.tmdb.org/t/p/original

* Do NOT use raw `poster_path` or `backdrop_path`
* Always return full URLs from the data layer

---

# 7. Architecture Rules (STRICT)

Architecture:

UI Components → Data Layer (lib) → External API

---

## Responsibilities

### Components

* Render UI only
* Receive normalized data via props
* Must be reusable

### Data Layer (/lib)

* Handle API calls
* Transform DTO → Domain Model
* Handle errors

### Models (/types)

* Define TypeScript interfaces
* Ensure consistency

---

# 8. Project Structure Rules

```
src/
│
├── app/
│   ├── page.tsx
│   ├── movie/[id]/page.tsx
│   ├── search/page.tsx
│
├── components/
│
├── lib/
│   └── tmdb.ts
│
├── types/
│   └── movie.ts
```

---

# 9. Framework-Specific Rules (Next.js)

* Use App Router (`/app`)
* Default: Server Components
* Use `"use client"` ONLY when necessary
* Routing is file-based

---

## Component Rendering Rules

* Server Components by default
* Use Client Components only for:

  * user interaction
  * local state

---

# 10. Data Fetching Rules

* Use server-side fetching
* Avoid `useEffect` for main data

---

## Caching Strategy

All fetch calls MUST include:

```ts
next: { revalidate: 60 }
```

---

# 11. State Management

* Prefer server data
* Use React state only for UI interactions
* Avoid global state unless necessary

---

# 12. Search Implementation Rules

* Use URL search params (`?q=`)
* Do NOT persist search in local state
* Read query from route

---

# 13. Error Handling Strategy

* Never crash UI
* Return fallback data if API fails
* Show:

  * loading state
  * error state
  * empty state

---

# 14. Styling Rules

* Use Tailwind CSS only
* Avoid inline styles
* Avoid custom CSS unless necessary

---

# 15. Image Optimization

* Use Next.js `<Image />` component
* Optimize loading and sizes

---

# 16. Naming Conventions

* Components: PascalCase
* Variables: camelCase
* Functions: camelCase
* API functions: descriptive

---

## API Naming Rules

* getTrendingMovies()
* getPopularMovies()
* getMovieById(id)
* searchMovies(query)

---

# 17. Routing Rules

* Use lowercase routes
* Follow Next.js conventions
* Use dynamic routes for IDs

---

# 18. Performance Guidelines

* Avoid unnecessary re-renders
* Use ISR caching
* Optimize images

---

# 19. Logging

* Log API errors only
* Do not log sensitive data

---

# 20. Configuration Management

* Use `.env.local`
* Do not expose secrets
* Do not hardcode API keys

---

# 21. Docker Rules (CRITICAL)

* All commands must run inside Docker
* Do not use host Node.js

---

## Docker Dependency Rule

* Dependencies must be installed inside container
* Do NOT share node_modules with host

---

# 22. Core Entities

* Movie
* Genre
* SearchResult

---

# 23. Multi-Tenancy

* Not applicable

---

# 24. Development Rules

* Keep code simple
* Avoid duplication
* Reuse components

---

## Reusability Rule

Before creating a new component:

* Check if existing component can be reused

---

# 25. Evolution Rule

* Extend existing code
* Maintain consistency

---

# 26. Testing Strategy

* Focus on critical UI flows
* Test components where needed

## Validation execution policy (subphases)

* During each subphase, prioritize fast scoped validation:
  * Run lint only for modified files.
  * Run focused tests only for touched areas when applicable.
  * Avoid running full-project validation on every micro-change.
* After finishing all planned subphases in a batch/phase, run full validation once:
  * `docker compose exec web npm run lint`
  * `docker compose exec web npm run type-check`
  * `docker compose exec web npm run test`
  * `docker compose exec -e CI= web npm run test:e2e:docker` (when UI flows changed)

---

# 27. Development Strategy

Modules:

1. Layout
2. Movie listing
3. Movie detail
4. Search
5. UI polish

---

# 28. Constraints

* MVP-first
* No overengineering
* No unnecessary complexity

---

# 29. AI Behavior Rules (CRITICAL)

AI must:

* Follow PROJECT_RULES.md strictly
* Respect architecture
* Avoid duplication
* Not overwrite working code
* Not introduce new patterns without justification

If unsure:

* Do NOT guess

---

# 30. Output Rules

* Only generate requested output
* Keep responses minimal

---

# 31. Mindset

Act as a senior frontend engineer.

Focus on:

* scalability
* maintainability
* clean architecture
* performance
