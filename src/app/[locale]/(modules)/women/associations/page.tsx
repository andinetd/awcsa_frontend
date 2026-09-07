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
const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">{t("title")}</h1>
          <p className="text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
        <WomenReportDialog category="ASSOCIATION" />
        <WomenAssociationForm />
      </div>

      {subCityFilter && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>
            {t("filteredBySubCity", { subCity: subCityFilter })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSubCityFilter("");
              setSearch("");
            }}
          >
            {t("clearFilter")}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatChip label={t("stats.total")} value={records.length} tone="text-slate-900" />
        <StatChip label={t("status.DRAFT")} value={statusCounts.DRAFT} tone="text-slate-700" />
        <StatChip label={t("status.SUBMITTED")} value={statusCounts.SUBMITTED} tone="text-amber-600" />
        <StatChip label={t("status.APPROVED")} value={statusCounts.APPROVED} tone="text-emerald-600" />
        <StatChip label={t("status.REJECTED")} value={statusCounts.REJECTED} tone="text-red-600" />
        <StatChip label={t("stats.declaredMembers")} value={totalDeclaredMembers} tone="text-primary" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 bg-slate-50/50 border-slate-200"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
              <SelectTrigger className="w-[170px]">
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
              <SelectTrigger className="w-[160px]">
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
        <CardContent>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold">{t("table.name")}</TableHead>
                  <TableHead className="font-semibold">{t("table.type")}</TableHead>
                  <TableHead className="font-semibold">{t("table.location")}</TableHead>
                  <TableHead className="font-semibold">{t("table.leader")}</TableHead>
                  <TableHead className="font-semibold">{t("table.totalMembers")}</TableHead>
                  <TableHead className="font-semibold">{t("table.status")}</TableHead>
                  <TableHead className="font-semibold text-right">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">{rec.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{t(`types.${rec.type}`)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {rec.subCity} / {rec.woreda}
                        {rec.block ? `, ${t("table.block")} ${rec.block}` : ""}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {rec.leaderName}
                        <p className="text-xs text-slate-400">{rec.leaderPhoneNumber}</p>
                      </TableCell>
                      <TableCell>{rec.totalMembers ?? "-"}</TableCell>
                      <TableCell>
                        <Badge className={`rounded-full border-transparent ${STATUS_STYLES[rec.approvalStatus] || ""}`}>
                          {t(`status.${rec.approvalStatus}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/women/associations/${rec.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/women/associations/${rec.id}?edit=1`)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <RowReportButton associationId={rec.id} />
                          <Button variant="ghost" size="icon" className="text-destructive"
                            onClick={() => { setDeleteId(rec.id); setDeleteOpen(true); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              {t("showing", { from: totalItems === 0 ? 0 : startIndex + 1, to: Math.min(startIndex + limit, totalItems), total: totalItems })}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
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
    <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
