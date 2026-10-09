"use client";

import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBeneficiaryDashboard } from "@/hooks/beneficiaries/srs-hooks";
import {
  useGetBeneficiariesQuery,
  useGetSupportServicesQuery,
  useGetTrainingsQuery,
  useGetJobsQuery,
} from "@/hooks/beneficiaries";
import { useTranslations } from "next-intl";
import { ElderlyDisabledDashboardHeader } from "./_components/elderly-disabled-dashboard-header";
import { ElderlyDisabledKpiGrid } from "./_components/elderly-disabled-kpi-grid";
import { ElderlyDisabledChartsSection } from "./_components/elderly-disabled-charts-section";
import { ElderlyDisabledSubCityMatrix } from "./_components/elderly-disabled-subcity-matrix";
import { ElderlyDisabledRecentBeneficiaries } from "./_components/elderly-disabled-recent-beneficiaries";
import { ElderlyDisabledQuickActions } from "./_components/elderly-disabled-quick-actions";

export default function ElderlyAndDisabledDashboard() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard");
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TanStack Queries
  const { data: dashboardCounts, isLoading: isDashboardLoading } = useBeneficiaryDashboard();
  const { data: disabledList, isLoading: isDisabledLoading } = useGetBeneficiariesQuery("DISABLED");
  const { data: elderlyList, isLoading: isElderlyLoading } = useGetBeneficiariesQuery("ELDERLY");
  const { data: services, isLoading: isServicesLoading } = useGetSupportServicesQuery();
  const { data: trainings, isLoading: isTrainingsLoading } = useGetTrainingsQuery();
  const { data: jobs, isLoading: isJobsLoading } = useGetJobsQuery();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] }),
      queryClient.invalidateQueries({ queryKey: ["support-services"] }),
      queryClient.invalidateQueries({ queryKey: ["trainings"] }),
      queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Aggregated Counts
  const disabledCount = disabledList?.length || dashboardCounts?.disabledTotal || 0;
  const elderlyCount = elderlyList?.length || dashboardCounts?.elderlyTotal || 0;
  const totalBeneficiaries = dashboardCounts?.beneficiariesTotal || disabledCount + elderlyCount;
  const totalServices = services?.length || 0;
  const totalTrainings = trainings?.length || 0;
  const totalJobs = jobs?.length || 0;

  const pendingEligibility = dashboardCounts?.pendingEligibility || 0;
  const pendingConfirmation = dashboardCounts?.pendingConfirmation || 0;
  const requestedServices = dashboardCounts?.requestedServices || 0;

  const allBeneficiaries = useMemo(
    () => [...(disabledList || []), ...(elderlyList || [])],
    [disabledList, elderlyList]
  );

  const recentBeneficiaries = useMemo(
    () =>
      [...allBeneficiaries]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 8),
    [allBeneficiaries]
  );

  // Genuine Program Breakdown for Donut Chart without arbitrary formulas
  const programBreakdown = useMemo(() => {
    const list = [
      {
        category: "SERVICES",
        label: t("charts.categories.services"),
        count: totalServices,
        color: "#1769AA",
      },
      {
        category: "TRAINING",
        label: t("charts.categories.training"),
        count: totalTrainings,
        color: "#F59E0B",
      },
      {
        category: "EMPLOYMENT",
        label: t("charts.categories.employment"),
        count: totalJobs,
        color: "#10B981",
      },
    ];

    const activeList = list.filter((item) => item.count > 0);
    return activeList.length > 0 ? activeList : list;
  }, [totalServices, totalTrainings, totalJobs, t]);

  // Dynamically compute monthly trends from actual dates
  const intakeTrends = useMemo(() => {
    if (allBeneficiaries.length === 0 && (!services || services.length === 0)) {
      return [];
    }

    let latestTimestamp = Date.now();
    const timestamps = [
      ...allBeneficiaries.map((b) => new Date(b.createdAt || 0).getTime()),
      ...(services || []).map((s: any) => new Date(s.dateProvided || s.createdAt || 0).getTime()),
    ].filter((t) => t > 0);

    if (timestamps.length > 0) {
      latestTimestamp = Math.max(...timestamps);
    }

    const refDate = new Date(latestTimestamp);
    const buckets: { key: string; month: string; registered: number; supported: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const month = d.toLocaleDateString("en-US", { month: "short" });
      buckets.push({ key, month, registered: 0, supported: 0 });
    }

    allBeneficiaries.forEach((b) => {
      if (b.createdAt) {
        const d = new Date(b.createdAt);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const bucket = buckets.find((item) => item.key === key);
          if (bucket) bucket.registered += 1;
        }
      }
    });

    (services || []).forEach((s: any) => {
      const dateStr = s.dateProvided || s.createdAt;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const bucket = buckets.find((item) => item.key === key);
          if (bucket) bucket.supported += 1;
        }
      }
    });

    return buckets.map(({ month, registered, supported }) => ({
      month,
      registered,
      supported,
    }));
  }, [allBeneficiaries, services]);

  const isLoadingInitial =
    isDashboardLoading &&
    isDisabledLoading &&
    isElderlyLoading &&
    isServicesLoading &&
    isTrainingsLoading &&
    isJobsLoading;

  if (isLoadingInitial) {
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
      <ElderlyDisabledDashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Consolidated Master KPI Scorecard Grid */}
      <ElderlyDisabledKpiGrid
        totalBeneficiaries={totalBeneficiaries}
        elderlyTotal={elderlyCount}
        disabledTotal={disabledCount}
        totalServices={totalServices}
        totalJobs={totalJobs}
        totalTrainings={totalTrainings}
        pendingEligibility={pendingEligibility}
        pendingConfirmation={pendingConfirmation}
        requestedServices={requestedServices}
      />

      {/* 3. Analytics Visualizations: Inflow vs Resolution & Service Donut */}
      <ElderlyDisabledChartsSection
        intakeTrends={intakeTrends}
        programBreakdown={programBreakdown}
      />

      {/* 4. Sub-City Municipal Coverage Matrix */}
      <ElderlyDisabledSubCityMatrix
        beneficiariesList={allBeneficiaries}
        servicesList={services}
      />

      {/* 5. Recent Registrations & Beneficiaries Roster */}
      <ElderlyDisabledRecentBeneficiaries
        recentList={recentBeneficiaries}
      />

      {/* 6. Primary Governance Workflows & Shortcuts */}
      <ElderlyDisabledQuickActions />
    </div>
  );
}
