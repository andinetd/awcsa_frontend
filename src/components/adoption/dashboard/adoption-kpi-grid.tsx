"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

interface AdoptionKpiGridProps {
  totalChildren?: number;
  inCareCount?: number;
  fosteredOrKinship?: number;
  totalApplicants?: number;
  adoptedCount?: number;
  facilityCount?: number;
}

export function AdoptionKpiGrid({
  totalChildren = 0,
  inCareCount = 0,
  fosteredOrKinship = 0,
  totalApplicants = 0,
  adoptedCount = 0,
  facilityCount = 0,
}: AdoptionKpiGridProps) {
  const t = useTranslations("adoption");

  const kpis = [
    {
      title: t("dashboard.kpi.totalMinors.title"),
      value: totalChildren,
      badge: t("dashboard.kpi.totalMinors.badge"),
      detail: t("dashboard.kpi.totalMinors.detail"),
      subDetail: t("dashboard.kpi.totalMinors.subDetail"),
      trend: t("dashboard.kpi.totalMinors.trend"),
    },
    {
      title: t("dashboard.kpi.careCenters.title"),
      value: inCareCount,
      badge: t("dashboard.kpi.careCenters.badge"),
      detail: facilityCount > 0 
        ? t("dashboard.kpi.careCenters.detailWithCount", { count: facilityCount })
        : t("dashboard.kpi.careCenters.detailDefault"),
      subDetail: t("dashboard.kpi.careCenters.subDetail"),
      trend: t("dashboard.kpi.careCenters.trend", { count: inCareCount }),
    },
    {
      title: t("dashboard.kpi.aderaAndKinship.title"),
      value: fosteredOrKinship,
      badge: t("dashboard.kpi.aderaAndKinship.badge"),
      detail: t("dashboard.kpi.aderaAndKinship.detail", { count: fosteredOrKinship }),
      subDetail: t("dashboard.kpi.aderaAndKinship.subDetail"),
      trend: t("dashboard.kpi.aderaAndKinship.trend"),
    },
    {
      title: t("dashboard.kpi.activeApplicants.title"),
      value: totalApplicants,
      badge: t("dashboard.kpi.activeApplicants.badge"),
      detail: t("dashboard.kpi.activeApplicants.detail"),
      subDetail: t("dashboard.kpi.activeApplicants.subDetail", { count: totalApplicants }),
      trend: t("dashboard.kpi.activeApplicants.trend"),
    },
    {
      title: t("dashboard.kpi.courtDecrees.title"),
      value: adoptedCount,
      badge: t("dashboard.kpi.courtDecrees.badge"),
      detail: t("dashboard.kpi.courtDecrees.detail"),
      subDetail: t("dashboard.kpi.courtDecrees.subDetail"),
      trend: t("dashboard.kpi.courtDecrees.trend"),
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
