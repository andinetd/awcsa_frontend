"use client";

import React from "react";
import { Building2, ShieldCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubCityRow {
  name: string;
  elderlyCount: number;
  disabledCount: number;
  totalBeneficiaries: number;
  servicesProvided: number;
  coverageStatus: "COMPREHENSIVE" | "ACTIVE" | "PENDING AID" | "NO RECORDS";
}

interface ElderlyDisabledSubCityMatrixProps {
  beneficiariesList?: any[];
  servicesList?: any[];
}

const ADDIS_ABABA_SUBCITIES = [
  "Bole",
  "Yeka",
  "Kirkos",
  "Arada",
  "Gulele",
  "Lideta",
  "Nifas Silk-Lafto",
  "Kolfe Keranio",
  "Akaky Kaliti",
  "Addis Ketema",
  "Lemi Kura",
];

export function ElderlyDisabledSubCityMatrix({
  beneficiariesList = [],
  servicesList = [],
}: ElderlyDisabledSubCityMatrixProps) {
  const subCities: SubCityRow[] = React.useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        elderly: number;
        disabled: number;
        services: number;
      }
    > = {};

    ADDIS_ABABA_SUBCITIES.forEach((name) => {
      map[name.toLowerCase()] = {
        name,
        elderly: 0,
        disabled: 0,
        services: 0,
      };
    });

    beneficiariesList.forEach((b) => {
      const rawSc = (b.subCity || b.address || "").trim();
      const scKey = rawSc.toLowerCase();
      if (!scKey) return;

      if (!map[scKey]) {
        map[scKey] = {
          name: rawSc,
          elderly: 0,
          disabled: 0,
          services: 0,
        };
      }

      if (b.clientCategory === "ELDERLY") {
        map[scKey].elderly += 1;
      } else {
        map[scKey].disabled += 1;
      }
    });

    servicesList.forEach((s) => {
      const rawSc = (s.subCity || "").trim();
      const scKey = rawSc.toLowerCase();
      if (!scKey) return;

      if (!map[scKey]) {
        map[scKey] = {
          name: rawSc,
          elderly: 0,
          disabled: 0,
          services: 0,
        };
      }

      map[scKey].services += 1;
    });

    return Object.values(map).map((sc) => {
      const total = sc.elderly + sc.disabled;
      let status: SubCityRow["coverageStatus"] = "NO RECORDS";

      if (total > 0) {
        if (sc.services >= total) status = "COMPREHENSIVE";
        else if (sc.services > 0) status = "ACTIVE";
        else status = "PENDING AID";
      }

      return {
        name: sc.name,
        elderlyCount: sc.elderly,
        disabledCount: sc.disabled,
        totalBeneficiaries: total,
        servicesProvided: sc.services,
        coverageStatus: status,
      };
    });
  }, [beneficiariesList, servicesList]);

  const totalElderly = subCities.reduce((a, b) => a + b.elderlyCount, 0);
  const totalDisabled = subCities.reduce((a, b) => a + b.disabledCount, 0);
  const totalCensus = subCities.reduce((a, b) => a + b.totalBeneficiaries, 0);
  const totalServices = subCities.reduce((a, b) => a + b.servicesProvided, 0);

  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-[#E3E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-[#1769AA]" />
          <div>
            <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
              Municipal Sub-City Social Protection Matrix
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Distribution of vulnerable beneficiaries, assistive provisions, and protection coverage across 11 sub-cities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="size-2 rounded-full bg-emerald-500" />
            11 Municipal Sub-Cities
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 font-bold uppercase text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Sub-City Administration</th>
              <th className="py-2.5 px-3 text-right">Elderly</th>
              <th className="py-2.5 px-3 text-right">Disabled</th>
              <th className="py-2.5 px-3 text-right">Total Census</th>
              <th className="py-2.5 px-3 text-right">Services Delivered</th>
              <th className="py-2.5 px-3 text-center">Protection Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E7EB]">
            {subCities.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span>{row.name}</span>
                </td>
                <td className="py-2 px-3 text-right text-slate-700">
                  {row.elderlyCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-slate-700">
                  {row.disabledCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right font-bold text-[#0B1F3A]">
                  {row.totalBeneficiaries.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-emerald-700 font-bold">
                  {row.servicesProvided.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <Badge
                    variant="outline"
                    className={`rounded-xs text-[10px] uppercase font-bold tracking-wider font-mono border ${
                      row.coverageStatus === "COMPREHENSIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : row.coverageStatus === "ACTIVE"
                        ? "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
                        : row.coverageStatus === "PENDING AID"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    {row.coverageStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/80 border-t-2 border-[#E3E7EB] font-bold text-slate-900">
            <tr>
              <td className="py-2.5 px-3 uppercase text-[11px]">Total Addis Ababa Census</td>
              <td className="py-2.5 px-3 text-right text-slate-800">{totalElderly.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-slate-800">{totalDisabled.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-[#0B1F3A]">{totalCensus.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-emerald-700">{totalServices.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 font-normal">
                {totalCensus > 0
                  ? `${Math.round((totalServices / totalCensus) * 100)}% Coverage Ratio`
                  : "No Records"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
