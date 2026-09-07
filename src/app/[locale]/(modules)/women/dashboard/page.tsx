"use client";

import StatsCard from "@/components/shared/card/statistics-card";
import {
  HandHeart,
  Users,
  TrendingUp,
  FileText,
  Plus,
  Download,
  Zap,
  GraduationCap,
  Briefcase,
  Landmark,
} from "lucide-react";
import { useGetWomenProfilesQuery, useGetTechnologySupportQuery, useGetWomenTrainingsQuery, useGetWomenEmploymentsQuery, useGetWomenAssociationsQuery } from "@/hooks/womens";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import WomenAssociationDashboard from "../_components/women-association-dashboard";

const chartData = [
  { day: 1, value: 10 },
  { day: 2, value: 15 },
  { day: 3, value: 12 },
  { day: 4, value: 20 },
  { day: 5, value: 25 },
  { day: 6, value: 22 },
  { day: 7, value: 30 },
];

const chartConfig = {
  profiles: { label: "Profiles", color: "hsl(var(--chart-1))" },
  services: { label: "Services", color: "hsl(var(--chart-2))" },
  active: { label: "Active", color: "hsl(var(--chart-3))" },
  reports: { label: "Reports", color: "hsl(var(--chart-4))" },
};

const WomenDashboard = () => {
  const { data: profiles } = useGetWomenProfilesQuery();
  const { data: techSupport } = useGetTechnologySupportQuery();
  const { data: trainings } = useGetWomenTrainingsQuery();
  const { data: employments } = useGetWomenEmploymentsQuery();
  const { data: associationsResponse } = useGetWomenAssociationsQuery();
  const associations = associationsResponse?.data || [];
  const t = useTranslations("women");

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
            {t("dashboard.title")}
          </h1>
          <p className="text-zinc-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Link href="/women/profiles">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              {t("dashboard.registerProfile")}
            </Button>
          </Link>
          {/* <Button className="gap-2">
            <Download className="w-4 h-4" />
            {t("dashboard.generateReport")}
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t("dashboard.stats.totalProfiles")}
          icon={Users}
          value={profiles?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="profiles"
        />
        <StatsCard
          title={t("dashboard.stats.supportServices")}
          icon={HandHeart}
          value={156}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="services"
        />
        <StatsCard
          title={t("dashboard.stats.activeInterventions")}
          icon={TrendingUp}
          value="42"
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="active"
        />
        <StatsCard
          title={t("dashboard.stats.monthlyReports")}
          icon={FileText}
          value={12}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="reports"
        />
        <StatsCard
          title="Technology Support"
          icon={Zap}
          value={techSupport?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="profiles"
        />
        <StatsCard
          title="Training"
          icon={GraduationCap}
          value={trainings?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="services"
        />
        <StatsCard
          title="Employment"
          icon={Briefcase}
          value={employments?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="active"
        />
        <StatsCard
          title={t("dashboard.stats.associations")}
          icon={Landmark}
          value={associations.length}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="reports"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {t("dashboard.activity.title")}
          </h2>
          <WomenAssociationDashboard />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {t("dashboard.quickActions.title")}
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            <Link href="/women/profiles" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <Users className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.womenProfiles")}
              </Button>
            </Link>
            <Link href="/women/associations" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <Landmark className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.associations")}
              </Button>
            </Link>
            <Link href="/women/members" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <Users className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.members")}
              </Button>
            </Link>
            <Link href="/women/services" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <HandHeart className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.supportServices")}
              </Button>
            </Link>
            <Link href="/women/technology" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <Zap className="w-4 h-4 text-zinc-500" />
                Technology Support
              </Button>
            </Link>
            <Link href="/women/training" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <GraduationCap className="w-4 h-4 text-zinc-500" />
                Training
              </Button>
            </Link>
            <Link href="/women/employment" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <Briefcase className="w-4 h-4 text-zinc-500" />
                Employment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenDashboard;