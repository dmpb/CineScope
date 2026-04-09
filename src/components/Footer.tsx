"use client";

import Link from "next/link";
import { useUiMessages } from "@/components/LocaleProvider";
import { getPublicGithubUrl, SITE_NAME } from "@/lib/site";

export function Footer() {
  const ui = useUiMessages();
  const githubUrl = getPublicGithubUrl();

  return (
    <footer className="border-t border-zinc-800/70 bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-6 text-xs text-zinc-500 sm:px-6 sm:text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE_NAME}</p>
        <nav aria-label={ui.footerNavAria} className="flex items-center gap-4">
          <Link href="/about" className="focus-ring premium-transition rounded text-zinc-500 hover:text-zinc-300">
            {ui.footerAbout}
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring premium-transition rounded text-zinc-500 hover:text-zinc-300"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
