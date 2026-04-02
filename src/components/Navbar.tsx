"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";

export function Navbar() {
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
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
          {pathname === "/" ? (
            <h1 className="w-fit text-lg font-semibold tracking-tight text-zinc-100">
              <Link href="/" className="focus-ring premium-transition rounded-md hover:text-zinc-200">
                CineScope
              </Link>
            </h1>
          ) : (
            <Link
              href="/"
              className="focus-ring premium-transition w-fit rounded-md text-lg font-semibold tracking-tight text-zinc-100 hover:text-zinc-200"
            >
              CineScope
            </Link>
          )}

          <nav aria-label="Navegacion principal" className="flex items-center justify-start gap-1 lg:justify-center">
            <Link href="/" className={navLinkClassName(pathname === "/")}>
              Home
            </Link>
            <Link href="/movies" className={navLinkClassName(pathname === "/movies")}>
              Peliculas
            </Link>
            <Link href="/series" className={navLinkClassName(pathname === "/series")}>
              Series
            </Link>
          </nav>

          <div className="w-full lg:ml-auto lg:max-w-[240px]">
            <SearchBar compact />
          </div>
        </div>
      </div>
    </header>
  );
}
