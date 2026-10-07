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
      return "/social-affairs/edir/dashboard";

    case 3: // Disability & Elderly Directorate
      return "/social-affairs/dashboard";

    case 4: // Women Directorate
      return "/women/dashboard";

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
    case "WOMEN":
      return "/women/dashboard";
    case "CHILDREN_AFFAIRS":
      return "/adoption/dashboard";
    case "EDIR":
      return "/social-affairs/edir/dashboard";
    case "SOCIAL_AFFAIRS":
      return "/social-affairs/dashboard";
    case "SYSTEM":
      return "/bureau-head";
    default:
      return "/bureau-head";
  }
};

export const getDefaultRouteForUser = (
  user: { accountType: string } | null | undefined,
  department: string | null | undefined,
  assignedModules?: (string | null | undefined)[] | null,
  userRole?: string | null | undefined,
): string => {
  if (!user) return "/login";
  if (userRole === "Super_Admin") return "/super-admin/dashboard";
  if (user.accountType === "CLIENT") return "/applicant-portal/portal";
  if (
    user.accountType === "CHILD_CARE_FACLITY" ||
    user.accountType === "CHILD_CARE_FACILITY"
  ) {
    return "/care-centers-portal";
  }

  if (userRole === "Bureau_Manager" || department === "SYSTEM") {
    return "/bureau-head";
  }

  const validModules = (assignedModules || []).filter(Boolean);
  if (validModules.length > 0) {
    const primaryModule = validModules[0];
    switch (primaryModule) {
      case "WOMEN_AFFAIRS":
      case "WOMEN":
        return "/women/dashboard";
      case "CHILDREN_AFFAIRS":
        return "/adoption/dashboard";
      case "EDIR":
        return "/social-affairs/edir/dashboard";
      case "SOCIAL_AFFAIRS":
        return "/social-affairs/dashboard";
      case "SUPER_ADMIN":
        return "/super-admin/dashboard";
      case "BUREAU_HEAD":
      case "SYSTEM":
        return "/bureau-head";
    }
  }

  return getRouteByDepartment(department);
};
