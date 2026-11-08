"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import EditWomenProfileForm from "./_components/edit-women-profile-form";
import StatusToggleDialog from "./_components/status-toggle-dialog";
import { WomenProfile } from "@/api/womens/women-profile";
import { useTranslations } from "next-intl";
import {
  ProfilesStatsBar,
  PresetTab,
  TabCounts,
} from "./_components/profiles-stats-bar";
import { ProfilesFilterBar } from "./_components/profiles-filter-bar";
import { ProfilesTable } from "./_components/profiles-table";
import WomenInstitutionalBanner from "../_components/women-institutional-banner";

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

export default function ProfilesPage() {
  const { userSubCity, userWoreda, filterSubCityNames } =
    useJurisdictionScope();
  const { data: profiles, isLoading, isError } = useGetWomenProfilesQuery();
  const { data: subCitiesData } = useGetSubCitiesQuery();
  const t = useTranslations("women");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Workflow tab & advanced filter states
  const [presetTab, setPresetTab] = useState<PresetTab>("ALL");
  const [selectedSubCity, setSelectedSubCity] = useState<string>(
    userSubCity || "ALL",
  );
  const [selectedWoreda, setSelectedWoreda] = useState<string>(
    userWoreda || "ALL",
  );
  const [educationFilter, setEducationFilter] = useState<string>("ALL");
  const [careerFilter, setCareerFilter] = useState<string>("ALL");
  const [approvalFilter, setApprovalFilter] = useState<string>("ALL");
  const [ageFilter, setAgeFilter] = useState<
    "ALL" | "YOUTH" | "ADULT" | "SENIOR"
  >("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);

  const [editingProfile, setEditingProfile] = useState<WomenProfile | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusProfile, setStatusProfile] = useState<WomenProfile | null>(
    null,
  );
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    if (userSubCity) {
      setSelectedSubCity(userSubCity);
    }
    if (userWoreda) {
      setSelectedWoreda(userWoreda);
    }
  }, [userSubCity, userWoreda]);

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
    if (selectedSubCity === "ALL") return null;
    return (subCitiesData || []).find(
      (s) =>
        s.name.toLowerCase().trim() === selectedSubCity.toLowerCase().trim(),
    );
  }, [subCitiesData, selectedSubCity]);

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

  const getAgeNumber = (profile: WomenProfile): number | null => {
    if (profile.client.age) return profile.client.age;
    if (profile.client.dateOfBirth) {
      const diff =
        Date.now() - new Date(profile.client.dateOfBirth).getTime();
      const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      if (!isNaN(age) && age > 0) return age;
    }
    return null;
  };

  // Real-time tab counts
  const tabCounts: TabCounts = useMemo(() => {
    const list = profiles || [];
    return {
      all: list.length,
      unemployed: list.filter(
        (p: WomenProfile) =>
          (
            p.careerStatus ||
            p.client.careerStatus ||
            ""
          ).toUpperCase() === "UNEMPLOYED",
      ).length,
      employed: list.filter((p: WomenProfile) => {
        const s = (
          p.careerStatus ||
          p.client.careerStatus ||
          ""
        ).toUpperCase();
        return s === "EMPLOYED" || s === "SELF_EMPLOYED";
      }).length,
      pending: list.filter(
        (p: WomenProfile) => p.approvalStatus === "PENDING",
      ).length,
      active: list.filter((p: WomenProfile) => p.isActive).length,
      supported: list.filter(
        (p: WomenProfile) =>
          (p.client?.SupportRecord?.length || 0) > 0 ||
          (p.technologySupport?.length || 0) > 0,
      ).length,
      trained: list.filter(
        (p: WomenProfile) => (p.trainings?.length || 0) > 0,
      ).length,
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
          p.client.faydaId,
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
      if (
        presetTab === "SUPPORTED" &&
        (p.client?.SupportRecord?.length || 0) === 0 &&
        (p.technologySupport?.length || 0) === 0
      ) {
        return false;
      }
      if (presetTab === "TRAINED" && (p.trainings?.length || 0) === 0) {
        return false;
      }

      // 3. Sub-City Filter
      if (selectedSubCity !== "ALL") {
        const pSubCity = (p.client.subCity || "").toLowerCase().trim();
        const fSubCity = selectedSubCity.toLowerCase().trim();
        if (pSubCity !== fSubCity) return false;
      }

      // 4. Woreda Filter
      if (selectedWoreda !== "ALL") {
        const pWoreda = (p.client.woreda || "").toString().trim();
        const fWoreda = selectedWoreda.toString().trim();
        if (pWoreda !== fWoreda) return false;
      }

      // 5. Education Filter
      if (educationFilter !== "ALL") {
        if (
          (p.educationLevel || "").toUpperCase() !==
          educationFilter.toUpperCase()
        ) {
          return false;
        }
      }

      // 6. Career Filter
      if (careerFilter !== "ALL") {
        if (careerStatusUpper !== careerFilter.toUpperCase()) {
          return false;
        }
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
    (!userSubCity && selectedSubCity !== "ALL") ||
    (!userWoreda && selectedWoreda !== "ALL") ||
    educationFilter !== "ALL" ||
    careerFilter !== "ALL" ||
    approvalFilter !== "ALL" ||
    ageFilter !== "ALL" ||
    activeStatusFilter !== "ALL";

  const resetAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPresetTab("ALL");
    setSelectedSubCity(userSubCity || "ALL");
    setSelectedWoreda(userWoreda || "ALL");
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
  const currentProfiles = filteredProfiles.slice(
    startIndex,
    startIndex + limit,
  );

  const handleEdit = (profile: WomenProfile) => {
    setEditingProfile(profile);
    setEditDialogOpen(true);
  };

  const handleStatusToggle = (profile: WomenProfile) => {
    setStatusProfile(profile);
    setStatusDialogOpen(true);
  };

  if (isError) {
    return <div className="p-8 text-red-500">{t("womenList.error")}</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-3">
        <WomenInstitutionalBanner />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              {t("womenList.title")}
            </h1>
            <p className="text-xs text-slate-500">{t("womenList.subtitle")}</p>
          </div>
        </div>

        <ProfilesFilterBar
          search={search}
          onSearchChange={setSearch}
          showAdvancedFilters={showAdvancedFilters}
          onToggleAdvancedFilters={() =>
            setShowAdvancedFilters((prev) => !prev)
          }
          activeFiltersCount={activeFiltersCount}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetAllFilters}
          selectedSubCity={selectedSubCity}
          onSubCityChange={(sc) => {
            setSelectedSubCity(sc);
            setPage(1);
          }}
          userSubCity={userSubCity}
          allSubCityNames={allSubCityNames}
          selectedWoreda={selectedWoreda}
          onWoredaChange={(w) => {
            setSelectedWoreda(w);
            setPage(1);
          }}
          userWoreda={userWoreda}
          availableWoredas={availableWoredas}
          careerFilter={careerFilter}
          onCareerFilterChange={(c) => {
            setCareerFilter(c);
            setPage(1);
          }}
          educationFilter={educationFilter}
          onEducationFilterChange={(e) => {
            setEducationFilter(e);
            setPage(1);
          }}
          ageFilter={ageFilter}
          onAgeFilterChange={(a) => {
            setAgeFilter(a);
            setPage(1);
          }}
          approvalFilter={approvalFilter}
          onApprovalFilterChange={(ap) => {
            setApprovalFilter(ap);
            setPage(1);
          }}
        />
      </div>

      {/* ── Workflow Preset Tabs ────────────────────────────────────────────── */}
      <ProfilesStatsBar
        presetTab={presetTab}
        onTabChange={(tab) => {
          setPresetTab(tab);
          setPage(1);
        }}
        tabCounts={tabCounts}
      />

      {/* ── Profiles Table & Pagination ────────────────────────────────────── */}
      <ProfilesTable
        currentProfiles={currentProfiles}
        isLoading={isLoading}
        totalItems={totalItems}
        startIndex={startIndex}
        limit={limit}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onStatusToggle={handleStatusToggle}
      />

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