"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useChildWelfareDashboard } from "@/hooks/dashboard/useChildWelfareDashboard";
import StatsCard from "@/components/shared/card/statistics-card";
import { Baby, Users, Building, FileText, UserCheck, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const chartData = [
  { day: 1, value: 3 },
  { day: 2, value: 4 },
  { day: 3, value: 8 },
  { day: 4, value: 3 },
  { day: 5, value: 5 },
  { day: 6, value: 12 },
  { day: 7, value: 10 },
];

export default function ChildWelfareDashboard() {
  const t = useTranslations("child-welfare.dashboard");
  const { data, isLoading } = useChildWelfareDashboard();

  const chartConfig = {
    total: { label: t("children.total"), color: "hsl(var(--chart-1))" },
    found: { label: t("children.found"), color: "hsl(var(--chart-2))" },
    inCare: { label: t("children.inCare"), color: "hsl(var(--chart-3))" },
    adopted: { label: t("children.adopted"), color: "hsl(var(--chart-4))" },
    facilities: {
      label: t("infrastructure.totalFacilities"),
      color: "hsl(var(--chart-5))",
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">{t("loading")}</div>
      </div>
    );
  }

  const pendingReports =
    data?.infrastructure.reports.find((r) => r.status === "PENDING")?._count ||
    0;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
            {t("title")}
          </h1>
          <p className="text-zinc-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/adoption/children">
            <Button className="gap-2">
              <Baby className="w-4 h-4" />
              {t("quickActions.registerChild")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards - First Row: Children Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title={t("children.total")}
          icon={Baby}
          value={data?.children.total || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("children.found")}
          icon={UserCheck}
          value={data?.children.found || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="found"
        />
        <StatsCard
          title={t("children.inCare")}
          icon={Home}
          value={data?.children.inCare || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="inCare"
        />
        <StatsCard
          title={t("children.adopted")}
          icon={UserCheck}
          value={data?.children.adopted || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="adopted"
        />
        <StatsCard
          title={t("children.fostered")}
          icon={Users}
          value={data?.children.fostered || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="adopted"
        />
      </div>

      {/* Stats Cards - Second Row: Adoption & Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title={t("adoption.totalApplicants")}
          icon={Users}
          value={data?.adoption.totalApplicants || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("infrastructure.totalFacilities")}
          icon={Building}
          value={data?.infrastructure.totalFacilities || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="facilities"
        />
        <StatsCard
          title={t("infrastructure.pending")}
          icon={FileText}
          value={pendingReports}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("quickActions.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/adoption/children" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Baby className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewChildren")}
              </Button>
            </Link>
            <Link href="/adoption/adoption-requests" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Users className="w-4 h-4 text-zinc-500" />
                {t("quickActions.manageAdoptions")}
              </Button>
            </Link>
            <Link href="/adoption/care-centers" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Building className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewFacilities")}
              </Button>
            </Link>
            <Link href="/bureau-head" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <FileText className="w-4 h-4 text-zinc-500" />
                {t("infrastructure.reports")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
