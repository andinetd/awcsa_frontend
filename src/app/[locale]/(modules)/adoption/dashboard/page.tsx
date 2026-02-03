"use client";

import StatsCard from "@/components/shared/card/statistics-card";
import { Baby, Building, Heart, FileText } from "lucide-react";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

const chartData = [
  { day: 1, value: 3 },
  { day: 2, value: 4 },
  { day: 3, value: 8 },
  { day: 4, value: 3 },
  { day: 5, value: 5 },
  { day: 6, value: 12 },
  { day: 7, value: 10 },
];

export default function AdoptionDashboard() {
  const t = useTranslations("adoption");
  const { data: careCenters } = useGetCareCentersQuery();

  const chartConfig = {
    children: { label: t("dashboard.charts.children"), color: "hsl(var(--chart-1))" },
    centers: { label: t("dashboard.charts.centers"), color: "hsl(var(--chart-2))" },
    requests: { label: t("dashboard.charts.requests"), color: "hsl(var(--chart-3))" },
    benefits: { label: t("dashboard.charts.benefits"), color: "hsl(var(--chart-4))" },
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
            {t("dashboard.title")}
          </h1>
          <p className="text-zinc-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/adoption/adoption-requests">
            <Button className="gap-2">{t("dashboard.newRequests")}</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t("dashboard.stats.totalChildren")}
          icon={Baby}
          value={124}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="children"
        />
        <StatsCard
          title={t("dashboard.stats.careCenters")}
          icon={Building}
          value={careCenters?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="centers"
        />
        <StatsCard
          title={t("dashboard.stats.adoptionRequests")}
          icon={FileText}
          value={42}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="requests"
        />
        <StatsCard
          title={t("dashboard.stats.supportBenefits")}
          icon={Heart}
          value={86}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="benefits"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {t("dashboard.recentActivity.title")}
          </h2>
          <div className="min-h-[400px] rounded-xl border border-zinc-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-zinc-50 rounded-full">
              <FileText className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-900 font-medium">
                {t("dashboard.recentActivity.empty.title")}
              </p>
              <p className="text-sm text-zinc-500">
                {t("dashboard.recentActivity.empty.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            {t("dashboard.quickActions.title")}
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            <Link href="/adoption/children" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Baby className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.manageChildren")}
              </Button>
            </Link>
            <Link href="/adoption/care-centers" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Building className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.careCenterList")}
              </Button>
            </Link>
            <Link href="/adoption/adoption-requests" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Heart className="w-4 h-4 text-zinc-500" />
                {t("dashboard.quickActions.adoptionRequests")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
