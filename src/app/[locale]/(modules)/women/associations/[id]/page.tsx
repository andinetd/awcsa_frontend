"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGetWomenAssociationByIdQuery } from "@/hooks/womens";
import { useAuthStore } from "@/stores/auth-store";
import WomenAssociationForm from "../_components/women-association-form";
import AssociationMembersManager from "../_components/association-members-manager";
import { AssociationWorkflowPanel } from "../_components/association-workflow";
import AssociationReportMenu from "../_components/association-report-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, Pencil, Users, ClipboardList } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AssociationDetailPage() {
  const t = useTranslations("women.associations");
  const router = useRouter();
  const params = useParams();
  const recordId = Number(params?.id);
  const userRole = useAuthStore((s) => s.userRole);

  const { data: response, isLoading } = useGetWomenAssociationByIdQuery(recordId);
  const record = response?.data;

  const [editOpen, setEditOpen] = useState(false);

  const openAuditTrail = () => {
    if (!record) return;
    const params = new URLSearchParams({
      entityType: "WomenAssociation",
      entityId: String(record.id),
    });
    router.push(`/super-admin/audit-logs?${params.toString()}`);
  };

  useEffect(() => {
    if (!isLoading && record) {
      const search = window.location.search;
      if (search.includes("edit=1")) setEditOpen(true);
    }
  }, [isLoading, record]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        {t("detail.loading")}
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-muted-foreground">{t("detail.error")}</p>
        <Button variant="outline" onClick={() => router.push("/women/associations")}>
          {t("detail.goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/women/associations")}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{record.name}</h1>
              <Badge
                className={`rounded-full border-transparent ${STATUS_STYLES[record.approvalStatus] || ""}`}
              >
                {t(`status.${record.approvalStatus}`)}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {t(`types.${record.type}`)} · ID: {record.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {record.approvalStatus === "DRAFT" && (
            <Button className="gap-2" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4" />
              {t("detail.edit")}
            </Button>
          )}
          {userRole === "Super_Admin" && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={openAuditTrail}
            >
              <ClipboardList className="w-4 h-4" />
              {t("detail.auditTrail")}
            </Button>
          )}
          <AssociationReportMenu associationId={record.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("detail.generalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow label={t("form.fields.name")} value={record.name} />
            <InfoRow label={t("form.fields.type")} value={t(`types.${record.type}`)} />
            <InfoRow
              label={t("form.fields.establishmentDate")}
              value={
                record.establishmentDate
                  ? new Date(record.establishmentDate).toLocaleDateString()
                  : "-"
              }
            />
            <InfoRow label={t("form.fields.totalMembers")} value={record.totalMembers ?? "-"} />
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("form.fields.objective")}</p>
              <p className="text-sm">{record.objective || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("detail.location")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label={t("form.fields.subCity")} value={record.subCity} />
            <InfoRow label={t("form.fields.woreda")} value={record.woreda} />
            <InfoRow label={t("form.fields.block")} value={record.block || "-"} />
            <InfoRow label={t("form.fields.houseNumber")} value={record.houseNumber || "-"} />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{t("detail.leader")}</CardTitle>
          </CardHeader>
          <CardContent>
            {record.leaders && record.leaders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {record.leaders.map((leader: any, index: number) => (
                  <div key={leader.id ?? index} className="rounded-xl border bg-muted/20 p-4 space-y-1">
                    <p className="text-xs font-medium text-primary">
                      {index + 1}. {t(`form.leaderPositions.${leader.position}`)}
                    </p>
                    <p className="text-sm font-semibold">{leader.fullName}</p>
                    <p className="text-xs text-muted-foreground">{leader.phoneNumber}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <InfoRow label={t("form.fields.leaderFullName")} value={record.leaderName} />
                <InfoRow label={t("form.fields.leaderPhone")} value={record.leaderPhoneNumber} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t("detail.membership")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox label={t("detail.registeredMembers")} value={record._count?.members ?? 0} />
            <StatBox label={t("detail.totalMembersDeclared")} value={record.totalMembers ?? "-"} />
            <StatBox label={t("detail.supportRecords")} value={record._count?.supportReceived ?? 0} />
          </CardContent>
        </Card>

        <AssociationMembersManager
          associationId={record.id}
          members={record.oneToTenMembers}
          groups={record.groups}
          approvalStatus={record.approvalStatus}
        />

        <AssociationWorkflowPanel record={record} />
      </div>

      <WomenAssociationForm record={record} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4 text-center space-y-1">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
