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
import { uiTokens } from "@/styles/design-system";

const STATUS_TAGS: Record<string, string> = {
  DRAFT: uiTokens.statusTag.neutral,
  SUBMITTED: uiTokens.statusTag.warning,
  APPROVED: uiTokens.statusTag.primary,
  REJECTED: uiTokens.statusTag.danger,
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
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto w-full">
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
              onClick={() => router.push("/women/associations")}
              className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">{record.name}</h1>
                <span
                  className={`px-2.5 py-0.5 rounded-xs text-xs font-semibold border ${STATUS_TAGS[record.approvalStatus] || uiTokens.statusTag.neutral}`}
                >
                  {t(`status.${record.approvalStatus}`)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(`types.${record.type}`)} · <span className="font-mono">ID: #{record.id}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {record.approvalStatus === "DRAFT" && (
              <Button
                className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="w-3.5 h-3.5" />
                {t("detail.edit")}
              </Button>
            )}
            {userRole === "Super_Admin" && (
              <Button
                variant="outline"
                className="h-8 rounded-xs text-xs font-medium border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] cursor-pointer gap-1.5"
                onClick={openAuditTrail}
              >
                <ClipboardList className="w-3.5 h-3.5 text-[#1769AA]" />
                {t("detail.auditTrail")}
              </Button>
            )}
            <AssociationReportMenu associationId={record.id} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-2">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("detail.generalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <InfoRow label={t("form.fields.name")} value={record.name} />
            <InfoRow label={t("form.fields.type")} value={t(`types.${record.type}`)} />
            <InfoRow
              label={t("form.fields.establishmentDate")}
              value={
                record.establishmentDate
                  ? new Date(record.establishmentDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"
              }
            />
            <InfoRow label={t("form.fields.totalMembers")} value={<span className="font-mono">{record.totalMembers ?? "—"}</span>} />
            <div className="md:col-span-2 space-y-1">
              <p className="text-xs font-medium text-slate-500">{t("form.fields.objective")}</p>
              <p className="text-xs text-slate-800">{record.objective || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("detail.location")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <InfoRow label={t("form.fields.subCity")} value={record.subCity} />
            <InfoRow label={t("form.fields.woreda")} value={record.woreda} />
            <InfoRow label={t("form.fields.block")} value={record.block || "—"} />
            <InfoRow label={t("form.fields.houseNumber")} value={record.houseNumber || "—"} />
          </CardContent>
        </Card>

        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-3">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("detail.leader")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {record.leaders && record.leaders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {record.leaders.map((leader: any, index: number) => (
                  <div key={leader.id ?? index} className="rounded-xs border border-[#E3E7EB] bg-[#F7F8FA] p-3 space-y-1">
                    <p className="text-[11px] font-semibold text-[#1769AA]">
                      {index + 1}. {t(`form.leaderPositions.${leader.position}`)}
                    </p>
                    <p className="text-xs font-semibold text-[#0B1F3A]">{leader.fullName}</p>
                    <p className="text-xs font-mono text-slate-500">{leader.phoneNumber}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <InfoRow label={t("form.fields.leaderFullName")} value={record.leaderName} />
                <InfoRow label={t("form.fields.leaderPhone")} value={<span className="font-mono">{record.leaderPhoneNumber}</span>} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-3">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <Users className="w-4 h-4 text-[#1769AA]" />
              {t("detail.membership")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatBox label={t("detail.registeredMembers")} value={record._count?.members ?? 0} />
            <StatBox label={t("detail.totalMembersDeclared")} value={record.totalMembers ?? "—"} />
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
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="text-xs font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white p-3.5 text-center space-y-0.5 shadow-2xs">
      <p className="text-xl font-bold font-mono text-[#1769AA]">{value}</p>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}
