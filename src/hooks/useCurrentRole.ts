"use client";

import { useAuthStore } from "@/stores/auth-store";
import { AppModules, DeputyBureau } from "@/types";
export function useCurrentRole(): AppModules | undefined {
  const user = useAuthStore((state) => state.user);
  if (!user?.role) return undefined;
  console.log("USER IN useCurrentRole: ", JSON.stringify(user));

  return user?.role as AppModules;
}

export function useEmployeModule(): DeputyBureau | undefined {
  const { user } = useAuthStore();
  if (!user?.org.deputyBureau) return undefined;
  return user.org.deputyBureau as DeputyBureau;
}
