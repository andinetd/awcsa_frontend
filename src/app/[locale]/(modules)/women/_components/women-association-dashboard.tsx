"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useGetAssociationDashboardQuery } from "@/hooks/womens";
import StatsCard from "@/components/shared/card/statistics-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Landmark, Users, ListChecks, FileEdit, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WomenAssociationDashboard() {
  const t = useTranslations("women.dashboard");
  const router = useRouter();
  const { data, isLoading } = useGetAssociationDashboardQuery();
  const stats = data?.data;

  const chartData = useMemo(
    () => [
      { day: 1, value: stats?.total ?? 0 },
      { day: 2, value: stats?.byStatus.APPROVED ?? 0 },
      { day: 3, value: stats?.byStatus.SUBMITTED ?? 0 },
      { day: 4, value: stats?.totalMembers ?? 0 },
    ],
    [stats]
  );
  const chartConfig = {
    total: { label: "Total", color: "hsl(var(--chart-1))" },
    approved: { label: "Approved", color: "hsl(var(--chart-2))" },
    submitted: { label: "Submitted", color: "hsl(var(--chart-3))" },
    members: { label: "Members", color: "hsl(var(--chart-4))" },
  };

  const handleSubCityDrillDown = (subCity: string) => {
    router.push(`/women/associations?subCity=${encodeURIComponent(subCity)}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          title={t("stats.total")}
          icon={Landmark}
          value={isLoading ? "—" : (stats?.total ?? 0)}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("stats.draft")}
          icon={FileEdit}
          value={isLoading ? "—" : (stats?.byStatus.DRAFT ?? 0)}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("stats.submitted")}
          icon={Clock}
          value={isLoading ? "—" : (stats?.byStatus.SUBMITTED ?? 0)}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="submitted"
        />
        <StatsCard
          title={t("stats.approved")}
          icon={CheckCircle2}
          value={isLoading ? "—" : (stats?.byStatus.APPROVED ?? 0)}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="approved"
        />
        <StatsCard
          title={t("stats.rejected")}
          icon={XCircle}
          value={isLoading ? "—" : (stats?.byStatus.REJECTED ?? 0)}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
        <StatsCard
          title={t("stats.incomplete")}
          icon={AlertTriangle}
          value={isLoading ? "—" : (stats?.incomplete ?? 0)}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="total"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="pb-3 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#0B1F3A]">
              <Users className="w-4 h-4 text-[#1769AA]" />
              {t("bySubCity.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <SubCityTable
              rows={stats?.bySubCity ?? []}
              loading={isLoading}
              onRowClick={handleSubCityDrillDown}
              emptyLabel={t("bySubCity.empty")}
            />
          </CardContent>
        </Card>

        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="pb-3 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#0B1F3A]">
              <ListChecks className="w-4 h-4 text-[#1769AA]" />
              {t("totals.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="space-y-3 text-xs">
              <TotalRow
                label={t("totals.declaredMembers")}
                value={stats?.declaredMembers ?? 0}
              />
              <TotalRow
                label={t("totals.registeredMembers")}
                value={stats?.totalMembers ?? 0}
              />
              <TotalRow
                label={t("totals.totalGroups")}
                value={stats?.totalGroups ?? 0}
              />
              <TotalRow
                label={t("totals.approved")}
                value={stats?.byStatus.APPROVED ?? 0}
              />
            </dl>
            <div className="mt-4 pt-3 border-t border-[#E3E7EB] text-xs">
              <Link
                href="/women/associations"
                className="text-[#1769AA] font-semibold hover:underline inline-flex items-center gap-1"
              >
                {t("totals.viewList")} →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SubCityTable({
  rows,
  loading,
  onRowClick,
  emptyLabel,
}: {
  rows: { subCity: string; total: number; approved: number; members: number }[];
  loading: boolean;
  onRowClick: (subCity: string) => void;
  emptyLabel: string;
}) {
  const t = useTranslations("women.dashboard.bySubCity");
  return (
    <div className="border border-[#E3E7EB] rounded-xs overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
          <TableRow>
            <TableHead className="font-semibold text-xs text-slate-700">{t("subCity")}</TableHead>
            <TableHead className="font-semibold text-xs text-slate-700 text-right">{t("total")}</TableHead>
            <TableHead className="font-semibold text-xs text-slate-700 text-right">
              {t("approved")}
            </TableHead>
            <TableHead className="font-semibold text-xs text-slate-700 text-right">
              {t("members")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                {t("loading")}
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                {emptyLabel}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.subCity}
                className="hover:bg-[#F7F8FA] cursor-pointer transition-colors"
                onClick={() => onRowClick(row.subCity)}
              >
                <TableCell className="font-medium text-xs text-[#0B1F3A]">{row.subCity}</TableCell>
                <TableCell className="text-right text-xs font-mono">{row.total}</TableCell>
                <TableCell className="text-right text-xs font-mono text-[#1769AA] font-semibold">{row.approved}</TableCell>
                <TableCell className="text-right text-xs font-mono">{row.members}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
      <dt className="text-slate-600 font-medium">{label}</dt>
      <dd className="text-sm font-bold font-mono text-[#0B1F3A]">{value}</dd>
    </div>
  );
}
