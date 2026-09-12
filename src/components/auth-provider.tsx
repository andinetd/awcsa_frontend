"use client";
import { useAuthStore } from "@/stores/auth-store";
import { DeputyBureau } from "@/types/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import CheckingAccess from "./shared/access-check-ui";
import { LOGIN_ROUTE, isPublicAuthPath } from "@/lib/auth-routes";

interface AuthProviderProps {
  children: ReactNode;
  allowedRoles?: DeputyBureau[];
  requiredPermissions?: string[];
}

const AuthProvider = ({
  children,
  allowedRoles,
  requiredPermissions,
}: AuthProviderProps) => {
  const { user, department, hydrated, orgUnit } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = isPublicAuthPath(pathname);

  useEffect(() => {
    if (!hydrated) {
      useAuthStore.getState().loadTokenFromCookie();
      return;
    }

    // Skip the auth gate on public auth pages — calling `router.replace` from
    // the login page back to the login page would otherwise cause a render
    // loop and prevent the form from ever showing.
    if (isPublic) {
      return;
    }

    if (!user) {
      useAuthStore.getState().logout();
      router.replace(LOGIN_ROUTE);
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
        return;
      }
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const { userRole, userPermissions } = useAuthStore.getState();
      const isSuperAdmin = userRole === "Super_Admin";
      if (!isSuperAdmin) {
        const hasAllPermissions = requiredPermissions.every((perm) =>
          userPermissions?.includes(perm),
        );
        if (!hasAllPermissions) {
          router.replace("/unauthorized");
          return;
        }
      }
    }
  }, [hydrated, user, department, allowedRoles, requiredPermissions, router, isPublic]);

  if (!hydrated) {
    // Public auth pages should render immediately, even before hydration, so
    // the user never sees a blank/loading screen when they click "Login".
    if (isPublic) return <>{children}</>;
    return <CheckingAccess />;
  }

  if (allowedRoles && !user) return null;

  return <>{children}</>;
};

export default AuthProvider;
