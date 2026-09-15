import { ADDIS_ABABA_SUBCITIES, SubCityStat } from "./types";

export function generateSubCityStats(
  totalFacilities: number = 18,
  totalChildren: number = 1420,
  totalVulnerable: number = 3850,
  totalEdirs: number = 240
): SubCityStat[] {
  // Proportional weights for each sub-city in Addis Ababa
  const weights: Record<string, number> = {
    Bole: 0.14,
    Yeka: 0.12,
    Kirkos: 0.09,
    Arada: 0.08,
    Lideta: 0.07,
    "Addis Ketema": 0.11,
    Gulele: 0.09,
    "Kolfe Keranio": 0.13,
    "Akaky Kaliti": 0.06,
    "Nifas Silk-Lafto": 0.08,
    "Lemi Kura": 0.03,
  };

  const complianceScores: Record<string, number> = {
    Bole: 96,
    Yeka: 92,
    Kirkos: 89,
    Arada: 94,
    Lideta: 88,
    "Addis Ketema": 85,
    Gulele: 91,
    "Kolfe Keranio": 87,
    "Akaky Kaliti": 93,
    "Nifas Silk-Lafto": 90,
    "Lemi Kura": 84,
  };

  return ADDIS_ABABA_SUBCITIES.map((name) => {
    const w = weights[name] || 0.09;
    return {
      name,
      totalChildren: Math.max(12, Math.round(totalChildren * w)),
      vulnerableCitizens: Math.max(30, Math.round(totalVulnerable * w)),
      totalFacilities: Math.max(1, Math.round(totalFacilities * w)),
      activeEdirs: Math.max(5, Math.round(totalEdirs * w)),
      complianceRate: complianceScores[name] || 90,
      recentActivityCount: Math.round(w * 120),
    };
  });
}
