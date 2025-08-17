import { EmployeeJwtPayload, OrgType } from "@/types/api/auth";
import { sidebarConfig } from "./sidebar-config";

export function getSidebarItems(orgUnit: OrgType, pathname: string) {
  console.log("getSidebarItems called with:", { orgUnit, pathname });
  console.log("sidebarConfig.ADOPTION:", sidebarConfig.ADOPTION); // Verify ADOPTION exists

  const localePrefix = /^\/[a-z]{2}\//;
  const cleanPathname = pathname.replace(localePrefix, "/");
  console.log("Path details:", { pathname, cleanPathname });

  if (orgUnit.type === "BUREAU" && orgUnit.deputyBureau === null) {
    console.log("Entered Bureau Manager branch");
    if (cleanPathname.startsWith("/adoption")) {
      console.log(
        "Matched /adoption, returning ADOPTION:",
        sidebarConfig.ADOPTION
      );
      return sidebarConfig.ADOPTION || [];
    }
    if (cleanPathname.startsWith("/social-affairs")) {
      console.log("Matched /social-affairs");
      return sidebarConfig.SOCIAL_AFFAIRS;
    }
    if (cleanPathname.startsWith("/womens")) {
      console.log("Matched /womens");
      return sidebarConfig.WOMENS;
    }
    if (cleanPathname.startsWith("/super-admin")) {
      console.log("Matched /super-admin");
      return sidebarConfig.SUPER_ADMIN;
    }
    if (cleanPathname.startsWith("/bureau-head")) {
      console.log("Matched /bureau-head");
      return sidebarConfig.BUREAU_HEAD;
    }
    console.log("No route matched, defaulting to GLOBAL");
    return sidebarConfig.GLOBAL;
  }

  if (orgUnit.type === "BUREAU" && orgUnit.deputyBureau) {
    const deputy = orgUnit.deputyBureau as keyof typeof sidebarConfig;
    console.log(`Deputy Bureau matched: ${deputy}`);
    return sidebarConfig[deputy] || [];
  }

  if (orgUnit.type === "WOREDA" && orgUnit.id === 3) {
    console.log("WOREDA matched");
    return sidebarConfig.WOREDA || [];
  }

  if (orgUnit.type === "SUBCITY" && orgUnit.id === 2) {
    console.log("SUBCITY matched");
    return sidebarConfig.SUBCITY || [];
  }

  console.log("Returning empty fallback");
  return [];
}
