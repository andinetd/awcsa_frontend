"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  useListMembersQuery,
  useDeleteMemberMutation,
} from "@/hooks/womens";
import {
  WomenAssociationMemberListItem,
} from "@/api/womens/associations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Users,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  History,
} from "lucide-react";
import { toast } from "sonner";
import MemberEditDialog from "../associations/_components/member-edit-dialog";
import PersonHistoryDialog from "@/components/shared/person-history-dialog";
import { uiTokens } from "@/styles/design-system";

export default function WomenMembersPage() {
  const t = useTranslations("women.members");
  const router = useRouter();
  const { data, isLoading } = useListMembersQuery({
    page: 1,
    limit: 50,
  });
  const deleteMutation = useDeleteMemberMutation();

  const [search, setSearch] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [editTarget, setEditTarget] = useState<WomenAssociationMemberListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WomenAssociationMemberListItem | null>(null);

  const filteredData = useMemo(() => {
    const rows = data?.data ?? [];
    const q = search.toLowerCase();
    return rows.filter((row) => {
      if (q) {
        const hay = [row.fullName, row.phoneNumber, row.association?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (subCity && row.association?.subCity !== subCity) return false;
      if (woreda && row.association?.woreda !== woreda) return false;
      return true;
    });
  }, [data, search, subCity, woreda]);

  const startIndex = (page - 1) * limit;
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  const subCityOptions = useMemo(() => {
    const set = new Set<string>();
    (data?.data ?? []).forEach((r) => r.association?.subCity && set.add(r.association.subCity));
    return Array.from(set).sort();
  }, [data]);
  const woredaOptions = useMemo(() => {
    const set = new Set<string>();
    (data?.data ?? []).forEach((r) => {
      if (subCity && r.association?.subCity !== subCity) return;
      if (r.association?.woreda) set.add(r.association.woreda);
    });
    return Array.from(set).sort();
  }, [data, subCity]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(t("messages.deleted"));
        setDeleteTarget(null);
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || t("messages.deleteError")),
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
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-500">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <Users className="w-4 h-4 text-[#1769AA]" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 h-8 text-xs bg-slate-50/50 border-[#E3E7EB] rounded-xs"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={subCity || "all"}
              onValueChange={(v) => {
                setSubCity(v === "all" ? "" : v);
                setWoreda("");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] h-8 text-xs border-[#E3E7EB] rounded-xs">
                <SelectValue placeholder={t("filters.allSubCities")} />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB]">
                <SelectItem value="all" className="text-xs">{t("filters.allSubCities")}</SelectItem>
                {subCityOptions.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={woreda || "all"}
              onValueChange={(v) => {
                setWoreda(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px] h-8 text-xs border-[#E3E7EB] rounded-xs">
                <SelectValue placeholder={t("filters.allWoredas")} />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB]">
                <SelectItem value="all" className="text-xs">{t("filters.allWoredas")}</SelectItem>
                {woredaOptions.map((w) => (
                  <SelectItem key={w} value={w} className="text-xs">
                    {w}
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
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">{t("table.fullName")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.phone")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.association")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.location")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.group")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">{t("table.actions")}</TableHead>
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
                  currentData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0">
                      <TableCell className="py-3 pl-5">
                        <div className="font-semibold text-xs text-[#0B1F3A]">{row.fullName}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-mono py-3">
                        {row.phoneNumber || "—"}
                      </TableCell>
                      <TableCell className="text-xs py-3">
                        <button
                          type="button"
                          className="text-[#1769AA] hover:underline font-medium cursor-pointer"
                          onClick={() =>
                            router.push(`/women/associations/${row.associationId}`)
                          }
                        >
                          {row.association?.name ?? "—"}
                        </button>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3">
                        {row.association?.subCity} / {row.association?.woreda}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-mono text-[11px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-xs text-slate-700">
                          {t("table.groupCell", {
                            group: row.groupNumber,
                            serial: row.serialNumber,
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <PersonHistoryDialog
                            personName={row.fullName}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View cross-department support history"
                                className="h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                              >
                                <History className="w-3.5 h-3.5" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                            onClick={() =>
                              router.push(`/women/associations/${row.associationId}`)
                            }
                            title={t("actions.viewAssociation")}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                            onClick={() => setEditTarget(row)}
                            title={t("actions.edit")}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                            onClick={() => setDeleteTarget(row)}
                            title={t("actions.delete")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E7EB] bg-slate-50/40">
            <p className="text-xs text-slate-500">
              {t("showing", {
                from: totalItems === 0 ? 0 : startIndex + 1,
                to: Math.min(startIndex + limit, totalItems),
                total: totalItems,
              })}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] hover:bg-white cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Prev
              </Button>
              <span className="text-xs font-mono text-slate-600 px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] hover:bg-white cursor-pointer disabled:opacity-40"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <MemberEditDialog
        member={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-xs border-[#E3E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold text-[#0B1F3A]">{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              {t("delete.description", { name: deleteTarget?.fullName ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs rounded-xs border-[#E3E7EB]">{t("delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-8 text-xs rounded-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {t("delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
