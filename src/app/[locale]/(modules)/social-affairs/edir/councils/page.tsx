"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirCouncilsQuery } from "@/hooks/social-affairs";
import { EdirCouncil, EdirLevel, EdirStatus } from "@/api/social-affairs/edir";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  List,
  Eye,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import CouncilCard from "./_components/council-card";
import NewCouncilForm from "./_components/new-council-form";
import Link from "next/link";

const LEVEL_OPTIONS: (EdirLevel | "ALL")[] = [
  "ALL",
  "WOREDA",
  "SUB_CITY",
  "CITY",
];

const STATUS_OPTIONS: (EdirStatus | "ALL")[] = [
  "ALL",
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "CANCELLED",
];

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
};

const levelStyles: Record<string, string> = {
  WOREDA: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  SUB_CITY: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  CITY: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
};

const CouncilsPage = () => {
  const t = useTranslations("social-affairs.edir.councils");
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [levelFilter, setLevelFilter] = useState<EdirLevel | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<EdirStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const limit = viewMode === "grid" ? 6 : 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: councils, isLoading, isError } = useGetEdirCouncilsQuery();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredCouncils = (councils || []).filter((council: EdirCouncil) => {
    const matchesSearch =
      council.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (council.registrationNumber || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()) ||
      council.subCity.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (council.chairpersonName || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || council.level === levelFilter;
    const matchesStatus =
      statusFilter === "ALL" || council.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const totalItems = filteredCouncils.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentCouncils = filteredCouncils.slice(
    startIndex,
    startIndex + limit,
  );

  if (isError) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("list.error")}
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
        <span className="text-[#0B1F3A] font-bold">{t("list.title")}</span>
      </div>

      {/* Header & Primary Actions */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1769AA]" />
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("list.title")}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">{t("list.subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              placeholder={t("list.search")}
              className="h-8 pl-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NewCouncilForm />
        </div>
      </div>

      {/* Filter Controls + View Switcher */}
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
                <Button
                  key={level}
                  size="sm"
                  variant="outline"
                  className={`h-7 px-2.5 text-xs font-mono rounded-xs transition-colors ${
                    isSelected
                      ? "bg-[#1769AA] text-white border-[#1769AA] hover:bg-[#12568E] hover:text-white"
                      : "bg-white text-slate-600 border-[#E3E7EB] hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    setLevelFilter(level);
                    setPage(1);
                  }}
                >
                  {level === "ALL"
                    ? t("list.levels.all")
                    : t(`level.${level}`)}
                </Button>
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
                <Button
                  key={status}
                  size="sm"
                  variant="outline"
                  className={`h-7 px-2.5 text-xs font-mono rounded-xs transition-colors ${
                    isSelected
                      ? "bg-[#1769AA] text-white border-[#1769AA] hover:bg-[#12568E] hover:text-white"
                      : "bg-white text-slate-600 border-[#E3E7EB] hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                >
                  {status === "ALL"
                    ? t("list.status.all")
                    : t(`status.${status}`)}
                </Button>
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
            <span>{t.has("list.viewGrid") ? t("list.viewGrid") : "Grid"}</span>
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
            <span>{t.has("list.viewList") ? t("list.viewList") : "List"}</span>
          </Button>
        </div>
      </div>

      {/* Content Rendering: Grid vs List Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
                {t("list.loading")}
              </div>
            </div>
          ) : currentCouncils.length > 0 ? (
            currentCouncils.map((council: EdirCouncil) => (
              <CouncilCard
                key={council.id}
                council={council}
                onViewDetails={(c) =>
                  router.push(`/social-affairs/edir/councils/${c.id}`)
                }
              />
            ))
          ) : (
            <div className="col-span-full rounded-xs border border-dashed border-[#E3E7EB] bg-white p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
              {t("list.noRecords")}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xs border border-[#E3E7EB] overflow-hidden bg-white shadow-2xs min-h-[300px]">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("list.table.name") ? t("list.table.name") : "Council Name"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("list.table.level") ? t("list.table.level") : "Level"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("list.table.location") ? t("list.table.location") : "Location"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("list.table.contact") ? t("list.table.contact") : "Chairperson / Contact"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("list.table.memberEdirs") ? t("list.table.memberEdirs") : "Member Edirs"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4">
                  {t.has("list.table.status") ? t("list.table.status") : "Status"}
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 py-3 px-4 text-right">
                  {t.has("list.table.actions") ? t("list.table.actions") : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#E3E7EB]">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-xs font-mono uppercase tracking-wider text-slate-400"
                  >
                    {t("list.loading")}
                  </TableCell>
                </TableRow>
              ) : currentCouncils.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-xs font-mono uppercase text-slate-400"
                  >
                    {t("list.noRecords")}
                  </TableCell>
                </TableRow>
              ) : (
                currentCouncils.map((council: EdirCouncil) => {
                  const memberCount =
                    council._count?.memberEdirs ??
                    council.memberEdirs?.length ??
                    0;
                  return (
                    <TableRow
                      key={council.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/social-affairs/edir/councils/${council.id}`)
                      }
                    >
                      <TableCell className="px-4 py-3">
                        <div className="font-semibold text-xs text-[#0B1F3A]">
                          {council.name}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                          {council.registrationNumber || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
                            levelStyles[council.level] ||
                            "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {t(`level.${council.level}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-slate-600">
                        <div className="font-medium text-slate-800">
                          {council.subCity}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {council.woreda
                            ? `Woreda ${council.woreda}`
                            : "Sub-city wide"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-slate-600">
                        <div className="font-medium text-slate-800">
                          {council.chairpersonName || "—"}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {council.chairpersonPhone ||
                            council.contactPhone ||
                            "—"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs text-slate-700">
                        <span className="font-bold text-[#0B1F3A]">
                          {memberCount}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-1">
                          {memberCount === 1 ? "edir" : "edirs"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
                            statusStyles[council.status] ||
                            "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {t(`status.${council.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#E8F2FA] hover:text-[#1769AA] hover:border-[#BCD5EA] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/social-affairs/edir/councils/${council.id}`,
                            );
                          }}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>{t("buttons.viewDetails")}</span>
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

      {/* Institutional Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-[#E3E7EB] pt-4 mt-auto">
          <div className="text-xs font-mono text-slate-500">
            {t("list.pagination", {
              start: startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] hover:bg-slate-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("list.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] hover:bg-slate-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              {t("list.next")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilsPage;