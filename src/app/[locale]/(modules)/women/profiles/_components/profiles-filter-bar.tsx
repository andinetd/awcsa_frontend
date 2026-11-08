"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import NewWomenProfileForm from "./new-women-profile-form";

export const EDUCATION_OPTIONS = [
  "NONE",
  "PRIMARY",
  "SECONDARY",
  "DIPLOMA",
  "BACHELOR",
  "MASTERS",
  "DOCTORATE",
  "OTHER",
] as const;

export const CAREER_OPTIONS = ["EMPLOYED", "SELF_EMPLOYED", "UNEMPLOYED"] as const;

interface ProfilesFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  selectedSubCity: string;
  onSubCityChange: (val: string) => void;
  userSubCity?: string | null;
  allSubCityNames: string[];
  selectedWoreda: string;
  onWoredaChange: (val: string) => void;
  userWoreda?: string | null;
  availableWoredas: Array<{ id: number; code: string }>;
  careerFilter: string;
  onCareerFilterChange: (val: string) => void;
  educationFilter: string;
  onEducationFilterChange: (val: string) => void;
  ageFilter: "ALL" | "YOUTH" | "ADULT" | "SENIOR";
  onAgeFilterChange: (val: "ALL" | "YOUTH" | "ADULT" | "SENIOR") => void;
  approvalFilter: string;
  onApprovalFilterChange: (val: string) => void;
}

export function ProfilesFilterBar({
  search,
  onSearchChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  activeFiltersCount,
  hasActiveFilters,
  onResetFilters,
  selectedSubCity,
  onSubCityChange,
  userSubCity,
  allSubCityNames,
  selectedWoreda,
  onWoredaChange,
  userWoreda,
  availableWoredas,
  careerFilter,
  onCareerFilterChange,
  educationFilter,
  onEducationFilterChange,
  ageFilter,
  onAgeFilterChange,
  approvalFilter,
  onApprovalFilterChange,
}: ProfilesFilterBarProps) {
  const t = useTranslations("women");
  const router = useRouter();

  return (
    <div className="space-y-3">
      {/* Search & Actions Header Row */}
      <div className="flex flex-wrap items-center gap-2.5 w-full">
        <div className="relative flex-1 min-w-[240px] sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="search"
            placeholder={t("womenList.searchPlaceholder")}
            className="pl-8 pr-7 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
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
              ? "bg-[#1769AA] hover:bg-[#12568E] text-white"
              : "border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
          }`}
          onClick={onToggleAdvancedFilters}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
          <span>{t("womenList.filters.toggle")}</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-white text-[#1769AA] font-bold rounded-full text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/women/intake")}
          className="h-8 text-xs rounded-xs font-mono border-[#E3E7EB] text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Intake Form (መላኪያ ቅፅ)</span>
        </Button>

        <div className="ml-auto">
          <NewWomenProfileForm />
        </div>
      </div>

      {/* Advanced Collapsible Filter Panel */}
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
                onClick={onResetFilters}
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
                disabled={!!userSubCity}
                value={selectedSubCity}
                onValueChange={(val) => {
                  onSubCityChange(val);
                  onWoredaChange("ALL");
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white disabled:bg-slate-100 disabled:text-slate-500">
                  <SelectValue placeholder={t("womenList.filters.allSubCities")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  {!userSubCity && (
                    <SelectItem
                      value="ALL"
                      className="text-xs rounded-xs font-semibold"
                    >
                      {t("womenList.filters.allSubCities")}
                    </SelectItem>
                  )}
                  {allSubCityNames.map((sc) => (
                    <SelectItem
                      key={sc}
                      value={sc}
                      className="text-xs rounded-xs"
                    >
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
                disabled={!!userWoreda || selectedSubCity === "ALL"}
                value={selectedWoreda}
                onValueChange={onWoredaChange}
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
                  {!userWoreda && (
                    <SelectItem
                      value="ALL"
                      className="text-xs rounded-xs font-semibold"
                    >
                      {t("womenList.filters.allWoredas")}
                    </SelectItem>
                  )}
                  {availableWoredas.map((w) => (
                    <SelectItem
                      key={w.id}
                      value={w.code}
                      className="text-xs rounded-xs"
                    >
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
                onValueChange={onCareerFilterChange}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue
                    placeholder={t("womenList.filters.allCareerStatuses")}
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem
                    value="ALL"
                    className="text-xs rounded-xs font-semibold"
                  >
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
                onValueChange={onEducationFilterChange}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue
                    placeholder={t("womenList.filters.allEducationLevels")}
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem
                    value="ALL"
                    className="text-xs rounded-xs font-semibold"
                  >
                    {t("womenList.filters.allEducationLevels")}
                  </SelectItem>
                  {EDUCATION_OPTIONS.map((edu) => (
                    <SelectItem
                      key={edu}
                      value={edu}
                      className="text-xs rounded-xs"
                    >
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
                onValueChange={onAgeFilterChange}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue placeholder={t("womenList.filters.allAges")} />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem
                    value="ALL"
                    className="text-xs rounded-xs font-semibold"
                  >
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
                onValueChange={onApprovalFilterChange}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                  <SelectValue
                    placeholder={t("womenList.filters.allApprovals")}
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem
                    value="ALL"
                    className="text-xs rounded-xs font-semibold"
                  >
                    {t("womenList.filters.allApprovals")}
                  </SelectItem>
                  <SelectItem value="APPROVED" className="text-xs rounded-xs">
                    {t("womenList.approvalOptions.APPROVED")}
                  </SelectItem>
                  <SelectItem value="PENDING" className="text-xs rounded-xs">
                    {t("womenList.approvalOptions.PENDING")}
                  </SelectItem>
                  <SelectItem value="REJECTED" className="text-xs rounded-xs">
                    {t("womenList.approvalOptions.REJECTED")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
