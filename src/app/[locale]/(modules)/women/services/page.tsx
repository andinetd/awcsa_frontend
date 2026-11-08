"use client";

import React from "react";
import RegisterSupportForm from "./_components/register-support-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import WomanSelect from "./_components/woman-select";
import SupportHistoryTable from "./_components/support-history-table";
import { useGetClientHistoryQuery, useGetSupportRecordsQuery } from "@/hooks/support";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, HandHeart, X, RotateCcw, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import QuickRegistrationForm from "./_components/quick-registration-form";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isWithinDateRange } from "@/utils/date-range";
import WomenInstitutionalBanner from "../_components/women-institutional-banner";
import { uiTokens } from "@/styles/design-system";

export default function ServicesPage() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const t = useTranslations("women");

  // All supported women records
  const { data: allSupportRecords, isLoading: isLoadingAll } = useGetSupportRecordsQuery();

  // Search & pagination for Supported Women tab
  const [searchAll, setSearchAll] = useState("");
  const [filterStartDateAll, setFilterStartDateAll] = useState("");
  const [filterEndDateAll, setFilterEndDateAll] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: clientHistory, isLoading: isLoadingHistory } =
    useGetClientHistoryQuery(selectedClientId as number);

  const filteredHistory = useMemo(() => {
    let data = clientHistory || [];
    if (historyStartDate || historyEndDate) {
      data = data.filter((rec: any) =>
        isWithinDateRange(rec.dateProvided, historyStartDate, historyEndDate),
      );
    }
    return data;
  }, [clientHistory, historyStartDate, historyEndDate]);

  const filteredAllRecords = useMemo(() => {
    let data = allSupportRecords || [];
    if (searchAll.trim()) {
      const q = searchAll.toLowerCase();
      data = data.filter((r: any) => {
        const clientName = `${r.client?.firstName || ""} ${r.client?.lastName || ""}`.toLowerCase();
        const assocName = (r.womenAssociation?.name || "").toLowerCase();
        const faydaId = (r.client?.faydaId || "").toLowerCase();
        const cityId = (r.client?.cityIdNumber || "").toLowerCase();
        const serviceName = (r.serviceType?.name || "").toLowerCase();
        const provider = (r.provider || "").toLowerCase();
        return (
          clientName.includes(q) ||
          assocName.includes(q) ||
          faydaId.includes(q) ||
          cityId.includes(q) ||
          serviceName.includes(q) ||
          provider.includes(q)
        );
      });
    }
    if (filterStartDateAll || filterEndDateAll) {
      data = data.filter((rec: any) =>
        isWithinDateRange(rec.dateProvided, filterStartDateAll, filterEndDateAll),
      );
    }
    return data;
  }, [allSupportRecords, searchAll, filterStartDateAll, filterEndDateAll]);

  const totalPages = Math.ceil(filteredAllRecords.length / limit) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAllRecords.slice(start, start + limit);
  }, [filteredAllRecords, page, limit]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <WomenInstitutionalBanner />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">{t("support.title")}</h1>
            <p className="text-xs text-slate-500">{t("support.subtitle")}</p>
          </div>
          <RegisterSupportForm />
        </div>
      </div>

      <Tabs defaultValue="supported-women" className="w-full space-y-4">
        <TabsList className="bg-slate-100/80 p-1 rounded-xs border border-[#E3E7EB] h-9">
          <TabsTrigger value="supported-women" className="rounded-xs text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-[#1769AA] data-[state=active]:shadow-2xs gap-1.5">
            <HandHeart className="size-3.5" />
            <span>{t("support.tabs.supportedWomen") || "Supported Women"}</span>
            {Array.isArray(allSupportRecords) && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-xs bg-[#E8F2FA] text-[#1769AA] font-bold border border-[#BCD5EA]">
                {allSupportRecords.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="services" className="rounded-xs text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-[#1769AA] data-[state=active]:shadow-2xs">
            {t("support.history.title")}
          </TabsTrigger>
          <TabsTrigger value="combined" className="rounded-xs text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-[#1769AA] data-[state=active]:shadow-2xs">
            {t("support.tabs.quickRegistration")}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ALL SUPPORTED WOMEN BENEFICIARIES */}
        <TabsContent value="supported-women" className="space-y-4 mt-0">
          <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-5 border-b border-[#E3E7EB]">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <HandHeart className="w-4 h-4 text-[#1769AA]" />
                {t("support.tabs.supportedWomen") || "Supported Women Beneficiaries"}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search by name, ID, service, provider..."
                    className="pl-8 pr-8 h-8 text-xs bg-slate-50/50 border-[#E3E7EB] rounded-xs"
                    value={searchAll}
                    onChange={(e) => {
                      setSearchAll(e.target.value);
                      setPage(1);
                    }}
                  />
                  {searchAll && (
                    <button
                      onClick={() => {
                        setSearchAll("");
                        setPage(1);
                      }}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="date"
                    value={filterStartDateAll}
                    onChange={(e) => {
                      setFilterStartDateAll(e.target.value);
                      setPage(1);
                    }}
                    className="h-8 text-xs border-[#E3E7EB] rounded-xs w-32"
                    title="From date"
                  />
                  <span className="text-xs text-slate-400">—</span>
                  <Input
                    type="date"
                    value={filterEndDateAll}
                    onChange={(e) => {
                      setFilterEndDateAll(e.target.value);
                      setPage(1);
                    }}
                    className="h-8 text-xs border-[#E3E7EB] rounded-xs w-32"
                    title="To date"
                  />
                  {(searchAll || filterStartDateAll || filterEndDateAll) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchAll("");
                        setFilterStartDateAll("");
                        setFilterEndDateAll("");
                        setPage(1);
                      }}
                      className="h-8 text-xs text-rose-600 hover:bg-rose-50 rounded-xs px-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {isLoadingAll ? (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-12 justify-center font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1769AA]" />
                  Loading supported women records...
                </div>
              ) : (
                <SupportHistoryTable data={paginatedRecords} />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-[#E3E7EB] text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Page {page} of {totalPages} ({filteredAllRecords.length} records)
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="h-7 w-7 rounded-xs border-[#E3E7EB]"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="h-7 w-7 rounded-xs border-[#E3E7EB]"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4 mt-0">
          <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs w-full">
            <CardHeader className="py-3.5 px-5 border-b border-[#E3E7EB]">
              <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("support.history.title")}</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {t("support.history.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <Label className="text-[11px] font-semibold text-slate-600 block mb-1">{t("support.history.searchBeneficiary")}</Label>
                  <WomanSelect
                    value={selectedClientId?.toString()}
                    onValueChange={(value) =>
                      setSelectedClientId(value ? parseInt(value) : null)
                    }
                    placeholder={t("support.history.selectWoman")}
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600 block mb-1">{t("support.history.dateFrom")}</Label>
                  <Input
                    type="date"
                    value={historyStartDate}
                    onChange={(e) => setHistoryStartDate(e.target.value)}
                    className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600 block mb-1">{t("support.history.dateTo")}</Label>
                  <Input
                    type="date"
                    value={historyEndDate}
                    onChange={(e) => setHistoryEndDate(e.target.value)}
                    className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                  />
                </div>
              </div>

              {selectedClientId ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                      {t("support.history.records")}
                    </h3>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs">
                      {t("support.history.total", {
                        total: filteredHistory.length,
                      })}
                    </span>
                  </div>
                  {isLoadingHistory ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-8 justify-center font-mono">
                      <Loader2 className="w-4 h-4 animate-spin text-[#1769AA]" />
                      {t("support.history.loading")}
                    </div>
                  ) : (
                    <div className="border border-[#E3E7EB] rounded-xs overflow-hidden">
                      <SupportHistoryTable data={filteredHistory} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                      Recent Support Records
                    </h3>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border border-[#E3E7EB] rounded-xs">
                      {allSupportRecords?.length || 0} Total
                    </span>
                  </div>
                  <div className="border border-[#E3E7EB] rounded-xs overflow-hidden">
                    <SupportHistoryTable data={(allSupportRecords || []).slice(0, 5)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combined" className="space-y-4 mt-0">
          <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
            <CardHeader className="py-3.5 px-5 border-b border-[#E3E7EB]">
              <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("support.tabs.quickRegistration")}</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {t("support.tabs.quickRegistration")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <QuickRegistrationForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}