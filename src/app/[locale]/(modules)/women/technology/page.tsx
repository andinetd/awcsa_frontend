"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useGetTechnologySupportQuery,
  useDeleteTechnologySupportMutation,
} from "@/hooks/womens";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Zap,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import TechnologySupportForm from "./_components/technology-support-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TechnologySupportRecord } from "@/api/womens/technologySupport";
import { isWithinDateRange } from "@/utils/date-range";

export default function TechnologySupportPage() {
  const t = useTranslations("women.technologySupport");
  const router = useRouter();
  const { data: records, isLoading } = useGetTechnologySupportQuery();
  const deleteMutation = useDeleteTechnologySupportMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter state
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPoor, setFilterPoor] = useState<boolean | null>(null);
  const [filterDisabled, setFilterDisabled] = useState<boolean | null>(null);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [editRecord, setEditRecord] = useState<TechnologySupportRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = records || [];
    const q = search.toLowerCase();

    data = data.filter((rec: TechnologySupportRecord) =>
      [rec.womenProfile?.client?.firstName || rec.firstName, rec.womenProfile?.client?.lastName || rec.lastName, rec.womenProfile?.client?.cityIdNumber, rec.technologyType, rec.associationName]
        .filter(Boolean)
        .some((val) => val?.toLowerCase().includes(q)),
    );

    if (filterType !== "all") {
      data = data.filter((rec: TechnologySupportRecord) => rec.technologyType === filterType);
    }
    if (filterPoor === true) {
      data = data.filter((rec: TechnologySupportRecord) => rec.isPoor);
    }
    if (filterPoor === false) {
      data = data.filter((rec: TechnologySupportRecord) => !rec.isPoor);
    }
    if (filterDisabled === true) {
      data = data.filter((rec: TechnologySupportRecord) => rec.disabilities?.length > 0);
    }
    if (filterDisabled === false) {
      data = data.filter((rec: TechnologySupportRecord) => !rec.disabilities || rec.disabilities.length === 0);
    }

    if (filterStartDate || filterEndDate) {
      data = data.filter((rec: TechnologySupportRecord) =>
        isWithinDateRange(rec.createdAt, filterStartDate, filterEndDate),
      );
    }

    return data;
  }, [records, search, filterType, filterPoor, filterDisabled, filterStartDate, filterEndDate]);

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

  const handleEdit = (record: TechnologySupportRecord) => {
    setEditRecord(record);
    setEditOpen(true);
  };

  const getClientName = (rec: TechnologySupportRecord) => {
    const c = rec.womenProfile?.client;
    if (c) return `${c.firstName} ${c.lastName}`;
    return [rec.firstName, rec.lastName].filter(Boolean).join(" ") || "N/A";
  };

  const getClientId = (rec: TechnologySupportRecord) => rec.womenProfile?.client?.cityIdNumber || "";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">{t("title")}</h1>
          <p className="text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <WomenReportDialog category="TECHNOLOGY_SUPPORT" />
          {editRecord && (
            <TechnologySupportForm
              record={editRecord}
              open={editOpen}
              onOpenChange={(o) => { setEditOpen(o); if (!o) setEditRecord(null); }}
            />
          )}
          <TechnologySupportForm />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="text-slate-500">
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">{t("filter.allTypes")}</h4>
                  <div className="space-y-2">
                    <Label>{t("form.fields.technologyType")}</Label>
                    <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("filter.allTypes")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("filter.allTypes")}</SelectItem>
                        <SelectItem value="SOLAR">{t("filter.solar")}</SelectItem>
                        <SelectItem value="WATER_PUMP">{t("filter.waterPump")}</SelectItem>
                        <SelectItem value="IMPROVED_STOVE">{t("filter.improvedStove")}</SelectItem>
                        <SelectItem value="BIODIGESTER">{t("filter.biodigester")}</SelectItem>
                        <SelectItem value="ELECTRIC_MILL">{t("filter.electricMill")}</SelectItem>
                        <SelectItem value="OTHER">{t("filter.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-poor"
                      checked={filterPoor === true}
                      onCheckedChange={(c) => { setFilterPoor(c ? true : null); setPage(1); }}
                    />
                    <Label htmlFor="filter-poor">{t("filter.poorStatus")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-disabled"
                      checked={filterDisabled === true}
                      onCheckedChange={(c) => { setFilterDisabled(c ? true : null); setPage(1); }}
                    />
                    <Label htmlFor="filter-disabled">{t("filter.hasDisabilities")}</Label>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setFilterType("all"); setFilterPoor(null); setFilterDisabled(null); setFilterStartDate(""); setFilterEndDate(""); setPage(1); }}
                  >
                    {t("filter.clearFilters")}
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
                  <TableHead className="font-semibold">{t("table.technologyType")}</TableHead>
                  <TableHead className="font-semibold">{t("table.association")}</TableHead>
                  <TableHead className="font-semibold">{t("table.status")}</TableHead>
                  <TableHead className="font-semibold">{t("table.health")}</TableHead>
                  <TableHead className="font-semibold text-right">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec: TechnologySupportRecord) => (
                    <TableRow key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">
                        {getClientName(rec)}
                        <p className="text-xs text-slate-400">{getClientId(rec)}</p>
                      </TableCell>
                      <TableCell>{t(`form.technologyTypes.${rec.technologyType}`) || rec.technologyType}</TableCell>
                      <TableCell>{rec.associationName || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rec.isPoor && <Badge variant="secondary" className="rounded-full text-xs">{t("poor")}</Badge>}
                          {rec.isSexWorker && <Badge variant="outline" className="rounded-full text-xs">{t("sexWorker")}</Badge>}
                          {rec.disabilities?.length > 0 && (
                            <Badge variant="secondary" className="rounded-full text-xs">
                              {t("disabled")} ({rec.disabilities.length})
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rec.healthConditions?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rec.healthConditions.map((c: string) => (
                              <Badge key={c} variant="destructive" className="rounded-full text-xs">
                                {c}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/women/technology/${rec.id}`)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(rec)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => { setDeleteId(rec.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {t("form.showing", { from: startIndex + 1, to: Math.min(startIndex + limit, totalItems), total: totalItems })}
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
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground">
              {deleteMutation.isPending ? t("delete.deleting") : t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
