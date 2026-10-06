"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useBeneficiarySearch } from "@/hooks/beneficiaries/srs-hooks";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
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
  const openDialog = useBeneficiaryRegisterStore((s) => s.openDialog);

  const [category, setCategory] = useState<BeneficiaryCategory>("DISABLED");
  const [disabledTab, setDisabledTab] = useState<DisabledPresetTab>("ALL");
  const [elderlyTab, setElderlyTab] = useState<ElderlyPresetTab>("ALL");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Location filters
  const [selectedSubCity, setSelectedSubCity] = useState<string>("ALL");
  const [selectedWoreda, setSelectedWoreda] = useState<string>("ALL");

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
    if (sub) {
      setSelectedSubCity(sub);
      setShowAdvancedFilters(true);
    }
  }, []);

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
    return Array.from(new Set([...fromApi, ...DEFAULT_SUBCITY_NAMES]));
  }, [subCitiesData]);

  const currentSubCityObj = useMemo(() => {
    if (selectedSubCity === "ALL" || !selectedSubCity) return null;
    return (subCitiesData || []).find(
      (s) => s.name.toLowerCase().trim() === selectedSubCity.toLowerCase().trim(),
    );
  }, [subCitiesData, selectedSubCity]);

  const availableWoredas = useMemo(() => {
    return currentSubCityObj?.woredas || [];
  }, [currentSubCityObj]);

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
    if (selectedSubCity !== "ALL") count++;
    if (selectedWoreda !== "ALL") count++;
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
    selectedSubCity !== "ALL" ||
    selectedWoreda !== "ALL" ||
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
    setSelectedSubCity("ALL");
    setSelectedWoreda("ALL");
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
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href="/social-affairs/elderly-and-disabled/dashboard"
          className="hover:text-[#1769AA] transition-colors"
        >
          Disability &amp; Elderly
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">
          {category === "DISABLED" ? t("disabled") : t("elderly")} Beneficiaries
        </span>
      </div>

      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>Addis Ababa City Administration</span>
          <span>·</span>
          <span>Women &amp; Social Affairs Bureau</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            Social Rehabilitation &amp; Inclusion
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
                placeholder="Search Fayda, City ID, name, phone..."
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
              <span>Filters</span>
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
            { id: "ALL" as const, label: "All Disabled", count: tabCounts.all },
            {
              id: "SEVERE" as const,
              label: "Severe & Profound",
              count: tabCounts.severe,
              color: "text-rose-700 bg-rose-50",
            },
            {
              id: "ASSISTANCE" as const,
              label: "Assistance / Device Needed",
              count: tabCounts.assistance,
              color: "text-amber-700 bg-amber-50",
            },
            {
              id: "UNEMPLOYED" as const,
              label: "Seeking Work (Unemployed)",
              count: tabCounts.unemployed,
              color: "text-indigo-700 bg-indigo-50",
            },
            {
              id: "ACTIVE" as const,
              label: "Active Beneficiaries",
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
            { id: "ALL" as const, label: "All Elderly", count: tabCounts.all },
            {
              id: "CONFIRMED" as const,
              label: "Support Confirmed",
              count: tabCounts.confirmed,
              color: "text-emerald-700 bg-emerald-50",
            },
            {
              id: "VULNERABLE" as const,
              label: "Living Alone / Widowed",
              count: tabCounts.vulnerable,
              color: "text-amber-700 bg-amber-50",
            },
            {
              id: "OLDEST" as const,
              label: "Oldest-Old (80+)",
              count: tabCounts.oldest,
              color: "text-purple-700 bg-purple-50",
            },
            {
              id: "ACTIVE" as const,
              label: "Active Beneficiaries",
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
                Advanced Vulnerability &amp; Location Filters ({category})
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Sub-City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Sub-City
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
                value={selectedWoreda}
                onValueChange={(val) => {
                  setSelectedWoreda(val);
                  setPage(1);
                }}
                disabled={selectedSubCity === "ALL" || !selectedSubCity}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-400">
                  <SelectValue
                    placeholder={
                      selectedSubCity === "ALL" || !selectedSubCity
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

            {/* Category-specific filters */}
            {category === "DISABLED" ? (
              <>
                {/* Disability Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Disability Type
                  </label>
                  <Select
                    value={disabilityTypeFilter}
                    onValueChange={(val) => {
                      setDisabilityTypeFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        All Disability Types
                      </SelectItem>
                      {DISABILITY_TYPES.map((dt) => (
                        <SelectItem key={dt} value={dt} className="text-xs rounded-xs capitalize">
                          {dt.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Disability Severity */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Severity Grade
                  </label>
                  <Select
                    value={severityFilter}
                    onValueChange={(val) => {
                      setSeverityFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder="All Severities" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        All Severities
                      </SelectItem>
                      {SEVERITY_LEVELS.map((sev) => (
                        <SelectItem key={sev} value={sev} className="text-xs rounded-xs">
                          {sev}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Physical Assistance */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Physical Assistance
                  </label>
                  <Select
                    value={assistanceFilter}
                    onValueChange={(val) => {
                      setAssistanceFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder="All Assistance" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        All Assistance
                      </SelectItem>
                      <SelectItem value="YES" className="text-xs rounded-xs">
                        Requires Assistance / Device
                      </SelectItem>
                      <SelectItem value="NO" className="text-xs rounded-xs">
                        Independent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verification Status */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Medical Verification
                  </label>
                  <Select
                    value={verificationFilter}
                    onValueChange={(val) => {
                      setVerificationFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder="All Verifications" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        All Statuses
                      </SelectItem>
                      <SelectItem value="VERIFIED" className="text-xs rounded-xs">
                        Verified
                      </SelectItem>
                      <SelectItem value="PENDING" className="text-xs rounded-xs">
                        Pending
                      </SelectItem>
                      <SelectItem value="REJECTED" className="text-xs rounded-xs">
                        Rejected
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
                    Age Cohort
                  </label>
                  <Select
                    value={elderlyAgeFilter}
                    onValueChange={(val) => {
                      setElderlyAgeFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder="All Ages" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        All Ages
                      </SelectItem>
                      <SelectItem value="60_69" className="text-xs rounded-xs">
                        Young-Old (60–69)
                      </SelectItem>
                      <SelectItem value="70_79" className="text-xs rounded-xs">
                        Middle-Old (70–79)
                      </SelectItem>
                      <SelectItem value="80_PLUS" className="text-xs rounded-xs">
                        Oldest-Old (80+)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Support Confirmed */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Support Confirmed
                  </label>
                  <Select
                    value={supportConfirmedFilter}
                    onValueChange={(val) => {
                      setSupportConfirmedFilter(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xs border-[#E3E7EB]">
                      <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                        All Records
                      </SelectItem>
                      <SelectItem value="YES" className="text-xs rounded-xs">
                        Confirmed Only
                      </SelectItem>
                      <SelectItem value="NO" className="text-xs rounded-xs">
                        Unconfirmed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Employment Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Employment
              </label>
              <Select
                value={employmentFilter}
                onValueChange={(val) => {
                  setEmploymentFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder="All Employment" />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    All Employment
                  </SelectItem>
                  <SelectItem value="EMPLOYED" className="text-xs rounded-xs">
                    Employed
                  </SelectItem>
                  <SelectItem value="UNEMPLOYED" className="text-xs rounded-xs">
                    Unemployed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sex / Gender */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Gender
              </label>
              <Select
                value={sexFilter}
                onValueChange={(val) => {
                  setSexFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL" className="text-xs rounded-xs font-semibold">
                    All Genders
                  </SelectItem>
                  <SelectItem value="MALE" className="text-xs rounded-xs">
                    Male
                  </SelectItem>
                  <SelectItem value="FEMALE" className="text-xs rounded-xs">
                    Female
                  </SelectItem>
                  <SelectItem value="OTHER" className="text-xs rounded-xs">
                    Other
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
            Results ({filteredItems.length} of {rawItems.length}):
          </span>

          {currentTab !== "ALL" && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] gap-1 pl-2 pr-1 py-0.5"
            >
              <span>Preset: {currentTab}</span>
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
              <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
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
              <span>Sub-City: {selectedSubCity}</span>
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
              <span>Woreda: {selectedWoreda}</span>
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
              <span>Disability: {disabilityTypeFilter}</span>
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
              <span>Severity: {severityFilter}</span>
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
              <span>Assistance: {assistanceFilter}</span>
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
              <span>Age: {elderlyAgeFilter.replace("_", "–")}</span>
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
              <span>Employment: {employmentFilter}</span>
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
              <span>Sex: {sexFilter}</span>
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
            <span>Clear Filters</span>
          </Button>
        )}
      </div>

      {/* ── Directory Table Card ────────────────────────────────────────────── */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#1769AA]" />
            <span>
              {category === "DISABLED" ? "Disabled Beneficiary" : "Elderly Beneficiary"} Registry Records
            </span>
          </CardTitle>
          <span className="text-xs font-mono text-slate-500">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + limit, totalItems)} of {totalItems}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isFetching && !isLoading && (
            <div className="px-5 py-2 text-[11px] font-mono text-slate-500 flex items-center gap-2 bg-slate-50/50 border-b border-[#E3E7EB]">
              <Loader2 className="w-3 h-3 animate-spin text-[#1769AA]" /> Refreshing records...
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
                Page {page} of {totalPages} ({totalItems} total)
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
