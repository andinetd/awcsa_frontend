"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWomenProfilesQuery,
  useGetTechnologySupportQuery,
  useGetWomenTrainingsQuery,
  useGetWomenEmploymentsQuery,
  useGetWomenAssociationsQuery,
  useGetAssociationDashboardQuery,
} from "@/hooks/womens";
import { WomenDashboardHeader } from "@/components/women/dashboard/women-dashboard-header";
import { WomenAttentionCards } from "@/components/women/dashboard/women-attention-cards";
import { WomenKpiGrid } from "@/components/women/dashboard/women-kpi-grid";
import { WomenChartsSection } from "@/components/women/dashboard/women-charts-section";
import { WomenSubCityMatrix } from "@/components/women/dashboard/women-subcity-matrix";
import { WomenQuickActions } from "@/components/women/dashboard/women-quick-actions";

export default function WomenDashboard() {
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

  // Program Breakdown for Donut Chart
  const programBreakdown = [
    {
      category: "EMPLOYMENT",
      label: "Employment Placements",
      count: totalEmployments || 18,
      color: "#1769AA",
    },
    {
      category: "TECHNOLOGY",
      label: "Productive Technology",
      count: totalTechSupport || 14,
      color: "#0B1F3A",
    },
    {
      category: "TRAINING",
      label: "Vocational Skills",
      count: totalTrainings || 22,
      color: "#F59E0B",
    },
    {
      category: "ASSOCIATIONS",
      label: "Grassroots Associations",
      count: totalAssociations || 16,
      color: "#10B981",
    },
  ];

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
            Loading Women &amp; Social Affairs executive dashboard...
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

      {/* 2. Operational Attention Alert Cards */}
      <WomenAttentionCards
        submittedAssociations={submittedAssociations}
        totalEmployments={totalEmployments}
        totalTechSupport={totalTechSupport}
        totalTrainings={totalTrainings}
      />

      {/* 3. Master KPI Metric Scorecard Grid (5 Clean Metric Cards) */}
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

      {/* 4. Analytics Visualizations: Dual Bar Trends & Donut Allocation */}
      <WomenChartsSection
        programBreakdown={programBreakdown}
      />

      {/* 5. Sub-City Municipal Coverage Matrix & Federation Summary */}
      <WomenSubCityMatrix
        rows={stats?.bySubCity ?? []}
        loading={isDashboardLoading}
        declaredMembers={declaredMembers}
        totalMembers={totalMembers}
        totalGroups={totalGroups}
        approvedCount={approvedAssociations}
        incompleteCount={incompleteCount}
      />

      {/* 6. Primary Module Workflows & Directories Panel */}
      <WomenQuickActions />
    </div>
  );
}