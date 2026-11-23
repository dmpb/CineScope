import { cookies } from "next/headers";
import { cache } from "react";
import { parseTasteCookieValue, TASTE_COOKIE } from "@/lib/taste";

export const resolveTasteRefsForRequest = cache(async () => {
  try {
    const store = await cookies();
    const raw = store.get(TASTE_COOKIE)?.value;
    return parseTasteCookieValue(raw);
  } catch {
    return [];
  }
});
