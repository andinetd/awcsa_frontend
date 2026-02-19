import {
  EmployeeJwtPayload,
  JwtUserType,
  OrgType,
  UserRole,
} from "@/types/api/auth";
import { sidebarConfig } from "./sidebar-config";

export function getSidebarItems(
  orgUnit: OrgType | null | undefined,
  pathname: string,
  user?: JwtUserType | null,
  userRole?: UserRole | null,
  permissions?: string[],
  entityRole?: string,
  department?: string | null,
) {
  const accountType = user?.accountType;

  console.log("getSidebarItems called with:", {
    orgUnit,
    pathname,
    accountType,
    userRole,
    permissions,
  });

  const localePrefix = /^\/[a-z]{2}\//;
  const cleanPathname = pathname.replace(localePrefix, "/");

  // Priority 1: Care Centers Portal
  if (
    accountType === "CHILD_CARE_FACLITY" ||
    accountType === "CHILD_CARE_FACILITY"
  ) {
    return sidebarConfig.CARE_CENTERS_PORTAL;
  }

  // Priority 2: Path-based detection for SYSTEM users
  if (department === "SYSTEM") {
    if (cleanPathname.startsWith("/bureau-head") || cleanPathname === "/") {
      return sidebarConfig.BUREAU_HEAD;
    }
    if (cleanPathname.startsWith("/super-admin")) {
      return sidebarConfig.SUPER_ADMIN;
    }
    if (cleanPathname.startsWith("/adoption"))
      return sidebarConfig.CHILDREN_AFFAIRS;
    if (cleanPathname.startsWith("/social-affairs"))
      return sidebarConfig.SOCIAL_AFFAIRS;
    if (cleanPathname.startsWith("/womens")) return sidebarConfig.WOMENS;
    if (cleanPathname.startsWith("/complaints"))
      return sidebarConfig.BUREAU_HEAD;
  }

  // Priority 3: Default Super Admin (for paths not matched above)
  if (userRole === "Super_Admin") {
    return sidebarConfig.SUPER_ADMIN;
  }

  // Priority 3: Bureau Staff & Local Units (Base on orgUnit)
  if (orgUnit) {
    if (
      orgUnit.type === "BUREAU" ||
      orgUnit.type === "OFFICE" ||
      orgUnit.type === "SUBCITY" ||
      orgUnit.type === "WOREDA"
    ) {
      // First try pathname-based detection (most accurate for navigation)
      if (cleanPathname.startsWith("/adoption"))
        return sidebarConfig.CHILDREN_AFFAIRS;
      if (cleanPathname.startsWith("/social-affairs"))
        return sidebarConfig.SOCIAL_AFFAIRS;
      if (cleanPathname.startsWith("/womens")) return sidebarConfig.WOMENS;
      if (cleanPathname.startsWith("/super-admin"))
        return sidebarConfig.SUPER_ADMIN;
      if (cleanPathname.startsWith("/bureau-head"))
        return sidebarConfig.BUREAU_HEAD;
      if (cleanPathname.startsWith("/complaints"))
        return sidebarConfig.BUREAU_HEAD;

      // Special handling for legacy/specific bureau head logic
      if (orgUnit.type === "BUREAU" && !orgUnit.deputyBureau) {
        // Fallback: Try to infer from role and permissions
        const roleStr = (entityRole || "").toLowerCase();
        const isWomensRole = roleStr.includes("women");
        const isChildrenRole =
          roleStr.includes("child") || roleStr.includes("adoption");
        const isSocialRole = roleStr.includes("social");

        const hasWomensPermissions = permissions?.some((p) =>
          p.toLowerCase().includes("women"),
        );
        const hasChildrenPermissions = permissions?.some(
          (p) =>
            p.toLowerCase().includes("child") ||
            p.toLowerCase().includes("adoption"),
        );
        const hasSocialPermissions = permissions?.some(
          (p) =>
            p.toLowerCase().includes("social") ||
            p.toLowerCase().includes("edir"),
        );

        if (isWomensRole || hasWomensPermissions) return sidebarConfig.WOMENS;
        if (isChildrenRole || hasChildrenPermissions)
          return sidebarConfig.CHILDREN_AFFAIRS;
        if (isSocialRole || hasSocialPermissions)
          return sidebarConfig.SOCIAL_AFFAIRS;

        return sidebarConfig.GLOBAL;
      }

      // Specific Deputy Bureau (if set)
      if (orgUnit.deputyBureau) {
        const deputy = orgUnit.deputyBureau as keyof typeof sidebarConfig;
        return sidebarConfig[deputy] || [];
      }

      // Default for local units if no specific path or deputy is matched
      if (orgUnit.type === "WOREDA") return sidebarConfig.WOREDA || [];
      if (orgUnit.type === "SUBCITY") return sidebarConfig.SUBCITY || [];

      // Fallback for OFFICE or BUREAU without deputy
      return sidebarConfig.BUREAU_HEAD;
    }
  }

  return [];
}
