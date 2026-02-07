"use client";

import StatsCard from "@/components/shared/card/statistics-card";
import {
  HandHeart,
  Users,
  TrendingUp,
  FileText,
  Plus,
  Download,
} from "lucide-react";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("womens");

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
          <Link href="/womens/women-list">
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
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {t("dashboard.activity.title")}
          </h2>
          <div className="min-h-[400px] rounded-xl border border-zinc-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-zinc-50 rounded-full">
              <Users className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-900 font-medium">
                {t("dashboard.activity.communityRegistry")}
              </p>
              <p className="text-sm text-zinc-500">
                {t("dashboard.activity.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {t("dashboard.quickActions.title")}
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            <Link href="/womens/women-list" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <Users className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.womenProfiles")}
              </Button>
            </Link>
            <Link href="/womens/support-service" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <HandHeart className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.supportServices")}
              </Button>
            </Link>
            {/* <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-zinc-700"
            >
              <FileText className="w-4 h-4 text-zinc-500" />
              {t("dashboard.quickActions.caseManagement")}
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenDashboard;
