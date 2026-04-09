"use client";

import { useEffect, useRef, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
import { createPortal } from "react-dom";

type TrailerModalProps = {
  trailerUrl: string | null;
  movieTitle: string;
};

export function TrailerModal({ trailerUrl, movieTitle }: TrailerModalProps) {
  const ui = useUiMessages();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const hasTrailer = Boolean(trailerUrl);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        disabled={!hasTrailer}
        onClick={() => {
          if (hasTrailer) {
            setIsOpen(true);
          }
        }}
        className="focus-ring premium-transition inline-flex items-center rounded-lg border border-zinc-400/30 bg-black/35 px-4 py-2.5 text-sm font-medium text-zinc-100 hover:border-zinc-200/60 hover:bg-black/55 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {ui.trailerWatch}
      </button>

      {isMounted &&
        isOpen &&
        trailerUrl &&
        createPortal(
          <div
            role="presentation"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[200] isolate flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={ui.trailerDialogTitle(movieTitle)}
              onClick={(event) => event.stopPropagation()}
              className="glass-surface relative z-[210] w-full max-w-4xl overflow-hidden rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-zinc-700/70 px-4 py-3">
                <p className="truncate text-sm font-medium text-zinc-100">{ui.trailerDialogTitle(movieTitle)}</p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="focus-ring premium-transition rounded-md px-2 py-1 text-sm text-zinc-300 hover:text-zinc-100"
                >
                  {ui.trailerClose}
                </button>
              </div>
              <iframe
                src={trailerUrl}
                title={ui.trailerDialogTitle(movieTitle)}
                className="aspect-video w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
