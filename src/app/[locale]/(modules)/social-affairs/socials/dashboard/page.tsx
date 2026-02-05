"use client";

import StatsCard from "@/components/shared/card/statistics-card";
import {
  HandHelping,
  Users,
  TrendingUp,
  FileText,
  Plus,
  FileUp,
  Download,
} from "lucide-react";
import { useGetEdirAssociationsQuery } from "@/hooks/social-affairs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useTranslations } from "next-intl";

const chartData = [
  { day: 1, value: 5 },
  { day: 2, value: 9 },
  { day: 3, value: 7 },
  { day: 4, value: 12 },
  { day: 5, value: 15 },
  { day: 6, value: 10 },
  { day: 7, value: 18 },
];

const chartConfig = {
  edirs: { label: "Edirs", color: "hsl(var(--chart-1))" },
  members: { label: "Members", color: "hsl(var(--chart-2))" },
  growth: { label: "Growth", color: "hsl(var(--chart-3))" },
  reports: { label: "Reports", color: "hsl(var(--chart-4))" },
};

const SocialsDashboard = () => {
  const t = useTranslations("social-affairs.socials.dashboard");
  const { data: edirs } = useGetEdirAssociationsQuery();

  return (
    <SidebarLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
              {t("title")}
            </h1>
            <p className="text-zinc-500 mt-1">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Link href="/social-affairs/edir/list">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                {t("registerEdir")}
              </Button>
            </Link>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              {t("generateReport")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={t("stats.totalEdirs")}
            icon={HandHelping}
            value={edirs?.length || 0}
            chartData={chartData}
            chartConfig={chartConfig}
            dataKey="edirs"
          />
          <StatsCard
            title={t("stats.totalMembers")}
            icon={Users}
            value={1240}
            chartData={chartData}
            chartConfig={chartConfig}
            dataKey="members"
          />
          <StatsCard
            title={t("stats.recentGrowth")}
            icon={TrendingUp}
            value="+12%"
            chartData={chartData}
            chartConfig={chartConfig}
            dataKey="growth"
          />
          <StatsCard
            title={t("stats.activeReports")}
            icon={FileText}
            value={28}
            chartData={chartData}
            chartConfig={chartConfig}
            dataKey="reports"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              {t("recentActivity.title")}
            </h2>
            <div className="min-h-[400px] rounded-xl border border-zinc-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-4 bg-zinc-50 rounded-full">
                <TrendingUp className="w-8 h-8 text-zinc-400" />
              </div>
              <div>
                <p className="text-zinc-900 font-medium">
                  {t("recentActivity.monitoring")}
                </p>
                <p className="text-sm text-zinc-500">
                  {t("recentActivity.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              {t("quickActions.title")}
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
              <Link href="/social-affairs/edir/list" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 text-zinc-700"
                >
                  <HandHelping className="w-4 h-4 text-zinc-500" />
                  {t("quickActions.edirAssociations")}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <FileUp className="w-4 h-4 text-zinc-500" />
                {t("quickActions.importMembers")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12 text-zinc-700"
              >
                <FileText className="w-4 h-4 text-zinc-500" />
                {t("quickActions.downloadTemplates")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SocialsDashboard;
