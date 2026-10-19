import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "am"],

  // Used when no locale matches
  defaultLocale: "en",

  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: "lax",
  },
});
