"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirAssociationsQuery } from "@/hooks/social-affairs";
import EdirCard from "./_components/edir-card";
import NewEdirForm from "./_components/new-edir-form";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";
import ImportEdirDialog from "./_components/import-edir-dialog";
import GenerateReportDialog from "./_components/generate-report-dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  List,
  Eye,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import Link from "next/link";

const STATUS_OPTIONS: (EdirStatus | "ALL")[] = [
  "ALL",
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "CANCELLED",
];

const LEVEL_OPTIONS = ["ALL", "WOREDA", "SUB_CITY", "CITY"] as const;

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

const EdirList = () => {
  const t = useTranslations("social-affairs.edir.list");
  const router = useRouter();
  const { data: edirs, isLoading, isError } = useGetEdirAssociationsQuery();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);
  const limit = viewMode === "grid" ? 6 : 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EdirStatus | "ALL">("ALL");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Client-side filtering
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  const filteredEdirs = (edirs || []).filter((edir: Edir) => {
    const matchesSearch =
      edir.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (edir.registrationNumber || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      edir.subCity.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || edir.status === statusFilter;
    const matchesLevel =
      levelFilter === "ALL" || edir.registerLevel === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Client-side pagination
  const totalItems = filteredEdirs.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentEdirs = filteredEdirs.slice(startIndex, startIndex + limit);

  if (isError) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("error")}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link
          href="/"
          className="hover:text-[#1769AA] flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">Social Affairs</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">Edir Associations</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              placeholder={t("search")}
              className="h-8 pl-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <GenerateReportDialog />
            <ImportEdirDialog />
            <NewEdirForm />
          </div>
        </div>
      </div>

      {/* Level & Status Filters + View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-2">
          {/* Level Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-1">
              Level:
            </span>
            {LEVEL_OPTIONS.map((level) => {
              const isSelected = levelFilter === level;
              return (
                <button
                  key={level}
                  onClick={() => {
                    setLevelFilter(level);
                    setPage(1);
                  }}
                  className={`h-7 px-2.5 rounded-xs text-xs font-mono font-medium border transition-colors ${
                    isSelected
                      ? "bg-[#1769AA] text-white border-[#1769AA] shadow-2xs"
                      : "bg-white text-slate-700 border-[#E3E7EB] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {level === "ALL" ? t("levels.all") : t(`levels.${level}`)}
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-1">
              Status:
            </span>
            {STATUS_OPTIONS.map((status) => {
              const isSelected = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`h-7 px-2.5 rounded-xs text-xs font-mono font-medium border transition-colors ${
                    isSelected
                      ? "bg-[#1769AA] text-white border-[#1769AA] shadow-2xs"
                      : "bg-white text-slate-700 border-[#E3E7EB] hover:bg-[#F7F8FA]"
                  }`}
                >
                  {status === "ALL" ? t("status.all") : t(`status.${status}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* View Switcher (Grid vs Table List) */}
        <div className="flex items-center self-start md:self-end border border-[#E3E7EB] rounded-xs p-0.5 bg-slate-50/70">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-7 px-2.5 rounded-xs text-xs font-mono transition-colors ${
              viewMode === "grid"
                ? "bg-white text-[#1769AA] font-bold shadow-2xs border border-[#E3E7EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setViewMode("grid")}
            title="Card Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
            <span>{t.has("viewGrid") ? t("viewGrid") : "Grid"}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-7 px-2.5 rounded-xs text-xs font-mono transition-colors ${
              viewMode === "table"
                ? "bg-white text-[#1769AA] font-bold shadow-2xs border border-[#E3E7EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setViewMode("table")}
            title="List / Table View"
          >
            <List className="w-3.5 h-3.5 mr-1.5" />
            <span>{t.has("viewList") ? t("viewList") : "List"}</span>
          </Button>
        </div>
      </div>

      {/* Content Rendering: Grid vs List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentEdirs.length > 0 ? (
            currentEdirs.map((edir: Edir) => (
              <EdirCard
                key={edir.id}
                edir={edir}
                onViewDetails={(e) => router.push(`/social-affairs/edir/${e.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-xs font-mono text-slate-500 py-12 border border-dashed border-[#E3E7EB] rounded-xs bg-slate-50/50">
              {t("noRecords")}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xs border border-[#E3E7EB] overflow-hidden bg-white shadow-2xs">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("table.name") ? t("table.name") : "Edir Name"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("table.level") ? t("table.level") : "Level"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("table.location") ? t("table.location") : "Location"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("table.members") ? t("table.members") : "Members"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("table.status") ? t("table.status") : "Status"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4 text-right">
                  {t.has("table.actions") ? t("table.actions") : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#E3E7EB]">
              {currentEdirs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-xs font-mono text-slate-400"
                  >
                    {t("noRecords")}
                  </TableCell>
                </TableRow>
              ) : (
                currentEdirs.map((edir: Edir) => {
                  const totalMembers =
                    (edir.managementMale || 0) +
                    (edir.managementFemale || 0) +
                    (edir.generalMale || 0) +
                    (edir.generalFemale || 0);

                  return (
                    <TableRow
                      key={edir.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => router.push(`/social-affairs/edir/${edir.id}`)}
                    >
                      <TableCell className="px-4 py-3">
                        <div className="font-semibold text-xs text-[#0B1F3A]">
                          {edir.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-slate-500">
                          <span>{edir.registrationNumber || "—"}</span>
                          {edir.renewedForYear && (
                            <span className="text-slate-400">
                              • Year {edir.renewedForYear}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]"
                        >
                          {edir.registerLevel
                            ? t(`levels.${edir.registerLevel}`)
                            : "WOREDA"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-slate-600">
                        <div className="font-medium text-slate-800">
                          {edir.subCity}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Woreda {edir.woreda}
                          {edir.kebele ? `, Kebele ${edir.kebele}` : ""}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs text-slate-700">
                        <div className="font-bold text-[#0B1F3A]">
                          {Intl.NumberFormat().format(totalMembers)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          M:{" "}
                          {(edir.managementMale || 0) +
                            (edir.generalMale || 0)}{" "}
                          | F:{" "}
                          {(edir.managementFemale || 0) +
                            (edir.generalFemale || 0)}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {edir.status && (
                          <span
                            className={`inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-xs border ${
                              statusStyles[edir.status] ||
                              "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {t(`status.${edir.status}`)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs rounded-xs border-[#E3E7EB] hover:bg-[#E8F2FA] hover:text-[#1769AA] hover:border-[#BCD5EA] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/social-affairs/edir/${edir.id}`);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>{t.has("table.view") ? t("table.view") : "View"}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-[#E3E7EB] pt-4 mt-auto">
          <div className="text-xs font-mono text-slate-500">
            {t("pagination", {
              start: startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA]"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA]"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              {t("next")}
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdirList;
