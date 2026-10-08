"use client";

import React from "react";
import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EdirSubCityRow {
  name: string;
  edirCount: number;
  activeEdirs: number;
  councilCount: number;
  recordedMembers: number;
  complianceRating: "COMPLIANT" | "PARTIAL" | "AUDIT REQUIRED" | "NO RECORDS";
}

interface EdirSubCityMatrixProps {
  edirList?: any[];
  councilList?: any[];
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

export function EdirSubCityMatrix({
  edirList = [],
  councilList = [],
}: EdirSubCityMatrixProps) {
  const subCities: EdirSubCityRow[] = React.useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        edirs: number;
        active: number;
        councils: number;
        members: number;
      }
    > = {};

    ADDIS_ABABA_SUBCITIES.forEach((name) => {
      map[name.toLowerCase()] = {
        name,
        edirs: 0,
        active: 0,
        councils: 0,
        members: 0,
      };
    });

    edirList.forEach((e) => {
      const rawSc = (e.subCity || "").trim();
      const scKey = rawSc.toLowerCase();
      if (!scKey) return;

      if (!map[scKey]) {
        map[scKey] = {
          name: rawSc,
          edirs: 0,
          active: 0,
          councils: 0,
          members: 0,
        };
      }

      map[scKey].edirs += 1;
      if (e.status === "ACTIVE") {
        map[scKey].active += 1;
      }

      const totalEdirMembers =
        (Number(e.managementMale) || 0) +
        (Number(e.managementFemale) || 0) +
        (Number(e.generalMale) || 0) +
        (Number(e.generalFemale) || 0);

      map[scKey].members += totalEdirMembers;
    });

    councilList.forEach((c) => {
      const rawSc = (c.subCity || "").trim();
      const scKey = rawSc.toLowerCase();
      if (!scKey) return;

      if (!map[scKey]) {
        map[scKey] = {
          name: rawSc,
          edirs: 0,
          active: 0,
          councils: 0,
          members: 0,
        };
      }

      map[scKey].councils += 1;
    });

    return Object.values(map).map((sc) => {
      let rating: EdirSubCityRow["complianceRating"] = "NO RECORDS";
      if (sc.edirs > 0) {
        const rate = (sc.active / sc.edirs) * 100;
        if (rate >= 80) rating = "COMPLIANT";
        else if (rate >= 50) rating = "PARTIAL";
        else rating = "AUDIT REQUIRED";
      }

      return {
        name: sc.name,
        edirCount: sc.edirs,
        activeEdirs: sc.active,
        councilCount: sc.councils,
        recordedMembers: sc.members,
        complianceRating: rating,
      };
    });
  }, [edirList, councilList]);

  const totalRegistered = subCities.reduce((a, b) => a + b.edirCount, 0);
  const totalCouncils = subCities.reduce((a, b) => a + b.councilCount, 0);
  const totalMembers = subCities.reduce((a, b) => a + b.recordedMembers, 0);

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
              Grassroots community associations census, federated councils, and recorded membership across Addis Ababa
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
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
              <th className="py-2.5 px-3 text-right">Registered Edirs</th>
              <th className="py-2.5 px-3 text-right">Active Standing</th>
              <th className="py-2.5 px-3 text-right">Federated Councils</th>
              <th className="py-2.5 px-3 text-right">Recorded Members</th>
              <th className="py-2.5 px-3 text-center">Accreditation Status</th>
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
                <td className="py-2 px-3 text-right text-emerald-700 font-medium">
                  {row.activeEdirs.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-[#1769AA] font-bold">
                  {row.councilCount.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right text-slate-700 font-medium">
                  {row.recordedMembers > 0
                    ? row.recordedMembers.toLocaleString()
                    : "—"}
                </td>
                <td className="py-2 px-3 text-center">
                  <Badge
                    variant="outline"
                    className={`rounded-xs text-[10px] uppercase font-bold tracking-wider font-mono border ${
                      row.complianceRating === "COMPLIANT"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : row.complianceRating === "PARTIAL"
                        ? "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
                        : row.complianceRating === "AUDIT REQUIRED"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    {row.complianceRating}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50/80 border-t-2 border-[#E3E7EB] font-bold text-slate-900">
            <tr>
              <td className="py-2.5 px-3 uppercase text-[11px]">Total Addis Ababa Census</td>
              <td className="py-2.5 px-3 text-right text-[#0B1F3A]">{totalRegistered.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-emerald-700">
                {subCities.reduce((a, b) => a + b.activeEdirs, 0).toLocaleString()}
              </td>
              <td className="py-2.5 px-3 text-right text-[#1769AA]">{totalCouncils.toLocaleString()}</td>
              <td className="py-2.5 px-3 text-right text-slate-800">
                {totalMembers > 0 ? totalMembers.toLocaleString() : "—"}
              </td>
              <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 font-normal">
                {totalRegistered > 0
                  ? `${Math.round(
                      (subCities.reduce((a, b) => a + b.activeEdirs, 0) / totalRegistered) *
                        100
                    )}% Compliant`
                  : "No Records"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
