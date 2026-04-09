"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getUiMessages, type UiMessages } from "@/lib/ui-i18n";

const LocaleContext = createContext<UiMessages | null>(null);

type LocaleProviderProps = {
  /** Codigo TMDb resuelto en el servidor (cookie / env), sin funciones en el payload RSC. */
  tmdbLanguage: string;
  children: ReactNode;
};

export function LocaleProvider({ tmdbLanguage, children }: LocaleProviderProps) {
  const messages = useMemo(() => getUiMessages(tmdbLanguage), [tmdbLanguage]);
  return <LocaleContext.Provider value={messages}>{children}</LocaleContext.Provider>;
}

/** Textos de UI; si no hay provider (p. ej. tests aislados), usa español por defecto. */
export function useUiMessages(): UiMessages {
  const ctx = useContext(LocaleContext);
  return ctx ?? getUiMessages("es-ES");
}
