"use client";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types/api/auth";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import CheckingAccess from "./shared/access-check-ui";

interface AuthProviderProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const AuthProvider = ({ children, allowedRoles }: AuthProviderProps) => {
  const { userRole, hydrated } = useAuthStore();
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
      userRole,
      "Allowed:",
      allowedRoles
    );

    if (!userRole) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.replace("/unauthorized");
    }
  }, [hydrated, userRole, allowedRoles, router]);

  console.log(
    "Hydrated:",
    hydrated,
    "Role:",
    userRole,
    "Allowed:",
    allowedRoles
  );

  if (!hydrated) {
    return <CheckingAccess />;
  }

  if (allowedRoles && !userRole) return null;

  return <>{children}</>;
};

export default AuthProvider;
