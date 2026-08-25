"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetTechnologySupportByIdQuery, useAddTechnologySupportMonitoringMutation } from "@/hooks/womens";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  User,
  Zap,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import AddMonitoringDialog from "../../_shared/add-monitoring-dialog";
import MonitoringTimeline from "../../_shared/monitoring-timeline";
import { CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function TechnologyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const recordId = parseInt(id as string);
  const t = useTranslations("women");

  const { data: record, isLoading, error } = useGetTechnologySupportByIdQuery(recordId);
  const addMonitoring = useAddTechnologySupportMonitoringMutation();

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
          {error instanceof Error ? error.message : t("technologySupport.detail.error")}
        </p>
        <Button onClick={() => router.push("/women/technology")}>
          {t("technologySupport.detail.goBack")}
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
        <Button variant="ghost" size="icon" onClick={() => router.push("/women/technology")} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("technologySupport.detail.title")}</h1>
          <p className="text-muted-foreground">ID: {record.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {t("technologySupport.detail.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("technologySupport.detail.technologyType")}</p>
              <p className="text-lg font-semibold">
                {record.technologyType ? t(`technologySupport.form.technologyTypes.${record.technologyType}`, { defaultValue: record.technologyType }) : record.technologyType}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("technologySupport.detail.association")}</p>
              <p className="text-lg font-semibold">{record.associationName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t("technologySupport.detail.status")}</p>
              <div className="flex flex-wrap gap-1">
                {record.isPoor && <Badge variant="secondary">{t("technologySupport.poor")}</Badge>}
                {record.isSexWorker && <Badge variant="outline">{t("technologySupport.sexWorker")}</Badge>}
                {record.disabilities?.length > 0 && (
                  <Badge variant="secondary">{t("technologySupport.disabled")} ({record.disabilities.length})</Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t("technologySupport.detail.healthConditions")}</p>
              {record.healthConditions?.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {record.healthConditions.map((c: string) => (
                    <Badge key={c} variant="destructive">{c}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">-</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t("technologySupport.detail.beneficiary")}
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
              <p className="text-sm"><span className="text-muted-foreground">{t("technologySupport.detail.phone")}</span> {client.phoneNumber}</p>
            )}
            {client?.address && (
              <p className="text-sm"><span className="text-muted-foreground">{t("technologySupport.detail.address")}</span> {client.address}</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                {t("technologySupport.detail.monitoringHistory")}
              </CardTitle>
              <CardDescription>{t("technologySupport.detail.monitoringHistoryDesc")}</CardDescription>
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