"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useBeneficiarySearch } from "@/hooks/beneficiaries/srs-hooks";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import { useBeneficiaryRegisterStore } from "@/stores/beneficiary-register-store";
import BeneficiaryTable from "../_components/beneficiary-table";
import BeneficiaryReportDialog from "../_components/report-dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RotateCcw,
  Home,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Beneficiary,
  BeneficiaryCategory,
  DisabilitySeverity,
} from "@/api/beneficiaries/types-v2";

type DisabledPresetTab = "ALL" | "SEVERE" | "ASSISTANCE" | "UNEMPLOYED" | "ACTIVE";
type ElderlyPresetTab = "ALL" | "CONFIRMED" | "VULNERABLE" | "OLDEST" | "ACTIVE";

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

const DISABILITY_TYPES = [
  "PHYSICAL",
  "VISUAL",
  "HEARING",
  "INTELLECTUAL",
  "SPEECH",
  "MULTIPLE",
  "OTHER",
];

const SEVERITY_LEVELS: DisabilitySeverity[] = [
  "MILD",
  "MODERATE",
  "SEVERE",
  "PROFOUND",
];

export default function BeneficiariesPage() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.beneficiaries");
  const tSubCities = useTranslations("subCities.names");
  const tOpts = useTranslations("social-affairs.elderlyAndDisabled.options");

  const getSubCityLabel = (sc: string) => (tSubCities.has(sc) ? tSubCities(sc) : sc);
  const openDialog = useBeneficiaryRegisterStore((s) => s.openDialog);
  const { userSubCity, userWoreda, filterSubCityNames } = useJurisdictionScope();

  const [category, setCategory] = useState<BeneficiaryCategory>("DISABLED");
  const [disabledTab, setDisabledTab] = useState<DisabledPresetTab>("ALL");
  const [elderlyTab, setElderlyTab] = useState<ElderlyPresetTab>("ALL");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Location filters
  const [selectedSubCity, setSelectedSubCity] = useState<string>(userSubCity || "ALL");
  const [selectedWoreda, setSelectedWoreda] = useState<string>(userWoreda || "ALL");

  // Common demographic filters
  const [sexFilter, setSexFilter] = useState<string>("ALL");
  const [employmentFilter, setEmploymentFilter] = useState<string>("ALL");
  const [maritalFilter, setMaritalFilter] = useState<string>("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");

  // Disability-specific filters
  const [disabilityTypeFilter, setDisabilityTypeFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [verificationFilter, setVerificationFilter] = useState<string>("ALL");
  const [assistanceFilter, setAssistanceFilter] = useState<string>("ALL");

  // Elderly-specific filters
  const [elderlyAgeFilter, setElderlyAgeFilter] = useState<string>("ALL");
  const [supportConfirmedFilter, setSupportConfirmedFilter] = useState<string>("ALL");

  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const { data: subCitiesData } = useGetSubCitiesQuery();

  useEffect(() => {
    if (userSubCity) {
      setSelectedSubCity(userSubCity);
      setShowAdvancedFilters(true);
    }
    if (userWoreda) {
      setSelectedWoreda(userWoreda);
    }
  }, [userSubCity, userWoreda]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle URL param ?subCity=...
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sub = params.get("subCity");
    if (sub && !userSubCity) {
      setSelectedSubCity(sub);
      setShowAdvancedFilters(true);
    }
  }, [userSubCity]);

  // Fetch from server: query category with larger page size for fast client filtering
  const { data, isLoading, isFetching } = useBeneficiarySearch({
    category,
    subCity: selectedSubCity !== "ALL" ? selectedSubCity : undefined,
    woreda: selectedWoreda !== "ALL" ? selectedWoreda : undefined,
    page: 1,
    pageSize: 150,
  });

  // Derived sub-cities and woredas
  const allSubCityNames = useMemo(() => {
    const fromApi = (subCitiesData || []).map((s) => s.name);
    const combined = Array.from(new Set([...fromApi, ...DEFAULT_SUBCITY_NAMES]));
    return filterSubCityNames(combined);
  }, [subCitiesData, filterSubCityNames]);

  const currentSubCityObj = useMemo(() => {
    if (selectedSubCity === "ALL" || !selectedSubCity) return null;
    return (subCitiesData || []).find(
      (s) => s.name.toLowerCase().trim() === selectedSubCity.toLowerCase().trim(),
    );
  }, [subCitiesData, selectedSubCity]);

  const availableWoredas = useMemo(() => {
    const list = currentSubCityObj?.woredas || [];
    if (userWoreda) {
      const filtered = list.filter(
        (w) => String(w.code) === String(userWoreda)
      );
      return filtered.length > 0
        ? filtered
        : [{ id: -1, code: String(userWoreda), subCityId: 0 }];
    }
    return list;
  }, [currentSubCityObj, userWoreda]);

  const getAge = (b: Beneficiary): number | null => {
    if (typeof b.age === "number" && b.age > 0) return b.age;
    if (b.dateOfBirth) {
      const diff = Date.now() - new Date(b.dateOfBirth).getTime();
      const calculated = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      if (!isNaN(calculated) && calculated > 0) return calculated;
    }
    return null;
  };

  const rawItems: Beneficiary[] = data?.items || [];

  // Tab counts
  const tabCounts = useMemo(() => {
    if (category === "DISABLED") {
      return {
        all: rawItems.length,
        severe: rawItems.filter(
          (b) =>
            b.DisabilityProfile?.disabilitySeverity === "SEVERE" ||
            b.DisabilityProfile?.disabilitySeverity === "PROFOUND",
        ).length,
        assistance: rawItems.filter(
          (b) =>
            b.DisabilityProfile?.requiresPhysicalAssistance ||
            !!b.DisabilityProfile?.requiredAssistiveDevice,
        ).length,
        unemployed: rawItems.filter((b) => b.employmentStatus === "UNEMPLOYED").length,
        active: rawItems.filter((b) => b.activeStatus).length,
      };
    } else {
      return {
        all: rawItems.length,
        confirmed: rawItems.filter((b) => b.ElderlyProfile?.supportConfirmed).length,
        vulnerable: rawItems.filter(
          (b) => b.maritalStatus === "WIDOWED" || b.maritalStatus === "UNMARRIED",
        ).length,
        oldest: rawItems.filter((b) => (getAge(b) ?? 0) >= 80).length,
        active: rawItems.filter((b) => b.activeStatus).length,
      };
    }
  }, [rawItems, category]);

  // Filtering
  const filteredItems = useMemo(() => {
    let list = rawItems;

    // 1. Workflow preset tab
    if (category === "DISABLED") {
      if (disabledTab === "SEVERE") {
        list = list.filter(
          (b) =>
            b.DisabilityProfile?.disabilitySeverity === "SEVERE" ||
            b.DisabilityProfile?.disabilitySeverity === "PROFOUND",
        );
      } else if (disabledTab === "ASSISTANCE") {
        list = list.filter(
          (b) =>
            b.DisabilityProfile?.requiresPhysicalAssistance ||
            !!b.DisabilityProfile?.requiredAssistiveDevice,
        );
      } else if (disabledTab === "UNEMPLOYED") {
        list = list.filter((b) => b.employmentStatus === "UNEMPLOYED");
      } else if (disabledTab === "ACTIVE") {
        list = list.filter((b) => b.activeStatus);
      }
    } else {
      if (elderlyTab === "CONFIRMED") {
        list = list.filter((b) => b.ElderlyProfile?.supportConfirmed);
      } else if (elderlyTab === "VULNERABLE") {
        list = list.filter(
          (b) => b.maritalStatus === "WIDOWED" || b.maritalStatus === "UNMARRIED",
        );
      } else if (elderlyTab === "OLDEST") {
        list = list.filter((b) => (getAge(b) ?? 0) >= 80);
      } else if (elderlyTab === "ACTIVE") {
        list = list.filter((b) => b.activeStatus);
      }
    }

    // 2. Multi-field search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter((b) => {
        const fields = [
          b.firstName,
          b.lastName,
          b.grandfatherName,
          `${b.firstName} ${b.lastName}`,
          `${b.firstName} ${b.lastName} ${b.grandfatherName || ""}`,
          b.faydaId,
          b.cityIdNumber,
          b.phoneNumber,
          b.subCity,
          b.woreda,
          b.address,
          b.occupation,
          b.DisabilityProfile?.disabilityType,
          b.DisabilityProfile?.cause,
          b.ElderlyProfile?.requiredSupportType,
        ].filter(Boolean) as string[];
        return fields.some((f) => f.toLowerCase().includes(q));
      });
    }

    // 3. Location
    if (selectedSubCity !== "ALL") {
      list = list.filter(
        (b) => b.subCity?.toLowerCase().trim() === selectedSubCity.toLowerCase().trim(),
      );
    }
    if (selectedWoreda !== "ALL") {
      list = list.filter((b) => {
        const wStr = String(b.woreda || "").toLowerCase().trim();
        const target = String(selectedWoreda).toLowerCase().trim();
        return wStr === target || wStr === `woreda ${target}` || wStr === `w-${target}`;
      });
    }

    // 4. Common Demographics
    if (sexFilter !== "ALL") {
      list = list.filter((b) => b.sex === sexFilter);
    }
    if (employmentFilter !== "ALL") {
      list = list.filter((b) => b.employmentStatus === employmentFilter);
    }
    if (maritalFilter !== "ALL") {
      list = list.filter((b) => b.maritalStatus === maritalFilter);
    }
    if (activeStatusFilter === "ACTIVE") {
      list = list.filter((b) => b.activeStatus);
    } else if (activeStatusFilter === "INACTIVE") {
      list = list.filter((b) => !b.activeStatus);
    }

    // 5. Category-specific
    if (category === "DISABLED") {
      if (disabilityTypeFilter !== "ALL") {
        list = list.filter((b) =>
          b.DisabilityProfile?.disabilityType
            ?.toLowerCase()
            .includes(disabilityTypeFilter.toLowerCase()),
        );
      }
      if (severityFilter !== "ALL") {
        list = list.filter(
          (b) => b.DisabilityProfile?.disabilitySeverity === severityFilter,
        );
      }
      if (verificationFilter !== "ALL") {
        list = list.filter(
          (b) =>
            b.DisabilityProfile?.medicalVerificationStatus === verificationFilter,
        );
      }
      if (assistanceFilter === "YES") {
        list = list.filter(
          (b) =>
            b.DisabilityProfile?.requiresPhysicalAssistance ||
            !!b.DisabilityProfile?.requiredAssistiveDevice,
        );
      } else if (assistanceFilter === "NO") {
        list = list.filter(
          (b) =>
            !b.DisabilityProfile?.requiresPhysicalAssistance &&
            !b.DisabilityProfile?.requiredAssistiveDevice,
        );
      }
    } else {
      if (elderlyAgeFilter !== "ALL") {
        list = list.filter((b) => {
          const age = getAge(b);
          if (age === null) return false;
          if (elderlyAgeFilter === "60_69") return age >= 60 && age <= 69;
          if (elderlyAgeFilter === "70_79") return age >= 70 && age <= 79;
          if (elderlyAgeFilter === "80_PLUS") return age >= 80;
          return true;
        });
      }
      if (supportConfirmedFilter === "YES") {
        list = list.filter((b) => b.ElderlyProfile?.supportConfirmed);
      } else if (supportConfirmedFilter === "NO") {
        list = list.filter((b) => !b.ElderlyProfile?.supportConfirmed);
      }
    }

    return list;
  }, [
    rawItems,
    category,
    disabledTab,
    elderlyTab,
    debouncedSearch,
    selectedSubCity,
    selectedWoreda,
    sexFilter,
    employmentFilter,
    maritalFilter,
    activeStatusFilter,
    disabilityTypeFilter,
    severityFilter,
    verificationFilter,
    assistanceFilter,
    elderlyAgeFilter,
    supportConfirmedFilter,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!userSubCity && selectedSubCity !== "ALL") count++;
    if (!userWoreda && selectedWoreda !== "ALL") count++;
    if (sexFilter !== "ALL") count++;
    if (employmentFilter !== "ALL") count++;
    if (maritalFilter !== "ALL") count++;
    if (activeStatusFilter !== "ALL") count++;
    if (category === "DISABLED") {
      if (disabilityTypeFilter !== "ALL") count++;
      if (severityFilter !== "ALL") count++;
      if (verificationFilter !== "ALL") count++;
      if (assistanceFilter !== "ALL") count++;
    } else {
      if (elderlyAgeFilter !== "ALL") count++;
      if (supportConfirmedFilter !== "ALL") count++;
    }
    return count;
  }, [
    selectedSubCity,
    selectedWoreda,
    userSubCity,
    userWoreda,
    sexFilter,
    employmentFilter,
    maritalFilter,
    activeStatusFilter,
    category,
    disabilityTypeFilter,
    severityFilter,
    verificationFilter,
    assistanceFilter,
    elderlyAgeFilter,
    supportConfirmedFilter,
  ]);

  const currentTab = category === "DISABLED" ? disabledTab : elderlyTab;

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    currentTab !== "ALL" ||
    (!userSubCity && selectedSubCity !== "ALL") ||
    (!userWoreda && selectedWoreda !== "ALL") ||
    sexFilter !== "ALL" ||
    employmentFilter !== "ALL" ||
    maritalFilter !== "ALL" ||
    activeStatusFilter !== "ALL" ||
    (category === "DISABLED" &&
      (disabilityTypeFilter !== "ALL" ||
        severityFilter !== "ALL" ||
        verificationFilter !== "ALL" ||
        assistanceFilter !== "ALL")) ||
    (category === "ELDERLY" &&
      (elderlyAgeFilter !== "ALL" || supportConfirmedFilter !== "ALL"));

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    if (category === "DISABLED") {
      setDisabledTab("ALL");
    } else {
      setElderlyTab("ALL");
    }
    setSelectedSubCity(userSubCity || "ALL");
    setSelectedWoreda(userWoreda || "ALL");
    setSexFilter("ALL");
    setEmploymentFilter("ALL");
    setMaritalFilter("ALL");
    setActiveStatusFilter("ALL");
    setDisabilityTypeFilter("ALL");
    setSeverityFilter("ALL");
    setVerificationFilter("ALL");
    setAssistanceFilter("ALL");
    setElderlyAgeFilter("ALL");
    setSupportConfirmedFilter("ALL");
    setPage(1);
  };

  const handleCategorySwitch = (cat: BeneficiaryCategory) => {
    setCategory(cat);
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
    setDisabledTab("ALL");
    setElderlyTab("ALL");
  };

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const startIndex = (page - 1) * limit;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + limit);

  return (
    <div className="space-y-4 max-w-7xl mx-auto w-full p-4 md:p-6">
      {/* ── Municipal Breadcrumbs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link
          href="/"
          className="hover:text-[#1769AA] flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t("breadcrumbs.home")}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href="/social-affairs/elderly-and-disabled/dashboard"
          className="hover:text-[#1769AA] transition-colors"
        >
          {t("breadcrumbs.module")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">
          {category === "DISABLED" ? t("disabled") : t("elderly")} {t("breadcrumbs.beneficiariesSuffix")}
        </span>
      </div>

      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>{t("banner.cityAdmin")}</span>
          <span>·</span>
          <span>{t("banner.bureau")}</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            {t("banner.directorate")}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {category === "DISABLED" ? t("disabledTitle") : t("elderlyTitle")}
            </h1>
            <p className="text-xs text-slate-500">
              {category === "DISABLED"
                ? t("disabledSubtitle")
                : t("elderlySubtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Toggle Tabs */}
            <div className="flex items-center p-0.5 rounded-xs bg-slate-100 border border-[#E3E7EB]">
              <button
                type="button"
                onClick={() => handleCategorySwitch("DISABLED")}
                className={`h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
                  category === "DISABLED"
                    ? "bg-[#1769AA] text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t("disabled")}
              </button>
              <button
                type="button"
                onClick={() => handleCategorySwitch("ELDERLY")}
                className={`h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer transition-colors ${
                  category === "ELDERLY"
                    ? "bg-[#1769AA] text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t("elderly")}
              </button>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholderDetailed")}
                className="pl-8 pr-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
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
              <span>{t("filtersButton")}</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <BeneficiaryReportDialog />

            <Button
              className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5 cursor-pointer"
              onClick={() => openDialog(category)}
            >
              <Plus className="w-3.5 h-3.5" />
              {t("registerNew")}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Workflow Preset Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3E7EB]">
        {category === "DISABLED" ? (
          [
            { id: "ALL" as const, label: t("tabs.allDisabled"), count: tabCounts.all },
            {
              id: "SEVERE" as const,
              label: t("tabs.severeProfound"),
              count: tabCounts.severe,
              color: "text-rose-700 bg-rose-50",
            },
            {
              id: "ASSISTANCE" as const,
              label: t("tabs.assistanceNeeded"),
              count: tabCounts.assistance,
              color: "text-amber-700 bg-amber-50",
            },
            {
              id: "UNEMPLOYED" as const,
              label: t("tabs.seekingWork"),
              count: tabCounts.unemployed,
              color: "text-indigo-700 bg-indigo-50",
            },
            {
              id: "ACTIVE" as const,
              label: t("tabs.activeDisabled"),
              count: tabCounts.active,
              color: "text-emerald-700 bg-emerald-50",
            },
          ].map((tab) => {
            const isActive = disabledTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setDisabledTab(tab.id);
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
          })
        ) : (
          [
            { id: "ALL" as const, label: t("tabs.allElderly"), count: tabCounts.all },
            {
              id: "CONFIRMED" as const,
              label: t("tabs.supportConfirmed"),
              count: tabCounts.confirmed,
              color: "text-emerald-700 bg-emerald-50",
            },
            {
              id: "VULNERABLE" as const,
              label: t("tabs.livingAloneWidowed"),
              count: tabCounts.vulnerable,
              color: "text-amber-700 bg-amber-50",
            },
            {
              id: "OLDEST" as const,
              label: t("tabs.oldestOld"),
              count: tabCounts.oldest,
              color: "text-purple-700 bg-purple-50",
            },
            {
              id: "ACTIVE" as const,
              label: t("tabs.activeElderly"),
              count: tabCounts.active,
              color: "text-blue-700 bg-blue-50",
            },
          ].map((tab) => {
            const isActive = elderlyTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setElderlyTab(tab.id);
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
          })
        )}
      </div>

      {/* ── Advanced Collapsible Filter Panel ────────────────────────────────── */}
      {showAdvancedFilters && (
        <div className="p-4 bg-slate-50/80 rounded-xs border border-[#E3E7EB] space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3E7EB]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F3A]">
                {t("filterDrawer.title", {
                  category: category === "DISABLED" ? t("disabled") : t("elderly"),
                })}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t("filterDrawer.resetAll")}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Sub-City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filterDrawer.subCity")}
              </label>
              <Select
                disabled={!!userSubCity}
                value={selectedSubCity}
                onValueChange={(val) => {
                  setSelectedSubCity(val);
                  setSelectedWoreda("ALL");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-500">
                  <SelectValue placeholder={t("filterDrawer.allSubCities")}>
                    {selectedSubCity === "ALL" ? t("filterDrawer.allSubCities") : getSubCityLabel(selectedSubCity)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userSubCity && (
                    <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                      {t("filterDrawer.allSubCities")}
                    </SelectItem>
                  )}
                  {allSubCityNames.map((sc) => (
                    <SelectItem key={sc} value={sc} className="text-xs rounded-xs">
                      {getSubCityLabel(sc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Woreda Selector (Cascading) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filterDrawer.woreda")}
              </label>
              <Select
                value={selectedWoreda}
                onValueChange={(val) => {
                  setSelectedWoreda(val);
                  setPage(1);
                }}
                disabled={!!userWoreda || selectedSubCity === "ALL" || !selectedSubCity}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-400">
                  <SelectValue
                    placeholder={
                      selectedSubCity === "ALL" || !selectedSubCity
                        ? t("filterDrawer.selectSubCityFirst")
                        : t("filterDrawer.allWoredas")
                    }
                  >
                    {selectedWoreda === "ALL"
                      ? t("filterDrawer.allWoredas")
                      : selectedWoreda
                      ? t("filterDrawer.woredaPrefix", { code: selectedWoreda })
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userWoreda && (
                    <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                      {t("filterDrawer.allWoredas")}
                    </SelectItem>
                  )}
                  {availableWoredas.map((w) => (
                    <SelectItem key={w.id} value={w.code} className="text-xs rounded-xs">
                      {t("filterDrawer.woredaPrefix", { code: w.code })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category-specific filters */}
            {category === "DISABLED" ? (
              <>
                {/* Disability Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {t("filterDrawer.disabilityType")}
                  </label>
                  <Select
                    value={disabilityTypeFilter}
                    onValueChange={(val) => {
                      setDisabilityTypeFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder={t("filterDrawer.allDisabilityTypes")}>
                        {disabilityTypeFilter === "ALL"
                          ? t("filterDrawer.allDisabilityTypes")
                          : tOpts.has(`disabilityTypes.${disabilityTypeFilter}`)
                          ? tOpts(`disabilityTypes.${disabilityTypeFilter}`)
                          : disabilityTypeFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        {t("filterDrawer.allDisabilityTypes")}
                      </SelectItem>
                      {DISABILITY_TYPES.map((dt) => (
                        <SelectItem key={dt} value={dt} className="text-xs rounded-xs">
                          {tOpts.has(`disabilityTypes.${dt}`) ? tOpts(`disabilityTypes.${dt}`) : dt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Disability Severity */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {t("filterDrawer.severityGrade")}
                  </label>
                  <Select
                    value={severityFilter}
                    onValueChange={(val) => {
                      setSeverityFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder={t("filterDrawer.allSeverities")}>
                        {severityFilter === "ALL"
                          ? t("filterDrawer.allSeverities")
                          : tOpts.has(`severity.${severityFilter}`)
                          ? tOpts(`severity.${severityFilter}`)
                          : severityFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        {t("filterDrawer.allSeverities")}
                      </SelectItem>
                      {SEVERITY_LEVELS.map((sev) => (
                        <SelectItem key={sev} value={sev} className="text-xs rounded-xs">
                          {tOpts.has(`severity.${sev}`) ? tOpts(`severity.${sev}`) : sev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Physical Assistance */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {t("filterDrawer.physicalAssistance")}
                  </label>
                  <Select
                    value={assistanceFilter}
                    onValueChange={(val) => {
                      setAssistanceFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder={t("filterDrawer.allAssistance")}>
                        {assistanceFilter === "ALL"
                          ? t("filterDrawer.allAssistance")
                          : assistanceFilter === "YES"
                          ? t("filterDrawer.requiresAssistance")
                          : t("filterDrawer.independent")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        {t("filterDrawer.allAssistance")}
                      </SelectItem>
                      <SelectItem value="YES" className="text-xs rounded-xs">
                        {t("filterDrawer.requiresAssistance")}
                      </SelectItem>
                      <SelectItem value="NO" className="text-xs rounded-xs">
                        {t("filterDrawer.independent")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Medical Verification */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {t("filterDrawer.medicalVerification")}
                  </label>
                  <Select
                    value={verificationFilter}
                    onValueChange={(val) => {
                      setVerificationFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder={t("filterDrawer.allVerifications")}>
                        {verificationFilter === "ALL"
                          ? t("filterDrawer.allVerifications")
                          : verificationFilter === "VERIFIED"
                          ? t("filterDrawer.verified")
                          : verificationFilter === "PENDING"
                          ? t("filterDrawer.pending")
                          : t("filterDrawer.rejected")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        {t("filterDrawer.allVerifications")}
                      </SelectItem>
                      <SelectItem value="VERIFIED" className="text-xs rounded-xs">
                        {t("filterDrawer.verified")}
                      </SelectItem>
                      <SelectItem value="PENDING" className="text-xs rounded-xs">
                        {t("filterDrawer.pending")}
                      </SelectItem>
                      <SelectItem value="REJECTED" className="text-xs rounded-xs">
                        {t("filterDrawer.rejected")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                {/* Elderly Age Bracket */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {t("filterDrawer.ageCohort")}
                  </label>
                  <Select
                    value={elderlyAgeFilter}
                    onValueChange={(val) => {
                      setElderlyAgeFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder={t("filterDrawer.allAges")}>
                        {elderlyAgeFilter === "ALL"
                          ? t("filterDrawer.allAges")
                          : elderlyAgeFilter === "60_69"
                          ? t("filterDrawer.youngOld")
                          : elderlyAgeFilter === "70_79"
                          ? t("filterDrawer.middleOld")
                          : t("filterDrawer.oldestOld")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        {t("filterDrawer.allAges")}
                      </SelectItem>
                      <SelectItem value="60_69" className="text-xs rounded-xs">
                        {t("filterDrawer.youngOld")}
                      </SelectItem>
                      <SelectItem value="70_79" className="text-xs rounded-xs">
                        {t("filterDrawer.middleOld")}
                      </SelectItem>
                      <SelectItem value="80_PLUS" className="text-xs rounded-xs">
                        {t("filterDrawer.oldestOld")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Support Confirmed */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {t("filterDrawer.supportConfirmed")}
                  </label>
                  <Select
                    value={supportConfirmedFilter}
                    onValueChange={(val) => {
                      setSupportConfirmedFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder={t("filterDrawer.allRecords")}>
                        {supportConfirmedFilter === "ALL"
                          ? t("filterDrawer.allRecords")
                          : supportConfirmedFilter === "YES"
                          ? t("filterDrawer.confirmedOnly")
                          : t("filterDrawer.unconfirmed")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        {t("filterDrawer.allRecords")}
                      </SelectItem>
                      <SelectItem value="YES" className="text-xs rounded-xs">
                        {t("filterDrawer.confirmedOnly")}
                      </SelectItem>
                      <SelectItem value="NO" className="text-xs rounded-xs">
                        {t("filterDrawer.unconfirmed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Employment Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filterDrawer.employment")}
              </label>
              <Select
                value={employmentFilter}
                onValueChange={(val) => {
                  setEmploymentFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("filterDrawer.allEmployment")}>
                    {employmentFilter === "ALL"
                      ? t("filterDrawer.allEmployment")
                      : employmentFilter === "EMPLOYED"
                      ? t("filterDrawer.employed")
                      : t("filterDrawer.unemployed")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("filterDrawer.allEmployment")}
                  </SelectItem>
                  <SelectItem value="EMPLOYED" className="text-xs rounded-xs">
                    {t("filterDrawer.employed")}
                  </SelectItem>
                  <SelectItem value="UNEMPLOYED" className="text-xs rounded-xs">
                    {t("filterDrawer.unemployed")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sex / Gender */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("filterDrawer.gender")}
              </label>
              <Select
                value={sexFilter}
                onValueChange={(val) => {
                  setSexFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("filterDrawer.allGenders")}>
                    {sexFilter === "ALL"
                      ? t("filterDrawer.allGenders")
                      : sexFilter === "MALE"
                      ? t("filterDrawer.male")
                      : sexFilter === "FEMALE"
                      ? t("filterDrawer.female")
                      : t("filterDrawer.other")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    {t("filterDrawer.allGenders")}
                  </SelectItem>
                  <SelectItem value="MALE" className="text-xs rounded-xs">
                    {t("filterDrawer.male")}
                  </SelectItem>
                  <SelectItem value="FEMALE" className="text-xs rounded-xs">
                    {t("filterDrawer.female")}
                  </SelectItem>
                  <SelectItem value="OTHER" className="text-xs rounded-xs">
                    {t("filterDrawer.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Chips Bar ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">
            {t("chips.resultsCount", { filtered: filteredItems.length, total: rawItems.length })}
          </span>

          {currentTab !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.preset", { tab: currentTab })}</span>
              <button
                onClick={() => {
                  if (category === "DISABLED") setDisabledTab("ALL");
                  else setElderlyTab("ALL");
                }}
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

          {selectedSubCity !== "ALL" && !userSubCity && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.subCity", { name: getSubCityLabel(selectedSubCity) })}</span>
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

          {selectedWoreda !== "ALL" && !userWoreda && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.woreda", { code: selectedWoreda })}</span>
              <button
                onClick={() => setSelectedWoreda("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {category === "DISABLED" && disabilityTypeFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.disabilityType", {
                  type: tOpts.has(`disabilityTypes.${disabilityTypeFilter}`)
                    ? tOpts(`disabilityTypes.${disabilityTypeFilter}`)
                    : disabilityTypeFilter,
                })}
              </span>
              <button
                onClick={() => setDisabilityTypeFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {category === "DISABLED" && severityFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.severity", {
                  sev: tOpts.has(`severity.${severityFilter}`)
                    ? tOpts(`severity.${severityFilter}`)
                    : severityFilter,
                })}
              </span>
              <button
                onClick={() => setSeverityFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {category === "DISABLED" && assistanceFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.assistance", { status: assistanceFilter })}</span>
              <button
                onClick={() => setAssistanceFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {category === "ELDERLY" && elderlyAgeFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>{t("chips.ageCohort", { cohort: elderlyAgeFilter.replace("_", "–") })}</span>
              <button
                onClick={() => setElderlyAgeFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {employmentFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.employment", {
                  status: tOpts.has(`employment.${employmentFilter}`)
                    ? tOpts(`employment.${employmentFilter}`)
                    : employmentFilter,
                })}
              </span>
              <button
                onClick={() => setEmploymentFilter("ALL")}
                className="hover:text-rose-600 ml-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {sexFilter !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-slate-300 bg-white text-slate-700 gap-1 pl-2 pr-1 py-0.5"
            >
              <span>
                {t("chips.gender", {
                  gender: tOpts.has(`sex.${sexFilter}`)
                    ? tOpts(`sex.${sexFilter}`)
                    : sexFilter,
                })}
              </span>
              <button
                onClick={() => setSexFilter("ALL")}
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
            <span>{t("chips.clearAll")}</span>
          </Button>
        )}
      </div>

      {/* ── Directory Table Card ────────────────────────────────────────────── */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1769AA]" />
            <span>
              {category === "DISABLED" ? t("disabled") : t("elderly")} {t("registeredCard")}
            </span>
          </CardTitle>
          <span className="text-xs font-mono text-slate-500">
            {t("pagination.showing", {
              start: totalItems === 0 ? 0 : startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isFetching && !isLoading && (
            <div className="px-5 py-2 text-[11px] font-mono text-slate-500 flex items-center gap-2 bg-slate-50/50 border-b border-[#E3E7EB]">
              <Loader2 className="w-3 h-3 animate-spin text-[#1769AA]" /> {t("loading")}
            </div>
          )}
          <BeneficiaryTable
            data={paginatedItems}
            isLoading={isLoading}
            type={category}
            profileHref="/social-affairs/elderly-and-disabled/beneficiaries"
          />
          {totalItems > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E7EB]">
              <div className="text-xs font-mono text-slate-500">
                {t("pagination.pageInfo", { page, pages: totalPages })} ({totalItems})
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="text-xs font-mono px-2 text-slate-600">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
