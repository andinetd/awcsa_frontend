"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useGetWomenAssociationsQuery,
  useDeleteWomenAssociationMutation,
} from "@/hooks/womens";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import WomenAssociationForm from "./_components/women-association-form";
import RowReportButton from "./_components/row-report-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RotateCcw,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  WomenAssociationRecord,
  WomenAssociationStatus,
  WomenAssociationType,
} from "@/api/womens/associations";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";
import { uiTokens } from "@/styles/design-system";

const STATUS_TAGS: Record<string, string> = {
  DRAFT: uiTokens.statusTag.neutral,
  SUBMITTED: uiTokens.statusTag.warning,
  APPROVED: uiTokens.statusTag.primary,
  REJECTED: uiTokens.statusTag.danger,
};

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
  const router = useRouter();
  const { data: response, isLoading } = useGetWomenAssociationsQuery();
  const { data: subCitiesData } = useGetSubCitiesQuery();
  const deleteMutation = useDeleteWomenAssociationMutation();

  const records: WomenAssociationRecord[] = response?.data || [];

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [presetTab, setPresetTab] = useState<PresetTab>("ALL");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [subCityFilter, setSubCityFilter] = useState<string>("ALL");
  const [woredaFilter, setWoredaFilter] = useState<string>("ALL");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const limit = 10;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sub = params.get("subCity");
    if (sub) {
      setSubCityFilter(sub);
      setShowAdvancedFilters(true);
    }
  }, []);

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
    return Array.from(new Set([...fromApi, ...DEFAULT_SUBCITY_NAMES]));
  }, [subCitiesData]);

  const currentSubCityObj = useMemo(() => {
    if (subCityFilter === "ALL" || !subCityFilter) return null;
    return (subCitiesData || []).find(
      (s) => s.name.toLowerCase().trim() === subCityFilter.toLowerCase().trim(),
    );
  }, [subCitiesData, subCityFilter]);

  const availableWoredas = useMemo(() => {
    return currentSubCityObj?.woredas || [];
  }, [currentSubCityObj]);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = records;

    // 1. Workflow Preset Tab
    if (presetTab !== "ALL") {
      data = data.filter((rec) => rec.approvalStatus === presetTab);
    }

    // 2. Multi-field debounced search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      data = data.filter((rec) => {
        const fields = [
          rec.name,
          rec.leaderName,
          rec.leaderPhoneNumber,
          rec.subCity,
          rec.woreda,
          rec.block ? `block ${rec.block}` : "",
          rec.houseNumber ? `house ${rec.houseNumber}` : "",
          rec.objective,
        ].filter(Boolean) as string[];
        return fields.some((f) => f.toLowerCase().includes(q));
      });
    }

    // 3. Sub-City Filter
    if (subCityFilter && subCityFilter !== "ALL") {
      data = data.filter(
        (rec) => rec.subCity?.toLowerCase().trim() === subCityFilter.toLowerCase().trim(),
      );
    }

    // 4. Woreda Filter
    if (woredaFilter && woredaFilter !== "ALL") {
      data = data.filter((rec) => {
        const wStr = String(rec.woreda || "").toLowerCase().trim();
        const target = String(woredaFilter).toLowerCase().trim();
        return wStr === target || wStr === `woreda ${target}` || wStr === `w-${target}`;
      });
    }

    // 5. Association Type Filter
    if (filterType !== "ALL") {
      data = data.filter((rec) => rec.type === filterType);
    }

    // 6. Active status filter
    if (activeFilter === "ACTIVE") {
      data = data.filter((rec) => rec.isActive);
    } else if (activeFilter === "INACTIVE") {
      data = data.filter((rec) => !rec.isActive);
    }

    return data;
  }, [records, presetTab, debouncedSearch, subCityFilter, woredaFilter, filterType, activeFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startIndex = (page - 1) * limit;
  const currentData = filteredData.slice(startIndex, startIndex + limit);

  const statusCounts = useMemo(() => {
    const counts = { DRAFT: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0 };
    records.forEach((rec) => {
      if (counts[rec.approvalStatus as keyof typeof counts] !== undefined) {
        counts[rec.approvalStatus as keyof typeof counts] += 1;
      }
    });
    return counts;
  }, [records]);

  const tabCounts = useMemo(() => {
    return {
      ALL: records.length,
      APPROVED: statusCounts.APPROVED,
      SUBMITTED: statusCounts.SUBMITTED,
      DRAFT: statusCounts.DRAFT,
      REJECTED: statusCounts.REJECTED,
    };
  }, [records, statusCounts]);

  const totalDeclaredMembers = useMemo(
    () => records.reduce((sum, rec) => sum + (rec.totalMembers ?? 0), 0),
    [records],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (subCityFilter !== "ALL" && subCityFilter !== "") count++;
    if (woredaFilter !== "ALL") count++;
    if (filterType !== "ALL") count++;
    if (activeFilter !== "ALL") count++;
    return count;
  }, [subCityFilter, woredaFilter, filterType, activeFilter]);

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    presetTab !== "ALL" ||
    (subCityFilter !== "ALL" && subCityFilter !== "") ||
    woredaFilter !== "ALL" ||
    filterType !== "ALL" ||
    activeFilter !== "ALL";

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPresetTab("ALL");
    setSubCityFilter("ALL");
    setWoredaFilter("ALL");
    setFilterType("ALL");
    setActiveFilter("ALL");
    setPage(1);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success(t("messages.deleteSuccess"));
        setDeleteOpen(false);
        setDeleteId(null);
      },
      onError: (err: any) =>
        toast.error(err?.message || t("messages.deleteError")),
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-3">
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
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 pr-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
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
              className={`h-8 text-xs rounded-xs font-mono transition-colors ${
                showAdvancedFilters || activeFiltersCount > 0
                  ? "bg-[#1769AA] hover:bg-[#125386] text-white border-[#1769AA]"
                  : "border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <span>Filters</span>
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
          { id: "ALL" as const, label: "All Associations", count: tabCounts.ALL },
          {
            id: "APPROVED" as const,
            label: "Approved & Active",
            count: tabCounts.APPROVED,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            id: "SUBMITTED" as const,
            label: "Under Review",
            count: tabCounts.SUBMITTED,
            color: "text-amber-700 bg-amber-50",
          },
          {
            id: "DRAFT" as const,
            label: "Draft Registrations",
            count: tabCounts.DRAFT,
            color: "text-slate-700 bg-slate-100",
          },
          {
            id: "REJECTED" as const,
            label: "Rejected",
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-mono font-medium transition-all whitespace-nowrap ${
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
                Advanced Location &amp; Association Filters
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Sub-City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Sub-City
              </label>
              <Select
                value={subCityFilter}
                onValueChange={(val) => {
                  setSubCityFilter(val);
                  setWoredaFilter("ALL");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder="All Sub-Cities" />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    All Sub-Cities
                  </SelectItem>
                  {allSubCityNames.map((sc) => (
                    <SelectItem key={sc} value={sc} className="text-xs rounded-xs">
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Woreda Selector (Cascading) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Woreda
              </label>
              <Select
                value={woredaFilter}
                onValueChange={(val) => {
                  setWoredaFilter(val);
                  setPage(1);
                }}
                disabled={subCityFilter === "ALL" || !subCityFilter}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-400">
                  <SelectValue
                    placeholder={
                      subCityFilter === "ALL" || !subCityFilter
                        ? "Select Sub-City first"
                        : "All Woredas"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    All Woredas
                  </SelectItem>
                  {availableWoredas.map((w) => (
                    <SelectItem key={w.id} value={w.code} className="text-xs rounded-xs">
                      Woreda {w.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Association Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Association Type
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
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("filters.allTypes")}
                  </SelectItem>
                  {(["ASSOCIATION", "DEVELOPMENT_ASSOCIATION", "FEDERATION"] as WomenAssociationType[]).map((type) => (
                    <SelectItem key={type} value={type} className="text-xs rounded-xs">
                      {t(`types.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Activity Status
              </label>
              <Select
                value={activeFilter}
                onValueChange={(val) => {
                  setActiveFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder="All Activity Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="ACTIVE" className="text-xs rounded-xs">
                    Active Records Only
                  </SelectItem>
                  <SelectItem value="INACTIVE" className="text-xs rounded-xs">
                    Inactive Records
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
            Results ({filteredData.length} of {records.length}):
          </span>

          {presetTab !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] gap-1 pl-2 pr-1 py-0.5"
            >
              <span>Status: {presetTab}</span>
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
              <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
              <button
                onClick={() => setSearch("")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {subCityFilter !== "ALL" && subCityFilter !== "" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>Sub-City: {subCityFilter}</span>
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

          {woredaFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>Woreda: {woredaFilter}</span>
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
              <span>Type: {t(`types.${filterType}`)}</span>
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
              <span>{activeFilter === "ACTIVE" ? "Active Only" : "Inactive Only"}</span>
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
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      {/* ── Summary Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatChip label={t("stats.total")} value={records.length} tone="text-[#0B1F3A]" />
        <StatChip label={t("status.DRAFT")} value={statusCounts.DRAFT} tone="text-slate-600" />
        <StatChip label={t("status.SUBMITTED")} value={statusCounts.SUBMITTED} tone="text-[#D97706]" />
        <StatChip label={t("status.APPROVED")} value={statusCounts.APPROVED} tone="text-[#1769AA]" />
        <StatChip label={t("status.REJECTED")} value={statusCounts.REJECTED} tone="text-[#DC2626]" />
        <StatChip label={t("stats.declaredMembers")} value={totalDeclaredMembers} tone="text-[#1769AA]" />
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <Users className="w-4 h-4 text-[#1769AA]" />
            {t("cardTitle")}
          </CardTitle>
          <span className="text-xs font-mono text-slate-500">
            {t("showing", { from: totalItems === 0 ? 0 : startIndex + 1, to: Math.min(startIndex + limit, totalItems), total: totalItems })}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">{t("table.name")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.type")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.location")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.leader")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.totalMembers")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">{t("table.status")}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-500">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0">
                      <TableCell className="font-semibold text-xs text-[#0B1F3A] py-3 pl-5">{rec.name}</TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-medium border border-[#E3E7EB] bg-slate-50 text-slate-700">
                          {t(`types.${rec.type}`)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3">
                        {rec.subCity} / {rec.woreda}
                        {rec.block ? `, ${t("table.block")} ${rec.block}` : ""}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-3">
                        <span className="font-medium text-slate-800">{rec.leaderName}</span>
                        <p className="font-mono text-[11px] text-slate-500">{rec.leaderPhoneNumber}</p>
                      </TableCell>
                      <TableCell className="font-mono text-xs py-3">{rec.totalMembers ?? "—"}</TableCell>
                      <TableCell className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${STATUS_TAGS[rec.approvalStatus] || uiTokens.statusTag.neutral}`}>
                          {t(`status.${rec.approvalStatus}`)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/women/associations/${rec.id}`)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/women/associations/${rec.id}?edit=1`)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <RowReportButton associationId={rec.id} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                            onClick={() => { setDeleteId(rec.id); setDeleteOpen(true); }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-500">
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
            <p className="text-xs font-mono text-slate-500">
              {t("showing", { from: totalItems === 0 ? 0 : startIndex + 1, to: Math.min(startIndex + limit, totalItems), total: totalItems })}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-mono px-2 text-slate-600">{page} / {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-xs border-[#E3E7EB]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#0B1F3A]">{t("delete.title")}</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">{t("delete.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xs text-xs h-8">{t("delete.cancel")}</AlertDialogCancel>
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
