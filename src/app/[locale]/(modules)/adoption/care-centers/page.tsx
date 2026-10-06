"use client";

import React, { useMemo, useState } from "react";
import NewCareCenterForm from "./_components/new-care-center-form";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { useGetSubCitiesQuery } from "@/hooks/social-affairs";
import CareCenterCard from "./_components/care-center-card";
import CareCenterDetailsDialog from "./_components/care-center-details-dialog";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import { useTranslations } from "next-intl";
import { Building2, Landmark, HeartHandshake, Search, ShieldCheck, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const CareCenters = () => {
  const t = useTranslations("adoption");
  const { data: rawCareCenters = [], isLoading, isError } = useGetCareCentersQuery();
  const careCenters = (rawCareCenters || []) as NewCareCenterSchemaType[];
  const { data: subCitiesData } = useGetSubCitiesQuery();

  const [selectedCenter, setSelectedCenter] =
    useState<NewCareCenterSchemaType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "GOVERNMENT" | "NGO">("ALL");
  const [selectedSubCity, setSelectedSubCity] = useState<string>("ALL");

  const handleViewDetails = (center: NewCareCenterSchemaType) => {
    setSelectedCenter(center);
    setIsDialogOpen(true);
  };

  const allSubCityNames = useMemo(() => {
    const fromApi = (subCitiesData || []).map((s) => s.name);
    return Array.from(new Set([...fromApi, ...DEFAULT_SUBCITY_NAMES]));
  }, [subCitiesData]);

  const totalCenters = careCenters.length;
  const govCenters = careCenters.filter((c) => (c.type || "").toUpperCase() === "GOVERNMENT").length;
  const ngoCenters = careCenters.filter((c) => (c.type || "").toUpperCase() !== "GOVERNMENT").length;

  const subCitiesCount = useMemo(() => {
    const set = new Set(careCenters.map((c) => c.subCity).filter(Boolean));
    return set.size || 11;
  }, [careCenters]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedType !== "ALL" ||
    selectedSubCity !== "ALL";

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedSubCity("ALL");
  };

  const filteredCenters = useMemo(() => {
    return careCenters.filter((center) => {
      // Type filter
      if (selectedType === "GOVERNMENT") {
        if ((center.type || "").toUpperCase() !== "GOVERNMENT") return false;
      } else if (selectedType === "NGO") {
        if ((center.type || "").toUpperCase() === "GOVERNMENT") return false;
      }

      // Sub-city filter
      if (selectedSubCity !== "ALL") {
        const sc = (center.subCity || "").toLowerCase().trim();
        if (sc !== selectedSubCity.toLowerCase().trim()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (center.name || "").toLowerCase();
        const subCity = (center.subCity || "").toLowerCase();
        const woreda = (center.woreda || "").toLowerCase();
        const phone = (center.phone || "").toLowerCase();
        return (
          name.includes(q) ||
          subCity.includes(q) ||
          woreda.includes(q) ||
          phone.includes(q)
        );
      }

      return true;
    });
  }, [careCenters, selectedType, selectedSubCity, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 bg-[#F7F8FA]">
        <div className="size-6 animate-spin rounded-full border-2 border-[#1769AA] border-t-transparent" />
        <p className="text-xs font-semibold text-slate-600">
          {t("careCenters.loading") || "Loading accredited care facilities..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xs max-w-xl mx-auto my-12">
        {t("careCenters.error") || "Error retrieving care centers. Please check connection."}
      </div>
    );
  }

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
            <span className="text-[#1769AA] font-semibold">Institutional Care Directory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
            {t("careCenters.title") || "Accredited Child Care Centers & Shelters"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervision, capacity allocation, regulatory compliance, and resident minor records across all sub-cities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NewCareCenterForm />
        </div>
      </div>

      {/* ── Metric Scorecard Strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Total Accredited Centers
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {totalCenters}
          </p>
          <span className="text-[10px] text-slate-400">Supervised facilities</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#1769AA]">
          <p className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider font-mono">
            Government Facilities
          </p>
          <p className="text-xl font-bold font-mono text-[#1769AA] mt-0.5">
            {govCenters}
          </p>
          <span className="text-[10px] text-slate-400">Direct municipal administration</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-slate-400">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            NGO &amp; Community Centers
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {ngoCenters}
          </p>
          <span className="text-[10px] text-slate-400">Licensed non-governmental partners</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-emerald-600">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
            Sub-City Jurisdictions
          </p>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
            {subCitiesCount}
          </p>
          <span className="text-[10px] text-slate-400">Municipal operational spread</span>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs space-y-3">
        {/* Facility Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {[
            { key: "ALL" as const, label: "All Facilities", count: totalCenters, icon: Building2 },
            { key: "GOVERNMENT" as const, label: "Government Run", count: govCenters, icon: Landmark },
            { key: "NGO" as const, label: "NGO & Private", count: ngoCenters, icon: HeartHandshake },
          ].map((tab) => {
            const active = selectedType === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedType(tab.key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-[#E3E7EB]"
                }`}
              >
                <tab.icon className="size-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Location Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="relative sm:col-span-2">
            <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search facility by name, sub-city, woreda, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8 bg-white border-[#E3E7EB] focus:border-[#1769AA] rounded-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div>
            <Select value={selectedSubCity} onValueChange={(val) => setSelectedSubCity(val)}>
              <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                <SelectValue placeholder="All Sub-Cities" />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB]">
                <SelectItem value="ALL">All Sub-Cities</SelectItem>
                {allSubCityNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filter Badges */}
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
            {selectedType !== "ALL" && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Type: {selectedType === "GOVERNMENT" ? "Government Run" : "NGO & Private"}
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => setSelectedType("ALL")}
                />
              </Badge>
            )}
            {selectedSubCity !== "ALL" && (
              <Badge
                variant="secondary"
                className="rounded-xs text-[11px] font-mono gap-1 bg-white border border-[#BCD5EA] text-[#1769AA]"
              >
                Sub-City: {selectedSubCity}
                <X
                  className="size-3 cursor-pointer hover:text-rose-600"
                  onClick={() => setSelectedSubCity("ALL")}
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

      {/* ── Care Centers Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCenters.map((center: NewCareCenterSchemaType, index: number) => (
          <CareCenterCard
            key={index}
            careCenter={center}
            onViewDetails={handleViewDetails}
          />
        ))}

        {filteredCenters.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-14 bg-white border border-[#E3E7EB] rounded-xs">
            <Building2 className="size-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              {searchQuery
                ? "No care facilities match your search query."
                : t("careCenters.noCareCenters") || "No accredited care centers registered yet."}
            </p>
          </div>
        )}
      </div>

      {/* ── Details Dialog ──────────────────────────────────────────────────── */}
      <CareCenterDetailsDialog
        careCenter={selectedCenter}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default CareCenters;
