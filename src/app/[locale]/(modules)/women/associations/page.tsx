"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useGetWomenAssociationsQuery,
  useDeleteWomenAssociationMutation,
} from "@/hooks/womens";
import WomenAssociationForm from "./_components/women-association-form";
import RowReportButton from "./_components/row-report-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  WomenAssociationRecord,
  WomenAssociationStatus,
  WomenAssociationType,
} from "@/api/womens/associations";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";
import { uiTokens } from "@/styles/design-system";

const STATUS_TAGS: Record<string, string> = {
  DRAFT: uiTokens.statusTag.neutral,
  SUBMITTED: uiTokens.statusTag.warning,
  APPROVED: uiTokens.statusTag.primary,
  REJECTED: uiTokens.statusTag.danger,
};

export default function AssociationsPage() {
  const t = useTranslations("women.associations");
  const router = useRouter();
  const { data: response, isLoading } = useGetWomenAssociationsQuery();
  const deleteMutation = useDeleteWomenAssociationMutation();

  const records: WomenAssociationRecord[] = response?.data || [];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [subCityFilter, setSubCityFilter] = useState<string>("");
  const limit = 10;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sub = params.get("subCity");
    if (sub) {
      setSubCityFilter(sub);
      setSearch(sub);
    }
  }, []);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = records;
    const q = search.toLowerCase();
    data = data.filter(
      (rec) =>
        [rec.name, rec.leaderName, rec.subCity, rec.woreda]
          .filter(Boolean)
          .some((val) => val?.toLowerCase().includes(q)),
    );
    if (subCityFilter) {
      data = data.filter(
        (rec) => rec.subCity?.toLowerCase() === subCityFilter.toLowerCase()
      );
    }
    if (filterType !== "all")
      data = data.filter((rec) => rec.type === filterType);
    if (filterStatus !== "all")
      data = data.filter((rec) => rec.approvalStatus === filterStatus);
    return data;
  }, [records, search, subCityFilter, filterType, filterStatus]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startIndex = (page - 1) * limit;
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  const statusCounts = useMemo(() => {
    const counts = { DRAFT: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0 };
    records.forEach((rec) => {
      if (counts[rec.approvalStatus as keyof typeof counts] !== undefined) {
        counts[rec.approvalStatus as keyof typeof counts] += 1;
      }
    });
    return counts;
  }, [records]);

  const totalDeclaredMembers = useMemo(
    () => records.reduce((sum, rec) => sum + (rec.totalMembers ?? 0), 0),
    [records],
  );

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success(t("messages.deleteSuccess"));
        setDeleteOpen(false);
        setDeleteId(null);
      },
      onError: (err: any) =>
        toast.error(err?.message || t("messages.deleteError")),
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
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
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">{t("title")}</h1>
            <p className="text-xs text-slate-500">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <WomenReportDialog category="ASSOCIATION" />
            <WomenAssociationForm />
          </div>
        </div>
      </div>

      {subCityFilter && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#E8F2FA] border border-[#BCD5EA] p-2.5 rounded-xs">
          <span>
            {t("filteredBySubCity", { subCity: subCityFilter })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-[#1769AA] hover:underline cursor-pointer p-0"
            onClick={() => {
              setSubCityFilter("");
              setSearch("");
            }}
          >
            {t("clearFilter")}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatChip label={t("stats.total")} value={records.length} tone="text-[#0B1F3A]" />
        <StatChip label={t("status.DRAFT")} value={statusCounts.DRAFT} tone="text-slate-600" />
        <StatChip label={t("status.SUBMITTED")} value={statusCounts.SUBMITTED} tone="text-[#D97706]" />
        <StatChip label={t("status.APPROVED")} value={statusCounts.APPROVED} tone="text-[#1769AA]" />
        <StatChip label={t("status.REJECTED")} value={statusCounts.REJECTED} tone="text-[#DC2626]" />
        <StatChip label={t("stats.declaredMembers")} value={totalDeclaredMembers} tone="text-[#1769AA]" />
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <Users className="w-4 h-4 text-[#1769AA]" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
              <SelectTrigger className="w-[150px] h-8 text-xs border-[#E3E7EB] rounded-xs">
                <SelectValue placeholder={t("filters.allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
                {(["ASSOCIATION", "DEVELOPMENT_ASSOCIATION", "FEDERATION"] as WomenAssociationType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
              <SelectTrigger className="w-[140px] h-8 text-xs border-[#E3E7EB] rounded-xs">
                <SelectValue placeholder={t("filters.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                {(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as WomenAssociationStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">{t("table.name")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.type")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.location")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.leader")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.totalMembers")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.status")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-500">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0">
                      <TableCell className="font-semibold text-xs text-[#0B1F3A] py-3 pl-5">{rec.name}</TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-medium border border-[#E3E7EB] bg-slate-50 text-slate-700">
                          {t(`types.${rec.type}`)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3">
                        {rec.subCity} / {rec.woreda}
                        {rec.block ? `, ${t("table.block")} ${rec.block}` : ""}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3">
                        <span className="font-medium text-slate-800">{rec.leaderName}</span>
                        <p className="font-mono text-[11px] text-slate-500">{rec.leaderPhoneNumber}</p>
                      </TableCell>
                      <TableCell className="font-mono text-xs py-3">{rec.totalMembers ?? "—"}</TableCell>
                      <TableCell className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${STATUS_TAGS[rec.approvalStatus] || uiTokens.statusTag.neutral}`}>
                          {t(`status.${rec.approvalStatus}`)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/women/associations/${rec.id}`)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/women/associations/${rec.id}?edit=1`)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <RowReportButton associationId={rec.id} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                            onClick={() => { setDeleteId(rec.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-500">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
            <p className="text-xs font-mono text-slate-500">
              {t("showing", { from: totalItems === 0 ? 0 : startIndex + 1, to: Math.min(startIndex + limit, totalItems), total: totalItems })}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-mono px-2 text-slate-600">{page} / {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-xs border-[#E3E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#0B1F3A]">{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">{t("delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xs text-xs h-8">{t("delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 rounded-xs text-xs h-8"
            >
              {t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white p-3 text-center shadow-2xs">
      <p className={`text-xl font-bold font-mono ${tone}`}>{value}</p>
      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
