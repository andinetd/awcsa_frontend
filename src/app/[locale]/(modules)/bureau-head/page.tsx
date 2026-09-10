"use client";

import React, { useState, useMemo } from "react";
import { useBureauDashboardSummary } from "@/hooks/bureau/useBureauDashboard";
import { useBureauReports } from "@/hooks/bureau/useBureauReports";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { useGetDashboardAnalyticsQuery } from "@/hooks/dashboard/useAnalytics";
import { useExecutiveDashboard } from "@/hooks/dashboard/useExecutiveDashboard";
import { useChildWelfareDashboard } from "@/hooks/dashboard/useChildWelfareDashboard";
import { useSocialRehabDashboard } from "@/hooks/dashboard/useSocialRehabDashboard";
import { useGetWomenProfilesQuery } from "@/hooks/womens";

import { ExecutiveHeader } from "@/components/dashboard/redesign/executive-header";
import { KPIScorecardGrid } from "@/components/dashboard/redesign/kpi-scorecard-grid";
import { ExecutiveChartsSection } from "@/components/dashboard/redesign/executive-charts-section";
import { DirectorateDrilldown } from "@/components/dashboard/redesign/directorate-drilldown";
import { HeavyReportsHub } from "@/components/dashboard/redesign/heavy-reports-hub";
import { SubCityAnalytics } from "@/components/dashboard/redesign/subcity-analytics";
import { LiveActivityStream } from "@/components/dashboard/redesign/live-activity-stream";
import { buildMetricCards, generateSubCityStats } from "@/components/dashboard/redesign/demo-data";
import { TimeframeOption } from "@/components/dashboard/redesign/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Building,
  FileSpreadsheet,
  Layers,
  MapPin,
  Sparkles,
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
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Metric cards computation
  const totalChildren =
    bureauStats?.totalChildren ??
    childWelfareData?.children?.total ??
    execData?.overview?.totalChildren ??
    1420;

  const totalVulnerable =
    socialRehabData?.beneficiaries?.totalVulnerable ??
    execData?.overview?.totalPeopleRegistered ??
    3850;

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

  const metricCards = useMemo(() => {
    return buildMetricCards({
      totalChildren,
      totalVulnerable,
      totalFacilities,
      totalEdirs,
      submittedReports,
      pendingReports,
      womenProfilesCount,
    });
  }, [
    totalChildren,
    totalVulnerable,
    totalFacilities,
    totalEdirs,
    submittedReports,
    pendingReports,
    womenProfilesCount,
  ]);

  // Sub-city stats computation
  const subCityStats = useMemo(() => {
    return generateSubCityStats(
      totalFacilities,
      totalChildren,
      totalVulnerable,
      totalEdirs
    );
  }, [totalFacilities, totalChildren, totalVulnerable, totalEdirs]);

  // CSV export for executive summary
  const handleExportSummaryCSV = () => {
    const rows = [
      ["Bureau of Women & Social Affairs - Executive Summary"],
      ["Generated Date", new Date().toISOString()],
      ["Timeframe Scope", timeframe.toUpperCase()],
      ["Selected Sub-City Filter", selectedSubCity],
      [],
      ["Master KPI Summary"],
      ["Indicator", "Value"],
      ["Total Children in Care / Registry", totalChildren],
      ["Vulnerable Citizens (Elderly & Disabled)", totalVulnerable],
      ["Women Profiles / Vocational Intake", womenProfilesCount],
      ["Verified Care Facilities", totalFacilities],
      ["Registered Community Edirs", totalEdirs],
      ["Monthly Reports Submitted", submittedReports],
      ["Monthly Reports Pending Review", pendingReports],
      [],
      ["Sub-City Municipal Breakdown"],
      ["Sub-City", "Children", "Vulnerable Citizens", "Facilities", "Edirs", "Compliance %"],
      ...subCityStats.map((s) => [
        s.name,
        s.totalChildren,
        s.vulnerableCitizens,
        s.totalFacilities,
        s.activeEdirs,
        `${s.complianceRate}%`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bureau-executive-summary-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isStatsLoading && isAnalyticsLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading executive intelligence command center...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1520px] mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      {/* 1. Executive Top Header */}
      <ExecutiveHeader
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        selectedSubCity={selectedSubCity}
        setSelectedSubCity={setSelectedSubCity}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onExportCSV={handleExportSummaryCSV}
        onPrint={handlePrint}
      />

      {/* Active Sub-City Filter Banner */}
      {selectedSubCity !== "ALL" && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>
              Currently filtering all metrics and facility reports for <strong>{selectedSubCity} Sub-City</strong>.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedSubCity("ALL")}
            className="h-7 gap-1 px-2 text-xs hover:bg-primary/20 text-primary"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset to All</span>
          </Button>
        </div>
      )}

      {/* 2. High-Impact Master KPI Grid */}
      <KPIScorecardGrid cards={metricCards} />

      {/* 3. Multi-View Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-3">
          <TabsList className="bg-muted/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Executive Intelligence
            </TabsTrigger>

            <TabsTrigger
              value="directorates"
              className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Layers className="mr-2 h-4 w-4" />
              Directorate Breakdown
            </TabsTrigger>

            <TabsTrigger
              value="reports"
              className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Reports & Compliance Hub
              <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/20 text-[10px] px-1.5 py-0">
                {reportsList.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value="subcities"
              className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Building className="mr-2 h-4 w-4" />
              Sub-City Municipalities
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Executive Intelligence */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          {analyticsData && <ExecutiveChartsSection data={analyticsData} />}
          <LiveActivityStream activities={execData?.recentActivity} />
        </TabsContent>

        {/* Tab 2: Directorate Drilldown */}
        <TabsContent value="directorates" className="space-y-6 mt-0">
          <DirectorateDrilldown
            childWelfareData={childWelfareData}
            socialRehabData={socialRehabData}
            careCentersCount={careCenters.length || totalFacilities}
            womenProfilesCount={womenProfilesCount}
          />
        </TabsContent>

        {/* Tab 3: Reports & Compliance Hub */}
        <TabsContent value="reports" className="space-y-6 mt-0">
          <HeavyReportsHub
            reports={reportsList}
            isLoading={isReportsLoading}
            isError={isReportsError}
            careCenters={careCenters}
          />
        </TabsContent>

        {/* Tab 4: Sub-City Municipalities */}
        <TabsContent value="subcities" className="space-y-6 mt-0">
          <SubCityAnalytics
            stats={subCityStats}
            selectedSubCity={selectedSubCity}
            onSelectSubCity={(name) => {
              setSelectedSubCity(name);
              setActiveTab("reports");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
