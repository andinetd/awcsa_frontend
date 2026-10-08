"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useGetEdirAssociationsQuery,
  useGetSubCitiesQuery,
} from "@/hooks/social-affairs";
import EdirCard from "./_components/edir-card";
import NewEdirForm from "./_components/new-edir-form";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";
import ImportEdirDialog from "./_components/import-edir-dialog";
import GenerateReportDialog from "./_components/generate-report-dialog";
import RowReportButton from "./_components/row-report-button";
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
  SlidersHorizontal,
  X,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type PresetTab = "ALL" | "ACTIVE" | "RENEWAL" | "AUDIT" | "SANCTIONED";

const STATUS_OPTIONS: (EdirStatus | "ALL")[] = [
  "ALL",
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "CANCELLED",
];

const LEVEL_OPTIONS = ["ALL", "WOREDA", "SUB_CITY", "CITY"] as const;

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
  const { data: subCitiesData } = useGetSubCitiesQuery();

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [presetTab, setPresetTab] = useState<PresetTab>("ALL");
  const [page, setPage] = useState(1);
  const limit = viewMode === "grid" ? 6 : 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Location & Administrative filters
  const [selectedSubCity, setSelectedSubCity] = useState<string>("ALL");
  const [selectedWoreda, setSelectedWoreda] = useState<string>("ALL");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<EdirStatus | "ALL">("ALL");
  const [sizeFilter, setSizeFilter] = useState<"ALL" | "SMALL" | "MEDIUM" | "LARGE">("ALL");
  const [complianceFilter, setComplianceFilter] = useState<
    "ALL" | "AUDITED" | "ASSEMBLY_APPROVED" | "HAS_BYLAWS" | "PENALTY_APPLIED"
  >("ALL");
  const [femaleLeadershipOnly, setFemaleLeadershipOnly] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Derived sub-cities and woredas
  const allSubCityNames = useMemo(() => {
    const fromApi = (subCitiesData || []).map((s) => s.name);
    return Array.from(new Set([...fromApi, ...DEFAULT_SUBCITY_NAMES]));
  }, [subCitiesData]);

  const currentSubCityObj = useMemo(() => {
    if (selectedSubCity === "ALL") return null;
    return (subCitiesData || []).find(
      (s) => s.name.toLowerCase().trim() === selectedSubCity.toLowerCase().trim(),
    );
  }, [subCitiesData, selectedSubCity]);

  const availableWoredas = useMemo(() => {
    return currentSubCityObj?.woredas || [];
  }, [currentSubCityObj]);

  // Real-time tab counts across all fetched records
  const tabCounts = useMemo(() => {
    const list = edirs || [];
    return {
      all: list.length,
      active: list.filter((e: Edir) => e.status === "ACTIVE").length,
      renewal: list.filter(
        (e: Edir) => e.status === "EXPIRED" || Boolean(e.renewalPenaltyApplied),
      ).length,
      audit: list.filter(
        (e: Edir) =>
          !e.assetsAuditedByAuditCommittee ||
          !e.assetsApprovedByGeneralAssembly ||
          !e.byLawsDoc,
      ).length,
      sanctioned: list.filter(
        (e: Edir) => e.status === "REVOKED" || e.status === "CANCELLED",
      ).length,
    };
  }, [edirs]);

  // Client-side filtering
  const filteredEdirs = useMemo(() => {
    return (edirs || []).filter((edir: Edir) => {
      // 1. Multi-field search
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = edir.name?.toLowerCase().includes(query);
        const matchesReg = edir.registrationNumber?.toLowerCase().includes(query);
        const matchesSubCity = edir.subCity?.toLowerCase().includes(query);
        const matchesWoreda = edir.woreda?.toLowerCase().includes(query);
        const matchesKebele = edir.kebele?.toLowerCase().includes(query);
        const matchesLoc = edir.specificLocation?.toLowerCase().includes(query);
        const matchesBank = edir.bankAccountNumber?.toLowerCase().includes(query);
        const matchesFounders = (edir.foundingMembers || []).some((fm) =>
          fm.fullName?.toLowerCase().includes(query),
        );

        if (
          !matchesName &&
          !matchesReg &&
          !matchesSubCity &&
          !matchesWoreda &&
          !matchesKebele &&
          !matchesLoc &&
          !matchesBank &&
          !matchesFounders
        ) {
          return false;
        }
      }

      // 2. Preset Tab
      if (presetTab === "ACTIVE" && edir.status !== "ACTIVE") return false;
      if (
        presetTab === "RENEWAL" &&
        edir.status !== "EXPIRED" &&
        !edir.renewalPenaltyApplied
      ) {
        return false;
      }
      if (presetTab === "AUDIT") {
        const isPending =
          !edir.assetsAuditedByAuditCommittee ||
          !edir.assetsApprovedByGeneralAssembly ||
          !edir.byLawsDoc;
        if (!isPending) return false;
      }
      if (
        presetTab === "SANCTIONED" &&
        edir.status !== "REVOKED" &&
        edir.status !== "CANCELLED"
      ) {
        return false;
      }

      // 3. Location Filters
      if (selectedSubCity !== "ALL") {
        if (
          (edir.subCity || "").toLowerCase().trim() !==
          selectedSubCity.toLowerCase().trim()
        ) {
          return false;
        }
      }
      if (selectedWoreda !== "ALL") {
        if (
          (edir.woreda || "").toLowerCase().trim() !==
          selectedWoreda.toLowerCase().trim()
        ) {
          return false;
        }
      }

      // 4. Register Level
      if (levelFilter !== "ALL" && edir.registerLevel !== levelFilter) {
        return false;
      }

      // 5. Status Filter
      if (statusFilter !== "ALL" && edir.status !== statusFilter) {
        return false;
      }

      // 6. Association Size
      const totalMembers =
        (edir.managementMale || 0) +
        (edir.managementFemale || 0) +
        (edir.generalMale || 0) +
        (edir.generalFemale || 0);

      if (sizeFilter === "SMALL" && totalMembers >= 100) return false;
      if (
        sizeFilter === "MEDIUM" &&
        (totalMembers < 100 || totalMembers > 300)
      ) {
        return false;
      }
      if (sizeFilter === "LARGE" && totalMembers <= 300) return false;

      // 7. Female Leadership
      if (femaleLeadershipOnly && (edir.managementFemale || 0) <= 0) {
        return false;
      }

      // 8. Compliance & Governance
      if (
        complianceFilter === "AUDITED" &&
        !edir.assetsAuditedByAuditCommittee
      ) {
        return false;
      }
      if (
        complianceFilter === "ASSEMBLY_APPROVED" &&
        !edir.assetsApprovedByGeneralAssembly
      ) {
        return false;
      }
      if (complianceFilter === "HAS_BYLAWS" && !edir.byLawsDoc) return false;
      if (
        complianceFilter === "PENALTY_APPLIED" &&
        !edir.renewalPenaltyApplied
      ) {
        return false;
      }

      return true;
    });
  }, [
    edirs,
    debouncedSearch,
    presetTab,
    selectedSubCity,
    selectedWoreda,
    levelFilter,
    statusFilter,
    sizeFilter,
    femaleLeadershipOnly,
    complianceFilter,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubCity !== "ALL") count++;
    if (selectedWoreda !== "ALL") count++;
    if (levelFilter !== "ALL") count++;
    if (statusFilter !== "ALL") count++;
    if (sizeFilter !== "ALL") count++;
    if (femaleLeadershipOnly) count++;
    if (complianceFilter !== "ALL") count++;
    return count;
  }, [
    selectedSubCity,
    selectedWoreda,
    levelFilter,
    statusFilter,
    sizeFilter,
    femaleLeadershipOnly,
    complianceFilter,
  ]);

  const hasActiveFilters =
    search.length > 0 ||
    presetTab !== "ALL" ||
    selectedSubCity !== "ALL" ||
    selectedWoreda !== "ALL" ||
    levelFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    sizeFilter !== "ALL" ||
    femaleLeadershipOnly ||
    complianceFilter !== "ALL";

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPresetTab("ALL");
    setSelectedSubCity("ALL");
    setSelectedWoreda("ALL");
    setLevelFilter("ALL");
    setStatusFilter("ALL");
    setSizeFilter("ALL");
    setFemaleLeadershipOnly(false);
    setComplianceFilter("ALL");
    setPage(1);
  };

  // Pagination calculations
  const totalItems = filteredEdirs.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const currentEdirs = filteredEdirs.slice(startIndex, startIndex + limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("error")}
      </div>
    );
  }

  const tSubCities = useTranslations("subCities.names");

  const getSubCityDisplayName = (name: string) => {
    try {
      return tSubCities(name);
    } catch {
      return name;
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link
          href="/"
          className="hover:text-[#1769AA] flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t("breadcrumbs.home")}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">{t("breadcrumbs.socialAffairs")}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">{t("breadcrumbs.edir")}</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">{t("subtitle")}</p>
        </div>

        {/* Search input + Filter toggle + Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="h-8 pl-8 pr-7 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
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
            variant={showAdvancedFilters || activeFiltersCount > 0 ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs rounded-xs font-mono transition-colors ${
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-[#1769AA] hover:bg-[#125386] text-white border-[#1769AA]"
                : "border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
            }`}
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            <span>{t("filtersButton")}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <GenerateReportDialog />
            <ImportEdirDialog />
            <NewEdirForm />
          </div>
        </div>
      </div>

      {/* Workflow Preset Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3E7EB]">
        {[
          { id: "ALL" as const, label: t("tabs.all"), count: tabCounts.all },
          {
            id: "ACTIVE" as const,
            label: t("tabs.active"),
            count: tabCounts.active,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            id: "RENEWAL" as const,
            label: t("tabs.renewal"),
            count: tabCounts.renewal,
            color: "text-amber-700 bg-amber-50",
          },
          {
            id: "AUDIT" as const,
            label: t("tabs.audit"),
            count: tabCounts.audit,
            color: "text-indigo-700 bg-indigo-50",
          },
          {
            id: "SANCTIONED" as const,
            label: t("tabs.sanctioned"),
            count: tabCounts.sanctioned,
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
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-[#E3E7EB]"
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

      {/* Advanced Collapsible Filter Panel */}
      {showAdvancedFilters && (
        <div className="p-4 bg-slate-50/80 rounded-xs border border-[#E3E7EB] space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3E7EB]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F3A]">
                {t("advanced.title")}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("advanced.reset")}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Sub-City Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("advanced.subCity")}
              </label>
              <Select
                value={selectedSubCity}
                onValueChange={(val) => {
                  setSelectedSubCity(val);
                  setSelectedWoreda("ALL");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("advanced.allSubCities")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("advanced.allSubCities")}
                  </SelectItem>
                  {allSubCityNames.map((sc) => (
                    <SelectItem key={sc} value={sc} className="text-xs rounded-xs">
                      {getSubCityDisplayName(sc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Woreda Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("advanced.woreda")}
              </label>
              <Select
                value={selectedWoreda}
                onValueChange={(val) => {
                  setSelectedWoreda(val);
                  setPage(1);
                }}
                disabled={selectedSubCity === "ALL"}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-400">
                  <SelectValue
                    placeholder={
                      selectedSubCity === "ALL"
                        ? t("advanced.selectSubCityFirst")
                        : t("advanced.allWoredas")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("advanced.allWoredas")}
                  </SelectItem>
                  {availableWoredas.map((w) => (
                    <SelectItem key={w.id} value={w.code} className="text-xs rounded-xs">
                      {t("woredaLabel", { code: w.code })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Register Level */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("advanced.registrationLevel")}
              </label>
              <Select
                value={levelFilter}
                onValueChange={(val) => {
                  setLevelFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("advanced.allLevels")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("advanced.allLevels")}
                  </SelectItem>
                  {LEVEL_OPTIONS.filter((l) => l !== "ALL").map((level) => (
                    <SelectItem key={level} value={level} className="text-xs rounded-xs">
                      {t(`levels.${level}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Compliance Criteria */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("advanced.compliance")}
              </label>
              <Select
                value={complianceFilter}
                onValueChange={(val: any) => {
                  setComplianceFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("advanced.allCompliance")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("advanced.allCompliance")}
                  </SelectItem>
                  <SelectItem value="AUDITED" className="text-xs rounded-xs">
                    {t("advanced.audited")}
                  </SelectItem>
                  <SelectItem value="ASSEMBLY_APPROVED" className="text-xs rounded-xs">
                    {t("advanced.assemblyApproved")}
                  </SelectItem>
                  <SelectItem value="HAS_BYLAWS" className="text-xs rounded-xs">
                    {t("advanced.hasBylaws")}
                  </SelectItem>
                  <SelectItem value="PENALTY_APPLIED" className="text-xs rounded-xs">
                    {t("advanced.penaltyApplied")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Member Size */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("advanced.membershipSize")}
              </label>
              <Select
                value={sizeFilter}
                onValueChange={(val: any) => {
                  setSizeFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("advanced.allSizes")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("advanced.allSizes")}
                  </SelectItem>
                  <SelectItem value="SMALL" className="text-xs rounded-xs">
                    {t("advanced.small")}
                  </SelectItem>
                  <SelectItem value="MEDIUM" className="text-xs rounded-xs">
                    {t("advanced.medium")}
                  </SelectItem>
                  <SelectItem value="LARGE" className="text-xs rounded-xs">
                    {t("advanced.large")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Demographics Checkbox */}
          <div className="pt-2 flex items-center justify-between border-t border-[#E3E7EB]/70">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={femaleLeadershipOnly}
                onCheckedChange={(checked) => {
                  setFemaleLeadershipOnly(Boolean(checked));
                  setPage(1);
                }}
              />
              <span className="text-xs font-mono text-slate-700">
                {t("advanced.femaleLeadership")}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Active Filter Chips & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">
            {t("chips.results", {
              count: filteredEdirs.length,
              total: edirs?.length || 0,
            })}
          </span>

          {presetTab !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.preset", { tab: t(`tabs.${presetTab.toLowerCase()}` as any) || presetTab })}</span>
              <button
                onClick={() => setPresetTab("ALL")}
                className="hover:text-rose-600 ml-0.5"
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
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {selectedSubCity !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.subCity", { val: getSubCityDisplayName(selectedSubCity) })}</span>
              <button
                onClick={() => {
                  setSelectedSubCity("ALL");
                  setSelectedWoreda("ALL");
                }}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {selectedWoreda !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.woreda", { val: t("woredaLabel", { code: selectedWoreda }) })}</span>
              <button
                onClick={() => setSelectedWoreda("ALL")}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {levelFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.level", { val: t(`levels.${levelFilter}`) })}</span>
              <button
                onClick={() => setLevelFilter("ALL")}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {statusFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.status", { val: t(`status.${statusFilter}`) })}</span>
              <button
                onClick={() => setStatusFilter("ALL")}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {sizeFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.size", { val: t(`advanced.${sizeFilter.toLowerCase()}` as any) || sizeFilter })}</span>
              <button
                onClick={() => setSizeFilter("ALL")}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {complianceFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.compliance", {
                  val:
                    complianceFilter === "AUDITED"
                      ? t("advanced.audited")
                      : complianceFilter === "ASSEMBLY_APPROVED"
                      ? t("advanced.assemblyApproved")
                      : complianceFilter === "HAS_BYLAWS"
                      ? t("advanced.hasBylaws")
                      : t("advanced.penaltyApplied"),
                })}
              </span>
              <button
                onClick={() => setComplianceFilter("ALL")}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {femaleLeadershipOnly && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.femaleLeadership")}</span>
              <button
                onClick={() => setFemaleLeadershipOnly(false)}
                className="hover:text-rose-600 ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[11px] font-mono font-semibold text-rose-600 hover:text-rose-800 ml-1 underline underline-offset-2"
            >
              {t("chips.clearAll")}
            </button>
          )}
        </div>

        {/* View Switcher (Grid vs Table List) */}
        <div className="flex items-center self-start sm:self-auto border border-[#E3E7EB] rounded-xs p-0.5 bg-slate-50/70">
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
            <span>Grid</span>
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
            <span>List</span>
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
                          {getSubCityDisplayName(edir.subCity || "")}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {t("woredaLabel", { code: edir.woreda ?? "—" })}
                          {edir.kebele ? t("kebeleLabel", { code: edir.kebele }) : ""}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs text-slate-700">
                        <div className="font-bold text-[#0B1F3A]">
                          {Intl.NumberFormat().format(totalMembers)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t("genderCounts", {
                            male:
                              (edir.managementMale || 0) +
                              (edir.generalMale || 0),
                            female:
                              (edir.managementFemale || 0) +
                              (edir.generalFemale || 0),
                          })}
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
                        <div className="flex items-center justify-end gap-1">
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
                          <RowReportButton edir={edir} />
                        </div>
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
