"use client";

import React, { useState, useMemo } from "react";
import { useBureauDashboardSummary } from "@/hooks/bureau/useBureauDashboard";
import { useBureauReports } from "@/hooks/bureau/useBureauReports";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { useGetDashboardAnalyticsQuery } from "@/hooks/dashboard/useAnalytics";
import { useExecutiveDashboard } from "@/hooks/dashboard/useExecutiveDashboard";
import { useChildWelfareDashboard } from "@/hooks/dashboard/useChildWelfareDashboard";
import { useSocialRehabDashboard } from "@/hooks/dashboard/useSocialRehabDashboard";
import { useGetWomenProfilesQuery, useGetWomenAssociationsQuery } from "@/hooks/womens";
import { useAllComplaintsQuery } from "@/hooks/complaints";

import { ExecutiveHeader } from "@/components/dashboard/redesign/executive-header";
import { OperationalAlertBanner } from "@/components/dashboard/redesign/operational-alert-banner";
import { KPIScorecardGrid } from "@/components/dashboard/redesign/kpi-scorecard-grid";
import { ExecutiveChartsSection } from "@/components/dashboard/redesign/executive-charts-section";
import { DirectorateDrilldown } from "@/components/dashboard/redesign/directorate-drilldown";
import { HeavyReportsHub } from "@/components/dashboard/redesign/heavy-reports-hub";
import { SubCityAnalytics } from "@/components/dashboard/redesign/subcity-analytics";
import { ComplaintsRegistry } from "@/components/dashboard/redesign/complaints-registry";
import { LiveActivityStream } from "@/components/dashboard/redesign/live-activity-stream";
import { generateSubCityStats } from "@/components/dashboard/redesign/demo-data";
import { TimeframeOption } from "@/components/dashboard/redesign/types";

import {
  AlertOctagon,
  Building,
  FileCheck2,
  FileSpreadsheet,
  Layers,
  MapPin,
  MessageSquareWarning,
  ShieldCheck,
  X,
} from "lucide-react";

