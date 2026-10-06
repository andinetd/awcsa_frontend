"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { DataTable } from "@/components/ui/data-table";
import { useChildren } from "@/hooks/adoption/useChildren";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { getColumns } from "./_components/columns";
import { TransferStatusDialog } from "./_components/transfer-status-dialog";
import { Child, ChildStatus } from "@/types/child-matching-types";

const FILTER_TABS: { key: ChildStatus | "ALL"; label: string; icon?: React.ElementType }[] = [
  { key: "ALL", label: "All Children" },
  { key: "IN_CARE", label: "In Care", icon: Building2 },
  { key: "FOUND", label: "Found", icon: Clock },
  { key: "IN_ADERA", label: "In Adera", icon: HeartHandshake },
  { key: "WITH_BLOOD_RELATIVE", label: "Kinship Care", icon: Users },
  { key: "ADOPTED", label: "Adopted", icon: CheckCircle2 },
  { key: "RETURNED", label: "Returned", icon: RotateCcw },
];

const VALID_CHILD_STATUSES: (ChildStatus | "ALL")[] = [
  "ALL",
  "IN_CARE",
  "FOUND",
  "IN_ADERA",
  "WITH_BLOOD_RELATIVE",
  "ADOPTED",
  "RETURNED",
];

function ChildrenPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStatus = searchParams.get("status") as ChildStatus | "ALL" | null;
  const initialStatus =
    urlStatus && VALID_CHILD_STATUSES.includes(urlStatus) ? urlStatus : "ALL";

  const t = useTranslations("adoption");
  const { data: children = [], isLoading, refetch } = useChildren();
  const { data: careCenters = [] } = useGetCareCentersQuery();

  const [selectedStatus, setSelectedStatus] = useState<ChildStatus | "ALL">(initialStatus);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sexFilter, setSexFilter] = useState<string>("ALL");
  const [ageCohortFilter, setAgeCohortFilter] = useState<string>("ALL");
  const [facilityFilter, setFacilityFilter] = useState<string>("ALL");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [transferChild, setTransferChild] = useState<Child | null>(null);

  // Synchronize status state when URL changes
  useEffect(() => {
    if (urlStatus && VALID_CHILD_STATUSES.includes(urlStatus) && urlStatus !== selectedStatus) {
      setSelectedStatus(urlStatus);
    } else if (!urlStatus && selectedStatus !== "ALL") {
      setSelectedStatus("ALL");
    }
  }, [urlStatus, selectedStatus]);

  const handleStatusChange = (status: ChildStatus | "ALL") => {
    setSelectedStatus(status);
    const params = new URLSearchParams(window.location.search);
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (sexFilter !== "ALL") count++;
    if (ageCohortFilter !== "ALL") count++;
    if (facilityFilter !== "ALL") count++;
    if (locationFilter.trim()) count++;
    return count;
  }, [sexFilter, ageCohortFilter, facilityFilter, locationFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedStatus !== "ALL" ||
    sexFilter !== "ALL" ||
    ageCohortFilter !== "ALL" ||
    facilityFilter !== "ALL" ||
    locationFilter.trim().length > 0;

  const resetAllFilters = () => {
    handleSearchChange("");
    setSelectedStatus("ALL");
    setSexFilter("ALL");
    setAgeCohortFilter("ALL");
    setFacilityFilter("ALL");
    setLocationFilter("");
  };

  // Helper to calculate age in years from DOB
  const getChildAge = (child: Child): number | null => {
    const dob =
      child.serviceData?.formData?.dateOfBirth ||
      child.serviceData?.client?.dateOfBirth;
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    const diffMs = Date.now() - birthDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  // Filtered dataset
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      // Status filter
      if (selectedStatus !== "ALL" && child.currentStatus !== selectedStatus) {
        return false;
      }

      // Sex filter
      if (sexFilter !== "ALL") {
        const rawSex = (child.serviceData?.formData?.sex || "").toUpperCase();
        if (rawSex !== sexFilter) return false;
      }

      // Age Cohort filter
      if (ageCohortFilter !== "ALL") {
        const age = getChildAge(child);
        if (age === null) return false;
        if (ageCohortFilter === "INFANT" && age >= 1) return false; // < 1 yr
        if (ageCohortFilter === "TODDLER" && (age < 1 || age > 4)) return false; // 1-4 yrs
        if (ageCohortFilter === "CHILD" && (age < 5 || age > 9)) return false; // 5-9 yrs
        if (ageCohortFilter === "ADOLESCENT" && age < 10) return false; // 10+ yrs
      }

      // Care Facility filter
      if (facilityFilter !== "ALL") {
        const facName = (child.childCareFacility?.name || "").trim().toLowerCase();
        if (facName !== facilityFilter.toLowerCase().trim()) return false;
      }

      // Location / Found Place filter
      if (locationFilter.trim()) {
        const qLoc = locationFilter.trim().toLowerCase();
        const facilitySubCity = (child.childCareFacility?.subCity || "").toLowerCase();
        const facilityWoreda = (child.childCareFacility?.woreda || "").toLowerCase();
        const placeFound = (child.placeWhereChildFound || "").toLowerCase();
        const locMatch =
          facilitySubCity.includes(qLoc) ||
          facilityWoreda.includes(qLoc) ||
          placeFound.includes(qLoc);
        if (!locMatch) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const firstName = (
          child.serviceData?.formData?.firstName ||
          child.serviceData?.client?.firstName ||
          ""
        ).toLowerCase();
        const lastName = (
          child.serviceData?.formData?.lastName ||
          child.serviceData?.client?.lastName ||
          ""
        ).toLowerCase();
        const facilityCode = (child.childIdFromFacility || "").toLowerCase();
        const facilityName = (child.childCareFacility?.name || "").toLowerCase();
        const placeFound = (child.placeWhereChildFound || "").toLowerCase();

        return (
          firstName.includes(q) ||
          lastName.includes(q) ||
          `${firstName} ${lastName}`.includes(q) ||
          facilityCode.includes(q) ||
          facilityName.includes(q) ||
          placeFound.includes(q)
        );
      }

      return true;
    });
  }, [
    children,
    selectedStatus,
    sexFilter,
    ageCohortFilter,
    facilityFilter,
    locationFilter,
    searchQuery,
  ]);

  // Status counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: children.length };
    children.forEach((ch) => {
      const s = ch.currentStatus || "FOUND";
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [children]);

  const columns = useMemo(
    () => getColumns(t, (child) => setTransferChild(child)),
    [t]
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-3 sm:p-5 lg:p-6 space-y-4 max-w-7xl mx-auto text-slate-800">
      {/* ── Institutional Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E3E7EB]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-0.5">
            <span>Addis Ababa City Administration</span>
            <span>·</span>
            <span>Women &amp; Social Affairs Bureau</span>
            <span>·</span>
            <span className="text-[#1769AA] font-semibold">Child Protection &amp; Care</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
            {t("children.list.title") || "Children Records & Welfare Registry"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("children.list.subtitle") ||
              "Institutional intake tracking, facility transfers, kinship tracing, and adoption eligibility."}
          </p>
        </div>
        <Link href="/adoption/children/child-registration/new">
          <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 shadow-2xs text-xs font-semibold rounded-xs h-8 px-3 cursor-pointer">
            <Plus className="size-3.5" />
            {t("children.list.addNew") || "Register New Child"}
          </Button>
        </Link>
      </div>

      {/* ── Quick Metric Scorecards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Total Registry
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {children.length}
          </p>
          <span className="text-[10px] text-slate-400">All recorded minors</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#1769AA]">
          <p className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider font-mono">
            In Care (Eligible)
          </p>
          <p className="text-xl font-bold font-mono text-[#1769AA] mt-0.5">
            {counts["IN_CARE"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Institutional centers</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-amber-500">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
            Found / Intake
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {counts["FOUND"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Under initial tracing</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-slate-400">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            In Adera Custody
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {counts["IN_ADERA"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Temporary shelter</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-blue-400">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            Kinship Care
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {counts["WITH_BLOOD_RELATIVE"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Extended family</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-emerald-600">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
            Decree Adopted
          </p>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
            {counts["ADOPTED"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Finalized decrees</span>
        </div>
      </div>

      {/* ── Filters & Search ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.key] ?? 0;
            const active = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleStatusChange(tab.key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-[#E3E7EB]"
                }`}
              >
                {tab.icon && <tab.icon className="size-3.5" />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                    active
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

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder={
                t("children.list.searchPlaceholder") ||
                "Search by child name, facility code (e.g. FAC-001), or intake location..."
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 text-xs h-8 bg-white border-[#E3E7EB] focus:border-[#1769AA] rounded-xs"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant={showAdvancedFilters || activeFiltersCount > 0 ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs rounded-xs font-mono transition-colors cursor-pointer shrink-0 ${
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-[#1769AA] hover:bg-[#125386] text-white border-[#1769AA]"
                : "border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50"
            }`}
            onClick={() => setShowAdvancedFilters((prev) => !prev)}
          >
            <SlidersHorizontal className="size-3.5 mr-1.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* ── Advanced Collapsible Filter Drawer ── */}
        {showAdvancedFilters && (
          <div className="p-3.5 bg-slate-50/90 rounded-xs border border-[#E3E7EB] space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3E7EB]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-[#1769AA]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F3A]">
                  Pediatric Demographics &amp; Placement Filters
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Biological Sex */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Gender / Sex
                </label>
                <Select value={sexFilter} onValueChange={(val) => setSexFilter(val)}>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xs border-[#E3E7EB]">
                    <SelectItem value="ALL">All Genders</SelectItem>
                    <SelectItem value="MALE">Male Minor</SelectItem>
                    <SelectItem value="FEMALE">Female Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pediatric Age Bracket */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Pediatric Age Bracket
                </label>
                <Select value={ageCohortFilter} onValueChange={(val) => setAgeCohortFilter(val)}>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                    <SelectValue placeholder="All Ages" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xs border-[#E3E7EB]">
                    <SelectItem value="ALL">All Age Cohorts</SelectItem>
                    <SelectItem value="INFANT">Infant (&lt; 1 Year)</SelectItem>
                    <SelectItem value="TODDLER">Toddler (1 – 4 Years)</SelectItem>
                    <SelectItem value="CHILD">Young Child (5 – 9 Years)</SelectItem>
                    <SelectItem value="ADOLESCENT">Adolescent (10+ Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Care Center / Facility */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Care Facility
                </label>
                <Select value={facilityFilter} onValueChange={(val) => setFacilityFilter(val)}>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                    <SelectValue placeholder="All Facilities" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xs border-[#E3E7EB]">
                    <SelectItem value="ALL">All Care Facilities</SelectItem>
                    {careCenters.map((cc: any) => (
                      <SelectItem key={cc.id || cc.name} value={cc.name}>
                        {cc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Placement / Intake Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Jurisdiction / Found Place
                </label>
                <div className="relative">
                  <Input
                    placeholder="Sub-city, woreda, or place..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white pr-7"
                  />
                  {locationFilter && (
                    <button
                      onClick={() => setLocationFilter("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Active Filter Badges ── */}
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
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {selectedStatus !== "ALL" && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Status: {selectedStatus}
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => handleStatusChange("ALL")}
                />
              </Badge>
            )}
            {sexFilter !== "ALL" && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Sex: {sexFilter}
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => setSexFilter("ALL")}
                />
              </Badge>
            )}
            {ageCohortFilter !== "ALL" && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Age: {ageCohortFilter}
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => setAgeCohortFilter("ALL")}
                />
              </Badge>
            )}
            {facilityFilter !== "ALL" && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Facility: {facilityFilter}
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => setFacilityFilter("ALL")}
                />
              </Badge>
            )}
            {locationFilter.trim() && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Location: &quot;{locationFilter}&quot;
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => setLocationFilter("")}
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
      </div>

      {/* ── Table / Content ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">
            {t("children.list.loading") || "Loading registered children..."}
          </div>
        ) : (
          <DataTable columns={columns} data={filteredChildren} />
        )}
      </div>

      {/* ── Status Transfer Modal ────────────────────────────────────────────── */}
      <TransferStatusDialog
        child={transferChild}
        isOpen={Boolean(transferChild)}
        onClose={() => setTransferChild(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default function ChildrenPage() {
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
      <ChildrenPageContent />
    </Suspense>
  );
}
