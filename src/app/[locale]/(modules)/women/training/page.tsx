"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useGetWomenTrainingsQuery,
  useDeleteTrainingMutation,
} from "@/hooks/womens";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  GraduationCap,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import WomenTrainingForm from "./_components/training-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WomenTrainingRecord } from "@/api/womens/training";
import { isWithinDateRange } from "@/utils/date-range";
import { uiTokens } from "@/styles/design-system";

export default function WomenTrainingPage() {
  const t = useTranslations("women.training");
  const router = useRouter();
  const { data: trainings, isLoading } = useGetWomenTrainingsQuery();
  const deleteMutation = useDeleteTrainingMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filterAttended, setFilterAttended] = useState<boolean | null>(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [editRecord, setEditRecord] = useState<WomenTrainingRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = trainings || [];
    const q = search.toLowerCase();
    data = data.filter((rec: WomenTrainingRecord) =>
      [rec.womenProfile?.client?.firstName || rec.firstName, rec.womenProfile?.client?.lastName || rec.lastName, rec.womenProfile?.client?.cityIdNumber, rec.trainingTopic]
        .filter(Boolean)
        .some((val) => val?.toLowerCase().includes(q)),
    );
    if (filterAttended === true) data = data.filter((rec: WomenTrainingRecord) => rec.attended);
    if (filterAttended === false) data = data.filter((rec: WomenTrainingRecord) => !rec.attended);
    if (filterStartDate || filterEndDate) {
      data = data.filter((rec: WomenTrainingRecord) =>
        isWithinDateRange(rec.startDate, filterStartDate, filterEndDate),
      );
    }
    return data;
  }, [trainings, search, filterAttended, filterStartDate, filterEndDate]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => { toast.success("Training record deleted"); setDeleteOpen(false); setDeleteId(null); },
      onError: (err: any) => toast.error(err?.message || "Delete failed"),
    });
  };

  const getClientName = (rec: WomenTrainingRecord) => {
    const c = rec.womenProfile?.client;
    if (c) return `${c.firstName} ${c.lastName}`;
    return [rec.firstName, rec.lastName].filter(Boolean).join(" ") || "N/A";
  };
  const getClientId = (rec: WomenTrainingRecord) => rec.womenProfile?.client?.cityIdNumber || "";

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
            <WomenReportDialog category="TRAINING" />
            {editRecord && (
              <WomenTrainingForm record={editRecord} open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditRecord(null); }} />
            )}
            <WomenTrainingForm />
          </div>
        </div>
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <GraduationCap className="w-4 h-4 text-[#1769AA]" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 h-8 text-xs bg-slate-50/50 border-[#E3E7EB] rounded-xs"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 border-[#E3E7EB] rounded-xs shadow-md p-4" align="end">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">Filters</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-attended"
                      checked={filterAttended === true}
                      onCheckedChange={(c) => { setFilterAttended(c ? true : null); setPage(1); }}
                      className="rounded-xs border-[#E3E7EB] data-[state=checked]:bg-[#1769AA]"
                    />
                    <Label htmlFor="filter-attended" className="text-xs text-slate-700 cursor-pointer">Attended only</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-600">{t("filter.dateFrom")}</Label>
                      <Input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => { setFilterStartDate(e.target.value); setPage(1); }}
                        className="h-8 text-xs border-[#E3E7EB] rounded-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-600">{t("filter.dateTo")}</Label>
                      <Input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => { setFilterEndDate(e.target.value); setPage(1); }}
                        className="h-8 text-xs border-[#E3E7EB] rounded-xs"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs w-full"
                    onClick={() => { setFilterAttended(null); setFilterStartDate(""); setFilterEndDate(""); setPage(1); }}
                  >
                    Clear filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">{t("table.beneficiary")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.trainingTopic")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.dates")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.attended")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.remark")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">{t("table.loading")}</TableCell></TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec: WomenTrainingRecord) => (
                    <TableRow key={rec.id} className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0">
                      <TableCell className="py-3 pl-5">
                        <div className="font-semibold text-xs text-[#0B1F3A]">{getClientName(rec)}</div>
                        {getClientId(rec) && (
                          <span className="font-mono text-[11px] text-slate-500">{getClientId(rec)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-800 py-3">{rec.trainingTopic}</TableCell>
                      <TableCell className="text-xs text-slate-600 py-3">
                        <span className="font-mono">{new Date(rec.startDate).toLocaleDateString()}</span>
                        {rec.completionDate && <span className="font-mono">{` - ${new Date(rec.completionDate).toLocaleDateString()}`}</span>}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${
                          rec.attended ? uiTokens.statusTag.primary : uiTokens.statusTag.neutral
                        }`}>
                          {rec.attended ? t("attendedYes") : t("attendedNo")}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 max-w-[200px] truncate py-3">{rec.remark || "—"}</TableCell>
                      <TableCell className="text-right py-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                            onClick={() => router.push(`/women/training/${rec.id}`)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                            onClick={() => { setEditRecord(rec); setEditOpen(true); }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                            onClick={() => { setDeleteId(rec.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">{t("table.noRecords")}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalItems > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E7EB] bg-slate-50/40">
              <div className="text-xs text-slate-500">
                Showing <span className="font-medium text-slate-700">{startIndex + 1}</span>-
                <span className="font-medium text-slate-700">{Math.min(startIndex + limit, totalItems)}</span> of{" "}
                <span className="font-medium text-slate-700">{totalItems}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] hover:bg-white cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Prev
                </Button>
                <div className="text-xs font-mono text-slate-600 px-2">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] hover:bg-white cursor-pointer disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-xs border-[#E3E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold text-[#0B1F3A]">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">Are you sure you want to delete this training record?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs rounded-xs border-[#E3E7EB]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-8 text-xs rounded-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}