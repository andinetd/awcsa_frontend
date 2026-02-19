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
  const { user, department, hydrated, orgUnit } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) {
      useAuthStore.getState().loadTokenFromCookie();
      return;
    }

    console.log(
      "Hydrated:",
      hydrated,
      "User:",
      user?.email,
      "OrgUnit:",
      orgUnit?.deputyBureau,
      "Allowed:",
      allowedRoles,
    );

    if (!user) {
      useAuthStore.getState().logout();
      router.replace("/login");
      return;
    }

    if (allowedRoles) {
      const { userRole, department } = useAuthStore.getState();
      const isAuthorized = allowedRoles.some((role) => {
        if (role === "CLIENT") return user.accountType === "CLIENT";
        if (role === "CARE_CENTERS_PORTAL")
          return (
            user.accountType === "CHILD_CARE_FACILITY" ||
            user.accountType === "CHILD_CARE_FACLITY"
          );
        // "SYSTEM" department allows everything, or specific role check
        if (department === "SYSTEM") return true;
        return department === role;
      });

      if (!isAuthorized) {
        router.replace("/unauthorized");
      }
    }
  }, [hydrated, user, department, allowedRoles, router]);

  console.log(
    "AuthProvider Rendering - Hydrated:",
    hydrated,
    "User:",
    user?.email,
    "Allowed:",
    allowedRoles,
  );

  if (!hydrated) {
    return <CheckingAccess />;
  }

  if (allowedRoles && !user) return null;

  return <>{children}</>;
};

export default AuthProvider;
