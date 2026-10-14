"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useJurisdictionScope() {
  const orgUnit = useAuthStore((s) => s.orgUnit);
  const userRole = useAuthStore((s) => s.userRole);

  const isWoreda = orgUnit?.type === "WOREDA";
  const isSubCity = orgUnit?.type === "OFFICE" || orgUnit?.type === "SUBCITY";
  const isBureau =
    !isWoreda &&
    !isSubCity &&
    (orgUnit?.type === "BUREAU" ||
      userRole === "Super_Admin" ||
      userRole === "Bureau_Manager" ||
      !orgUnit?.subCity);

  const userSubCity =
    (isWoreda || isSubCity) && orgUnit?.subCity ? orgUnit.subCity : null;
  const userWoreda = isWoreda && orgUnit?.woreda ? orgUnit.woreda : null;

  const filterSubCityNames = useMemo(() => {
    return (names: string[]): string[] => {
      if (!userSubCity) return names;
      const filtered = names.filter(
        (name) =>
          name.toLowerCase() === userSubCity.toLowerCase() ||
          name.toLowerCase().replace(/[^a-z]/g, "") ===
            userSubCity.toLowerCase().replace(/[^a-z]/g, "")
      );
      return filtered.length > 0 ? filtered : [userSubCity];
    };
  }, [userSubCity]);

  return {
    isWoreda,
    isSubCity,
    isBureau,
    userSubCity,
    userWoreda,
    orgUnit,
    filterSubCityNames,
  };
}
