import { ADDIS_ABABA_SUBCITIES, SubCityStat, DirectorateSummary, MetricCardData } from "./types";

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

export function buildMetricCards(params: {
  totalChildren: number;
  totalVulnerable: number;
  totalFacilities: number;
  totalEdirs: number;
  submittedReports: number;
  pendingReports: number;
  womenProfilesCount?: number;
}): MetricCardData[] {
  const {
    totalChildren,
    totalVulnerable,
    totalFacilities,
    totalEdirs,
    submittedReports,
    pendingReports,
    womenProfilesCount = 1280,
  } = params;

  const totalBeneficiaries =
    (totalChildren || 1420) +
    (totalVulnerable || 3850) +
    (womenProfilesCount || 1280);

  const totalReports = (submittedReports || 0) + (pendingReports || 0);
  const compliancePct = totalReports > 0
    ? Math.round((submittedReports / totalReports) * 100)
    : 92;

  return [
    {
      id: "beneficiaries",
      title: "Total Beneficiaries Reached",
      value: totalBeneficiaries,
      changePercent: 14.8,
      changeType: "positive",
      subtitle: "Children, vulnerable citizens & women empowered",
      secondaryMetric: {
        label: "Annual Target",
        value: "86.4% Met",
      },
      sparkline: [
        { date: "Jan", value: 3800 },
        { date: "Feb", value: 4200 },
        { date: "Mar", value: 4900 },
        { date: "Apr", value: 5400 },
        { date: "May", value: 5900 },
        { date: "Jun", value: totalBeneficiaries },
      ],
      colorTheme: "blue",
    },
    {
      id: "children",
      title: "Child Welfare & Care Facilities",
      value: totalChildren || 1420,
      changePercent: 8.2,
      changeType: "positive",
      subtitle: `${totalFacilities || 18} Verified Care Centers & Shelters`,
      secondaryMetric: {
        label: "Care Center Load",
        value: "74% Occupied",
      },
      sparkline: [
        { date: "Jan", value: 920 },
        { date: "Feb", value: 1040 },
        { date: "Mar", value: 1180 },
        { date: "Apr", value: 1250 },
        { date: "May", value: 1350 },
        { date: "Jun", value: totalChildren || 1420 },
      ],
      colorTheme: "emerald",
    },
    {
      id: "vulnerable",
      title: "Vulnerable Social Assistance",
      value: totalVulnerable || 3850,
      changePercent: 11.5,
      changeType: "positive",
      subtitle: "Elderly & Persons with Disabilities registered",
      secondaryMetric: {
        label: "Aids Distributed",
        value: "1,240 Devices",
      },
      sparkline: [
        { date: "Jan", value: 2600 },
        { date: "Feb", value: 2900 },
        { date: "Mar", value: 3150 },
        { date: "Apr", value: 3400 },
        { date: "May", value: 3680 },
        { date: "Jun", value: totalVulnerable || 3850 },
      ],
      colorTheme: "violet",
    },
    {
      id: "women",
      title: "Women Development & Jobs",
      value: womenProfilesCount || 1280,
      changePercent: 19.3,
      changeType: "positive",
      subtitle: "Vocational skills, tech kits & associations",
      secondaryMetric: {
        label: "Job Placement",
        value: "640 Employed",
      },
      sparkline: [
        { date: "Jan", value: 650 },
        { date: "Feb", value: 780 },
        { date: "Mar", value: 910 },
        { date: "Apr", value: 1050 },
        { date: "May", value: 1190 },
        { date: "Jun", value: womenProfilesCount || 1280 },
      ],
      colorTheme: "rose",
    },
    {
      id: "compliance",
      title: "Monthly Reporting Compliance",
      value: `${compliancePct}%`,
      changePercent: 4.1,
      changeType: "positive",
      subtitle: `${submittedReports || 142} submitted • ${pendingReports || 12} pending`,
      secondaryMetric: {
        label: "Avg Review Time",
        value: "3.2 Days",
      },
      sparkline: [
        { date: "Jan", value: 81 },
        { date: "Feb", value: 84 },
        { date: "Mar", value: 88 },
        { date: "Apr", value: 86 },
        { date: "May", value: 91 },
        { date: "Jun", value: compliancePct },
      ],
      colorTheme: "amber",
    },
  ];
}
