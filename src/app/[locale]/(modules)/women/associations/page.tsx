"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useGetWomenAssociationsQuery,
  useDeleteWomenAssociationMutation,
} from "@/hooks/womens";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import WomenAssociationForm from "./_components/women-association-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";
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
import { toast } from "sonner";
import {
  WomenAssociationRecord,
  WomenAssociationType,
} from "@/api/womens/associations";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";
import WomenInstitutionalBanner from "@/app/[locale]/(modules)/women/_components/women-institutional-banner";
import { AssociationsTable } from "./_components/associations-table";

type PresetTab = "ALL" | "APPROVED" | "SUBMITTED" | "DRAFT" | "REJECTED";

const DEFAULT_SUBCITY_NAMES = [
  "Bole",
  "Yeka",
  "Kirkos",
  "Arada",
  "Gulele",
  "Lideta",
  "Nifas Silk-Lafto",
  "Kolfe Keranio",
  "Akaky Kaliti",
  "Addis Ketema",
  "Lemi Kura",
];

export default function AssociationsPage() {
  const t = useTranslations("women.associations");
  const { userSubCity, userWoreda, filterSubCityNames } =
    useJurisdictionScope();
  const { data: response, isLoading } = useGetWomenAssociationsQuery();
  const { data: subCitiesData } = useGetSubCitiesQuery();
  const deleteMutation = useDeleteWomenAssociationMutation();

  const records: WomenAssociationRecord[] = response?.data || [];

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [presetTab, setPresetTab] = useState<PresetTab>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [subCityFilter, setSubCityFilter] = useState<string>(
    userSubCity || "ALL",
  );
  const [woredaFilter, setWoredaFilter] = useState<string>(
    userWoreda || "ALL",
  );
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const limit = 10;

  useEffect(() => {
    if (userSubCity) {
      setSubCityFilter(userSubCity);
      setShowAdvancedFilters(true);
    }
    if (userWoreda) {
      setWoredaFilter(userWoreda);
    }
  }, [userSubCity, userWoreda]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sub = params.get("subCity");
    if (sub && !userSubCity) {
      setSubCityFilter(sub);
      setShowAdvancedFilters(true);
    }
  }, [userSubCity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Derived sub-cities and woredas
  const allSubCityNames = useMemo(() => {
    const fromApi = (subCitiesData || []).map((s) => s.name);
    const combined = Array.from(
      new Set([...fromApi, ...DEFAULT_SUBCITY_NAMES]),
    );
    return filterSubCityNames(combined);
  }, [subCitiesData, filterSubCityNames]);

  const currentSubCityObj = useMemo(() => {
    if (subCityFilter === "ALL" || !subCityFilter) return null;
    return (subCitiesData || []).find(
      (s) =>
        s.name.toLowerCase().trim() === subCityFilter.toLowerCase().trim(),
    );
  }, [subCitiesData, subCityFilter]);

  const availableWoredas = useMemo(() => {
    const defaultWoredas = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      code: String(i + 1).padStart(2, "0"),
      subCityId: currentSubCityObj?.id ?? 0,
    }));
    const list =
      currentSubCityObj?.woredas && currentSubCityObj.woredas.length >= 20
        ? currentSubCityObj.woredas
        : defaultWoredas;
    if (userWoreda) {
      const filtered = list.filter(
        (w) =>
          String(w.code) === String(userWoreda) ||
          Number(w.code) === Number(userWoreda),
      );
      return filtered.length > 0
        ? filtered
        : [{ id: -1, code: String(userWoreda), subCityId: 0 }];
    }
    return list;
  }, [currentSubCityObj, userWoreda]);

  // Real-time tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: records.length,
      APPROVED: records.filter((r) => r.approvalStatus === "APPROVED").length,
      SUBMITTED: records.filter((r) => r.approvalStatus === "SUBMITTED").length,
      DRAFT: records.filter((r) => r.approvalStatus === "DRAFT").length,
      REJECTED: records.filter((r) => r.approvalStatus === "REJECTED").length,
    };
  }, [records]);

  // Status counts for stat chips
  const statusCounts = useMemo(() => {
    return {
      DRAFT: records.filter((r) => r.approvalStatus === "DRAFT").length,
      SUBMITTED: records.filter((r) => r.approvalStatus === "SUBMITTED").length,
      APPROVED: records.filter((r) => r.approvalStatus === "APPROVED").length,
      REJECTED: records.filter((r) => r.approvalStatus === "REJECTED").length,
    };
  }, [records]);

  const totalDeclaredMembers = useMemo(() => {
    return records.reduce((sum, r) => sum + (r.totalMembers || 0), 0);
  }, [records]);

  // Filter pipeline
  const filteredData = useMemo(() => {
    return records.filter((rec) => {
      // 1. Debounced Search
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.trim().toLowerCase();
        const matchesSearch = [
          rec.name,
          rec.leaderName,
          rec.leaderPhoneNumber,
          rec.subCity,
          rec.woreda,
          rec.block,
          rec.houseNumber,
        ]
          .filter(Boolean)
          .some((val) => val?.toString().toLowerCase().includes(q));

        if (!matchesSearch) return false;
      }

      // 2. Preset Tab
      if (presetTab !== "ALL" && rec.approvalStatus !== presetTab) {
        return false;
      }

      // 3. Sub-City Filter
      if (subCityFilter !== "ALL" && subCityFilter !== "") {
        const rSubCity = (rec.subCity || "").toLowerCase().trim();
        const fSubCity = subCityFilter.toLowerCase().trim();
        if (rSubCity !== fSubCity) return false;
      }

      // 4. Woreda Filter
      if (woredaFilter !== "ALL" && woredaFilter !== "") {
        const rWoreda = (rec.woreda || "").toString().trim();
        const fWoreda = woredaFilter.toString().trim();
        if (rWoreda !== fWoreda) return false;
      }

      // 5. Association Type Filter
      if (filterType !== "ALL" && rec.type !== filterType) {
        return false;
      }

      // 6. Active Status Filter
      if (activeFilter === "ACTIVE" && !rec.isActive) return false;
      if (activeFilter === "INACTIVE" && rec.isActive) return false;

      return true;
    });
  }, [
    records,
    debouncedSearch,
    presetTab,
    subCityFilter,
    woredaFilter,
    filterType,
    activeFilter,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (subCityFilter !== "ALL" && subCityFilter !== "") count++;
    if (woredaFilter !== "ALL" && woredaFilter !== "") count++;
    if (filterType !== "ALL") count++;
    if (activeFilter !== "ALL") count++;
    return count;
  }, [subCityFilter, woredaFilter, filterType, activeFilter]);

  const hasActiveFilters =
    search.length > 0 ||
    presetTab !== "ALL" ||
    (subCityFilter !== "ALL" && subCityFilter !== "" && !userSubCity) ||
    (woredaFilter !== "ALL" && woredaFilter !== "" && !userWoreda) ||
    filterType !== "ALL" ||
    activeFilter !== "ALL";

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPresetTab("ALL");
    setSubCityFilter(userSubCity || "ALL");
    setWoredaFilter(userWoreda || "ALL");
    setFilterType("ALL");
    setActiveFilter("ALL");
    setPage(1);
  };

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
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
      onError: (error: any) => {
        toast.error(error?.message || t("delete.error"));
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <WomenInstitutionalBanner />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-500">{t("subtitle")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                className="pl-8 pr-7 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant={
                showAdvancedFilters || activeFiltersCount > 0
                  ? "default"
                  : "outline"
              }
              size="sm"
              className={`h-8 text-xs rounded-xs font-mono transition-colors cursor-pointer ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? "bg-[#1769AA] hover:bg-[#125386] text-white border-[#1769AA]"
                  : "border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <span>{t("filters.button")}</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <WomenReportDialog category="ASSOCIATION" />
            <WomenAssociationForm />
          </div>
        </div>
      </div>

      {/* ── Workflow Preset Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3E7EB]">
        {[
          { id: "ALL" as const, label: t("tabs.all"), count: tabCounts.ALL },
          {
            id: "APPROVED" as const,
            label: t("tabs.approved"),
            count: tabCounts.APPROVED,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            id: "SUBMITTED" as const,
            label: t("tabs.submitted"),
            count: tabCounts.SUBMITTED,
            color: "text-amber-700 bg-amber-50",
          },
          {
            id: "DRAFT" as const,
            label: t("tabs.draft"),
            count: tabCounts.DRAFT,
            color: "text-slate-700 bg-slate-100",
          },
          {
            id: "REJECTED" as const,
            label: t("tabs.rejected"),
            count: tabCounts.REJECTED,
            color: "text-rose-700 bg-rose-50",
          },
        ].map((tab) => {
          const isActive = presetTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setPresetTab(tab.id);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#0B1F3A] text-white shadow-2xs font-bold"
                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-[#E3E7EB]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-white"
                    : tab.color || "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Advanced Collapsible Filter Panel ────────────────────────────────── */}
      {showAdvancedFilters && (
        <div className="p-4 bg-slate-50/80 rounded-xs border border-[#E3E7EB] space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3E7EB]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F3A]">
                {t("filters.title")}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("filters.resetAll")}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Sub-City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filters.subCity")}
              </label>
              <Select
                disabled={!!userSubCity}
                value={subCityFilter}
                onValueChange={(val) => {
                  setSubCityFilter(val);
                  setWoredaFilter("ALL");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-500">
                  <SelectValue placeholder={t("filters.allSubCities")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userSubCity && (
                    <SelectItem
                      value="ALL"
                      className="text-xs rounded-xs font-semibold"
                    >
                      {t("filters.allSubCities")}
                    </SelectItem>
                  )}
                  {allSubCityNames.map((sc) => (
                    <SelectItem
                      key={sc}
                      value={sc}
                      className="text-xs rounded-xs"
                    >
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Woreda Selector (Cascading) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filters.woreda")}
              </label>
              <Select
                value={woredaFilter}
                onValueChange={(val) => {
                  setWoredaFilter(val);
                  setPage(1);
                }}
                disabled={
                  !!userWoreda || subCityFilter === "ALL" || !subCityFilter
                }
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-400">
                  <SelectValue
                    placeholder={
                      subCityFilter === "ALL" || !subCityFilter
                        ? t("filters.selectSubCityFirst")
                        : t("filters.allWoredas")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userWoreda && (
                    <SelectItem
                      value="ALL"
                      className="text-xs rounded-xs font-semibold"
                    >
                      {t("filters.allWoredas")}
                    </SelectItem>
                  )}
                  {availableWoredas.map((w) => (
                    <SelectItem
                      key={w.id}
                      value={w.code}
                      className="text-xs rounded-xs"
                    >
                      {t("filters.woreda")} {w.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Association Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filters.associationType")}
              </label>
              <Select
                value={filterType}
                onValueChange={(val) => {
                  setFilterType(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("filters.allTypes")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem
                    value="ALL"
                    className="text-xs rounded-xs font-semibold"
                  >
                    {t("filters.allTypes")}
                  </SelectItem>
                  {(
                    [
                      "ASSOCIATION",
                      "DEVELOPMENT_ASSOCIATION",
                      "FEDERATION",
                    ] as WomenAssociationType[]
                  ).map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-xs rounded-xs"
                    >
                      {t(`types.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filters.activityStatus")}
              </label>
              <Select
                value={activeFilter}
                onValueChange={(val) => {
                  setActiveFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("filters.allStatuses")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem
                    value="ALL"
                    className="text-xs rounded-xs font-semibold"
                  >
                    {t("filters.allStatuses")}
                  </SelectItem>
                  <SelectItem value="ACTIVE" className="text-xs rounded-xs">
                    {t("filters.activeOnly")}
                  </SelectItem>
                  <SelectItem value="INACTIVE" className="text-xs rounded-xs">
                    {t("filters.inactiveOnly")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Chips & Results Count Bar ──────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">
            {t("filters.resultsCount", {
              count: filteredData.length,
              total: records.length,
            })}
          </span>

          {presetTab !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.status", { status: t(`status.${presetTab}`) })}
              </span>
              <button
                onClick={() => setPresetTab("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {debouncedSearch && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-slate-100 text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.search", { query: debouncedSearch })}</span>
              <button
                onClick={() => setSearch("")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {subCityFilter !== "ALL" && subCityFilter !== "" && !userSubCity && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.subCity", { name: subCityFilter })}</span>
              <button
                onClick={() => {
                  setSubCityFilter("ALL");
                  setWoredaFilter("ALL");
                }}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {woredaFilter !== "ALL" && !userWoreda && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.woreda", { name: woredaFilter })}</span>
              <button
                onClick={() => setWoredaFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {filterType !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.type", { type: t(`types.${filterType}`) })}
              </span>
              <button
                onClick={() => setFilterType("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {activeFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {activeFilter === "ACTIVE"
                  ? t("chips.activeOnly")
                  : t("chips.inactiveOnly")}
              </span>
              <button
                onClick={() => setActiveFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetAllFilters}
            className="h-7 text-xs font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xs px-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span>{t("filters.clearAll")}</span>
          </Button>
        )}
      </div>

      {/* ── Summary Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatChip
          label={t("stats.total")}
          value={records.length}
          tone="text-[#0B1F3A]"
        />
        <StatChip
          label={t("status.DRAFT")}
          value={statusCounts.DRAFT}
          tone="text-slate-600"
        />
        <StatChip
          label={t("status.SUBMITTED")}
          value={statusCounts.SUBMITTED}
          tone="text-[#D97706]"
        />
        <StatChip
          label={t("status.APPROVED")}
          value={statusCounts.APPROVED}
          tone="text-[#1769AA]"
        />
        <StatChip
          label={t("status.REJECTED")}
          value={statusCounts.REJECTED}
          tone="text-[#DC2626]"
        />
        <StatChip
          label={t("stats.declaredMembers")}
          value={totalDeclaredMembers}
          tone="text-[#1769AA]"
        />
      </div>

      {/* ── Associations Table & Pagination ────────────────────────────────── */}
      <AssociationsTable
        currentData={currentData}
        isLoading={isLoading}
        totalItems={totalItems}
        startIndex={startIndex}
        limit={limit}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onDeleteRequest={(id) => {
          setDeleteId(id);
          setDeleteOpen(true);
        }}
      />

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
    <div className="rounded-xs border border-[#E3E7EB] bg-white p-3 text-center shadow-2xs">
      <p className={`text-xl font-bold font-mono ${tone}`}>{value}</p>
      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
