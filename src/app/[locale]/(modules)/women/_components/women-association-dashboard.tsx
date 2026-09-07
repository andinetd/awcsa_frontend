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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-primary" />
              {t("bySubCity.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubCityTable
              rows={stats?.bySubCity ?? []}
              loading={isLoading}
              onRowClick={handleSubCityDrillDown}
              emptyLabel={t("bySubCity.empty")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="w-4 h-4 text-primary" />
              {t("totals.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
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
            <div className="mt-4 text-xs text-muted-foreground">
              <Link
                href="/women/associations"
                className="text-primary hover:underline"
              >
                {t("totals.viewList")}
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
    <div className="border rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold">{t("subCity")}</TableHead>
            <TableHead className="font-semibold text-right">{t("total")}</TableHead>
            <TableHead className="font-semibold text-right">
              {t("approved")}
            </TableHead>
            <TableHead className="font-semibold text-right">
              {t("members")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                {t("loading")}
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                {emptyLabel}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.subCity}
                className="hover:bg-slate-50/50 cursor-pointer"
                onClick={() => onRowClick(row.subCity)}
              >
                <TableCell className="font-medium">{row.subCity}</TableCell>
                <TableCell className="text-right">{row.total}</TableCell>
                <TableCell className="text-right">{row.approved}</TableCell>
                <TableCell className="text-right">{row.members}</TableCell>
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
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
