import { DeputyBureau } from "@/types/api/auth";

export const moduleAndRouteMap = (deputyBureau: DeputyBureau): string => {
  if (!deputyBureau) return "/bureau-head";
  switch (deputyBureau) {
    case "BUREAU_HEAD":
      return "/bureau-head";
    case "CHILDREN_AFFAIRS":
      return "/adoption/dashboard";
    case "SOCIAL_AFFAIRS":
      return "/social-affairs/socials/dashboard";
    case "EDIR":
      return "/social-affairs/edir/dashboard";
    case "SUPER_ADMIN":
      return "/super-admin/user-management";
    case "WOMEN_AFFAIRS":
      return "/womens/dashboard";
    case "CARE_CENTERS_PORTAL":
      return "/care-centers-portal";
    default:
      return "/";
  }
};
