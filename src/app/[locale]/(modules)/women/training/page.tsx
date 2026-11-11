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
  CheckCircle2,
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
import WomenTrainingForm from "./_components/training-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WomenTrainingRecord } from "@/api/womens/training";
import { isWithinDateRange } from "@/utils/date-range";
import WomenInstitutionalBanner from "../_components/women-institutional-banner";

export default function WomenTrainingPage() {
  const t = useTranslations("women.training");
  const router = useRouter();
  const { data: trainings, isLoading } = useGetWomenTrainingsQuery();
  const deleteMutation = useDeleteTrainingMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [editRecord, setEditRecord] = useState<WomenTrainingRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Show only trained women (attended === true)
  const trainedList = useMemo(() => {
    return (trainings || []).filter((r: WomenTrainingRecord) => r.attended);
  }, [trainings]);

  const filteredData = useMemo(() => {
    let data = trainedList;
    const q = search.toLowerCase();
    data = data.filter((rec: WomenTrainingRecord) =>
      [
        rec.womenProfile?.client?.firstName || rec.firstName,
        rec.womenProfile?.client?.lastName || rec.lastName,
        rec.womenProfile?.client?.cityIdNumber,
        rec.womenAssociation?.name,
        rec.trainingTopic,
      ]
        .filter(Boolean)
        .some((val) => val?.toLowerCase().includes(q)),
    );
    if (filterStartDate || filterEndDate) {
      data = data.filter((rec: WomenTrainingRecord) =>
        isWithinDateRange(rec.startDate, filterStartDate, filterEndDate),
      );
    }
    return data;
  }, [trainedList, search, filterStartDate, filterEndDate]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success(t("delete.success"));
        setDeleteOpen(false);
        setDeleteId(null);
      },
      onError: (err: any) => toast.error(err?.message || t("delete.error")),
    });
  };

  const getClientName = (rec: WomenTrainingRecord) => {
    const c = rec.womenProfile?.client;
    if (c) return `${c.firstName} ${c.lastName}`;
    if (rec.womenAssociation?.name) return rec.womenAssociation.name;
    return [rec.firstName, rec.lastName].filter(Boolean).join(" ") || "N/A";
  };
  const getClientId = (rec: WomenTrainingRecord) =>
    rec.womenProfile?.client?.cityIdNumber || "";

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <WomenInstitutionalBanner />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">{t("title")}</h1>
            <p className="text-xs text-slate-500">{t("subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <WomenReportDialog category="TRAINING" />
            {editRecord && (
              <WomenTrainingForm
                record={editRecord}
                open={editOpen}
                onOpenChange={(o) => {
                  setEditOpen(o);
                  if (!o) setEditRecord(null);
                }}
              />
            )}
            <WomenTrainingForm />
          </div>
        </div>
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t("tabs.trainedWomen")}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              {totalItems} Trained
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 rounded-xs border-[#E3E7EB]" align="end">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                    Filter by Date
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-600">{t("filter.dateFrom")}</Label>
                      <Input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => {
                          setFilterStartDate(e.target.value);
                          setPage(1);
                        }}
                        className="h-8 text-xs border-[#E3E7EB] rounded-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-600">{t("filter.dateTo")}</Label>
                      <Input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => {
                          setFilterEndDate(e.target.value);
                          setPage(1);
                        }}
                        className="h-8 text-xs border-[#E3E7EB] rounded-xs"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs w-full cursor-pointer"
                    onClick={() => {
                      setFilterStartDate("");
                      setFilterEndDate("");
                      setPage(1);
                    }}
                  >
                    Clear Filters
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
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">
                    {t("table.beneficiary")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("table.trainingTopic")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("table.dates")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("table.attended")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("table.remark")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec: WomenTrainingRecord) => (
                    <TableRow
                      key={rec.id}
                      className="hover:bg-[#F7F8FA] cursor-pointer transition-colors border-b border-[#E3E7EB] last:border-0"
                      onClick={() => router.push(`/women/training/${rec.id}`)}
                    >
                      <TableCell className="py-3 pl-5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-xs text-[#0B1F3A]">
                            {getClientName(rec)}
                          </span>
                          {rec.womenAssociation && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-xs bg-[#E8F2FA] text-[#1769AA] font-semibold border border-[#BCD5EA]">
                              Association
                            </span>
                          )}
                        </div>
                        {getClientId(rec) && (
                          <span className="font-mono text-[11px] text-slate-500">
                            {getClientId(rec)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-800 py-3">
                        {rec.trainingTopic
                          ? t.has(`form.trainingTopics.${rec.trainingTopic}`)
                            ? t(`form.trainingTopics.${rec.trainingTopic}`)
                            : rec.trainingTopic
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3 font-mono">
                        {rec.startDate ? rec.startDate.split("T")[0] : "—"}
                        {rec.completionDate ? ` to ${rec.completionDate.split("T")[0]}` : ""}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {t("attendedYes")}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3 max-w-[200px] truncate">
                        {rec.remark || "—"}
                      </TableCell>
                      <TableCell className="text-right py-3 pr-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/women/training/${rec.id}`)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditRecord(rec);
                              setEditOpen(true);
                            }}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                            onClick={() => {
                              setDeleteId(rec.id);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
              <div className="text-xs font-mono text-slate-500">
                {t("showing", {
                  from: startIndex + 1,
                  to: Math.min(startIndex + limit, totalItems),
                  total: totalItems,
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="text-xs font-mono px-2 text-slate-600">
                  {page} / {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-xs border-[#E3E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#0B1F3A]">
              {t("delete.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              {t("delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xs text-xs h-8">
              {t("delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 rounded-xs text-xs h-8"
            >
              {deleteMutation.isPending ? t("delete.deleting") : t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}