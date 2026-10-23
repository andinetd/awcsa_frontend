"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAidDistributions,
  getAidDistributionSummary,
  deleteAidDistribution,
  AidDistribution,
} from "@/api/beneficiaries/aid-distribution";
import { DistributionDialog } from "./_components/distribution-dialog";
import { printAidDistributionRoster } from "@/lib/pdf/print-aid-distribution-roster";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Gift,
  Plus,
  Printer,
  Search,
  Users,
  Package,
  DollarSign,
  HeartHandshake,
  MoreVertical,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

type PackageTab = "ALL" | "FOOD" | "CLOTHING" | "CASH" | "INSURANCE";

export default function AidDistributionPage() {
  const queryClient = useQueryClient();
  const { userSubCity, userWoreda } = useJurisdictionScope();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filters state
  const [monthFilter, setMonthFilter] = useState("ጥቅምት 2017");
  const [subCityFilter, setSubCityFilter] = useState(userSubCity || "");
  const [woredaFilter, setWoredaFilter] = useState(userWoreda || "");
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState<PackageTab>("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 25;

  // Fetch distributions
  const {
    data: listResponse,
    isLoading,
  } = useQuery({
    queryKey: [
      "aid-distributions",
      monthFilter,
      subCityFilter,
      woredaFilter,
      searchFilter,
      page,
    ],
    queryFn: () =>
      listAidDistributions({
        distributionMonth: monthFilter || undefined,
        subCity: subCityFilter || undefined,
        woreda: woredaFilter || undefined,
        search: searchFilter || undefined,
        page,
        limit,
      }),
  });

  // Fetch summary
  const { data: summary } = useQuery({
    queryKey: [
      "aid-distribution-summary",
      monthFilter,
      subCityFilter,
      woredaFilter,
    ],
    queryFn: () =>
      getAidDistributionSummary({
        distributionMonth: monthFilter || undefined,
        subCity: subCityFilter || undefined,
        woreda: woredaFilter || undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAidDistribution(id),
    onSuccess: () => {
      toast.success("የስርጭት መረጃው ተሰርዟል (Record deleted)");
      queryClient.invalidateQueries({ queryKey: ["aid-distributions"] });
      queryClient.invalidateQueries({ queryKey: ["aid-distribution-summary"] });
    },
    onError: () => {
      toast.error("መረጃውን መሰረዝ አልተቻለም (Failed to delete record)");
    },
  });

  const handlePrintRoster = () => {
    if (!listResponse?.data || listResponse.data.length === 0) {
      toast.error("ለማተም የሚያስችል የስርጭት መረጃ አልተገኘም (No distribution records found to print)");
      return;
    }

    printAidDistributionRoster({
      distributions: listResponse.data,
      subCity: subCityFilter || "ለሚ ኩራ",
      distributionMonth: monthFilter,
      woreda: woredaFilter,
    });
  };

  const rawDistributions = listResponse?.data || [];

  // Filter tab counts
  const tabCounts = useMemo(() => {
    return {
      all: rawDistributions.length,
      food: rawDistributions.filter(
        (d) => (d.oilLiters && d.oilLiters > 0) || (d.flourKg && d.flourKg > 0)
      ).length,
      clothing: rawDistributions.filter((d) => d.clothingSupport).length,
      cash: rawDistributions.filter((d) => d.cashAmount && d.cashAmount > 0).length,
      insurance: rawDistributions.filter((d) => d.healthInsuranceSponsorship).length,
    };
  }, [rawDistributions]);

  // Tab filtered items
  const filteredDistributions = useMemo(() => {
    if (activeTab === "FOOD") {
      return rawDistributions.filter(
        (d) => (d.oilLiters && d.oilLiters > 0) || (d.flourKg && d.flourKg > 0)
      );
    }
    if (activeTab === "CLOTHING") {
      return rawDistributions.filter((d) => d.clothingSupport);
    }
    if (activeTab === "CASH") {
      return rawDistributions.filter((d) => d.cashAmount && d.cashAmount > 0);
    }
    if (activeTab === "INSURANCE") {
      return rawDistributions.filter((d) => d.healthInsuranceSponsorship);
    }
    return rawDistributions;
  }, [rawDistributions, activeTab]);

  const totalPages = listResponse?.totalPages || 1;

  const resetFilters = () => {
    setMonthFilter("");
    if (!userSubCity) setSubCityFilter("");
    if (!userWoreda) setWoredaFilter("");
    setSearchFilter("");
    setActiveTab("ALL");
    setPage(1);
  };

  const activeFiltersCount =
    (monthFilter ? 1 : 0) +
    (subCityFilter && subCityFilter !== userSubCity ? 1 : 0) +
    (woredaFilter && woredaFilter !== userWoreda ? 1 : 0) +
    (searchFilter ? 1 : 0) +
    (activeTab !== "ALL" ? 1 : 0);

  return (
    <div className="space-y-4 max-w-7xl mx-auto w-full p-4 md:p-6">
      {/* ── Municipal Breadcrumbs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link
          href="/"
          className="hover:text-[#1769AA] flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>መነሻ (Home)</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href="/social-affairs/elderly-and-disabled/dashboard"
          className="hover:text-[#1769AA] transition-colors"
        >
          አካል ጉዳተኞችና አረጋውያን (Disability & Elderly)
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">የቤተሰብ ድጋፍና ተሃድሶ ስርጭት</span>
      </div>

      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 font-mono">
          <span>የአዲስ አበባ ከተማ አስተዳደር</span>
          <span>·</span>
          <span>የሴቶች፣ ህጻናትና ማህበራዊ ጉዳይ ቢሮ</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            የአካል ጉዳተኞች፣ የአረጋውያን እና ቤተሰብ ጉዳይ ማስተባበርያ
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
              የቤተሰብ ድጋፍና ተሃድሶ ስርጭት ጥቅል መረጃ
            </h1>
            <p className="text-xs text-slate-500">
              ለችግር ተጋላጭ የሆኑና የስነልቦና፣ የማህበራዊ እና ሌሎች የተሃድሶ አገልግሎቶች ተጠቃሚ ቤተሰቦች የወር ጥቅል መረጃ መዝገብ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrintRoster}
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>የወር ጥቅል ሪፖርት አትም (Print Roster)</span>
            </Button>

            <Button
              className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5 cursor-pointer"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አዲስ ስርጭት መዝግብ</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Institutional KPI Cards Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Supported Families */}
        <Card className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xs bg-[#1769AA]/10 text-[#1769AA]">
                <Users className="size-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono border bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]">
                CENSUS / ቆጠራ
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0B1F3A]">
                {summary?.totalRecords?.toLocaleString() ?? 0}
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                ተጠቃሚ ቤተሰቦች (Families Supported)
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>በተመረጠው ወር የተደገፉ አባወራዎች</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Beneficiary Demography */}
        <Card className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xs bg-purple-500/10 text-purple-600">
                <HeartHandshake className="size-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono border bg-purple-50 text-purple-700 border-purple-200">
                DEMOGRAPHY
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0B1F3A]">
                {summary?.totalFamilyMembers?.toLocaleString() ?? 0}
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                የቤተሰብ አባላት (Total Members)
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>
                ወንድ: <strong className="text-[#0B1F3A]">{summary?.totalFamilyMale ?? 0}</strong> · ሴት:{" "}
                <strong className="text-[#0B1F3A]">{summary?.totalFamilyFemale ?? 0}</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Food Aid Packages */}
        <Card className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xs bg-emerald-500/10 text-emerald-600">
                <Package className="size-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono border bg-emerald-50 text-emerald-700 border-emerald-200">
                COMMODITIES
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0B1F3A]">
                {summary?.totalOilLiters ? `${summary.totalOilLiters} L` : "0 L"}
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                የምግብ ጥቅል ድጋፍ (Cooking Oil & Grain)
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>
                ዱቄት: {summary?.totalFlourKg ?? 0} ኪ · ሽንኩርት: {summary?.totalOnionsKg ?? 0} ኪ
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Converted ETB Valuation */}
        <Card className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between h-full">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xs bg-amber-500/10 text-amber-600">
                <DollarSign className="size-4" />
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono border bg-amber-50 text-amber-700 border-amber-200">
                VALUATION / ግምት
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono tracking-tight text-[#0B1F3A]">
                {(summary?.totalCashEquivalent ?? 0).toLocaleString()}{" "}
                <span className="text-sm font-normal text-slate-500">ETB</span>
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                ወደ ገንዘብ ሲቀየር (Total Value)
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>
                የጥሬ ገንዘብ ድጋፍ: {(summary?.totalCashAmount ?? 0).toLocaleString()} ብር
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Workflow Preset Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3E7EB]">
        {[
          { id: "ALL" as const, label: "ሁሉም ስርጭት (All)", count: tabCounts.all },
          {
            id: "FOOD" as const,
            label: "የምግብ ጥቅል (Food Package)",
            count: tabCounts.food,
            color: "text-emerald-700 bg-emerald-50",
          },
          {
            id: "CLOTHING" as const,
            label: "አልባሳት (Clothing)",
            count: tabCounts.clothing,
            color: "text-blue-700 bg-blue-50",
          },
          {
            id: "CASH" as const,
            label: "የጥሬ ገንዘብ (Cash)",
            count: tabCounts.cash,
            color: "text-amber-700 bg-amber-50",
          },
          {
            id: "INSURANCE" as const,
            label: "ጤና መድን (Insurance)",
            count: tabCounts.insurance,
            color: "text-purple-700 bg-purple-50",
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
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
        })}
      </div>

      {/* ── Search & Filter Panel ──────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-3 rounded-xs shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="በተጠቃሚ ስም / ስልክ / ፋይዳ..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Month Filter */}
            <div className="w-full sm:w-44">
              <Input
                placeholder="የስርጭት ወር..."
                value={monthFilter}
                onChange={(e) => {
                  setMonthFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono"
              />
            </div>

            {/* Sub-City Filter */}
            <div className="w-full sm:w-36">
              <Input
                placeholder="ክፍለ ከተማ..."
                disabled={!!userSubCity}
                value={subCityFilter}
                onChange={(e) => {
                  setSubCityFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            {/* Woreda Filter */}
            <div className="w-full sm:w-32">
              <Input
                placeholder="ወረዳ..."
                disabled={!!userWoreda}
                value={woredaFilter}
                onChange={(e) => {
                  setWoredaFilter(e.target.value);
                  setPage(1);
                }}
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs disabled:bg-slate-100 disabled:text-slate-500 font-mono"
              />
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-600 hover:bg-slate-50 gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>አጽዳ</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Municipal Data Table ────────────────────────────────────────────── */}
      <div className="border border-[#E3E7EB] rounded-xs bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
              <TableRow>
                <TableHead className="w-12 text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  ተ.ቁ
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                  የተጠቃሚው/ዋ ሙሉ ስም
                </TableHead>
                <TableHead className="text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  ፆታ
                </TableHead>
                <TableHead className="text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  እድሜ
                </TableHead>
                <TableHead className="text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  ወረዳ
                </TableHead>
                <TableHead className="text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  የቤተሰብ ብዛት
                  <span className="block text-[9.5px] font-normal text-slate-400 lowercase">
                    (ወንድ / ሴት / ድምር)
                  </span>
                </TableHead>
                <TableHead className="font-mono text-[11px] font-bold uppercase text-slate-600">
                  የድጋፉ ዓይነት (Package Items)
                </TableHead>
                <TableHead className="text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  ስልክ ቁጥር
                </TableHead>
                <TableHead className="text-right font-mono text-[11px] font-bold uppercase text-slate-600">
                  ወደ ገንዘብ ሲቀየር
                </TableHead>
                <TableHead className="text-center font-mono text-[11px] font-bold uppercase text-slate-600">
                  ፊርማ
                </TableHead>
                <TableHead className="w-10 text-center font-mono text-[11px] font-bold uppercase text-slate-600"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-44 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#1769AA]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-2 block">
                      መረጃ በመጫን ላይ ነው...
                    </span>
                  </TableCell>
                </TableRow>
              ) : filteredDistributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-40 text-center p-6">
                    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                      ምንም የተመዘገበ የድጋፍ ስርጭት መረጃ አልተገኘም
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      No matching aid distribution records found for this period.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDistributions.map((item, index) => {
                  const fullName = item.client
                    ? `${item.client.firstName} ${item.client.lastName} ${item.client.grandfatherName || ""}`.trim()
                    : "—";
                  const sexLabel =
                    item.client?.sex === "FEMALE" ? "ሴት" : item.client?.sex === "MALE" ? "ወንድ" : "—";

                  return (
                    <TableRow
                      key={item.id}
                      className="border-b border-[#E3E7EB] hover:bg-slate-50/80 transition-colors"
                    >
                      <TableCell className="text-center text-xs font-mono text-slate-500">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-[#0B1F3A]">
                        <div>{fullName}</div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="capitalize">
                            {item.client?.clientCategory === "DISABILITY" ? "አካል ጉዳተኛ" : "አረጋዊ"}
                          </span>
                          {item.client?.faydaId && (
                            <>
                              <span>·</span>
                              <span className="bg-slate-50 px-1 py-0.2 rounded-xs border border-slate-200">
                                {item.client.faydaId}
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs text-slate-600">
                        {sexLabel}
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono text-slate-600">
                        {item.client?.age ?? "—"}
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono text-slate-600">
                        {item.woreda || item.client?.woreda || "—"}
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono">
                        <span className="text-blue-700 font-bold">{item.familyMaleCount}</span>
                        <span className="text-slate-300"> / </span>
                        <span className="text-purple-700 font-bold">{item.familyFemaleCount}</span>
                        <span className="text-slate-300"> / </span>
                        <span className="font-bold text-[#0B1F3A] bg-slate-100 px-1.5 py-0.5 rounded-xs border border-slate-200">
                          {item.familyTotalCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.oilLiters > 0 && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider border bg-amber-50 text-amber-800 border-amber-200">
                              ዘይት {item.oilLiters}L
                            </span>
                          )}
                          {item.flourKg > 0 && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider border bg-slate-50 text-slate-800 border-slate-200">
                              ዱቄት {item.flourKg}Kg
                            </span>
                          )}
                          {item.onionsKg > 0 && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider border bg-red-50 text-red-800 border-red-200">
                              ሽንኩርት {item.onionsKg}Kg
                            </span>
                          )}
                          {item.clothingSupport && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider border bg-blue-50 text-blue-800 border-blue-200">
                              አልባሳት
                            </span>
                          )}
                          {item.cashAmount > 0 && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200">
                              ጥሬ ገንዘብ: {item.cashAmount.toLocaleString()} ብር
                            </span>
                          )}
                          {item.healthInsuranceSponsorship && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider border bg-purple-50 text-purple-800 border-purple-200">
                              ጤና መድን
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono text-slate-600">
                        {item.client?.phoneNumber || "—"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-bold text-[#0B1F3A]">
                        {item.totalCashEquivalent
                          ? `${item.totalCashEquivalent.toLocaleString()} ETB`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {item.signatureTaken ? (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                            የተፈረመ ✓
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">
                            ያልተፈረመ
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-slate-600 rounded-xs"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xs border-[#E3E7EB]">
                            <DropdownMenuItem
                              onClick={() => {
                                if (
                                  confirm(
                                    "እርግጠኛ ነዎት ይህንን የስርጭት መረጃ መሰረዝ ይፈልጋሉ? (Are you sure you want to delete this record?)"
                                  )
                                ) {
                                  deleteMutation.mutate(item.id);
                                }
                              }}
                              className="text-rose-600 text-xs flex items-center gap-2 cursor-pointer font-mono"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>መረጃውን ሰርዝ (Delete)</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination Footer ──────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-[#E3E7EB] bg-slate-50/50 text-xs text-slate-500 font-mono">
            <div>
              ገጽ <strong className="text-[#0B1F3A]">{page}</strong> ከ{" "}
              <strong className="text-[#0B1F3A]">{totalPages}</strong> (ጠቅላላ{" "}
              {listResponse?.total ?? 0} መዝገቦች)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 px-2.5 rounded-xs border-[#E3E7EB] bg-white hover:bg-slate-50 font-mono text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                <span>ቀዳሚ</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 px-2.5 rounded-xs border-[#E3E7EB] bg-white hover:bg-slate-50 font-mono text-xs"
              >
                <span>ቀጣይ</span>
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Registration Dialog ────────────────────────────────────────────── */}
      <DistributionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultMonth={monthFilter}
        defaultSubCity={subCityFilter || "ለሚ ኩራ"}
        defaultWoreda={woredaFilter}
      />
    </div>
  );
}
