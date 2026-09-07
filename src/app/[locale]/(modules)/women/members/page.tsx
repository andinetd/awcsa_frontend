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
} from "lucide-react";
import { toast } from "sonner";
import MemberEditDialog from "../associations/_components/member-edit-dialog";

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            {t("title")}
          </h1>
          <p className="text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 bg-slate-50/50 border-slate-200"
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
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("filters.allSubCities")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allSubCities")}</SelectItem>
                {subCityOptions.map((s) => (
                  <SelectItem key={s} value={s}>
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
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("filters.allWoredas")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allWoredas")}</SelectItem>
                {woredaOptions.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
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
                  <TableHead className="font-semibold">{t("table.fullName")}</TableHead>
                  <TableHead className="font-semibold">{t("table.phone")}</TableHead>
                  <TableHead className="font-semibold">{t("table.association")}</TableHead>
                  <TableHead className="font-semibold">{t("table.location")}</TableHead>
                  <TableHead className="font-semibold">{t("table.group")}</TableHead>
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
                  currentData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">{row.fullName}</TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {row.phoneNumber || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() =>
                            router.push(`/women/associations/${row.associationId}`)
                          }
                        >
                          {row.association?.name ?? "-"}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {row.association?.subCity} / {row.association?.woreda}
                      </TableCell>
                      <TableCell>
                        {t("table.groupCell", {
                          group: row.groupNumber,
                          serial: row.serialNumber,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/women/associations/${row.associationId}`)
                            }
                            title={t("actions.viewAssociation")}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditTarget(row)}
                            title={t("actions.edit")}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setDeleteTarget(row)}
                            title={t("actions.delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              {t("showing", {
                from: totalItems === 0 ? 0 : startIndex + 1,
                to: Math.min(startIndex + limit, totalItems),
                total: totalItems,
              })}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.description", { name: deleteTarget?.fullName ?? "" })}
            </AlertDialogDescription>
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
