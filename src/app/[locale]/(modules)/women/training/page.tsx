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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">{t("title")}</h1>
          <p className="text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <WomenReportDialog category="TRAINING" />
          {editRecord && (
            <WomenTrainingForm record={editRecord} open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditRecord(null); }} />
          )}
          <WomenTrainingForm />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder={t("searchPlaceholder")} className="pl-8 bg-slate-50/50 border-slate-200"
                value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="text-slate-500">
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Filters</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-attended" checked={filterAttended === true}
                      onCheckedChange={(c) => { setFilterAttended(c ? true : null); setPage(1); }} />
                    <Label htmlFor="filter-attended">Attended only</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">{t("filter.dateFrom")}</Label>
                      <Input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => { setFilterStartDate(e.target.value); setPage(1); }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("filter.dateTo")}</Label>
                      <Input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => { setFilterEndDate(e.target.value); setPage(1); }}
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFilterAttended(null); setFilterStartDate(""); setFilterEndDate(""); setPage(1); }}>
                    Clear filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold">{t("table.beneficiary")}</TableHead>
                  <TableHead className="font-semibold">{t("table.trainingTopic")}</TableHead>
                  <TableHead className="font-semibold">{t("table.dates")}</TableHead>
                  <TableHead className="font-semibold">{t("table.attended")}</TableHead>
                  <TableHead className="font-semibold">{t("table.remark")}</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">{t("table.loading")}</TableCell></TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec: WomenTrainingRecord) => (
                    <TableRow key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">
                        {getClientName(rec)}
                        <p className="text-xs text-slate-400">{getClientId(rec)}</p>
                      </TableCell>
                      <TableCell>{rec.trainingTopic}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(rec.startDate).toLocaleDateString()}
                        {rec.completionDate && ` - ${new Date(rec.completionDate).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rec.attended ? "default" : "secondary"} className="rounded-full">
                          {rec.attended ? t("attendedYes") : t("attendedNo")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{rec.remark || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/women/training/${rec.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setEditRecord(rec); setEditOpen(true); }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive"
                            onClick={() => { setDeleteId(rec.id); setDeleteOpen(true); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-400">{t("table.noRecords")}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalItems > 0 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + limit, totalItems)} of {totalItems}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this training record?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}