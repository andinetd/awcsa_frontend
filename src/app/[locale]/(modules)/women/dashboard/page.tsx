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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>Addis Ababa City Administration</span>
          <span>·</span>
          <span>Women &amp; Social Affairs Bureau</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            Women Development &amp; Support
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("dashboard.title")}
            </h1>
            <p className="text-xs text-slate-500">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/women/profiles">
              <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                {t("dashboard.registerProfile")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          title="Training Programs"
          icon={GraduationCap}
          value={trainings?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="services"
        />
        <StatsCard
          title="Employment Placements"
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
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("dashboard.activity.title")}
          </h2>
          <WomenAssociationDashboard />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("dashboard.quickActions.title")}
          </h2>
          <div className="rounded-xs border border-[#E3E7EB] bg-white p-3.5 space-y-2 shadow-2xs">
            <Link href="/women/profiles" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-[#1769AA]" />
                {t("dashboard.quickActions.womenProfiles")}
              </Button>
            </Link>
            <Link href="/women/associations" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <Landmark className="w-3.5 h-3.5 text-[#1769AA]" />
                {t("dashboard.quickActions.associations")}
              </Button>
            </Link>
            <Link href="/women/members" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-[#1769AA]" />
                {t("dashboard.quickActions.members")}
              </Button>
            </Link>
            <Link href="/women/services" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <HandHeart className="w-3.5 h-3.5 text-[#1769AA]" />
                {t("dashboard.quickActions.supportServices")}
              </Button>
            </Link>
            <Link href="/women/technology" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-[#1769AA]" />
                Technology Support
              </Button>
            </Link>
            <Link href="/women/training" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#1769AA]" />
                Training Programs
              </Button>
            </Link>
            <Link href="/women/employment" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-2.5 h-9 text-xs font-semibold text-slate-700 border-[#E3E7EB] rounded-xs hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/50 hover:text-[#1769AA] transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#1769AA]" />
                Employment Placements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenDashboard;