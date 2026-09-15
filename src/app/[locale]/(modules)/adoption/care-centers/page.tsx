"use client";

import React, { useMemo, useState } from "react";
import NewCareCenterForm from "./_components/new-care-center-form";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import CareCenterCard from "./_components/care-center-card";
import CareCenterDetailsDialog from "./_components/care-center-details-dialog";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";
import { useTranslations } from "next-intl";
import { Building2, Search, ShieldCheck, Users, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const CareCenters = () => {
  const t = useTranslations("adoption");
  const { data: rawCareCenters = [], isLoading, isError } = useGetCareCentersQuery();
  const careCenters = (rawCareCenters || []) as NewCareCenterSchemaType[];
  const [selectedCenter, setSelectedCenter] =
    useState<NewCareCenterSchemaType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (center: NewCareCenterSchemaType) => {
    setSelectedCenter(center);
    setIsDialogOpen(true);
  };

  const totalCenters = careCenters.length;
  const govCenters = careCenters.filter((c) => c.type === "GOVERNMENT").length;
  const ngoCenters = careCenters.filter((c) => c.type !== "GOVERNMENT").length;
  const subCitiesCount = useMemo(() => {
    const set = new Set(careCenters.map((c) => c.subCity).filter(Boolean));
    return set.size || 11;
  }, [careCenters]);

  const filteredCenters = useMemo(() => {
    if (!searchQuery.trim()) return careCenters;
    const q = searchQuery.toLowerCase().trim();
    return careCenters.filter((center) => {
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
    });
  }, [careCenters, searchQuery]);

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

      {/* ── Search Toolbar ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs">
        <div className="relative">
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
