import {
  DeputyBureau,
  JwtUserType,
  OrgType,
  UserRole,
} from "@/types/api/auth";
import { NavigationItem, NavigationSection, sidebarConfig } from "./sidebar-config";

const deputyMap: Record<string, keyof typeof sidebarConfig> = {
  BUREAU_HEAD: "BUREAU_HEAD",
  CHILDREN_AFFAIRS: "CHILDREN_AFFAIRS",
  SOCIAL_AFFAIRS: "SOCIAL_AFFAIRS",
  EDIR: "EDIR",
  WOMEN_AFFAIRS: "WOMEN",
  WOMEN: "WOMEN",
  SUPER_ADMIN: "SUPER_ADMIN",
  CARE_CENTERS_PORTAL: "CARE_CENTERS_PORTAL",
};

const moduleKeyToTitleMap: Record<string, string> = {
  CHILDREN_AFFAIRS: "Adoption",
  SOCIAL_AFFAIRS: "Disability and Elderly",
  EDIR: "Edir",
  WOMEN_AFFAIRS: "Women",
  WOMEN: "Women",
  SUPER_ADMIN: "Admin",
};

export function getSidebarItems(
  orgUnit: OrgType | null | undefined,
  _pathname: string,
  user?: JwtUserType | null,
  userRole?: UserRole | null,
  permissions?: string[],
  entityRole?: string,
  department?: string | null,
  assignedModules?: DeputyBureau[] | null,
): NavigationSection[] {
  const accountType = user?.accountType;

  let rawSections: NavigationSection[];

  // Priority 1: Care Centers Portal (facility account)
  if (
    accountType === "CHILD_CARE_FACLITY" ||
    accountType === "CHILD_CARE_FACILITY" ||
    userRole === "Facility_Admin" ||
    entityRole === "Facility_Admin" ||
    userRole === "FACILITATOR_OFFICER" ||
    entityRole === "FACILITATOR_OFFICER"
  ) {
    rawSections = sidebarConfig.CARE_CENTERS_PORTAL;
  } else if (userRole === "Super_Admin" || entityRole === "Super_Admin") {
    // Priority 2: Super Admin gets the admin management menu PLUS any assigned modules
    const baseAdminSections = sidebarConfig.SUPER_ADMIN.filter(
      (s) => s.title !== "Cross-Department",
    );
    const crossDepartmentSection = sidebarConfig.SUPER_ADMIN.find(
      (s) => s.title === "Cross-Department",
    );

    const effectiveModules: string[] = [
      ...(assignedModules || []),
      ...(department && department !== "SYSTEM" ? [department] : []),
      ...(orgUnit?.deputyBureau ? [orgUnit.deputyBureau] : []),
    ].filter((m): m is string => Boolean(m));

    const uniqueModules = Array.from(new Set(effectiveModules));

    const bureauModulesSection = sidebarConfig.BUREAU_HEAD.find(
      (s) => s.title === "Modules",
    );

    let moduleItems: NavigationItem[] = [];
    if (uniqueModules.includes("SYSTEM")) {
      // System scope: show all operational modules
      moduleItems = (bureauModulesSection?.items || []).filter(
        (item) => item.title !== "Admin",
      );
    } else if (uniqueModules.length > 0) {
      const allowedTitles = new Set(
        uniqueModules.map((m) => moduleKeyToTitleMap[m]).filter(Boolean),
      );
      moduleItems = (bureauModulesSection?.items || []).filter(
        (item) => allowedTitles.has(item.title),
      );
    }

    rawSections = [
      ...baseAdminSections,
      ...(moduleItems.length > 0
        ? [
            {
              title: "Modules",
              items: moduleItems,
            },
          ]
        : []),
      ...(crossDepartmentSection ? [crossDepartmentSection] : []),
    ];
  } else if (
    department === "SYSTEM" ||
    userRole === "Bureau_Manager" ||
    entityRole === "Bureau_Manager"
  ) {
    // Priority 3: Bureau Manager or SYSTEM users see the complete multi-module sidebar
    rawSections = sidebarConfig.BUREAU_HEAD;
  } else {
    // Priority 4: Module-based resolution using assignedModules, department, or orgUnit
    const effectiveModules: string[] = [
      ...(assignedModules || []),
      ...(department && department !== "SYSTEM" ? [department] : []),
      ...(orgUnit?.deputyBureau ? [orgUnit.deputyBureau] : []),
    ].filter((m): m is string => Boolean(m));

    const uniqueModules = Array.from(new Set(effectiveModules));

    const crossDepartmentSection = sidebarConfig.BUREAU_HEAD.find(
      (s) => s.title === "Cross-Department",
    );

    if (uniqueModules.length === 1 && deputyMap[uniqueModules[0]]) {
      // Exactly 1 module assigned: dedicated module sidebar (e.g. EDIR)
      rawSections = sidebarConfig[deputyMap[uniqueModules[0]]];
    } else if (uniqueModules.length > 1) {
      // Multiple modules assigned: scoped multi-module sidebar containing ONLY their modules
      const allowedTitles = new Set(
        uniqueModules.map((m) => moduleKeyToTitleMap[m]).filter(Boolean),
      );

      const bureauModulesSection = sidebarConfig.BUREAU_HEAD.find(
        (s) => s.title === "Modules",
      );
      const filteredModuleItems = (bureauModulesSection?.items || []).filter(
        (item) => allowedTitles.has(item.title),
      );

      rawSections = [
        {
          title: "Modules",
          items: filteredModuleItems,
        },
        ...(crossDepartmentSection ? [crossDepartmentSection] : []),
      ];
    } else {
      // Fallback: Infer from role keywords if no modules assigned
      const roleStr = (entityRole || "").toLowerCase();
      const isWomensRole = roleStr.includes("women");
      const isChildrenRole =
        roleStr.includes("child") || roleStr.includes("adoption");
      const isEdirRole = roleStr.includes("edir");
      const isSocialRole =
        roleStr.includes("social") ||
        roleStr.includes("elderly") ||
        roleStr.includes("disabilit");

      if (isEdirRole) {
        rawSections = sidebarConfig.EDIR;
      } else if (isWomensRole) {
        rawSections = sidebarConfig.WOMEN;
      } else if (isChildrenRole) {
        rawSections = sidebarConfig.CHILDREN_AFFAIRS;
      } else if (isSocialRole) {
        rawSections = sidebarConfig.SOCIAL_AFFAIRS;
      } else {
        // Restricted fallback: show only Cross-Department if permitted
        rawSections = crossDepartmentSection ? [crossDepartmentSection] : [];
      }
    }
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
