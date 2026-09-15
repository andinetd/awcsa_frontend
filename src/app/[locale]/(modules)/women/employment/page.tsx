"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useGetWomenEmploymentsQuery,
  useDeleteEmploymentMutation,
} from "@/hooks/womens";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Briefcase,
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
import { uiTokens } from "@/styles/design-system";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import WomenEmploymentForm from "./_components/employment-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WomenEmploymentRecord } from "@/api/womens/employment";
import { isWithinDateRange } from "@/utils/date-range";

export default function WomenEmploymentPage() {
  const t = useTranslations("women.employment");
  const router = useRouter();
  const { data: employments, isLoading } = useGetWomenEmploymentsQuery();
  const deleteMutation = useDeleteEmploymentMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filterType, setFilterType] = useState<string>("all");
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [editRecord, setEditRecord] = useState<WomenEmploymentRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = employments || [];
    const q = search.toLowerCase();
    data = data.filter((rec: WomenEmploymentRecord) =>
      [rec.womenProfile?.client?.firstName || rec.firstName, rec.womenProfile?.client?.lastName || rec.lastName, rec.womenProfile?.client?.cityIdNumber, rec.sector]
        .filter(Boolean)
        .some((val) => val?.toLowerCase().includes(q)),
    );
    if (filterType !== "all") data = data.filter((rec: WomenEmploymentRecord) => rec.employmentType === filterType);
    if (filterSector !== "all") data = data.filter((rec: WomenEmploymentRecord) => rec.sector === filterSector);
    if (filterStartDate || filterEndDate) {
      data = data.filter((rec: WomenEmploymentRecord) =>
        isWithinDateRange(rec.createdAt, filterStartDate, filterEndDate),
      );
    }
    return data;
  }, [employments, search, filterType, filterSector, filterStartDate, filterEndDate]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => { toast.success("Employment record deleted"); setDeleteOpen(false); setDeleteId(null); },
      onError: (err: any) => toast.error(err?.message || "Delete failed"),
    });
  };

  const getClientName = (rec: WomenEmploymentRecord) => {
    const c = rec.womenProfile?.client;
    if (c) return `${c.firstName} ${c.lastName}`;
    return [rec.firstName, rec.lastName].filter(Boolean).join(" ") || "N/A";
  };
  const getClientId = (rec: WomenEmploymentRecord) => rec.womenProfile?.client?.cityIdNumber || "";

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
            <WomenReportDialog category="EMPLOYMENT" />
            {editRecord && (
              <WomenEmploymentForm record={editRecord} open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditRecord(null); }} />
            )}
            <WomenEmploymentForm />
          </div>
        </div>
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <Briefcase className="w-4 h-4 text-[#1769AA]" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] cursor-pointer">
                  <Filter className="w-3.5 h-3.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 rounded-xs border-[#E3E7EB]" align="end">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">Filters</h4>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-600">Employment Type</Label>
                    <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
                      <SelectTrigger className="h-8 text-xs border-[#E3E7EB] rounded-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="GROUP">Group</SelectItem>
                      </SelectContent>
                    </Select>
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
                    onClick={() => { setFilterType("all"); setFilterSector("all"); setFilterStartDate(""); setFilterEndDate(""); setPage(1); }}
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
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.type")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.sector")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.year")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.remark")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">{t("table.loading")}</TableCell></TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((emp: WomenEmploymentRecord) => (
                    <TableRow key={emp.id} className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0">
                      <TableCell className="py-3 pl-5">
                        <div className="font-semibold text-xs text-[#0B1F3A]">{getClientName(emp)}</div>
                        {getClientId(emp) && (
                          <span className="font-mono text-[11px] text-slate-500">{getClientId(emp)}</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${
                          emp.employmentType === "INDIVIDUAL" ? uiTokens.statusTag.primary : uiTokens.statusTag.neutral
                        }`}>
                          {emp.employmentType === "INDIVIDUAL" ? t("individual") : t("group")}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700 py-3">{emp.sector}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-700 py-3">{emp.year}</TableCell>
                      <TableCell className="text-xs text-slate-500 max-w-[200px] truncate py-3">{emp.remark || "—"}</TableCell>
                      <TableCell className="text-right py-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/women/employment/${emp.id}`)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditRecord(emp); setEditOpen(true); }}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                            onClick={() => { setDeleteId(emp.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">{t("table.noRecords")}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalItems > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
              <div className="text-xs font-mono text-slate-500">
                Showing {startIndex + 1}-{Math.min(startIndex + limit, totalItems)} of {totalItems}
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
                <span className="text-xs font-mono px-2 text-slate-600">{page} / {totalPages || 1}</span>
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
            <AlertDialogTitle className="text-base font-bold text-[#0B1F3A]">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">Are you sure you want to delete this employment record?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xs text-xs h-8">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 rounded-xs text-xs h-8"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}