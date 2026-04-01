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
    `focus-ring rounded-full px-3 py-1.5 text-sm font-medium transition ${
      isActive ? "bg-zinc-100/15 text-zinc-100" : "text-zinc-300 hover:text-zinc-100"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${
        isScrolled
          ? "border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl"
          : "border-transparent bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
          <Link
            href="/"
            className="focus-ring w-fit rounded-md text-lg font-semibold tracking-tight text-zinc-100 transition hover:text-zinc-200"
          >
            CineScope
          </Link>

          <nav aria-label="Navegacion principal" className="flex items-center justify-start gap-1 lg:justify-center">
            <Link href="/" className={navLinkClassName(pathname === "/")}>
              Home
            </Link>
            <Link href="/" className={navLinkClassName(pathname === "/movies")}>
              Peliculas
            </Link>
            <Link href="/" className={navLinkClassName(pathname === "/series")}>
              Series
            </Link>
          </nav>

          <div className="w-full lg:ml-auto lg:max-w-md">
            <SearchBar compact />
          </div>
        </div>
      </div>
    </header>
  );
}
