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
import { useGetClientHistoryQuery } from "@/hooks/support";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import GenerateWomenReportDialog from "./_components/generate-women-report-dialog";
import QuickRegistrationForm from "./_components/quick-registration-form";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isWithinDateRange } from "@/utils/date-range";

export default function ServicesPage() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const t = useTranslations("women");

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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
      {/* ── Institutional Header Banner ──────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>Addis Ababa City Administration</span>
          <span>·</span>
          <span>Women &amp; Social Affairs Bureau</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            Women Development &amp; Support
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">{t("support.title")}</h1>
            <p className="text-xs text-slate-500">{t("support.subtitle")}</p>
          </div>
          <GenerateWomenReportDialog />
        </div>
      </div>

      <Tabs defaultValue="services" className="w-full space-y-4">
        <TabsList className="bg-slate-100/80 p-1 rounded-xs border border-[#E3E7EB] h-9">
          <TabsTrigger value="services" className="rounded-xs text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-[#1769AA] data-[state=active]:shadow-2xs">
            {t("support.tabs.management")}
          </TabsTrigger>
          <TabsTrigger value="combined" className="rounded-xs text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-[#1769AA] data-[state=active]:shadow-2xs">
            {t("support.tabs.quickRegistration")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4 mt-0">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            {/* Left Column: Registration Form */}
            <div className="xl:col-span-4">
              <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
                <CardHeader className="py-3.5 px-5 border-b border-[#E3E7EB]">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("support.register.title")}</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {t("support.register.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5">
                  <RegisterSupportForm />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Service History */}
            <div className="xl:col-span-8 space-y-4">
              <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs h-full">
                <CardHeader className="py-3.5 px-5 border-b border-[#E3E7EB]">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("support.history.title")}</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {t("support.history.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <Label className="text-[11px] font-semibold text-slate-600 block mb-1">Search Beneficiary</Label>
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
                    <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed border-[#E3E7EB] rounded-xs bg-[#F7F8FA]">
                      <p className="text-xs text-slate-500">
                        {t("support.history.noSelection")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
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