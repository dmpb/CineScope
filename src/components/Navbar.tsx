"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SearchBar } from "@/components/SearchBar";

type NavbarProps = {
  initialTmdbLanguage: string;
};

export function Navbar({ initialTmdbLanguage }: NavbarProps) {
  const ui = useUiMessages();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navLinkClassName = (isActive: boolean) =>
    `focus-ring premium-transition rounded-full px-3 py-1.5 text-sm font-medium ${
      isActive ? "glass-surface-soft text-zinc-100" : "text-zinc-300 hover:text-zinc-100"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b premium-transition ${
        isScrolled
          ? "glass-surface border-zinc-800/80"
          : "border-transparent bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-3 sm:px-6">
        {/*
          Movil: fila 1 = marca + busqueda (2 columnas); fila 2 = enlaces a ancho completo.
          lg+: una fila [marca | nav centrado | busqueda alineada a la derecha].
        */}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-6 lg:gap-y-0">
          <div className="col-start-1 row-start-1 flex min-w-0 items-center self-center">
            {pathname === "/" ? (
              <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
                <Link href="/" className="focus-ring premium-transition rounded-md hover:text-zinc-200">
                  CineScope
                </Link>
              </h1>
            ) : (
              <Link
                href="/"
                className="focus-ring premium-transition rounded-md text-lg font-semibold tracking-tight text-zinc-100 hover:text-zinc-200"
              >
                CineScope
              </Link>
            )}
          </div>

          <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-2 self-center lg:col-start-3 lg:row-start-1 lg:w-full lg:max-w-[min(100%,380px)] lg:justify-self-end">
            <LanguageSelector initialCode={initialTmdbLanguage} />
            <div className="min-w-0 flex-1 lg:max-w-[240px]">
              <SearchBar compact />
            </div>
          </div>

          <nav
            aria-label={ui.navAriaLabel}
            className="col-span-2 row-start-2 flex flex-wrap items-center gap-x-1 gap-y-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:flex-nowrap lg:justify-center lg:justify-self-center lg:gap-1"
          >
            <Link href="/" className={navLinkClassName(pathname === "/")}>
              {ui.navHome}
            </Link>
            <Link href="/movies" className={navLinkClassName(pathname === "/movies")}>
              {ui.navMovies}
            </Link>
            <Link href="/series" className={navLinkClassName(pathname === "/series")}>
              {ui.navSeries}
            </Link>
            <Link href="/favoritos" className={navLinkClassName(pathname === "/favoritos")}>
              {ui.navFavorites}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
