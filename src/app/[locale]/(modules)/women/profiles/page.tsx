"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import NewWomenProfileForm from "./_components/new-women-profile-form";
import EditWomenProfileForm from "./_components/edit-women-profile-form";
import StatusToggleDialog from "./_components/status-toggle-dialog";
import { WomenProfile } from "@/api/womens/women-profile";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  ToggleLeft,
  Users,
  History,
  SlidersHorizontal,
  X,
  RotateCcw,
  GraduationCap,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import PersonHistoryDialog from "@/components/shared/person-history-dialog";
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
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { uiTokens } from "@/styles/design-system";

type PresetTab = "ALL" | "UNEMPLOYED" | "EMPLOYED" | "PENDING" | "ACTIVE";

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

const EDUCATION_OPTIONS = [
  "NONE",
  "PRIMARY",
  "SECONDARY",
  "DIPLOMA",
  "BACHELOR",
  "MASTERS",
  "DOCTORATE",
  "OTHER",
] as const;

const CAREER_OPTIONS = ["EMPLOYED", "SELF_EMPLOYED", "UNEMPLOYED"] as const;

export default function ProfilesPage() {
  const router = useRouter();
  const { data: profiles, isLoading, isError } = useGetWomenProfilesQuery();
  const { data: subCitiesData } = useGetSubCitiesQuery();
  const t = useTranslations("women");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Workflow tab & advanced filter states
  const [presetTab, setPresetTab] = useState<PresetTab>("ALL");
  const [selectedSubCity, setSelectedSubCity] = useState<string>("ALL");
  const [selectedWoreda, setSelectedWoreda] = useState<string>("ALL");
  const [educationFilter, setEducationFilter] = useState<string>("ALL");
  const [careerFilter, setCareerFilter] = useState<string>("ALL");
  const [approvalFilter, setApprovalFilter] = useState<string>("ALL");
  const [ageFilter, setAgeFilter] = useState<"ALL" | "YOUTH" | "ADULT" | "SENIOR">("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const [editingProfile, setEditingProfile] = useState<WomenProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusProfile, setStatusProfile] = useState<WomenProfile | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

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
    if (selectedSubCity === "ALL") return null;
    return (subCitiesData || []).find(
      (s) => s.name.toLowerCase().trim() === selectedSubCity.toLowerCase().trim(),
    );
  }, [subCitiesData, selectedSubCity]);

  const availableWoredas = useMemo(() => {
    return currentSubCityObj?.woredas || [];
  }, [currentSubCityObj]);

  const getAgeNumber = (profile: WomenProfile): number | null => {
    if (profile.client.age) return profile.client.age;
    if (profile.client.dateOfBirth) {
      const diff = Date.now() - new Date(profile.client.dateOfBirth).getTime();
      const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      if (!isNaN(age) && age > 0) return age;
    }
    return null;
  };

  // Real-time tab counts
  const tabCounts = useMemo(() => {
    const list = profiles || [];
    return {
      all: list.length,
      unemployed: list.filter(
        (p: WomenProfile) =>
          (p.careerStatus || p.client.careerStatus || "").toUpperCase() === "UNEMPLOYED",
      ).length,
      employed: list.filter((p: WomenProfile) => {
        const s = (p.careerStatus || p.client.careerStatus || "").toUpperCase();
        return s === "EMPLOYED" || s === "SELF_EMPLOYED";
      }).length,
      pending: list.filter((p: WomenProfile) => p.approvalStatus === "PENDING").length,
      active: list.filter((p: WomenProfile) => p.isActive).length,
    };
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    return (profiles || []).filter((p: WomenProfile) => {
      // 1. Debounced Search
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.trim().toLowerCase();
        const matchesSearch = [
          p.client.firstName,
          p.client.lastName,
          p.client.cityIdNumber,
          p.client.phoneNumber,
          p.client.subCity,
          p.client.woreda,
          p.client.address,
          p.educationLevel,
          p.careerStatus,
          p.occupation,
        ]
          .filter(Boolean)
          .some((val) => val?.toString().toLowerCase().includes(q));

        if (!matchesSearch) return false;
      }

      // 2. Preset Tab
      const careerStatusUpper = (
        p.careerStatus ||
        p.client.careerStatus ||
        p.occupation ||
        ""
      ).toUpperCase();

      if (presetTab === "UNEMPLOYED" && careerStatusUpper !== "UNEMPLOYED") {
        return false;
      }
      if (
        presetTab === "EMPLOYED" &&
        careerStatusUpper !== "EMPLOYED" &&
        careerStatusUpper !== "SELF_EMPLOYED"
      ) {
        return false;
      }
      if (presetTab === "PENDING" && p.approvalStatus !== "PENDING") {
        return false;
      }
      if (presetTab === "ACTIVE" && !p.isActive) {
        return false;
      }

      // 3. Location Filters
      if (selectedSubCity !== "ALL") {
        if (
          (p.client.subCity || "").toLowerCase().trim() !==
          selectedSubCity.toLowerCase().trim()
        ) {
          return false;
        }
      }
      if (selectedWoreda !== "ALL") {
        if (
          (p.client.woreda || "").toLowerCase().trim() !==
          selectedWoreda.toLowerCase().trim()
        ) {
          return false;
        }
      }

      // 4. Education Filter
      if (educationFilter !== "ALL") {
        const edu = (
          p.educationLevel ||
          p.client.educationLevel ||
          ""
        ).toUpperCase();
        if (edu !== educationFilter.toUpperCase()) return false;
      }

      // 5. Career Status Filter
      if (careerFilter !== "ALL") {
        if (careerStatusUpper !== careerFilter.toUpperCase()) return false;
      }

      // 6. Approval Status Filter
      if (approvalFilter !== "ALL" && p.approvalStatus !== approvalFilter) {
        return false;
      }

      // 7. Age Filter
      if (ageFilter !== "ALL") {
        const ageNum = getAgeNumber(p);
        if (ageNum === null) return false;
        if (ageFilter === "YOUTH" && ageNum >= 30) return false;
        if (ageFilter === "ADULT" && (ageNum < 30 || ageNum > 49)) return false;
        if (ageFilter === "SENIOR" && ageNum < 50) return false;
      }

      // 8. Active Status Filter
      if (activeStatusFilter === "ACTIVE" && !p.isActive) return false;
      if (activeStatusFilter === "INACTIVE" && p.isActive) return false;

      return true;
    });
  }, [
    profiles,
    debouncedSearch,
    presetTab,
    selectedSubCity,
    selectedWoreda,
    educationFilter,
    careerFilter,
    approvalFilter,
    ageFilter,
    activeStatusFilter,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubCity !== "ALL") count++;
    if (selectedWoreda !== "ALL") count++;
    if (educationFilter !== "ALL") count++;
    if (careerFilter !== "ALL") count++;
    if (approvalFilter !== "ALL") count++;
    if (ageFilter !== "ALL") count++;
    if (activeStatusFilter !== "ALL") count++;
    return count;
  }, [
    selectedSubCity,
    selectedWoreda,
    educationFilter,
    careerFilter,
    approvalFilter,
    ageFilter,
    activeStatusFilter,
  ]);

  const hasActiveFilters =
    search.length > 0 ||
    presetTab !== "ALL" ||
    selectedSubCity !== "ALL" ||
    selectedWoreda !== "ALL" ||
    educationFilter !== "ALL" ||
    careerFilter !== "ALL" ||
    approvalFilter !== "ALL" ||
    ageFilter !== "ALL" ||
    activeStatusFilter !== "ALL";

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPresetTab("ALL");
    setSelectedSubCity("ALL");
    setSelectedWoreda("ALL");
    setEducationFilter("ALL");
    setCareerFilter("ALL");
    setApprovalFilter("ALL");
    setAgeFilter("ALL");
    setActiveStatusFilter("ALL");
    setPage(1);
  };

  const totalItems = filteredProfiles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startIndex = (page - 1) * limit;
  const currentProfiles = filteredProfiles.slice(startIndex, startIndex + limit);

  const handleEdit = (profile: WomenProfile) => {
    setEditingProfile(profile);
    setEditDialogOpen(true);
  };

  const handleStatusToggle = (profile: WomenProfile) => {
    setStatusProfile(profile);
    setStatusDialogOpen(true);
  };

  const getAge = (profile: WomenProfile) => {
    const age = getAgeNumber(profile);
    return age !== null ? age : "-";
  };

  const getCareerStatusLabel = (profile: WomenProfile) => {
    const status = profile.careerStatus || profile.occupation || "";
    if (!status) return <span className="text-slate-400">-</span>;

    let label = status;
    try {
      if (t.has(`form.careerOptions.${status}`)) {
        label = t(`form.careerOptions.${status}`);
      }
    } catch {
      // fallback
    }

    const s = status.toUpperCase();
    if (s === "EMPLOYED" || s.includes("WORK")) {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${uiTokens.statusTag.primary}`}
        >
          {label}
        </span>
      );
    }
    if (s === "UNEMPLOYED") {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${uiTokens.statusTag.warning}`}
        >
          {label}
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-medium border ${uiTokens.statusTag.neutral}`}
      >
        {label}
      </span>
    );
  };

  const getEducationLabel = (level?: string) => {
    if (!level) return <span className="text-slate-400">-</span>;
    try {
      if (t.has(`form.educationOptions.${level}`)) {
        return t(`form.educationOptions.${level}`);
      }
    } catch {
      // fallback
    }
    return level;
  };

  if (isError) {
    return <div className="p-8 text-red-500">{t("womenList.error")}</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>{t("womenList.institutionalBanner.cityAdmin")}</span>
          <span>·</span>
          <span>{t("womenList.institutionalBanner.bureau")}</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            {t("womenList.institutionalBanner.sector")}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("womenList.title")}
            </h1>
            <p className="text-xs text-slate-500">{t("womenList.subtitle")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="search"
                placeholder={t("womenList.searchPlaceholder")}
                className="pl-8 pr-7 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
              <span>{t("womenList.filters.button")}</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <NewWomenProfileForm />
          </div>
        </div>
      </div>

      {/* ── Workflow Preset Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3E7EB]">
        {[
          { id: "ALL" as const, label: t("womenList.tabs.all"), count: tabCounts.all },
          {
            id: "UNEMPLOYED" as const,
            label: t("womenList.tabs.unemployed"),
            count: tabCounts.unemployed,
            color: "text-amber-700 bg-amber-50",
          },
          {
            id: "EMPLOYED" as const,
            label: t("womenList.tabs.employed"),
            count: tabCounts.employed,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            id: "PENDING" as const,
            label: t("womenList.tabs.pending"),
            count: tabCounts.pending,
            color: "text-indigo-700 bg-indigo-50",
          },
          {
            id: "ACTIVE" as const,
            label: t("womenList.tabs.active"),
            count: tabCounts.active,
            color: "text-blue-700 bg-blue-50",
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
                {t("womenList.filters.title")}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("womenList.filters.resetAll")}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Sub-City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("womenList.filters.subCity")}
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
                  <SelectValue placeholder={t("womenList.filters.allSubCities")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("womenList.filters.allSubCities")}
                  </SelectItem>
                  {allSubCityNames.map((sc) => (
                    <SelectItem key={sc} value={sc} className="text-xs rounded-xs">
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Woreda Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("womenList.filters.woreda")}
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
                        ? t("womenList.filters.selectSubCityFirst")
                        : t("womenList.filters.allWoredas")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("womenList.filters.allWoredas")}
                  </SelectItem>
                  {availableWoredas.map((w) => (
                    <SelectItem key={w.id} value={w.code} className="text-xs rounded-xs">
                      {t("form.woreda")} {w.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Career / Employment Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("womenList.filters.careerStatus")}
              </label>
              <Select
                value={careerFilter}
                onValueChange={(val) => {
                  setCareerFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("womenList.filters.allCareerStatuses")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("womenList.filters.allCareerStatuses")}
                  </SelectItem>
                  {CAREER_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs rounded-xs">
                      {t.has(`form.careerOptions.${c}`)
                        ? t(`form.careerOptions.${c}`)
                        : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Education Level */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("womenList.filters.educationLevel")}
              </label>
              <Select
                value={educationFilter}
                onValueChange={(val) => {
                  setEducationFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("womenList.filters.allEducationLevels")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("womenList.filters.allEducationLevels")}
                  </SelectItem>
                  {EDUCATION_OPTIONS.map((edu) => (
                    <SelectItem key={edu} value={edu} className="text-xs rounded-xs">
                      {t.has(`form.educationOptions.${edu}`)
                        ? t(`form.educationOptions.${edu}`)
                        : edu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Age Bracket */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("womenList.filters.ageBracket")}
              </label>
              <Select
                value={ageFilter}
                onValueChange={(val: any) => {
                  setAgeFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("womenList.filters.allAges")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("womenList.filters.allAges")}
                  </SelectItem>
                  <SelectItem value="YOUTH" className="text-xs rounded-xs">
                    {t("womenList.filters.youth")}
                  </SelectItem>
                  <SelectItem value="ADULT" className="text-xs rounded-xs">
                    {t("womenList.filters.adult")}
                  </SelectItem>
                  <SelectItem value="SENIOR" className="text-xs rounded-xs">
                    {t("womenList.filters.senior")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Approval Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("womenList.filters.approval")}
              </label>
              <Select
                value={approvalFilter}
                onValueChange={(val) => {
                  setApprovalFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("womenList.filters.allApprovals")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("womenList.filters.allApprovals")}
                  </SelectItem>
                  <SelectItem value="PENDING" className="text-xs rounded-xs">
                    {t("womenList.filters.pending")}
                  </SelectItem>
                  <SelectItem value="APPROVED" className="text-xs rounded-xs">
                    {t("womenList.filters.approved")}
                  </SelectItem>
                  <SelectItem value="REJECTED" className="text-xs rounded-xs">
                    {t("womenList.filters.rejected")}
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
            {t("womenList.filters.resultsCount", {
              count: filteredProfiles.length,
              total: profiles?.length || 0,
            })}
          </span>

          {presetTab !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("womenList.chips.preset", { tab: presetTab })}</span>
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
              <span>{t("womenList.chips.search", { query: debouncedSearch })}</span>
              <button
                onClick={() => setSearch("")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
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
              <span>{t("womenList.chips.subCity", { name: selectedSubCity })}</span>
              <button
                onClick={() => {
                  setSelectedSubCity("ALL");
                  setSelectedWoreda("ALL");
                }}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
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
              <span>{t("womenList.chips.woreda", { name: selectedWoreda })}</span>
              <button
                onClick={() => setSelectedWoreda("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {careerFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("womenList.chips.career", { status: careerFilter })}</span>
              <button
                onClick={() => setCareerFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {educationFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("womenList.chips.education", { level: educationFilter })}</span>
              <button
                onClick={() => setEducationFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {ageFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("womenList.chips.age", { age: ageFilter })}</span>
              <button
                onClick={() => setAgeFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {approvalFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("womenList.chips.approval", { status: approvalFilter })}</span>
              <button
                onClick={() => setApprovalFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[11px] font-mono font-semibold text-rose-600 hover:text-rose-800 ml-1 underline underline-offset-2 cursor-pointer"
            >
              {t("womenList.filters.clearAll")}
            </button>
          )}
        </div>
      </div>

      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3.5 px-5 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <Users className="w-4 h-4 text-[#1769AA]" />
            {t("womenList.title")}
          </CardTitle>
          <div className="text-xs font-mono text-slate-500">
            {t("womenList.pagination.showing", {
              start: totalItems === 0 ? 0 : startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">
                    {t("womenList.table.name")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("womenList.table.cityId")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("womenList.table.age")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("womenList.table.phone")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("womenList.table.address")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("womenList.table.educationLevel")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 py-3">
                    {t("womenList.table.careerStatus")}
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">
                    {t("womenList.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-xs text-slate-500">
                      {t("womenList.loading")}
                    </TableCell>
                  </TableRow>
                ) : currentProfiles.length > 0 ? (
                  currentProfiles.map((profile: WomenProfile) => (
                    <TableRow
                      key={profile.id}
                      className="hover:bg-[#F7F8FA] transition-colors border-b border-[#E3E7EB] last:border-0"
                    >
                      <TableCell className="font-medium py-3 pl-5">
                        <span className="text-xs font-semibold text-[#0B1F3A]">
                          {profile.client.firstName} {profile.client.lastName}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs">
                          {profile.client.cityIdNumber || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs font-mono py-3">
                        {getAge(profile)}
                      </TableCell>
                      <TableCell className="text-slate-600 font-mono text-xs py-3">
                        {profile.client.phoneNumber || "—"}
                      </TableCell>
                      <TableCell
                        className="text-slate-600 text-xs max-w-[200px] truncate py-3"
                        title={[profile.client.subCity, profile.client.woreda ? `${t("form.woreda")} ${profile.client.woreda}` : null, profile.client.address].filter(Boolean).join(", ")}
                      >
                        {[profile.client.subCity, profile.client.woreda ? `${t("form.woreda")} ${profile.client.woreda}` : null, profile.client.address].filter(Boolean).join(", ") || "—"}
                      </TableCell>
                      <TableCell className="text-slate-600 text-xs py-3">
                        {getEducationLabel(profile.educationLevel)}
                      </TableCell>
                      <TableCell className="py-3">
                        {getCareerStatusLabel(profile)}
                      </TableCell>
                      <TableCell className="text-right py-3 pr-5">
                        <div className="flex justify-end gap-1">
                          <PersonHistoryDialog
                            clientId={profile.client.id}
                            personName={`${profile.client.firstName} ${profile.client.lastName}`}
                            cityIdNumber={profile.client.cityIdNumber ?? undefined}
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View cross-department support history"
                                className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                              >
                                <History className="w-3.5 h-3.5" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("womenList.table.viewDetails")}
                            onClick={() =>
                              router.push(`/women/profiles/${profile.id}`)
                            }
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("womenList.table.edit")}
                            onClick={() => handleEdit(profile)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t("womenList.table.toggleStatus")}
                            onClick={() => handleStatusToggle(profile)}
                            className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                          >
                            <ToggleLeft className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-xs text-slate-500"
                    >
                      {t("womenList.noProfiles")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalItems > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
              <p className="text-xs text-slate-500 font-mono">
                {t("womenList.pagination.showing", {
                  start: startIndex + 1,
                  end: Math.min(startIndex + limit, totalItems),
                  total: totalItems,
                })}
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
                <span className="text-xs font-mono px-2 text-slate-600">
                  {page} / {totalPages}
                </span>
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
          )}
        </CardContent>
      </Card>

      <EditWomenProfileForm
        profile={editingProfile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <StatusToggleDialog
        profile={statusProfile}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
}