"use client";

export type UserRole =
  | "super-admin"
  | "bureau-head"
  | "adoption"
  | "social-affairs"
  | "womens"
  | "edir"
  | "elderly-disabled";

import { useAuthStore } from "@/stores/auth-store";
export function useCurrentRole(): UserRole | undefined {
  const user = useAuthStore((state) => state.user);
  if (!user?.role) return undefined;
  console.log("USER IN useCurrentRole: ", JSON.stringify(user));

  return user?.role as UserRole;
}
