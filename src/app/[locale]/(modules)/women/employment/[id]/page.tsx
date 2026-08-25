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
        <p className="text-destructive font-medium">
          {error instanceof Error ? error.message : "Record not found"}
        </p>
        <Button onClick={() => router.push("/women/employment")}>
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
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/women/employment")} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("supportDetail.title")}</h1>
          <p className="text-muted-foreground">{t("supportDetail.referenceId")}: {record.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Employment Type</p>
              <Badge variant="outline" className="rounded-full">
                {record.employmentType === "INDIVIDUAL" ? "Individual" : "Group"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Sector</p>
              <p className="text-lg font-semibold">{record.sector}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Year</p>
              <p className="text-lg font-semibold">{record.year}</p>
            </div>
            {record.remark && (
              <div className="md:col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Remark</p>
                <p className="p-3 bg-muted/50 rounded-lg text-sm">{record.remark}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Beneficiary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-primary/5 p-4 rounded-xl border border-primary/10">
              <p className="text-xl font-bold text-primary">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{client?.cityIdNumber}</p>
            </div>
            {client?.phoneNumber && (
              <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {client.phoneNumber}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                {t("supportDetail.monitoringHistory")}
              </CardTitle>
              <CardDescription>{t("supportDetail.monitoringHistoryDesc")}</CardDescription>
            </div>
            <AddMonitoringDialog onAdd={handleAddMonitoring} isPending={addMonitoring.isPending} />
          </CardHeader>
          <CardContent>
            <MonitoringTimeline logs={record.monitoringLogs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}