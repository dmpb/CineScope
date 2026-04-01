import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <nav aria-label="Navegacion de pagina">
        <Link
          href="/"
          className="focus-ring premium-transition w-fit rounded-md text-sm text-zinc-300 underline-offset-4 hover:text-zinc-100 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </nav>

      <section className="glass-surface space-y-4 rounded-2xl p-5 sm:p-7">
        <h1 className="page-title">About CineScope</h1>
        <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
          CineScope es una experiencia frontend inspirada en plataformas de streaming para explorar peliculas con datos de TMDb.
        </p>
        <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
          Este proyecto prioriza arquitectura limpia, accesibilidad, UX premium y evolucion iterativa por fases.
        </p>
      </section>
    </main>
  );
}
