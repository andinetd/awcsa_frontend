"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useSocialRehabDashboard } from "@/hooks/dashboard/useSocialRehabDashboard";
import StatsCard from "@/components/shared/card/statistics-card";
import {
  Users,
  User,
  Activity,
  Heart,
  HandHeart,
  GraduationCap,
  Briefcase,
} from "lucide-react";
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

export default function SocialRehabDashboard() {
  const t = useTranslations("social-rehab.dashboard");
  const { data, isLoading } = useSocialRehabDashboard();

  const chartConfig = {
    total: {
      label: t("beneficiaries.totalVulnerable"),
      color: "hsl(var(--chart-1))",
    },
    elderly: {
      label: t("beneficiaries.elderly"),
      color: "hsl(var(--chart-2))",
    },
    disability: {
      label: t("beneficiaries.disability"),
      color: "hsl(var(--chart-3))",
    },
    women: { label: t("beneficiaries.women"), color: "hsl(var(--chart-4))" },
    edirs: { label: t("community.totalEdirs"), color: "hsl(var(--chart-5))" },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">{t("loading")}</div>
      </div>
    );
  }

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
      </div>

      {/* Stats Cards - First Row: Beneficiaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t("beneficiaries.totalVulnerable")}
          icon={Users}
          value={data?.beneficiaries.totalVulnerable || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("beneficiaries.elderly")}
          icon={User}
          value={data?.beneficiaries.elderly || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="elderly"
        />
        <StatsCard
          title={t("beneficiaries.disability")}
          icon={Activity}
          value={data?.beneficiaries.disability || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="disability"
        />
        <StatsCard
          title={t("beneficiaries.women")}
          icon={Heart}
          value={data?.beneficiaries.women || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="women"
        />
      </div>

      {/* Stats Cards - Second Row: Community & Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title={t("community.totalEdirs")}
          icon={HandHeart}
          value={data?.community.totalEdirs || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="edirs"
        />
        <StatsCard
          title={t("community.totalMembers")}
          icon={Users}
          value={data?.community.totalMembers || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("support.totalServicesProvided")}
          icon={Heart}
          value={data?.support.totalServicesProvided || 0}
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
            <Link
              href="/social-affairs/elderly-and-disabled/beneficiaries/elderly"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <User className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewElderly")}
              </Button>
            </Link>
            <Link
              href="/social-affairs/elderly-and-disabled/beneficiaries/disabled"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Activity className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewDisabled")}
              </Button>
            </Link>
            <Link href="/womens/beneficiaries" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Heart className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewWomen")}
              </Button>
            </Link>
            <Link href="/social-affairs/edir/list" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <HandHeart className="w-4 h-4 text-zinc-500" />
                {t("quickActions.manageEdirs")}
              </Button>
            </Link>
            <Link
              href="/social-affairs/elderly-and-disabled/trainings"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <GraduationCap className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewTrainings")}
              </Button>
            </Link>
            <Link
              href="/social-affairs/elderly-and-disabled/jobs"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Briefcase className="w-4 h-4 text-zinc-500" />
                {t("quickActions.viewJobs")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
