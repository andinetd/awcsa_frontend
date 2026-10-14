"use client";

import React from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Users, ListChecks, ArrowRight } from "lucide-react";
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
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";

interface SubCityRow {
  subCity: string;
  total: number;
  approved: number;
  members: number;
}

interface WomenSubCityMatrixProps {
  rows?: SubCityRow[];
  loading?: boolean;
  declaredMembers?: number;
  totalMembers?: number;
  totalGroups?: number;
  approvedCount?: number;
  incompleteCount?: number;
}

const ADDIS_ABABA_SUBCITIES = [
  "Addis Ketema",
  "Akaky Kaliti",
  "Arada",
  "Bole",
  "Gullele",
  "Kirkos",
  "Kolfe Keranio",
  "Lemi Kura",
  "Lideta",
  "Nifas Silk-Lafto",
  "Yeka",
];

export function WomenSubCityMatrix({
  rows = [],
  loading = false,
  declaredMembers = 0,
  totalMembers = 0,
  totalGroups = 0,
  approvedCount = 0,
  incompleteCount = 0,
}: WomenSubCityMatrixProps) {
  const router = useRouter();
  const t = useTranslations("women.dashboard.matrix");
  const tSubCity = useTranslations("women.subCities.names");
  const tBySubCity = useTranslations("women.dashboard.bySubCity");

  const handleRowClick = (subCity: string) => {
    router.push(`/women/associations?subCity=${encodeURIComponent(subCity)}`);
  };

  const getSubCityLabel = (name: string) => {
    try {
      return tSubCity(name as any);
    } catch {
      return name;
    }
  };

  const { filterSubCityNames } = useJurisdictionScope();

  const displayRows = React.useMemo(() => {
    const targetSubCities = filterSubCityNames(ADDIS_ABABA_SUBCITIES);
    return targetSubCities.map((name) => {
      const match = rows.find(
        (r) =>
          r.subCity?.toLowerCase() === name.toLowerCase() ||
          r.subCity?.toLowerCase().replace(/[^a-z]/g, "") ===
            name.toLowerCase().replace(/[^a-z]/g, "")
      );
      return {
        subCity: name,
        total: match?.total ?? 0,
        approved: match?.approved ?? 0,
        members: match?.members ?? 0,
      };
    });
  }, [rows, filterSubCityNames]);

  const totalAssocsInMatrix = displayRows.reduce((acc, r) => acc + r.total, 0);
  const totalApprovedInMatrix = displayRows.reduce((acc, r) => acc + r.approved, 0);
  const totalMembersInMatrix = displayRows.reduce((acc, r) => acc + r.members, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* SubCity Table (8 cols) */}
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs lg:col-span-8 flex flex-col justify-between">
        <div>
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB] flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <Users className="w-4 h-4 text-[#1769AA]" />
                {t("title")}
              </CardTitle>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                {t("subtitle")}
              </p>
            </div>
            <span className="text-[10.5px] text-slate-400 font-mono hidden sm:inline">
              {t("columns.actions")}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                  <TableRow>
                    <TableHead className="font-semibold text-xs text-slate-700 py-2.5 pl-4">{t("columns.subCity")}</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5">{t("columns.associations")}</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5">{tBySubCity("approved")}</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5">{tBySubCity("members")}</TableHead>
                    <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5 pr-4">{t("columns.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500 text-xs">
                        {tBySubCity("loading")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayRows.map((row) => {
                      const statusTag =
                        row.total === 0
                          ? { label: "-", cls: "bg-slate-100 text-slate-400 border-slate-200" }
                          : row.approved === row.total && row.total > 0
                          ? { label: t("status.active"), cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                          : row.approved > 0
                          ? { label: t("status.highDemand"), cls: "bg-sky-50 text-sky-700 border-sky-200" }
                          : { label: t("status.underReview"), cls: "bg-amber-50 text-amber-700 border-amber-200" };

                      return (
                        <TableRow
                          key={row.subCity}
                          className="hover:bg-[#F7F8FA] cursor-pointer transition-colors border-b border-[#E3E7EB] last:border-0"
                          onClick={() => handleRowClick(row.subCity)}
                        >
                          <TableCell className="font-medium text-xs text-[#0B1F3A] py-2 pl-4">
                            {getSubCityLabel(row.subCity)}
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono py-2">{row.total}</TableCell>
                          <TableCell className="text-right text-xs font-mono text-[#1769AA] font-semibold py-2">{row.approved}</TableCell>
                          <TableCell className="text-right text-xs font-mono py-2">{row.members.toLocaleString()}</TableCell>
                          <TableCell className="text-right py-2 pr-4">
                            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-xs text-[9.5px] font-bold font-mono border ${statusTag.cls}`}>
                              {statusTag.label}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </div>

        <div className="p-3 border-t border-[#E3E7EB] bg-slate-50/70 flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>{t("totals")} ({displayRows.length}):</span>
          <span className="font-bold text-[#0B1F3A]">
            {totalAssocsInMatrix} ({totalApprovedInMatrix}) • {totalMembersInMatrix.toLocaleString()}
          </span>
        </div>
      </Card>

      {/* Totals & Roster Summary (4 cols) */}
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs lg:col-span-4 flex flex-col justify-between">
        <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <ListChecks className="w-4 h-4 text-[#1769AA]" />
            {t("summaryCard.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <dl className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">{t("columns.budgetShare")}</dt>
              <dd className="text-sm font-bold font-mono text-[#0B1F3A]">{declaredMembers}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">{t("columns.registered")}</dt>
              <dd className="text-sm font-bold font-mono text-[#1769AA]">{totalMembers}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">{t("columns.associations")}</dt>
              <dd className="text-sm font-bold font-mono text-[#0B1F3A]">{totalGroups}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">{tBySubCity("approved")}</dt>
              <dd className="text-sm font-bold font-mono text-emerald-700">{approvedCount}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">{t("status.underReview")}</dt>
              <dd className="text-sm font-bold font-mono text-amber-600">{incompleteCount}</dd>
            </div>
          </dl>

          <div className="pt-2">
            <Link
              href="/women/associations"
              className="text-xs text-[#1769AA] font-semibold hover:underline inline-flex items-center gap-1 group"
            >
              <span>{t("viewSubCity", { name: "" })}</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
