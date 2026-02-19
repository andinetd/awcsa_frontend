export const getRouteByDirectorate = (
  directorateId: number | null | undefined,
  teamId: number | null | undefined,
): string => {
  if (!directorateId) {
    return "/bureau-head";
  }

  switch (directorateId) {
    case 1: // Children & Adoption Directorate
      return "/adoption/dashboard";

    case 2: // Edir Directorate
      return "/social-affairs/dashboard";

    case 3: // Disability & Elderly Directorate
      return "/social-affairs/dashboard";

    case 4: // Women Directorate
      return "/womens/dashboard";

    default:
      return "/bureau-head";
  }
};

export const getRouteByDepartment = (
  department: string | null | undefined,
): string => {
  if (!department) return "/bureau-head";

  switch (department) {
    case "WOMEN_AFFAIRS":
      return "/womens/dashboard";
    case "CHILDREN_AFFAIRS":
      return "/adoption/dashboard";
    case "SOCIAL_AFFAIRS":
    case "EDIR":
      return "/social-affairs/dashboard";
    case "SYSTEM":
      return "/bureau-head";
    default:
      return "/bureau-head";
  }
};
