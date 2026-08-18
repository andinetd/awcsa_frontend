import {
  JwtUserType,
  OrgType,
  UserRole,
} from "@/types/api/auth";
import { sidebarConfig } from "./sidebar-config";

export function getSidebarItems(
  orgUnit: OrgType | null | undefined,
  _pathname: string,
  user?: JwtUserType | null,
  userRole?: UserRole | null,
  permissions?: string[],
  entityRole?: string,
  department?: string | null,
) {
  const accountType = user?.accountType;

  // Priority 1: Care Centers Portal (facility account)
  if (
    accountType === "CHILD_CARE_FACLITY" ||
    accountType === "CHILD_CARE_FACILITY"
  ) {
    return sidebarConfig.CARE_CENTERS_PORTAL;
  }

  // Priority 2: SYSTEM users see the unified multi-module sidebar
  if (department === "SYSTEM") {
    return sidebarConfig.BUREAU_HEAD;
  }

  // Priority 3: Super Admin gets the admin management menu
  if (userRole === "Super_Admin") {
    return sidebarConfig.SUPER_ADMIN;
  }

  // Priority 4: Resolve by org unit / deputy bureau
  if (orgUnit) {
    const deputyMap: Record<string, keyof typeof sidebarConfig> = {
      BUREAU_HEAD: "BUREAU_HEAD",
      CHILDREN_AFFAIRS: "CHILDREN_AFFAIRS",
      SOCIAL_AFFAIRS: "SOCIAL_AFFAIRS",
      EDIR: "SOCIAL_AFFAIRS",
      WOMEN_AFFAIRS: "WOMENS",
      SUPER_ADMIN: "SUPER_ADMIN",
      CARE_CENTERS_PORTAL: "CARE_CENTERS_PORTAL",
    };

    if (orgUnit.deputyBureau) {
      const deputy = deputyMap[orgUnit.deputyBureau];
      if (deputy) return sidebarConfig[deputy];
    }

    if (
      orgUnit.type === "BUREAU" ||
      orgUnit.type === "OFFICE"
    ) {
      // Fallback: try to infer the module from role and permissions
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
    }
  }

  // Fallback: unified sidebar keeps every user able to navigate
  return sidebarConfig.BUREAU_HEAD;
}
