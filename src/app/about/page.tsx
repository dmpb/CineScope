import type { Metadata } from "next";
import Link from "next/link";
import type { IconType } from "react-icons";
import { SiNextdotjs, SiReact, SiTailwindcss, SiThemoviedatabase } from "react-icons/si";
import { getPublicGithubUrl, SITE_NAME } from "@/lib/site";

const stackBadges: ReadonlyArray<{
  label: string;
  Icon: IconType;
  iconClass: string;
}> = [
  { label: "Next.js", Icon: SiNextdotjs, iconClass: "text-zinc-100" },
  { label: "React", Icon: SiReact, iconClass: "text-[#61DAFB]" },
  { label: "Tailwind CSS", Icon: SiTailwindcss, iconClass: "text-[#38BDF8]" },
  { label: "TMDb API", Icon: SiThemoviedatabase, iconClass: "text-[#01D277]" }
];

export const metadata: Metadata = {
  title: `Acerca de | ${SITE_NAME}`,
  description:
    "Qué es CineScope, funcionalidades principales, stack técnico y atribución de datos de The Movie Database (TMDb)."
};

const linkInline =
  "focus-ring premium-transition rounded text-zinc-200 underline-offset-4 hover:text-zinc-50 hover:underline";

const featureCardBase =
  "focus-ring premium-transition relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/35 p-5 backdrop-blur-md hover:border-zinc-600/45 hover:bg-zinc-900/55 hover:shadow-lg hover:shadow-black/20";

const featureCardLink = `${featureCardBase} block`;

export default function AboutPage() {
  const githubUrl = getPublicGithubUrl();
  const hasCustomGithub = Boolean(process.env.NEXT_PUBLIC_GITHUB_URL?.trim());

  return (
    <main className="page-shell">
      <div className="mx-auto w-full max-w-4xl">
        <header className="space-y-4 border-b border-zinc-800/70 pb-10 sm:space-y-5 sm:pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{SITE_NAME}</p>
          <h1 className="page-title">Acerca del proyecto</h1>
          <p className="page-subtitle max-w-2xl text-base sm:text-lg">
            Una experiencia web inspirada en plataformas de streaming para explorar películas y series con datos en tiempo
            real de The Movie Database (TMDb).
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            Arquitectura clara, accesibilidad, interfaz cuidada y mejora continua del producto.
          </p>
        </header>

        <div className="mt-10 space-y-12 sm:mt-12 sm:space-y-14">
          <section aria-labelledby="about-features-heading">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Explora</p>
              <h2 id="about-features-heading" className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                Qué puedes hacer
              </h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-500">
                Usa la barra superior para moverte por la app; aquí tienes un resumen de cada área.
              </p>
            </div>

            <ul className="mt-8 grid list-none gap-4 sm:grid-cols-2">
              <li>
                <Link href="/" className={featureCardLink}>
                  <span className="text-base font-semibold text-zinc-100">Inicio</span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-400">
                    Carruseles y filas con tendencias, populares y más.
                  </span>
                </Link>
              </li>
              <li>
                <div className={`${featureCardBase} cursor-default`}>
                  <span className="text-base font-semibold text-zinc-100">Películas y series</span>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    <Link href="/movies" className={linkInline}>
                      Películas
                    </Link>
                    <span className="text-zinc-600"> · </span>
                    <Link href="/series" className={linkInline}>
                      Series
                    </Link>
                    <span className="text-zinc-500"> — listados para descubrir títulos.</span>
                  </p>
                </div>
              </li>
              <li>
                <Link href="/search" className={featureCardLink}>
                  <span className="text-base font-semibold text-zinc-100">Búsqueda</span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-400">
                    Encuentra títulos con filtros y resultados ampliados.
                  </span>
                </Link>
              </li>
              <li>
                <div className={`${featureCardBase} cursor-default`}>
                  <span className="text-base font-semibold text-zinc-100">Fichas de detalle</span>
                  <span className="mt-2 block text-sm leading-relaxed text-zinc-400">
                    Reparto, galería y trailers cuando la API aporta datos.
                  </span>
                </div>
              </li>
              <li className="sm:col-span-2">
                <Link href="/favoritos" className={featureCardLink}>
                  <span className="text-base font-semibold text-zinc-100">Favoritos</span>
                  <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-zinc-400">
                    Guarda películas y series en este dispositivo (almacenamiento local del navegador).
                  </span>
                </Link>
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="about-stack-heading"
            className="glass-surface rounded-2xl p-6 sm:p-8"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Stack</p>
              <h2 id="about-stack-heading" className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                Tecnología
              </h2>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="Tecnologías principales">
              {stackBadges.map(({ label, Icon, iconClass }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-950/50 py-1.5 pl-2.5 pr-3.5 text-xs font-medium text-zinc-200"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Construido con{" "}
              <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className={linkInline}>
                Next.js
              </a>{" "}
              (App Router),{" "}
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className={linkInline}>
                React
              </a>{" "}
              y{" "}
              <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className={linkInline}>
                Tailwind CSS
              </a>
              . Catálogo y metadatos provienen de la API de TMDb.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Código en{" "}
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkInline}>
                GitHub
              </a>
              .
            </p>
            {!hasCustomGithub && (
              <p className="mt-3 rounded-lg border border-dashed border-zinc-800/90 bg-zinc-950/30 px-3 py-2.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                Configura{" "}
                <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.8rem] text-zinc-400">
                  NEXT_PUBLIC_GITHUB_URL
                </code>{" "}
                en{" "}
                <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.8rem] text-zinc-400">
                  .env.local
                </code>{" "}
                para enlazar tu repositorio.
              </p>
            )}
          </section>

          <section
            aria-labelledby="about-tmdb-heading"
            className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/80 via-zinc-950/90 to-zinc-950 p-6 sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent-red)]/10 blur-3xl"
              aria-hidden
            />
            <div className="relative space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Legal</p>
              <h2 id="about-tmdb-heading" className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                Datos y atribución
              </h2>
            </div>
            <p className="relative mt-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Este producto utiliza la API de{" "}
              <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className={linkInline}>
                TMDb
              </a>{" "}
              pero no está avalado ni certificado por{" "}
              <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className={linkInline}>
                The Movie Database
              </a>
              .
            </p>
            <p className="relative mt-3 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              Más información:{" "}
              <a
                href="https://developer.themoviedb.org/docs/faq"
                target="_blank"
                rel="noopener noreferrer"
                className={linkInline}
              >
                FAQ de TMDb
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
