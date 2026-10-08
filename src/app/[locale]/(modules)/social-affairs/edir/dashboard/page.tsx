"use client";

import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetEdirAssociationsQuery,
  useGetEdirCouncilsQuery,
} from "@/hooks/social-affairs";
import { Edir } from "@/api/social-affairs/edir";
import { useTranslations, useLocale } from "next-intl";
import { EdirDashboardHeader } from "./_components/edir-dashboard-header";
import { EdirKpiGrid } from "./_components/edir-kpi-grid";
import { EdirChartsSection } from "./_components/edir-charts-section";
import { EdirSubCityMatrix } from "./_components/edir-subcity-matrix";
import { EdirRecentRegistrations } from "./_components/edir-recent-registrations";
import { EdirQuickActions } from "./_components/edir-quick-actions";

export default function EdirDashboard() {
  const t = useTranslations("social-affairs.edir.dashboard");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: edirs, isLoading: isEdirsLoading } = useGetEdirAssociationsQuery();
  const { data: councils, isLoading: isCouncilsLoading } = useGetEdirCouncilsQuery();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["edir-associations"] }),
      queryClient.invalidateQueries({ queryKey: ["edir-councils"] }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const list: Edir[] = edirs || [];
  const councilList = councils || [];

  const activeEdirs = list.filter((e) => e.status === "ACTIVE").length;
  const expiredEdirs = list.filter((e) => e.status === "EXPIRED").length;
  const revokedEdirs = list.filter((e) => e.status === "REVOKED").length;
  const cancelledEdirs = list.filter((e) => e.status === "CANCELLED").length;

  const currentYear = new Date().getFullYear();
  const renewedThisYear = list.filter(
    (e) => e.lastRenewedAt && new Date(e.lastRenewedAt).getFullYear() === currentYear
  ).length;

  // Real membership aggregations
  const totalManagementMale = list.reduce(
    (acc, e) => acc + (Number(e.managementMale) || 0),
    0
  );
  const totalManagementFemale = list.reduce(
    (acc, e) => acc + (Number(e.managementFemale) || 0),
    0
  );
  const totalGeneralMale = list.reduce(
    (acc, e) => acc + (Number(e.generalMale) || 0),
    0
  );
  const totalGeneralFemale = list.reduce(
    (acc, e) => acc + (Number(e.generalFemale) || 0),
    0
  );

  const maleMembers = totalManagementMale + totalGeneralMale;
  const femaleMembers = totalManagementFemale + totalGeneralFemale;
  const totalMembers = maleMembers + femaleMembers;

  // Genuine status distribution without mock fallbacks
  const statusBreakdown = [
    {
      status: "ACTIVE",
      label: t("charts.activeAccreditation"),
      count: activeEdirs,
      color: "#10B981",
    },
    {
      status: "EXPIRED",
      label: t("charts.expiredLicenses"),
      count: expiredEdirs,
      color: "#F59E0B",
    },
    {
      status: "REVOKED",
      label: t("charts.revokedSanctioned"),
      count: revokedEdirs,
      color: "#EF4444",
    },
    {
      status: "CANCELLED",
      label: t("charts.cancelledDissolved"),
      count: cancelledEdirs,
      color: "#64748B",
    },
  ];

  // Dynamically compute monthly trends from actual dates
  const intakeTrends = useMemo(() => {
    if (list.length === 0) return [];

    // Find the reference date (latest date present or current date)
    let latestTimestamp = Date.now();
    const timestamps = list
      .map((e) => new Date(e.registrationDate || e.createdAt || 0).getTime())
      .filter((t) => t > 0);

    if (timestamps.length > 0) {
      const maxTime = Math.max(...timestamps);
      // If the latest record is within reasonable future/past, anchor there
      if (maxTime > 0) {
        latestTimestamp = maxTime;
      }
    }

    const refDate = new Date(latestTimestamp);
    const buckets: { key: string; month: string; registered: number; renewed: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const month = d.toLocaleDateString(locale === "am" ? "am-ET" : "en-US", { month: "short" });
      buckets.push({ key, month, registered: 0, renewed: 0 });
    }

    list.forEach((e) => {
      const regStr = e.registrationDate || e.createdAt;
      if (regStr) {
        const d = new Date(regStr);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const b = buckets.find((item) => item.key === key);
          if (b) {
            b.registered += 1;
          }
        }
      }

      if (e.lastRenewedAt) {
        const d = new Date(e.lastRenewedAt);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const b = buckets.find((item) => item.key === key);
          if (b) {
            b.renewed += 1;
          }
        }
      }
    });

    return buckets.map(({ month, registered, renewed }) => ({
      month,
      registered,
      renewed,
    }));
  }, [list]);

  const recent = [...list]
    .sort(
      (a, b) =>
        new Date(b.registrationDate || b.createdAt || 0).getTime() -
        new Date(a.registrationDate || a.createdAt || 0).getTime()
    )
    .slice(0, 8);

  if (isEdirsLoading || isCouncilsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 font-mono">
          <div className="size-7 rounded-full border-2 border-[#1769AA] border-t-transparent animate-spin" />
          <span className="text-xs text-slate-500">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0F172A] p-4 lg:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Municipal Executive Header */}
      <EdirDashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Consolidated Master Scorecard Grid */}
      <EdirKpiGrid
        totalEdirs={list.length}
        activeEdirs={activeEdirs}
        expiredEdirs={expiredEdirs}
        revokedEdirs={revokedEdirs}
        cancelledEdirs={cancelledEdirs}
        totalCouncils={councilList.length}
        renewedThisYear={renewedThisYear}
        totalMembers={totalMembers}
        femaleMembers={femaleMembers}
        maleMembers={maleMembers}
      />

      {/* 3. Analytics Visualizations: Inflow Trends & Status Donut */}
      <EdirChartsSection
        intakeTrends={intakeTrends}
        statusBreakdown={statusBreakdown}
      />

      {/* 4. Sub-City Municipal Coverage & Federation Matrix */}
      <EdirSubCityMatrix
        edirList={list}
        councilList={councilList}
      />

      {/* 5. Recent Registrations & Accreditations Roster */}
      <EdirRecentRegistrations recentList={recent} />

      {/* 6. Primary Governance Workflows & Shortcuts */}
      <EdirQuickActions />
    </div>
  );
}