import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/70 bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-6 text-xs text-zinc-500 sm:px-6 sm:text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} CineScope</p>
        <nav aria-label="Footer links" className="flex items-center gap-4">
          <Link href="/about" className="focus-ring premium-transition rounded text-zinc-500 hover:text-zinc-300">
            About
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="focus-ring premium-transition rounded text-zinc-500 hover:text-zinc-300"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
