"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useUiMessages } from "@/components/LocaleProvider";
import {
  isAllowedTmdbLanguage,
  TMDB_LANGUAGE_OPTIONS,
  TMDB_USER_LANGUAGE_COOKIE
} from "@/lib/tmdb-language";

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

type LanguageSelectorProps = {
  initialCode: string;
};

export function LanguageSelector({ initialCode }: LanguageSelectorProps) {
  const ui = useUiMessages();
  const router = useRouter();
  const safeInitial = isAllowedTmdbLanguage(initialCode) ? initialCode : TMDB_LANGUAGE_OPTIONS[0].code;
  const [value, setValue] = useState(safeInitial);

  const persistAndRefresh = useCallback(
    (code: string) => {
      if (!isAllowedTmdbLanguage(code)) {
        return;
      }
      document.cookie = `${TMDB_USER_LANGUAGE_COOKIE}=${encodeURIComponent(code)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
      setValue(code);
      router.refresh();
    },
    [router]
  );

  return (
    <div className="flex shrink-0 items-center">
      <label htmlFor="cinescope-lang" className="sr-only">
        {ui.languageSrLabel}
      </label>
      <select
        id="cinescope-lang"
        value={value}
        onChange={(e) => persistAndRefresh(e.target.value)}
        className="focus-ring max-w-[7.5rem] cursor-pointer rounded-md border border-zinc-700/80 bg-zinc-900/90 py-1 pl-2 pr-6 text-xs font-medium text-zinc-200 shadow-sm backdrop-blur-sm sm:max-w-[11rem] sm:text-sm"
        aria-label={ui.languageAriaLabel}
      >
        {TMDB_LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
