import { DeputyBureau } from "@/types";

export const moduleAndRouteMap = (deputyBureau: DeputyBureau): string => {
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
      return "/super-admin";
    case "WOMEN_AFFAIRS":
      return "/womens/dashboard";
    default:
      return "/";
  }
};
