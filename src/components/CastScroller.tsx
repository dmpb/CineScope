"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { CastMember } from "@/types/movie";

type CastScrollerProps = {
  cast: CastMember[];
};

export function CastScroller({ cast }: CastScrollerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function scrollByOffset(offset: number) {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  }

  return (
    <div className="space-y-2">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Cast principal</h2>
        <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Desplazar cast a la izquierda"
          onClick={() => scrollByOffset(-320)}
          className="focus-ring premium-transition rounded-md border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Desplazar cast a la derecha"
          onClick={() => scrollByOffset(320)}
          className="focus-ring premium-transition rounded-md border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
        >
          →
        </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto overflow-y-hidden pb-2 pr-2 [scrollbar-color:#3f3f46_transparent] [scrollbar-width:thin]"
        tabIndex={0}
        aria-label="Lista desplazable de cast principal"
        onWheel={(event) => {
          if (!scrollRef.current) {
            return;
          }
          if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            scrollRef.current.scrollLeft += event.deltaY;
          }
        }}
      >
        <ul className="inline-flex min-w-max flex-nowrap gap-3 sm:gap-4" role="list">
          {cast.slice(0, 20).map((member) => (
            <li key={member.id} className="w-[120px] flex-none">
              <Link
                href={`/person/${member.id}`}
                className="group block space-y-2 text-center focus-visible:outline-none"
                aria-label={`Ver ficha de ${member.name}`}
              >
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border border-zinc-700/80 bg-zinc-800 premium-transition group-hover:border-zinc-400 group-focus-visible:border-zinc-400 group-focus-visible:ring-2 group-focus-visible:ring-zinc-300 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-zinc-950">
                  {member.profilePath ? (
                    <Image src={member.profilePath} alt="" fill loading="lazy" className="object-cover" sizes="80px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">N/A</div>
                  )}
                </div>
                <p className="line-clamp-1 text-xs font-medium text-zinc-100 group-hover:text-white">{member.name}</p>
                <p className="line-clamp-1 text-[11px] text-zinc-400 premium-transition group-hover:text-zinc-300">
                  {member.character}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
