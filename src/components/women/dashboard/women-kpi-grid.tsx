"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface WomenKpiGridProps {
  totalProfiles?: number;
  totalAssociations?: number;
  approvedAssociations?: number;
  submittedAssociations?: number;
  draftAssociations?: number;
  totalMembers?: number;
  totalGroups?: number;
  declaredMembers?: number;
  totalEmployments?: number;
  totalTechSupport?: number;
  totalTrainings?: number;
}

export function WomenKpiGrid({
  totalProfiles = 0,
  totalAssociations = 0,
  approvedAssociations = 0,
  submittedAssociations = 0,
  draftAssociations = 0,
  totalMembers = 0,
  totalGroups = 0,
  declaredMembers = 0,
  totalEmployments = 0,
  totalTechSupport = 0,
  totalTrainings = 0,
}: WomenKpiGridProps) {
  const kpis = [
    {
      title: "Total Tracked Women",
      value: totalProfiles,
      badge: "Verified",
      detail: "Addis Ababa municipal registry",
      subDetail: "All 11 sub-cities tracked",
      trend: "+12% YoY",
    },
    {
      title: "Grassroots Associations",
      value: totalAssociations,
      badge: `${approvedAssociations} Approved`,
      detail: `${draftAssociations} draft · ${submittedAssociations} submitted`,
      subDetail: "Certified community federations",
      trend: "Active federations",
    },
    {
      title: "Organized Group Members",
      value: totalMembers,
      badge: `${totalGroups} Groups`,
      detail: "Cooperative self-help groups",
      subDetail: `${declaredMembers} declared capacity`,
      trend: "High engagement",
    },
    {
      title: "Economic Placements",
      value: totalEmployments,
      badge: "Employment",
      detail: "Manufacturing, services & agriculture",
      subDetail: "Individual & group placements",
      trend: "Livelihood support",
    },
    {
      title: "Technology & Skills Grants",
      value: totalTechSupport + totalTrainings,
      badge: "Capacitated",
      detail: `${totalTechSupport} Technology · ${totalTrainings} Skills`,
      subDetail: "Direct productive empowerment",
      trend: "High impact",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white border border-[#E3E7EB] rounded-xs p-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span className="font-medium truncate">{kpi.title}</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-xs">
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
