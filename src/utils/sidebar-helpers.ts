import {
  JwtUserType,
  OrgType,
  UserRole,
} from "@/types/api/auth";
import { NavigationItem, NavigationSection, sidebarConfig } from "./sidebar-config";

export function getSidebarItems(
  orgUnit: OrgType | null | undefined,
  _pathname: string,
  user?: JwtUserType | null,
  userRole?: UserRole | null,
  permissions?: string[],
  entityRole?: string,
  department?: string | null,
): NavigationSection[] {
  const accountType = user?.accountType;

  let rawSections: NavigationSection[];

  // Priority 1: Care Centers Portal (facility account)
  if (
    accountType === "CHILD_CARE_FACLITY" ||
    accountType === "CHILD_CARE_FACILITY"
  ) {
    rawSections = sidebarConfig.CARE_CENTERS_PORTAL;
  } else if (department === "SYSTEM") {
    // Priority 2: SYSTEM users see the unified multi-module sidebar
    rawSections = sidebarConfig.BUREAU_HEAD;
  } else if (userRole === "Super_Admin") {
    // Priority 3: Super Admin gets the admin management menu
    rawSections = sidebarConfig.SUPER_ADMIN;
  } else if (orgUnit) {
    // Priority 4: Resolve by org unit / deputy bureau
    const deputyMap: Record<string, keyof typeof sidebarConfig> = {
      BUREAU_HEAD: "BUREAU_HEAD",
      CHILDREN_AFFAIRS: "CHILDREN_AFFAIRS",
      SOCIAL_AFFAIRS: "SOCIAL_AFFAIRS",
      EDIR: "SOCIAL_AFFAIRS",
      WOMEN_AFFAIRS: "WOMEN",
      SUPER_ADMIN: "SUPER_ADMIN",
      CARE_CENTERS_PORTAL: "CARE_CENTERS_PORTAL",
    };

    if (orgUnit.deputyBureau && deputyMap[orgUnit.deputyBureau]) {
      rawSections = sidebarConfig[deputyMap[orgUnit.deputyBureau]];
    } else if (
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

      if (isWomensRole || hasWomensPermissions) {
        rawSections = sidebarConfig.WOMEN;
      } else if (isChildrenRole || hasChildrenPermissions) {
        rawSections = sidebarConfig.CHILDREN_AFFAIRS;
      } else if (isSocialRole || hasSocialPermissions) {
        rawSections = sidebarConfig.SOCIAL_AFFAIRS;
      } else {
        rawSections = sidebarConfig.BUREAU_HEAD;
      }
    } else {
      rawSections = sidebarConfig.BUREAU_HEAD;
    }
  } else {
    // Fallback: unified sidebar keeps every user able to navigate
    rawSections = sidebarConfig.BUREAU_HEAD;
  }

  const isSuperAdmin =
    userRole === "Super_Admin" ||
    (user as any)?.role === "Super_Admin" ||
    (user as any)?.roles?.includes("Super_Admin") ||
    entityRole === "Super_Admin";

  const filterItem = (item: NavigationItem): NavigationItem | null => {
    const requiredPermission =
      item.permission || (item.url === "/persons" ? "view_unified_history" : undefined);

    if (requiredPermission && !isSuperAdmin) {
      if (!permissions?.includes(requiredPermission)) {
        return null;
      }
    }

    if (item.children) {
      const filteredChildren = item.children
        .map(filterItem)
        .filter((child): child is NavigationItem => child !== null);
      return { ...item, children: filteredChildren };
    }

    return item;
  };

  return rawSections
    .map((section) => ({
      ...section,
      items: section.items
        .map(filterItem)
        .filter((item): item is NavigationItem => item !== null),
    }))
    .filter((section) => section.items.length > 0);
}