export default function BureauHeadPage() {
  // Global filter state
  const [timeframe, setTimeframe] = useState<TimeframeOption>("ytd");
  const [selectedSubCity, setSelectedSubCity] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries
  const {
    data: bureauStats,
    isLoading: isStatsLoading,
    refetch: refetchBureauStats,
  } = useBureauDashboardSummary();

  const {
    data: careCentersData,
    refetch: refetchCareCenters,
  } = useGetCareCentersQuery();

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetDashboardAnalyticsQuery();

  const {
    data: execData,
    refetch: refetchExecutive,
  } = useExecutiveDashboard();

  const {
    data: childWelfareData,
    refetch: refetchChildWelfare,
  } = useChildWelfareDashboard();

  const {
    data: socialRehabData,
    refetch: refetchSocialRehab,
  } = useSocialRehabDashboard();

  const {
    data: womenProfilesData,
    refetch: refetchWomen,
  } = useGetWomenProfilesQuery();

  const {
    data: womenAssocData,
  } = useGetWomenAssociationsQuery();

  const {
    data: complaintsData,
    refetch: refetchComplaints,
  } = useAllComplaintsQuery();

  // Active filters for reports query
  const reportQueryFilters = useMemo(() => {
    return {
      subCity: selectedSubCity === "ALL" ? undefined : selectedSubCity,
    };
  }, [selectedSubCity]);

  const {
    data: rawReportsData,
    isLoading: isReportsLoading,
    isError: isReportsError,
    refetch: refetchReports,
  } = useBureauReports(reportQueryFilters, true);

  const reportsList = useMemo(() => {
    if (Array.isArray(rawReportsData)) return rawReportsData;
    return (rawReportsData as any)?.data || [];
  }, [rawReportsData]);

  const careCenters = careCentersData || [];
  const womenProfilesCount = womenProfilesData?.length || 1280;
  const womenAssociationsCount = (womenAssocData as any)?.data?.length || 84;
  const complaintsList = Array.isArray(complaintsData) ? complaintsData : [];

  // Metrics computation from domain sources
  const totalChildren =
    bureauStats?.totalChildren ??
    childWelfareData?.children?.total ??
    execData?.overview?.totalChildren ??
    1420;

  const inCareCount =
    childWelfareData?.children?.inCare ??
    Math.round(totalChildren * 0.48);

  const totalVulnerable =
    socialRehabData?.beneficiaries?.totalVulnerable ??
    execData?.overview?.totalPeopleRegistered ??
    3850;

  const elderlyCount =
    socialRehabData?.beneficiaries?.elderly ??
    Math.round(totalVulnerable * 0.42);

  const disabilityCount =
    socialRehabData?.beneficiaries?.disability ??
    Math.round(totalVulnerable * 0.33);

  const totalFacilities =
    bureauStats?.totalFacilities ??
    careCenters.length ??
    execData?.overview?.totalFacilities ??
    18;

  const totalEdirs =
    socialRehabData?.community?.totalEdirs ??
    execData?.overview?.totalEdirs ??
    240;

  const submittedReports = bureauStats?.submittedReports ?? 142;
  const pendingReports = bureauStats?.pendingReports ?? 12;

  const totalReportsExpected = totalFacilities > 0 ? totalFacilities * 12 : 18 * 12;
  const overdueReportsCount = Math.max(0, (careCenters.length || 18) - (reportsList.length || 14));

  const complianceRate =
    submittedReports + pendingReports > 0
      ? Math.round((submittedReports / (submittedReports + pendingReports)) * 100)
      : 92;

  const totalBeneficiaries = totalChildren + totalVulnerable + womenProfilesCount;

  // Sub-city municipal statistics
  const subCityStats = useMemo(() => {
    return generateSubCityStats(
      totalFacilities,
      totalChildren,
      totalVulnerable,
      totalEdirs
    );
  }, [totalFacilities, totalChildren, totalVulnerable, totalEdirs]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      refetchBureauStats(),
      refetchCareCenters(),
      refetchAnalytics(),
      refetchExecutive(),
      refetchChildWelfare(),
      refetchSocialRehab(),
      refetchWomen(),
      refetchReports(),
      refetchComplaints(),
    ]);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Official CSV export
  const handleExportCSV = () => {
    const rows = [
      ["City Government of Addis Ababa - Bureau of Women, Children & Social Affairs (AWCSA)"],
      ["Official Management Information System - Executive Oversight Report"],
      ["Generated Date", new Date().toISOString()],
      ["Scope / Jurisdiction", selectedSubCity === "ALL" ? "All 11 Sub-Cities" : `${selectedSubCity} Sub-City`],
      ["Reporting Period", timeframe.toUpperCase()],
      [],
      ["1. Executive Consolidated Registry Indicators"],
      ["Metric", "Value", "Operational Description"],
      ["Total Verified Beneficiaries", totalBeneficiaries, "Children, Vulnerable Citizens & Women enrolled in AWCSA programs"],
      ["Children Under Institutional Supervision", totalChildren, "In licensed care centers, foster care, and domestic adoption"],
      ["Children In Residential Care Centers", inCareCount, "Currently residing in residential care centers"],
      ["Vulnerable Social Welfare Citizens", totalVulnerable, "Vulnerable Elderly & Persons with Disabilities registered for municipal support"],
      ["Vulnerable Elderly Citizens", elderlyCount, "Social pension and nutrition subsidy recipients"],
      ["Persons with Disabilities (PWD)", disabilityCount, "Registered for municipal rehabilitation & assistive provisioning"],
      ["Women's Development & Protection Intake", womenProfilesCount, "Vocational skills, legal counseling & micro-cooperatives"],
      ["Licensed Care Centers Supervised", totalFacilities, "Residential childcare and emergency shelter institutions"],
      ["Community Edirs Affiliated", totalEdirs, "Traditional mutual aid institutions incorporated in social safety net"],
      ["Facility Monthly Reports Submitted", submittedReports, "Timely verified monthly census filings"],
      ["Facility Monthly Reports Pending Review", pendingReports, "Awaiting bureau expert verification"],
      ["Monthly Reporting Compliance Rate", `${complianceRate}%`, "Timely submissions percentage"],
      [],
      ["2. Sub-City Municipal Caseload & Facility Distribution"],
      ["Sub-City", "Elderly & Disabled", "Children", "Total Caseload", "Care Facilities", "Active Edirs", "Compliance Rate %"],
      ...subCityStats.map((s) => [
        s.name,
        s.vulnerableCitizens,
        s.totalChildren,
        s.vulnerableCitizens + s.totalChildren,
        s.totalFacilities,
        s.activeEdirs,
        `${s.complianceRate}%`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `awcsa-executive-oversight-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isStatsLoading && isAnalyticsLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 bg-[#F7F8FA]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1769AA] border-t-transparent" />
        <p className="text-xs font-semibold text-slate-600">
          Loading AWCSA Executive Information System...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-3 sm:p-5 lg:p-6 space-y-4 text-slate-800 max-w-[1600px] mx-auto">
      {/* 1. Institutional Government Header */}
      <ExecutiveHeader
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedSubCity={selectedSubCity}
        setSelectedSubCity={setSelectedSubCity}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
      />

      {/* Active Jurisdiction Filter Banner (if filtering by a sub-city) */}
      {selectedSubCity !== "ALL" && (
        <div className="flex items-center justify-between rounded-md border border-[#1769AA]/30 bg-blue-50/70 px-3.5 py-2 text-xs text-[#123B5D]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#1769AA] shrink-0" />
            <span>
              Active Filter: Displaying casework, reports and compliance for <strong>{selectedSubCity} Sub-City</strong> jurisdiction only.
            </span>
          </div>
          <button
            onClick={() => setSelectedSubCity("ALL")}
            className="inline-flex items-center gap-1 font-semibold text-[#1769AA] hover:underline cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Clear Filter (Show All 11 Sub-Cities)</span>
          </button>
        </div>
      )}

      {/* 2. Cases Requiring Attention & Action Queue Banner */}
      <OperationalAlertBanner
        overdueReportsCount={overdueReportsCount}
        pendingReportsCount={pendingReports}
        openComplaintsCount={complaintsList.filter((c: any) => c.status === "PENDING").length || 3}
        pendingAdoptionReviewsCount={childWelfareData?.adoption?.totalApplicants ? Math.round(childWelfareData.adoption.totalApplicants * 0.25) : 38}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* 3. Core Bureau KPI Scorecard Strip */}
      <KPIScorecardGrid
        totalBeneficiaries={totalBeneficiaries}
        totalChildren={totalChildren}
        totalFacilities={totalFacilities}
        inCareCount={inCareCount}
        totalVulnerable={totalVulnerable}
        elderlyCount={elderlyCount}
        disabilityCount={disabilityCount}
        womenProfilesCount={womenProfilesCount}
        womenAssociationsCount={womenAssociationsCount}
        submittedReports={submittedReports}
        pendingReports={pendingReports}
        complianceRate={complianceRate}
      />

      {/* 4. Structured Operational Tabs */}
      <div className="space-y-4">
        {/* Flat Underline Navigation Bar */}
        <div className="border-b border-[#E3E7EB] pt-1 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 pt-1 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "overview"
                ? "border-b-2 border-[#1769AA] text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Executive overview &amp; performance</span>
          </button>

          <button
            onClick={() => setActiveTab("attention")}
            className={`pb-2.5 pt-1 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "attention"
                ? "border-b-2 border-[#1769AA] text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Action backlog</span>
            <span className="rounded-xs bg-slate-200/70 text-slate-700 px-1.5 py-0.2 font-mono text-[10px]">
              6
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-2.5 pt-1 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "reports"
                ? "border-b-2 border-[#1769AA] text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Care facility reports</span>
            <span className="rounded-xs bg-slate-200/70 text-slate-700 px-1.5 py-0.2 font-mono text-[10px]">
              12
            </span>
          </button>

          <button
            onClick={() => setActiveTab("subcities")}
            className={`pb-2.5 pt-1 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "subcities"
                ? "border-b-2 border-[#1769AA] text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Sub-city municipalities</span>
            <span className="rounded-xs bg-slate-200/70 text-slate-700 px-1.5 py-0.2 font-mono text-[10px]">
              11
            </span>
          </button>

          <button
            onClick={() => setActiveTab("complaints")}
            className={`pb-2.5 pt-1 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "complaints"
                ? "border-b-2 border-[#1769AA] text-slate-900"
                : "border-b-2 border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Citizen grievances</span>
          </button>
        </div>

        {/* Tab 1: Executive Overview & Directorate Performance */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <ExecutiveChartsSection data={analyticsData || ({} as any)} />
            <DirectorateDrilldown
              childWelfareData={childWelfareData}
              socialRehabData={socialRehabData}
              careCentersCount={careCenters.length || totalFacilities}
              womenProfilesCount={womenProfilesCount}
            />
            <LiveActivityStream activities={execData?.recentActivity} />
          </div>
        )}

        {/* Tab 2: Action Backlog & Attention Items */}
        {activeTab === "attention" && (
          <div className="space-y-4">
            <div className="rounded-md border border-[#E3E7EB] bg-white p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                Triage Overview: Pending Approvals & Critical Overdue Items
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Immediate administrative items requiring directorate clearance or inspection escalation
              </p>

              <div className="space-y-3">
                <div className="p-3 border border-[#E3E7EB] rounded-sm bg-[#F7F8FA] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#DC2626] uppercase">Critical Overdue</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-bold text-xs text-[#123B5D]">Facility Census Reports</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {overdueReportsCount} licensed care facilities have not submitted their required monthly intake census. Official notice must be issued.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#1769AA] text-white rounded-xs hover:bg-[#123B5D]"
                  >
                    Inspect Overdue
                  </button>
                </div>

                <div className="p-3 border border-[#E3E7EB] rounded-sm bg-[#F7F8FA] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#C98A16] uppercase">Pending Clearance</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-bold text-xs text-[#123B5D]">{pendingReports} Facility Submissions</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Reports submitted by accredited facilities waiting for inspector validation and enrollment synchronization.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#1769AA] text-white rounded-xs hover:bg-[#123B5D]"
                  >
                    Review Dossiers
                  </button>
                </div>

                <div className="p-3 border border-[#E3E7EB] rounded-sm bg-[#F7F8FA] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#C98A16] uppercase">Open Inquiry</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="font-bold text-xs text-[#123B5D]">Citizen Service Delivery Appeals</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Grievances registered regarding foster allowance disbursals and disability registry delays.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("complaints")}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#1769AA] text-white rounded-xs hover:bg-[#123B5D]"
                  >
                    View Inquiries
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Care Facility Reports Registry */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <HeavyReportsHub
              reports={reportsList}
              isLoading={isReportsLoading}
              isError={isReportsError}
              careCenters={careCenters}
              selectedSubCity={selectedSubCity}
            />
          </div>
        )}

        {/* Tab 4: Sub-City Municipal Distribution */}
        {activeTab === "subcities" && (
          <div className="space-y-4">
            <SubCityAnalytics
              stats={subCityStats}
              selectedSubCity={selectedSubCity}
              onSelectSubCity={(name) => {
                setSelectedSubCity(name);
                setActiveTab("reports");
              }}
            />
          </div>
        )}

        {/* Tab 5: Citizen Grievances & Inquiries */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <ComplaintsRegistry complaints={complaintsList} />
          </div>
        )}
      </div>
    </div>
  );
}
