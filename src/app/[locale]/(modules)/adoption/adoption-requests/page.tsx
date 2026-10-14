"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Search, Eye, FileText, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";
import { useAdoptionApplicationsQuery } from "@/hooks/adoption/adoption-requests";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import type { BackendAdoptionApplication } from "@/api/adoption/adoption-requests/getAdoptionApplications";
export type { BackendAdoptionApplication };

export type BackendDocument = {
  publicId: string;
  fieldName: string;
  fileType: string;
  fileName: string;
};

export type BackendApplicantInfo = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  cityIdNumber?: string;
  subCity?: string;
  woreda?: string;
  houseNumber?: string;
  occupation?: string;
  address?: string;
};

export type BackendApplicationInfo = {
  serviceDataId?: number;
  submittedAt?: string;
  status?: string;
  rejectionReason?: string;
  submissionDate?: string;
  applicant?: {
    applicantId?: number;
    fullName?: string;
    nationalId?: string;
    phoneNumber?: string;
    email?: string;
  };
  attachments?: Array<{
    fileName?: string;
    fileUrl?: string;
    url?: string;
    fileType?: string;
  }>;
};

export type BackendReviewInfo = {
  region?: string;
  subCity?: string;
  woreda?: string;
  kebele?: string;
  houseNo?: string;
  createdAt?: string;
  updatedAt?: string;
};

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

const VALID_ADOPTION_TABS = [
  "all",
  "pending",
  "returned",
  "pending_home_visit",
  "pending_approval",
  "matched",
  "denied",
];

const TAB_STORAGE_KEY = "adoption_requests_active_tab";

// Map backend statuses to tab values used in the UI
const mapStatusToTab = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "PENDING_REVIEW":
      return "pending";
    case "PENDING_HOME_VISIT":
      return "pending_home_visit";
    case "PENDING_APPROVAL":
      return "pending_approval";
    case "MATCHED":
      return "matched";
    case "REJECTED":
      return "denied";
    case "RETURNED":
      return "returned";
    default:
      return status?.toLowerCase() || "pending";
  }
};

const AdoptionRequestsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");

  const [tab, setTab] = useState(() => {
    if (queryTab && VALID_ADOPTION_TABS.includes(queryTab)) {
      return queryTab;
    }
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(TAB_STORAGE_KEY);
      if (saved && VALID_ADOPTION_TABS.includes(saved)) {
        return saved;
      }
    }
    return "all";
  });

  const { userSubCity, userWoreda, filterSubCityNames } = useJurisdictionScope();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubCity, setSelectedSubCity] = useState<string>(userSubCity || "ALL");
  const [selectedWoreda, setSelectedWoreda] = useState<string>(userWoreda || "ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const t = useTranslations("adoption");
  const {
    data: applications = [],
    isLoading: loading,
  } = useAdoptionApplicationsQuery("ALL");

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

  // Keep tab in sync if URL query parameter changes
  useEffect(() => {
    if (queryTab && VALID_ADOPTION_TABS.includes(queryTab) && queryTab !== tab) {
      setTab(queryTab);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(TAB_STORAGE_KEY, queryTab);
      }
    }
  }, [queryTab, tab]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TAB_STORAGE_KEY, newTab);
    }
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("tab", newTab);
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  const TABS = [
    { value: "all", label: t("adoptionRequests.allDossiers") || "All Dossiers" },
    { value: "pending", label: t("adoptionRequests.tabs.pending") },
    { value: "returned", label: t("adoptionRequests.tabs.returned") },
    {
      value: "pending_home_visit",
      label: t("adoptionRequests.tabs.pending_home_visit"),
    },
    {
      value: "pending_approval",
      label: t("adoptionRequests.tabs.pending_approval"),
    },
    { value: "matched", label: t("adoptionRequests.tabs.matched") },
    { value: "denied", label: t("adoptionRequests.tabs.denied") },
  ];

  const getStatusBadge = (
    status: string
  ): {
    label: string;
    statusType: "primary" | "navy" | "neutral" | "subtle" | "warning" | "danger" | "success" | "info";
  } => {
    switch ((status || "").toUpperCase()) {
      case "PENDING_REVIEW":
        return {
          label: t("adoptionRequests.statuses.pending_review") || "Awaiting Review",
          statusType: "warning",
        };
      case "PENDING_HOME_VISIT":
        return {
          label: t("adoptionRequests.statuses.pending_home_visit") || "Home Inspection",
          statusType: "primary",
        };
      case "PENDING_APPROVAL":
        return {
          label: t("adoptionRequests.statuses.pending_approval") || "Committee Docket",
          statusType: "navy",
        };
      case "MATCHED":
        return {
          label: t("adoptionRequests.statuses.matched") || "Matched",
          statusType: "primary",
        };
      case "RETURNED":
        return {
          label: t("adoptionRequests.statuses.returned") || "Returned for Correction",
          statusType: "neutral",
        };
      case "REJECTED":
        return {
          label: t("adoptionRequests.statuses.denied") || "Denied",
          statusType: "danger",
        };
      default:
        return {
          label: status || "—",
          statusType: "neutral",
        };
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Count applications per tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: applications.length,
      pending: 0,
      returned: 0,
      pending_home_visit: 0,
      pending_approval: 0,
      matched: 0,
      denied: 0,
    };
    for (const app of applications) {
      const tabKey = mapStatusToTab(app.status);
      if (counts[tabKey] !== undefined) {
        counts[tabKey]++;
      }
    }
    return counts;
  }, [applications]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!userSubCity && selectedSubCity !== "ALL") count++;
    if (!userWoreda && selectedWoreda !== "ALL") count++;
    if (dateFilter !== "ALL") count++;
    return count;
  }, [selectedSubCity, selectedWoreda, dateFilter, userSubCity, userWoreda]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    (!userSubCity && selectedSubCity !== "ALL") ||
    (!userWoreda && selectedWoreda !== "ALL") ||
    dateFilter !== "ALL";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedSubCity(userSubCity || "ALL");
    setSelectedWoreda(userWoreda || "ALL");
    setDateFilter("ALL");
  };

  // Filter applications by UI tab value, search query, location, and date recency
  const filteredApps = (tabValue: string) => {
    const now = new Date().getTime();

    return applications.filter((app) => {
      if (tabValue !== "all") {
        const matchesTab = mapStatusToTab(app.status) === tabValue;
        if (!matchesTab) return false;
      }

      // Location filters
      const appSubCity = (app.reviewInfo?.subCity || app.applicantInfo?.subCity || "").trim().toLowerCase();
      if (selectedSubCity !== "ALL") {
        if (!appSubCity || appSubCity !== selectedSubCity.toLowerCase().trim()) {
          return false;
        }
      }

      const appWoreda = String(app.reviewInfo?.woreda || app.applicantInfo?.woreda || "").trim().toLowerCase();
      if (selectedWoreda !== "ALL") {
        const matchWoreda =
          appWoreda === selectedWoreda.toLowerCase().trim() ||
          appWoreda === `woreda ${selectedWoreda}`.toLowerCase().trim() ||
          appWoreda.includes(selectedWoreda.toLowerCase().trim());
        if (!matchWoreda) return false;
      }

      // Date recency filter
      if (dateFilter !== "ALL") {
        const dateStr =
          app.reviewInfo?.createdAt ||
          app.applicationInfo?.submittedAt ||
          app.applicationInfo?.submissionDate;
        if (!dateStr) return false;
        const filingTime = new Date(dateStr).getTime();
        if (isNaN(filingTime)) return false;

        const diffDays = (now - filingTime) / (1000 * 60 * 60 * 24);
        if (dateFilter === "7D" && diffDays > 7) return false;
        if (dateFilter === "30D" && diffDays > 30) return false;
        if (dateFilter === "90D" && diffDays > 90) return false;
        if (dateFilter === "THIS_YEAR" && diffDays > 365) return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const fullName = `${app.applicantInfo?.firstName ?? ""} ${app.applicantInfo?.lastName ?? ""}`.toLowerCase();
      const phone = (app.applicantInfo?.phoneNumber ?? "").toLowerCase();
      const cityId = (app.applicantInfo?.cityIdNumber ?? "").toLowerCase();
      const appId = String(app.applicationId);
      const subCity = (app.reviewInfo?.subCity ?? "").toLowerCase();
      const woreda = (app.reviewInfo?.woreda ?? "").toLowerCase();
      const address = (app.applicantInfo?.address ?? "").toLowerCase();

      return (
        fullName.includes(q) ||
        phone.includes(q) ||
        cityId.includes(q) ||
        appId.includes(q) ||
        subCity.includes(q) ||
        woreda.includes(q) ||
        address.includes(q)
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-3 sm:p-5 lg:p-6 space-y-4 max-w-7xl mx-auto text-slate-800">
      {/* ── Institutional Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E3E7EB]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-0.5">
            <span>{t("adoptionRequests.headerAdmin1")}</span>
            <span>·</span>
            <span>{t("adoptionRequests.headerAdmin2")}</span>
            <span>·</span>
            <span className="text-[#1769AA] font-semibold">{t("adoptionRequests.headerAdmin3")}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
            {t("adoptionRequests.title")}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("adoptionRequests.subtitle") || "Multi-stage applicant vetting: document intake, home suitability inspection, committee approval, and matching."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder={t("adoptionRequests.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-8 text-xs bg-white border-[#E3E7EB] focus:border-[#1769AA] rounded-xs shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant={showAdvancedFilters || activeFiltersCount > 0 ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 text-xs rounded-xs font-mono transition-colors cursor-pointer shrink-0",
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-[#1769AA] hover:bg-[#125386] text-white border-[#1769AA]"
                : "border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50"
            )}
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
          >
            <SlidersHorizontal className="size-3.5 mr-1.5" />
            <span>{t("adoptionRequests.filters.title")}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* ── Advanced Collapsible Filter Panel ────────────────────────────────── */}
      {showAdvancedFilters && (
        <div className="p-3.5 bg-slate-50/90 rounded-xs border border-[#E3E7EB] space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3E7EB]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-3.5 text-[#1769AA]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F3A]">
                {t("adoptionRequests.filters.title")}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>{t("adoptionRequests.filters.reset")}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sub-City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("adoptionRequests.filters.subCity")}
              </label>
              <Select
                disabled={!!userSubCity}
                value={selectedSubCity}
                onValueChange={(val) => {
                  setSelectedSubCity(val);
                  setSelectedWoreda("ALL");
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-500">
                  <SelectValue placeholder={t("adoptionRequests.filters.allSubCities")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userSubCity && <SelectItem value="ALL">{t("adoptionRequests.filters.allSubCities")}</SelectItem>}
                  {allSubCityNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Woreda Cascading Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("adoptionRequests.filters.woreda")}
              </label>
              <Select
                value={selectedWoreda}
                onValueChange={(val) => setSelectedWoreda(val)}
                disabled={!!userWoreda || selectedSubCity === "ALL"}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-400">
                  <SelectValue
                    placeholder={
                      selectedSubCity === "ALL"
                        ? t("adoptionRequests.filters.selectSubCityFirst")
                        : t("adoptionRequests.filters.allWoredas")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userWoreda && <SelectItem value="ALL">{t("adoptionRequests.filters.allWoredas")}</SelectItem>}
                  {availableWoredas.length > 0 ? (
                    availableWoredas.map((w) => (
                      <SelectItem key={w.id} value={w.code}>
                        {t("adoptionRequests.filters.woreda")} {w.code}
                      </SelectItem>
                    ))
                  ) : (
                    Array.from({ length: 15 }, (_, i) => String(i + 1)).map((num) => (
                      <SelectItem key={num} value={num}>
                        {t("adoptionRequests.filters.woreda")} {num}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date Recency Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {t("adoptionRequests.filters.dateRecency")}
              </label>
              <Select value={dateFilter} onValueChange={(val) => setDateFilter(val)}>
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("adoptionRequests.filters.allTime")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="ALL">{t("adoptionRequests.filters.allTime")}</SelectItem>
                  <SelectItem value="7D">{t("adoptionRequests.filters.last7Days")}</SelectItem>
                  <SelectItem value="30D">{t("adoptionRequests.filters.last30Days")}</SelectItem>
                  <SelectItem value="90D">{t("adoptionRequests.filters.last90Days")}</SelectItem>
                  <SelectItem value="THIS_YEAR">{t("adoptionRequests.filters.thisYear")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Badges ─────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-100/80 px-2.5 py-1.5 rounded-xs border border-slate-200">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {searchQuery && (
            <Badge
              variant="secondary"
              className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
            >
              Search: &quot;{searchQuery}&quot;
              <X
                className="size-3 cursor-pointer hover:text-rose-600"
                onClick={() => setSearchQuery("")}
              />
            </Badge>
          )}
          {selectedSubCity !== "ALL" && !userSubCity && (
            <Badge
              variant="secondary"
              className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
            >
              Sub-City: {selectedSubCity}
              <X
                className="size-3 cursor-pointer hover:text-rose-600"
                onClick={() => {
                  setSelectedSubCity("ALL");
                  setSelectedWoreda("ALL");
                }}
              />
            </Badge>
          )}
          {selectedWoreda !== "ALL" && !userWoreda && (
            <Badge
              variant="secondary"
              className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
            >
              Woreda: {selectedWoreda}
              <X
                className="size-3 cursor-pointer hover:text-rose-600"
                onClick={() => setSelectedWoreda("ALL")}
              />
            </Badge>
          )}
          {dateFilter !== "ALL" && (
            <Badge
              variant="secondary"
              className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
            >
              Filing: {dateFilter}
              <X
                className="size-3 cursor-pointer hover:text-rose-600"
                onClick={() => setDateFilter("ALL")}
              />
            </Badge>
          )}
          <button
            onClick={resetAllFilters}
            className="text-[11px] font-mono text-rose-600 hover:text-rose-700 ml-auto font-semibold cursor-pointer underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ── Quick Pipeline Metric Strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Total Dossiers
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {applications.length}
          </p>
          <span className="text-[10px] text-slate-400">All registered files</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-amber-500">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
            Initial Review
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {tabCounts.pending || 0}
          </p>
          <span className="text-[10px] text-slate-400">Awaiting clearance</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#1769AA]">
          <p className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider font-mono">
            Home Inspection
          </p>
          <p className="text-xl font-bold font-mono text-[#1769AA] mt-0.5">
            {tabCounts.pending_home_visit || 0}
          </p>
          <span className="text-[10px] text-slate-400">Social work visits</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
            Committee Docket
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {tabCounts.pending_approval || 0}
          </p>
          <span className="text-[10px] text-slate-400">Ready for decree</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-emerald-600">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
            Matched Minors
          </p>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
            {tabCounts.matched || 0}
          </p>
          <span className="text-[10px] text-slate-400">Trial placement</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-slate-400">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">
            Returned / Denied
          </p>
          <p className="text-xl font-bold font-mono text-slate-700 mt-0.5">
            {(tabCounts.returned || 0) + (tabCounts.denied || 0)}
          </p>
          <span className="text-[10px] text-slate-400">Action required / closed</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full space-y-3">
        <div className="overflow-x-auto pb-0.5 bg-white border border-[#E3E7EB] rounded-xs p-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            {TABS.map((tItem) => {
              const count = tabCounts[tItem.value] ?? 0;
              const isActive = tab === tItem.value;
              return (
                <button
                  key={tItem.value}
                  type="button"
                  onClick={() => handleTabChange(tItem.value)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-[#E3E7EB]"
                  }`}
                >
                  <span>{tItem.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content rendered as modern List Table */}
        {TABS.map((tabItem) => {
          const list = filteredApps(tabItem.value);
          const isPending = tabItem.value === "pending";

          return (
            <TabsContent
              key={tabItem.value}
              value={tabItem.value}
              className="w-full mt-0"
            >
              <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-2 border-b border-[#E3E7EB] last:border-0"
                      >
                        <Skeleton className="h-6 w-14 rounded-xs" />
                        <Skeleton className="h-6 flex-1 rounded-xs" />
                        <Skeleton className="h-6 w-32 rounded-xs" />
                        <Skeleton className="h-6 w-28 rounded-xs" />
                        <Skeleton className="h-6 w-24 rounded-xs" />
                        <Skeleton className="h-6 w-20 rounded-xs" />
                      </div>
                    ))}
                  </div>
                ) : list.length === 0 ? (
                  <div className="py-16 text-center text-slate-500">
                    <FileText className="size-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-xs text-slate-600">
                      {searchQuery
                        ? "No applications match your search query."
                        : t("adoptionRequests.noApplications") || "No adoption dossiers in this docket."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#F8FAFC] border-b border-[#E3E7EB]">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[90px] font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono">
                            {t("adoptionRequests.table.applicationId") || "App ID"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[200px]">
                            {t("adoptionRequests.table.applicant") || "Applicant Name & ID"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[140px]">
                            {t("adoptionRequests.table.contact") || "Contact"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[140px]">
                            {t("adoptionRequests.table.location") || "Jurisdiction"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[120px]">
                            {t("adoptionRequests.table.submitted") || "Filing Date"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[130px]">
                            {t("adoptionRequests.table.status") || "Vetting Stage"}
                          </TableHead>
                          <TableHead className="text-right font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[100px]">
                            {t("adoptionRequests.table.actions") || "Action"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((app) => {
                          const badge = getStatusBadge(app.status);
                          return (
                            <TableRow
                              key={app.applicationId}
                              className="hover:bg-slate-50/80 transition-colors border-b border-[#E3E7EB]"
                            >
                              <TableCell className="font-mono text-xs font-bold text-[#1769AA]">
                                #{app.applicationId}
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold text-xs text-slate-900">
                                  {app.applicantInfo?.firstName}{" "}
                                  {app.applicantInfo?.lastName}
                                </div>
                                {app.applicantInfo?.cityIdNumber && (
                                  <div className="font-mono text-[10.5px] text-slate-500 mt-0.5">
                                    ID: {app.applicantInfo.cityIdNumber}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-slate-800 font-mono font-medium">
                                  {app.applicantInfo?.phoneNumber || "—"}
                                </div>
                                {app.applicantInfo?.occupation && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {app.applicantInfo.occupation}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-slate-700">
                                  {app.reviewInfo?.subCity ||
                                    app.applicantInfo?.address ||
                                    "—"}
                                </div>
                                {app.reviewInfo?.woreda && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    Woreda {app.reviewInfo.woreda}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-slate-600 font-mono whitespace-nowrap">
                                {formatDate(app.reviewInfo?.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={cn(
                                    uiTokens.statusTag.base,
                                    uiTokens.statusTag[badge.statusType]
                                  )}
                                >
                                  {badge.label}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={`/adoption/adoption-requests/${String(
                                    app.applicationId,
                                  )}?fromTab=${tab}`}
                                >
                                  <Button
                                    size="sm"
                                    className={cn(
                                      "h-6.5 px-2.5 text-xs gap-1 font-semibold rounded-xs cursor-pointer shadow-none",
                                      isPending
                                        ? "bg-[#1769AA] hover:bg-[#12568E] text-white"
                                        : "border border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#1769AA]"
                                    )}
                                  >
                                    <Eye className="size-3" />
                                    <span>
                                      {isPending
                                        ? t("adoptionRequests.actions.review") || "Review"
                                        : t("adoptionRequests.actions.view") || "View"}
                                    </span>
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default function AdoptionRequests() {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <AdoptionRequestsContent />
    </Suspense>
  );
}
