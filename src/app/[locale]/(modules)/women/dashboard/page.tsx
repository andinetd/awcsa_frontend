"use client";

import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import {
  useGetWomenProfilesQuery,
  useGetTechnologySupportQuery,
  useGetWomenTrainingsQuery,
  useGetWomenEmploymentsQuery,
  useGetWomenAssociationsQuery,
  useGetAssociationDashboardQuery,
} from "@/hooks/womens";
import { WomenDashboardHeader } from "@/components/women/dashboard/women-dashboard-header";
import { WomenKpiGrid } from "@/components/women/dashboard/women-kpi-grid";
import { WomenChartsSection } from "@/components/women/dashboard/women-charts-section";
import { WomenSubCityMatrix } from "@/components/women/dashboard/women-subcity-matrix";
import { WomenQuickActions } from "@/components/women/dashboard/women-quick-actions";

export default function WomenDashboard() {
  const t = useTranslations("women.dashboard");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TanStack Queries
  const { data: profiles, isLoading: isProfilesLoading } = useGetWomenProfilesQuery();
  const { data: techSupport, isLoading: isTechLoading } = useGetTechnologySupportQuery();
  const { data: trainings, isLoading: isTrainingsLoading } = useGetWomenTrainingsQuery();
  const { data: employments, isLoading: isEmploymentsLoading } = useGetWomenEmploymentsQuery();
  const { data: associationsResponse, isLoading: isAssocListLoading } = useGetWomenAssociationsQuery();
  const { data: assocDashboardResponse, isLoading: isDashboardLoading } = useGetAssociationDashboardQuery();

  const stats = assocDashboardResponse?.data;
  const associations = associationsResponse?.data || [];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["women-profiles"] }),
      queryClient.invalidateQueries({ queryKey: ["technology-support"] }),
      queryClient.invalidateQueries({ queryKey: ["women-trainings"] }),
      queryClient.invalidateQueries({ queryKey: ["women-employments"] }),
      queryClient.invalidateQueries({ queryKey: ["women-associations"] }),
      queryClient.invalidateQueries({ queryKey: ["association-dashboard"] }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Metrics
  const totalProfiles = profiles?.length ?? 0;
  const totalAssociations = associations.length || (stats?.total ?? 0);
  const approvedAssociations = stats?.byStatus?.APPROVED ?? 0;
  const submittedAssociations = stats?.byStatus?.SUBMITTED ?? 0;
  const draftAssociations = stats?.byStatus?.DRAFT ?? 0;
  const totalMembers = stats?.totalMembers ?? 0;
  const totalGroups = stats?.totalGroups ?? 0;
  const declaredMembers = stats?.declaredMembers ?? 0;
  const incompleteCount = stats?.incomplete ?? 0;
  const totalEmployments = employments?.length ?? 0;
  const totalTechSupport = techSupport?.length ?? 0;
  const totalTrainings = trainings?.length ?? 0;

  // Genuine Program Breakdown for Donut Chart
  const programBreakdown = [
    {
      category: "EMPLOYMENT",
      label: t("charts.supportDistribution.economic"),
      count: totalEmployments,
      color: "#1769AA",
    },
    {
      category: "TECHNOLOGY",
      label: t("charts.supportDistribution.tech"),
      count: totalTechSupport,
      color: "#0B1F3A",
    },
    {
      category: "TRAINING",
      label: t("charts.supportDistribution.training"),
      count: totalTrainings,
      color: "#F59E0B",
    },
    {
      category: "ASSOCIATIONS",
      label: t("kpis.activeAssociations.title"),
      count: totalAssociations,
      color: "#10B981",
    },
  ];

  // Dynamic Trailing 6-Month Velocity Buckets
  const intakeTrends = useMemo(() => {
    const now = new Date();
    const buckets: { month: string; registered: number; supported: number; year: number; monthIdx: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-US", { month: "short" }).format(d);
      buckets.push({
        month: monthLabel,
        year: d.getFullYear(),
        monthIdx: d.getMonth(),
        registered: 0,
        supported: 0,
      });
    }

    // Tally profile registrations
    (profiles || []).forEach((p: any) => {
      const dateStr = p.createdAt || p.created_at;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const b = buckets.find((bucket) => bucket.monthIdx === d.getMonth() && bucket.year === d.getFullYear());
          if (b) b.registered += 1;
        }
      }
    });

    // Tally delivered livelihood interventions
    const allInterventions = [
      ...(employments || []),
      ...(techSupport || []),
      ...(trainings || []),
    ];

    allInterventions.forEach((item: any) => {
      const dateStr = item.createdAt || item.dateProvided || item.startDate;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const b = buckets.find((bucket) => bucket.monthIdx === d.getMonth() && bucket.year === d.getFullYear());
          if (b) b.supported += 1;
        }
      }
    });

    return buckets.map(({ month, registered, supported }) => ({ month, registered, supported }));
  }, [profiles, employments, techSupport, trainings, locale]);

  const isLoadingInitial =
    isProfilesLoading &&
    isTechLoading &&
    isTrainingsLoading &&
    isEmploymentsLoading &&
    isAssocListLoading &&
    isDashboardLoading;

  if (isLoadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-7 rounded-full border-2 border-[#1769AA] border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-slate-500">
            {t("loading.title")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0F172A] p-4 lg:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Municipal Executive Institutional Header */}
      <WomenDashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalProfiles={totalProfiles}
        totalAssociations={totalAssociations}
        totalMembers={totalMembers}
        totalEmployments={totalEmployments}
        totalTechSupport={totalTechSupport}
        totalTrainings={totalTrainings}
      />

      {/* 2. Master KPI Metric Scorecard Grid (Unified 5-Card Scorecard with Action Docket) */}
      <WomenKpiGrid
        totalProfiles={totalProfiles}
        totalAssociations={totalAssociations}
        approvedAssociations={approvedAssociations}
        submittedAssociations={submittedAssociations}
        draftAssociations={draftAssociations}
        totalMembers={totalMembers}
        totalGroups={totalGroups}
        declaredMembers={declaredMembers}
        totalEmployments={totalEmployments}
        totalTechSupport={totalTechSupport}
        totalTrainings={totalTrainings}
      />

      {/* 3. Analytics Visualizations: Trailing Velocity Trends & Intervention Donut */}
      <WomenChartsSection
        intakeTrends={intakeTrends}
        programBreakdown={programBreakdown}
      />

      {/* 4. Sub-City Municipal Coverage Matrix (All 11 Sub-Cities) & Federation Summary */}
      <WomenSubCityMatrix
        rows={stats?.bySubCity ?? []}
        loading={isDashboardLoading}
        declaredMembers={declaredMembers}
        totalMembers={totalMembers}
        totalGroups={totalGroups}
        approvedCount={approvedAssociations}
        incompleteCount={incompleteCount}
      />

      {/* 5. Primary Module Workflows & Directories Panel */}
      <WomenQuickActions />
    </div>
  );
}