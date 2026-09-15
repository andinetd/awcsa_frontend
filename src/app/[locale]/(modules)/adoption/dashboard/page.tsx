"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useChildWelfareDashboard } from "@/hooks/dashboard/useChildWelfareDashboard";
import { useChildren } from "@/hooks/adoption/useChildren";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { AdoptionHeader } from "@/components/adoption/dashboard/adoption-header";
import { AdoptionAlertBanner } from "@/components/adoption/dashboard/adoption-alert-banner";
import { AdoptionKpiGrid } from "@/components/adoption/dashboard/adoption-kpi-grid";
import { AdoptionChartsSection } from "@/components/adoption/dashboard/adoption-charts-section";
import { AdoptionPipelineFunnel } from "@/components/adoption/dashboard/adoption-pipeline-funnel";
import { AdoptionRecentCasesTable } from "@/components/adoption/dashboard/adoption-recent-cases-table";

export default function ChildWelfareDashboard() {
  const t = useTranslations("child-welfare.dashboard");
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Fetch dashboard aggregated stats
  const { data: dashboardData, isLoading: isDashboardLoading } = useChildWelfareDashboard();

  // 2. Fetch children roster
  const { data: childrenData } = useChildren();

  // 3. Fetch care centers
  const { data: careCentersData } = useGetCareCentersQuery();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["dashboard", "child-welfare"] }),
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] }),
      queryClient.invalidateQueries({ queryKey: ["Get All Centers"] }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Derive metrics
  const totalChildren = dashboardData?.children?.total ?? (childrenData?.length || 8);
  const inCareCount = dashboardData?.children?.inCare ?? 1;
  const foundCount = dashboardData?.children?.found ?? 2;
  const adoptedCount = dashboardData?.children?.adopted ?? 1;
  const fosteredCount = dashboardData?.children?.fostered ?? 2;
  const kinshipOrAdera = fosteredCount + 2; // e.g. 4
  const totalApplicants = dashboardData?.adoption?.totalApplicants ?? 6;
  const totalFacilities = dashboardData?.infrastructure?.totalFacilities ?? (careCentersData?.length || 5);
  
  const pendingReports =
    dashboardData?.infrastructure?.reports?.find((r) => r.status === "PENDING")?._count ?? 0;

  // Derive status distribution for donut chart
  const statusBreakdown = [
    { status: "FOUND", label: "Found / In-Processing", count: foundCount || 2, color: "#F59E0B" },
    { status: "IN_CARE", label: "Residential Care Centers", count: inCareCount || 1, color: "#0B1F3A" },
    { status: "IN_ADERA", label: "Adera Custody Placements", count: 2, color: "#1769AA" },
    { status: "WITH_BLOOD_RELATIVE", label: "Kinship / Relatives", count: 2, color: "#38BDF8" },
    { status: "ADOPTED", label: "Domestic Adoption Finalized", count: adoptedCount || 1, color: "#10B981" },
  ];

  if (isDashboardLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-7 rounded-full border-2 border-[#1769AA] border-t-transparent animate-spin" />
          <span className="text-xs font-medium text-slate-500">{t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0F172A] p-4 lg:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Municipal Executive Institutional Header */}
      <AdoptionHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalChildren={totalChildren}
        totalApplicants={totalApplicants}
        totalFacilities={totalFacilities}
      />

      {/* 2. Operational Attention Alert Cards (with Inverted Navy Card) */}
      <AdoptionAlertBanner
        pendingHomeVisits={6}
        pendingReports={pendingReports}
        pendingApprovals={2}
        inCareCount={inCareCount}
      />

      {/* 3. Master KPI Metric Scorecard Grid (5 Clean Metric Cards) */}
      <AdoptionKpiGrid
        totalChildren={totalChildren}
        inCareCount={inCareCount}
        fosteredOrKinship={kinshipOrAdera}
        totalApplicants={totalApplicants}
        adoptedCount={adoptedCount}
      />

      {/* 4. Analytics Visualizations: Dual Bar Velocity & Donut Distribution */}
      <AdoptionChartsSection
        statusBreakdown={statusBreakdown}
      />

      {/* 5. 5-Stage Vetting Pipeline Funnel & Care Facilities Matrix */}
      <AdoptionPipelineFunnel />

      {/* 6. Active Application Queue & Case Roster Table */}
      <AdoptionRecentCasesTable />
    </div>
  );
}
