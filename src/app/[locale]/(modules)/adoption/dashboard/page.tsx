"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useChildWelfareDashboard } from "@/hooks/dashboard/useChildWelfareDashboard";
import { useChildren } from "@/hooks/adoption/useChildren";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { useAdoptionApplicationsQuery } from "@/hooks/adoption/adoption-requests";
import { AdoptionHeader } from "@/components/adoption/dashboard/adoption-header";
import { AdoptionAlertBanner } from "@/components/adoption/dashboard/adoption-alert-banner";
import { AdoptionKpiGrid } from "@/components/adoption/dashboard/adoption-kpi-grid";
import { AdoptionChartsSection } from "@/components/adoption/dashboard/adoption-charts-section";
import { AdoptionPipelineFunnel } from "@/components/adoption/dashboard/adoption-pipeline-funnel";
import { AdoptionRecentCasesTable, AdoptionCaseItem } from "@/components/adoption/dashboard/adoption-recent-cases-table";

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

  // 4. Fetch adoption applications
  const { data: applications = [] } = useAdoptionApplicationsQuery("ALL");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ["dashboard", "child-welfare"] }),
      queryClient.invalidateQueries({ queryKey: ["adoption-children"] }),
      queryClient.invalidateQueries({ queryKey: ["Get All Centers"] }),
      queryClient.invalidateQueries({ queryKey: ["adoption", "applications"] }),
    ]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Derived counts
  const totalChildren = dashboardData?.children?.total ?? (childrenData?.length ?? 0);

  const foundCount = childrenData
    ? childrenData.filter((c) => c.currentStatus === "FOUND").length
    : (dashboardData?.children?.found ?? 0);

  const inCareCount = childrenData
    ? childrenData.filter((c) => c.currentStatus === "IN_CARE").length
    : (dashboardData?.children?.inCare ?? 0);

  const adoptedCount = childrenData
    ? childrenData.filter((c) => c.currentStatus === "ADOPTED").length
    : (dashboardData?.children?.adopted ?? 0);

  const inAderaCount = childrenData
    ? childrenData.filter((c) => c.currentStatus === "IN_ADERA").length
    : Math.floor((dashboardData?.children?.fostered ?? 0) / 2);

  const kinshipCount = childrenData
    ? childrenData.filter((c) => c.currentStatus === "WITH_BLOOD_RELATIVE").length
    : Math.ceil((dashboardData?.children?.fostered ?? 0) / 2);

  const fosteredOrKinship = inAderaCount + kinshipCount;

  const totalApplicants = dashboardData?.adoption?.totalApplicants ?? applications.length;
  const totalFacilities = dashboardData?.infrastructure?.totalFacilities ?? (careCentersData?.length ?? 0);

  const pendingReports =
    dashboardData?.infrastructure?.reports?.find((r) => r.status === "PENDING")?._count ?? 0;

  // Pipeline status breakdown for applications
  const pendingHomeVisits = applications.filter(
    (a) => (a.applicationInfo?.status || a.status) === "PENDING_HOME_VISIT"
  ).length;

  const pendingApprovals = applications.filter(
    (a) => (a.applicationInfo?.status || a.status) === "PENDING_APPROVAL"
  ).length;

  const matchedApps = applications.filter(
    (a) => (a.applicationInfo?.status || a.status) === "MATCHED"
  ).length;

  const finalizedApps = applications.filter(
    (a) => (a.applicationInfo?.status || a.status) === "FINALIZED" || (a.applicationInfo?.status || a.status) === "APPROVED"
  ).length;

  const tAdoption = useTranslations("adoption");

  // Status breakdown for Donut chart
  const statusBreakdown = [
    { status: "FOUND", label: tAdoption("dashboard.charts.statusLabels.FOUND"), count: foundCount, color: "#F59E0B" },
    { status: "IN_CARE", label: tAdoption("dashboard.charts.statusLabels.IN_CARE"), count: inCareCount, color: "#0B1F3A" },
    { status: "IN_ADERA", label: tAdoption("dashboard.charts.statusLabels.IN_ADERA"), count: inAderaCount, color: "#1769AA" },
    { status: "WITH_BLOOD_RELATIVE", label: tAdoption("dashboard.charts.statusLabels.WITH_BLOOD_RELATIVE"), count: kinshipCount, color: "#38BDF8" },
    { status: "ADOPTED", label: tAdoption("dashboard.charts.statusLabels.ADOPTED"), count: adoptedCount, color: "#10B981" },
  ];

  // Pipeline stages calculation
  const totalAppsCount = applications.length;
  const pipelineData = [
    {
      stage: 1,
      title: tAdoption("dashboard.pipeline.stages.stage1.title"),
      description: tAdoption("dashboard.pipeline.stages.stage1.description"),
      count: totalAppsCount,
      unit: tAdoption("dashboard.pipeline.stages.stage1.unit"),
      percentage: totalAppsCount > 0 ? 100 : 0,
      color: "#0B1F3A",
      tabKey: "pending",
    },
    {
      stage: 2,
      title: tAdoption("dashboard.pipeline.stages.stage2.title"),
      description: tAdoption("dashboard.pipeline.stages.stage2.description"),
      count: pendingHomeVisits,
      unit: tAdoption("dashboard.pipeline.stages.stage2.unit"),
      percentage: totalAppsCount > 0 ? Math.round((pendingHomeVisits / totalAppsCount) * 100) : 0,
      color: "#1769AA",
      tabKey: "pending_home_visit",
    },
    {
      stage: 3,
      title: tAdoption("dashboard.pipeline.stages.stage3.title"),
      description: tAdoption("dashboard.pipeline.stages.stage3.description"),
      count: pendingApprovals,
      unit: tAdoption("dashboard.pipeline.stages.stage3.unit"),
      percentage: totalAppsCount > 0 ? Math.round((pendingApprovals / totalAppsCount) * 100) : 0,
      color: "#38BDF8",
      tabKey: "pending_approval",
    },
    {
      stage: 4,
      title: tAdoption("dashboard.pipeline.stages.stage4.title"),
      description: tAdoption("dashboard.pipeline.stages.stage4.description"),
      count: matchedApps,
      unit: tAdoption("dashboard.pipeline.stages.stage4.unit"),
      percentage: totalAppsCount > 0 ? Math.round((matchedApps / totalAppsCount) * 100) : 0,
      color: "#8B5CF6",
      tabKey: "matched",
    },
    {
      stage: 5,
      title: tAdoption("dashboard.pipeline.stages.stage5.title"),
      description: tAdoption("dashboard.pipeline.stages.stage5.description"),
      count: finalizedApps || adoptedCount,
      unit: tAdoption("dashboard.pipeline.stages.stage5.unit"),
      percentage: totalAppsCount > 0 ? Math.round(((finalizedApps || adoptedCount) / totalAppsCount) * 100) : 0,
      color: "#10B981",
      tabKey: "matched",
    },
  ];

  // Care facilities mapping
  const facilities = (careCentersData || []).map((center: any, idx: number) => {
    const occ = (childrenData || []).filter(
      (c) => c.childCareFacilityId === center.id || c.childCareFacility?.name === center.name
    ).length;
    const cap = Number(center.capacity) || 25;
    return {
      id: center.id || idx + 1,
      name: center.name || `Facility ${idx + 1}`,
      type: center.type
        ? center.type.toUpperCase() === "GOVERNMENT"
          ? tAdoption("dashboard.pipeline.facilities.types.government")
          : tAdoption("dashboard.pipeline.facilities.types.licensedNgo")
        : tAdoption("dashboard.pipeline.facilities.types.general"),
      capacity: cap,
      occupancy: occ,
      status: tAdoption("dashboard.pipeline.facilities.active"),
    };
  });

  // Recent cases table mapping
  const recentCases: AdoptionCaseItem[] = (applications || []).map((app) => {
    const applicantName =
      app.applicantInfo?.fullName ||
      `${app.applicantInfo?.firstName || ""} ${app.applicantInfo?.lastName || ""}`.trim() ||
      "Applicant";

    const rawStatus = (app.applicationInfo?.status || app.status || "PENDING_REVIEW").toUpperCase();

    let statusLabel = tAdoption("dashboard.recentCases.tabs.pendingReview");
    if (rawStatus === "PENDING_REVIEW") statusLabel = tAdoption("dashboard.recentCases.tabs.pendingReview");
    else if (rawStatus === "PENDING_HOME_VISIT") statusLabel = tAdoption("dashboard.recentCases.tabs.homeVisit");
    else if (rawStatus === "PENDING_APPROVAL") statusLabel = tAdoption("dashboard.recentCases.tabs.committee");
    else if (rawStatus === "MATCHED") statusLabel = tAdoption("dashboard.recentCases.tabs.matched");
    else if (rawStatus === "FINALIZED" || rawStatus === "APPROVED") statusLabel = tAdoption("dashboard.recentCases.tabs.decreed");
    else if (rawStatus === "REJECTED") statusLabel = tAdoption("adoptionRequests.statuses.denied");
    else statusLabel = rawStatus.replace(/_/g, " ");

    const subCity = app.applicantInfo?.subCity || "—";
    const woreda = app.applicantInfo?.woreda || "—";

    const prefSex = app.applicationInfo?.preferredChildren?.sex;
    const prefAge = app.applicationInfo?.preferredChildren?.ageRange;
    let preference = tAdoption("dashboard.recentCases.standardPlacement");
    if (prefSex && prefAge) {
      preference = `${prefSex}, ${prefAge.min ?? 0}-${prefAge.max ?? 5} yrs`;
    } else if (prefSex) {
      preference = `${prefSex}`;
    } else if (prefAge) {
      preference = `${prefAge.min ?? 0}-${prefAge.max ?? 5} yrs`;
    }

    const dateStr =
      app.applicationInfo?.submittedAt ||
      app.applicationInfo?.submissionDate ||
      app.reviewInfo?.createdAt;
    const submittedDate = dateStr ? new Date(dateStr) : new Date();
    const daysInQueue = !isNaN(submittedDate.getTime())
      ? Math.max(0, Math.floor((Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
    const year = !isNaN(submittedDate.getFullYear()) ? submittedDate.getFullYear() : new Date().getFullYear();
    const caseCode = `AD-${year}-${String(app.applicationId).padStart(3, "0")}`;

    return {
      id: app.applicationId,
      caseCode,
      applicantName,
      subCity,
      woreda,
      preference,
      status: rawStatus,
      statusLabel,
      daysInQueue,
      assignedWorker: app.reviewInfo?.remark 
        ? tAdoption("dashboard.recentCases.assignedOfficerLabel") 
        : tAdoption("dashboard.recentCases.officerDefault"),
    };
  });

  // Calculate trailing 6 months intake trends
  const intakeTrends = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const buckets: { month: string; intake: number; placements: number; year: number; monthIdx: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        month: months[d.getMonth()],
        year: d.getFullYear(),
        monthIdx: d.getMonth(),
        intake: 0,
        placements: 0,
      });
    }

    // Tally child intakes
    (childrenData || []).forEach((c) => {
      const dateStr = c.createdAt || c.timeWhenChildFound;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const b = buckets.find((bucket) => bucket.monthIdx === d.getMonth() && bucket.year === d.getFullYear());
          if (b) {
            b.intake += 1;
            if (c.currentStatus === "ADOPTED" || c.currentStatus === "WITH_BLOOD_RELATIVE") {
              b.placements += 1;
            }
          }
        }
      }
    });

    // Tally application placements
    (applications || []).forEach((a) => {
      const dateStr = a.applicationInfo?.submittedAt || a.reviewInfo?.updatedAt;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const b = buckets.find((bucket) => bucket.monthIdx === d.getMonth() && bucket.year === d.getFullYear());
          const status = (a.applicationInfo?.status || a.status || "").toUpperCase();
          if (b && (status === "FINALIZED" || status === "APPROVED" || status === "MATCHED")) {
            b.placements += 1;
          }
        }
      }
    });

    return buckets.map(({ month, intake, placements }) => ({ month, intake, placements }));
  }, [childrenData, applications]);

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

      {/* 2. Operational Attention Alert Cards */}
      <AdoptionAlertBanner
        pendingHomeVisits={pendingHomeVisits}
        pendingReports={pendingReports}
        pendingApprovals={pendingApprovals}
        inCareCount={inCareCount}
      />

      {/* 3. Master KPI Metric Scorecard Grid (5 Clean Metric Cards) */}
      <AdoptionKpiGrid
        totalChildren={totalChildren}
        inCareCount={inCareCount}
        fosteredOrKinship={fosteredOrKinship}
        totalApplicants={totalApplicants}
        adoptedCount={adoptedCount}
        facilityCount={totalFacilities}
      />

      {/* 4. Analytics Visualizations: Dual Bar Velocity & Donut Distribution */}
      <AdoptionChartsSection
        intakeTrends={intakeTrends}
        statusBreakdown={statusBreakdown}
      />

      {/* 5. 5-Stage Vetting Pipeline Funnel & Care Facilities Matrix */}
      <AdoptionPipelineFunnel
        pipelineData={pipelineData}
        facilities={facilities}
      />

      {/* 6. Active Application Queue & Case Roster Table */}
      <AdoptionRecentCasesTable
        cases={recentCases}
      />
    </div>
  );
}
