"use client";
import { useAuthStore } from "@/stores/auth-store";
import { DeputyBureau } from "@/types/api/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import CheckingAccess from "./shared/access-check-ui";

interface AuthProviderProps {
  children: ReactNode;
  allowedRoles?: DeputyBureau[];
}

const AuthProvider = ({ children, allowedRoles }: AuthProviderProps) => {
  const { orgUnit, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) {
      useAuthStore.getState().loadTokenFromCookie();
      return;
    }

    console.log(
      "Hydrated:",
      hydrated,
      "Role:",
      orgUnit,
      "Allowed:",
      allowedRoles,
    );

    if (!orgUnit) {
      useAuthStore.getState().logout();
      router.replace("/login");
      return;
    }

    if (
      allowedRoles &&
      !allowedRoles.includes(orgUnit?.deputyBureau as DeputyBureau)
    ) {
      router.replace("/unauthorized");
    }
  }, [hydrated, orgUnit?.deputyBureau, allowedRoles, router]);

  console.log(
    "Hydrated:",
    hydrated,
    "Role:",
    orgUnit?.deputyBureau,
    "Allowed:",
    allowedRoles,
  );

  if (!hydrated) {
    return <CheckingAccess />;
  }

  if (allowedRoles && !orgUnit) return null;

  return <>{children}</>;
};

export default AuthProvider;
