"use client";

import React from "react";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EdirSubCityRow {
  name: string;
  edirCount: number;
  councilCount: number;
  estimatedHouseholds: number;
  complianceRating: "EXCELLENT" | "GOOD" | "AUDIT REQUIRED";
}

interface EdirSubCityMatrixProps {
  edirList?: any[];
  councilList?: any[];
}

const DEFAULT_EDIR_SUBCITIES: EdirSubCityRow[] = [
  { name: "Bole", edirCount: 124, councilCount: 8, estimatedHouseholds: 24800, complianceRating: "EXCELLENT" },
  { name: "Yeka", edirCount: 112, councilCount: 7, estimatedHouseholds: 22400, complianceRating: "EXCELLENT" },
  { name: "Kirkos", edirCount: 86, councilCount: 5, estimatedHouseholds: 17200, complianceRating: "GOOD" },
  { name: "Arada", edirCount: 78, councilCount: 5, estimatedHouseholds: 15600, complianceRating: "GOOD" },
  { name: "Gulele", edirCount: 94, councilCount: 6, estimatedHouseholds: 18800, complianceRating: "EXCELLENT" },
  { name: "Lideta", edirCount: 68, councilCount: 4, estimatedHouseholds: 13600, complianceRating: "GOOD" },
  { name: "Nifas Silk-Lafto", edirCount: 118, councilCount: 7, estimatedHouseholds: 23600, complianceRating: "EXCELLENT" },
  { name: "Kolfe Keranio", edirCount: 136, councilCount: 9, estimatedHouseholds: 27200, complianceRating: "EXCELLENT" },
  { name: "Akaky Kaliti", edirCount: 74, councilCount: 4, estimatedHouseholds: 14800, complianceRating: "AUDIT REQUIRED" },
  { name: "Addis Ketema", edirCount: 102, councilCount: 6, estimatedHouseholds: 20400, complianceRating: "GOOD" },
  { name: "Lemi Kura", edirCount: 82, councilCount: 5, estimatedHouseholds: 16400, complianceRating: "AUDIT REQUIRED" },
];

export function EdirSubCityMatrix({
  edirList,
  councilList,
}: EdirSubCityMatrixProps) {
  // If lists have actual items with subCity, compute real distribution
  const subCities: EdirSubCityRow[] = React.useMemo(() => {
    if (!edirList || edirList.length === 0) {
      return DEFAULT_EDIR_SUBCITIES;
    }

    const counts: Record<string, { edirs: number; councils: number }> = {};
    DEFAULT_EDIR_SUBCITIES.forEach((sc) => {
      counts[sc.name.toLowerCase()] = { edirs: 0, councils: 0 };
    });

    edirList.forEach((e) => {
      const scKey = (e.subCity || "").toLowerCase().trim();
      if (counts[scKey]) {
        counts[scKey].edirs += 1;
      }
    });

    councilList?.forEach((c) => {
      const scKey = (c.subCity || "").toLowerCase().trim();
      if (counts[scKey]) {
        counts[scKey].councils += 1;
      }
    });

    return DEFAULT_EDIR_SUBCITIES.map((sc) => {
      const k = sc.name.toLowerCase();
      const realEdirs = counts[k]?.edirs || sc.edirCount;
      const realCouncils = counts[k]?.councils || sc.councilCount;
      const households = realEdirs * 200; // Average 200 households per traditional edir

      return {
        ...sc,
        edirCount: realEdirs,
        councilCount: realCouncils,
        estimatedHouseholds: households,
      };
    });
  }, [edirList, councilList]);

  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-[#E3E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-[#1769AA]" />
          <div>
            <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
              Municipal Sub-City Edir &amp; Council Federation Matrix
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Community associations census, federated councils, and household coverage across 11 sub-cities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="size-2 rounded-full bg-emerald-500" />
            11 Sub-Cities Covered
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Sub-City Administration</th>
              <th className="py-2.5 px-3 text-right">Registered Edirs</th>
              <th className="py-2.5 px-3 text-right">Federated Councils</th>
              <th className="py-2.5 px-3 text-right">Covered Households</th>
              <th className="py-2.5 px-3 text-center">Accreditation Standing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E7EB]">
            {subCities.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span>{row.name}</span>
                </td>
                <td className="py-2 px-3 text-right font-bold text-[#0B1F3A]">
                  {row.edirCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-[#1769AA] font-bold">
                  {row.councilCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-slate-700">
                  ~{row.estimatedHouseholds.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <Badge
                    variant="outline"
                    className={`rounded-xs text-[10px] uppercase font-bold tracking-wider font-mono border ${
                      row.complianceRating === "EXCELLENT"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : row.complianceRating === "GOOD"
                        ? "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {row.complianceRating}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
