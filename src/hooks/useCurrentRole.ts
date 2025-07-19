"use client";

import { usePathname } from "next/navigation";

export type UserRole =
  | "super-admin"
  | "bureau-head"
  | "adoption"
  | "social-affairs"
  | "womens"
  | "edir"
  | "elderly-disabled";

export function useCurrentRole(): UserRole {
  const pathname = usePathname();
  if (pathname.startsWith("/social-affairs/edir")) return "edir";
  if (pathname.startsWith("/social-affairs/elderly-and-disabled"))
    return "elderly-disabled";
  if (pathname.startsWith("/super-admin")) return "super-admin";
  if (pathname.startsWith("/bureau-head")) return "bureau-head";
  if (pathname.startsWith("/adoption")) return "adoption";
  if (pathname.startsWith("/social-affairs")) return "social-affairs";
  if (pathname.startsWith("/womens")) return "womens";

  // Default fallback
  return "super-admin";
}
