"use client";

import React from "react";
import { useGetSupportByIdQuery } from "@/hooks/support";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Calendar,
  User,
  MapPin,
  ClipboardList,
  Package,
} from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import MonitoringForm from "../_components/monitoring-form";
import { useTranslations } from "next-intl";
import { uiTokens } from "@/styles/design-system";

export default function SupportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supportId = parseInt(id as string);
  const t = useTranslations("women");

  const { data: support, isLoading, error } = useGetSupportByIdQuery(supportId);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !support) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">
          {error instanceof Error ? error.message : t("supportDetail.noLogs")}
        </p>
        <Button onClick={() => router.back()}>
          {t("profileDetail.goBack")}
        </Button>
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">{t("supportDetail.title")}</h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs">
                  {t("supportDetail.referenceId")}: #{support.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {support.serviceType?.name ? t(`serviceTypes.${support.serviceType.name}`) : "Support Intervention"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Service Info */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-2">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <Package className="h-4 w-4 text-[#1769AA]" />
              {t("supportDetail.serviceInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-slate-500">
                {t("support.register.serviceType")}
              </p>
              <p className="font-semibold text-slate-800">
                {support.serviceType?.name
                  ? t(`serviceTypes.${support.serviceType.name}`)
                  : "N/A"}
              </p>
              {support.serviceType?.category && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-medium border border-[#E3E7EB] bg-slate-50 text-slate-600 mt-1">
                  {support.serviceType.category}
                </span>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-slate-500">
                {t("support.register.providerName")}
              </p>
              <p className="font-semibold text-slate-800">{support.provider}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-slate-500">
                {t("support.register.amountOrQuantity")}
              </p>
              <p className="font-mono font-semibold text-slate-800">
                {support.amountOrQuantity}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-slate-500">
                {t("support.register.dateProvided")}
              </p>
              <div className="flex items-center gap-1.5 text-slate-800 font-mono">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {support.dateProvided
                    ? format(new Date(support.dateProvided), "PPP")
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="sm:col-span-2 space-y-1 pt-1">
              <p className="text-[11px] font-medium text-slate-500">
                {t("support.register.remarks")}
              </p>
              <p className="p-2.5 bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs text-xs text-slate-700">
                {support.remark || t("supportDetail.noRemarks")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Beneficiary & Location */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <User className="h-4 w-4 text-[#1769AA]" />
              {t("supportDetail.beneficiaryLocation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="text-center bg-[#E8F2FA] p-3 rounded-xs border border-[#BCD5EA] space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500">
                {t("supportDetail.beneficiaryType")}
              </p>
              <p className="text-sm font-bold text-[#1769AA]">
                {support.clientId
                  ? t("supportDetail.individualWoman")
                  : t("supportDetail.womenAssociation")}
              </p>
              <p className="text-[11px] font-mono text-slate-600">
                ID: #{support.clientId || support.womenAssociationId}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#1769AA] mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-slate-500">
                    {t("report.subCity")}
                  </p>
                  <p className="font-semibold text-slate-800">{support.subCity}</p>
                  <p className="text-slate-600 font-mono text-[11px]">
                    {t("report.woreda")} {support.woreda}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ClipboardList className="h-4 w-4 text-[#1769AA] mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium text-slate-500">
                    {t("supportDetail.facilitator")}
                  </p>
                  <p className="font-mono font-semibold text-slate-800">{support.facilitatorCityId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Section */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-3">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB] flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <ClipboardList className="h-4 w-4 text-[#1769AA]" />
                {t("supportDetail.monitoringHistory")}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                {t("supportDetail.monitoringHistoryDesc")}
              </CardDescription>
            </div>
            <MonitoringForm supportServiceId={support.id} />
          </CardHeader>
          <CardContent className="p-4">
            {support.monitoringLogs && support.monitoringLogs.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto pr-2">
                <div className="relative border-l border-[#BCD5EA] ml-3 pl-6 space-y-6 py-2">
                  {support.monitoringLogs.map((log) => (
                    <div key={log.id} className="relative text-xs">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white bg-[#1769AA] shadow-xs" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <p className="font-bold text-sm text-[#0B1F3A]">
                            {format(new Date(log.monitoringDate), "PPP")}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA]">
                              {log.currentStatus}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-mono border border-[#E3E7EB] bg-slate-50 text-slate-700">
                              {t("supportDetail.score", { score: log.score })}
                            </span>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              {t("supportDetail.assessedBy", {
                                name: log.assessedBy,
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="w-full sm:w-28 h-2 bg-slate-100 rounded-xs overflow-hidden border border-[#E3E7EB]">
                          <div
                            className="h-full bg-[#1769AA] transition-all"
                            style={{ width: `${log.score}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-[#F7F8FA] p-3 rounded-xs border border-[#E3E7EB]">
                        <p className="text-xs text-slate-700 whitespace-pre-wrap">
                          {log.remark}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-[#E3E7EB] rounded-xs bg-[#F7F8FA]">
                <ClipboardList className="h-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  {t("supportDetail.noLogs")}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t("supportDetail.addFollowUp")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}