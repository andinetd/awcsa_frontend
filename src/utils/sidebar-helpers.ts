import { EmployeeJwtPayload } from "@/types/api/auth";
import { sidebarConfig } from "./sidebar-config";

export function getSidebarItems(token: EmployeeJwtPayload, pathname: string) {
  const { orgUnit } = token;

  // ✅ Bureau Manager (deputyBureau === null)
  if (orgUnit.type === "BUREAU" && orgUnit.deputyBureau === null) {
    // Route-specific sidebars
    if (pathname.startsWith("/adoption")) return sidebarConfig.ADOPTION;
    if (pathname.startsWith("/social-affairs"))
      return sidebarConfig.SOCIAL_AFFAIRS;
    if (pathname.startsWith("/womens")) return sidebarConfig.WOMENS;
    if (pathname.startsWith("/super-admin")) return sidebarConfig.SUPER_ADMIN;
    if (pathname.startsWith("/bureau-head")) return sidebarConfig.BUREAU_HEAD;

    // Default global view for Bureau Manager
    return sidebarConfig.GLOBAL;
  }

  // ✅ Deputy Bureau (if you later add deputy-specific menus)
  if (orgUnit.type === "BUREAU" && orgUnit.deputyBureau) {
    const deputy = orgUnit.deputyBureau as keyof typeof sidebarConfig;
    return sidebarConfig[deputy] || [];
  }

  // ✅ Woreda level
  if (orgUnit.type === "WOREDA" && orgUnit.id === 3) {
    return sidebarConfig.WOREDA || [];
  }

  // ✅ Subcity level (placeholder for when you add it)
  if (orgUnit.type === "SUBCITY" && orgUnit.id === 2) {
    return sidebarConfig.SUBCITY || [];
  }

  // Fallback → nothing
  return [];
}
