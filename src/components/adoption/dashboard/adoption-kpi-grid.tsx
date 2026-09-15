"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Users, Baby, Home, Shield, HeartHandshake } from "lucide-react";

interface AdoptionKpiGridProps {
  totalChildren?: number;
  inCareCount?: number;
  fosteredOrKinship?: number;
  totalApplicants?: number;
  adoptedCount?: number;
}

export function AdoptionKpiGrid({
  totalChildren = 8,
  inCareCount = 1,
  fosteredOrKinship = 4,
  totalApplicants = 6,
  adoptedCount = 1,
}: AdoptionKpiGridProps) {
  const kpis = [
    {
      title: "Total Tracked Minors",
      value: totalChildren,
      badge: "Verified",
      detail: "Addis Ababa municipal registry",
      subDetail: "All 11 sub-cities tracked",
      trend: "+2 this quarter",
    },
    {
      title: "Residential Care Centers",
      value: inCareCount,
      badge: "In-Care",
      detail: "In 5 licensed municipal facilities",
      subDetail: "Active residential guardianship",
      trend: "Stable capacity",
    },
    {
      title: "Adera & Kinship Custody",
      value: fosteredOrKinship,
      badge: "Family Care",
      detail: "2 Adera custody · 2 Kinship",
      subDetail: "Temporary & extended family care",
      trend: "+1 kinship match",
    },
    {
      title: "Active Adoption Applicants",
      value: totalApplicants,
      badge: "In Pipeline",
      detail: "Pre-screened prospective parents",
      subDetail: "6 dossiers in procedural vetting",
      trend: "High intake",
    },
    {
      title: "Court Decrees Finalized",
      value: adoptedCount,
      badge: "Decreed",
      detail: "Permanently placed & ratified",
      subDetail: "Full judicial adoption orders",
      trend: "100% legal compliance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white border border-[#E3E7EB] rounded-md p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-medium truncate">{kpi.title}</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                <CheckCircle2 className="size-2.5 text-[#15803D]" />
                {kpi.badge}
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-[#0F172A] font-mono">
              {kpi.value}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-0.5">
            <div className="text-[11.5px] font-medium text-slate-700 truncate">
              {kpi.detail}
            </div>
            <div className="flex items-center justify-between text-[10.5px] text-slate-400">
              <span className="truncate">{kpi.subDetail}</span>
              <span className="text-[#1769AA] font-medium shrink-0 ml-1">{kpi.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
