"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetEmploymentByIdQuery, useAddEmploymentMonitoringMutation } from "@/hooks/womens";
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
  User,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import AddMonitoringDialog from "../../_shared/add-monitoring-dialog";
import MonitoringTimeline from "../../_shared/monitoring-timeline";
import { toast } from "sonner";
import { uiTokens } from "@/styles/design-system";

export default function EmploymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const recordId = parseInt(id as string);
  const t = useTranslations("women");

  const { data: record, isLoading, error } = useGetEmploymentByIdQuery(recordId);
  const addMonitoring = useAddEmploymentMonitoringMutation();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium text-sm">
          {error instanceof Error ? error.message : "Record not found"}
        </p>
        <Button
          onClick={() => router.push("/women/employment")}
          className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E]"
        >
          {t("profileDetail.goBack")}
        </Button>
      </div>
    );
  }

  const handleAddMonitoring = (data: { monitoringDate: string; assessedBy: string; currentStatus: string; score: number; remark?: string }) => {
    addMonitoring.mutate(
      { id: recordId, data },
      {
        onSuccess: () => toast.success(t("monitoring.messages.success")),
        onError: (err: any) => toast.error(err?.message || t("monitoring.messages.error")),
      },
    );
  };

  const client = record.womenProfile?.client;
  const displayName = client
    ? `${client.firstName} ${client.lastName}`
    : [record.firstName, record.lastName].filter(Boolean).join(" ") || "N/A";

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
              onClick={() => router.push("/women/employment")}
              className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
                  {record.employmentType === "INDIVIDUAL" ? "Individual" : "Group"} Employment
                </h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs">
                  {t("supportDetail.referenceId")}: #{record.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {record.sector} · Beneficiary: {displayName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Employment Info */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-2">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <Briefcase className="h-4 w-4 text-[#1769AA]" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-slate-500">Employment Type</p>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${
                  record.employmentType === "INDIVIDUAL" ? uiTokens.statusTag.primary : uiTokens.statusTag.neutral
                }`}>
                  {record.employmentType === "INDIVIDUAL" ? "Individual" : "Group"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-slate-500">Sector</p>
              <p className="text-sm font-semibold text-[#0B1F3A]">{record.sector}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-slate-500">Year</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{record.year}</p>
            </div>
            {record.remark && (
              <div className="md:col-span-2 space-y-1">
                <p className="text-[11px] font-medium text-slate-500">Remark</p>
                <p className="p-3 bg-slate-50 border border-[#E3E7EB] rounded-xs text-xs text-slate-700">{record.remark}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Beneficiary Card */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <User className="h-4 w-4 text-[#1769AA]" />
              Beneficiary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="text-center bg-[#F7F8FA] p-3.5 rounded-xs border border-[#E3E7EB]">
              <p className="text-sm font-bold text-[#0B1F3A]">
                {displayName}
              </p>
              {client?.cityIdNumber && (
                <p className="font-mono text-[11px] text-slate-500 mt-1">{client.cityIdNumber}</p>
              )}
            </div>
            {client?.phoneNumber && (
              <div className="text-xs text-slate-600 flex justify-between pt-1">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-medium text-slate-800">{client.phoneNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monitoring Card */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-[#E3E7EB]">
            <div>
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <ClipboardList className="h-4 w-4 text-[#1769AA]" />
                {t("supportDetail.monitoringHistory")}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">{t("supportDetail.monitoringHistoryDesc")}</CardDescription>
            </div>
            <AddMonitoringDialog onAdd={handleAddMonitoring} isPending={addMonitoring.isPending} />
          </CardHeader>
          <CardContent className="p-4">
            <MonitoringTimeline logs={record.monitoringLogs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}