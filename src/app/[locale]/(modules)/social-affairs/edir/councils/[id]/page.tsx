"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirCouncilByIdQuery } from "@/hooks/social-affairs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  ScrollText,
  Crown,
  Phone,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
} from "lucide-react";
import { EdirCouncil, EdirStatus } from "@/api/social-affairs/edir";
import { useTranslations } from "next-intl";
import { useRemoveEdirFromCouncilMutation } from "@/hooks/social-affairs";
import { toast } from "sonner";
import NewCouncilForm from "../_components/new-council-form";
import CouncilActions from "./_components/council-actions";
import AddMemberDialog from "./_components/add-member-dialog";
import ManageLeadershipDialog from "./_components/manage-leadership-dialog";
import CouncilReportMenu from "./_components/council-report-menu";

import Link from "next/link";
import { ChevronRight, Home, UserCheck, Plus } from "lucide-react";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
};

const levelStyles: Record<string, string> = {
  WOREDA: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  SUB_CITY: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  CITY: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
};

const CANCELLATION_REASONS: Record<string, string> = {
  DISSOLVED: "detail.cancellationReasons.DISSOLVED",
  MEMBER_MAJORITY_REQUEST: "detail.cancellationReasons.MEMBER_MAJORITY_REQUEST",
  LAWS_VIOLATION: "detail.cancellationReasons.LAWS_VIOLATION",
  LICENSE_MISUSE: "detail.cancellationReasons.LICENSE_MISUSE",
  FALSE_DOCUMENTS: "detail.cancellationReasons.FALSE_DOCUMENTS",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CouncilDetailsPage({ params }: PageProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const router = useRouter();
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  const {
    data: council,
    isLoading,
    isError,
  } = useGetEdirCouncilByIdQuery(id);
  const removeMemberMutation = useRemoveEdirFromCouncilMutation();

  const handleRemoveMember = async (associationId: number) => {
    try {
      await removeMemberMutation.mutateAsync({
        councilId: id,
        associationId,
      });
      toast.success(t("buttons.removeMember"));
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          {t("detail.loading")}
        </div>
      </div>
    );
  }

  if (isError || !council) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("detail.error")}
      </div>
    );
  }

  const typedCouncil = council as EdirCouncil;
  const memberCount =
    typedCouncil._count?.memberEdirs ?? typedCouncil.memberEdirs.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>{t("breadcrumbs.home")}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/social-affairs/edir/councils" className="hover:text-[#1769AA] transition-colors">
          {t("breadcrumbs.councils")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold truncate max-w-xs">{typedCouncil.name}</span>
      </div>

      {/* Header Bar */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/social-affairs/edir/councils")}
            className="h-8 w-8 rounded-xs border-[#E3E7EB] hover:bg-slate-50 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1769AA]" />
              <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                {typedCouncil.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Badge
                variant="outline"
                className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
                  statusStyles[typedCouncil.status] || "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {t(`status.${typedCouncil.status}`)}
              </Badge>
              <Badge
                variant="outline"
                className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
                  levelStyles[typedCouncil.level] || "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {t(`level.${typedCouncil.level}`)}
              </Badge>
              {typedCouncil.registrationNumber && (
                <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-xs border border-slate-200/80">
                  {typedCouncil.registrationNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <AddMemberDialog council={typedCouncil} />
          <ManageLeadershipDialog council={typedCouncil} />
          <CouncilActions council={typedCouncil} />
          <NewCouncilForm
            initialData={typedCouncil}
            councilId={typedCouncil.id}
            trigger={
              <Button
                variant="outline"
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
              >
                {t("buttons.edit")}
              </Button>
            }
          />
          <CouncilReportMenu council={typedCouncil} />
        </div>
      </div>

      {/* Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Accreditation Card */}
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
            <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-[#1769AA]" />
                {t("detail.accreditation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {t("detail.registrationNumber")}
                </p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">
                  {typedCouncil.registrationNumber || t("detail.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {t("detail.registrationDate")}
                </p>
                <p className="font-mono text-slate-800 mt-0.5">
                  {typedCouncil.registrationDate
                    ? new Date(typedCouncil.registrationDate).toLocaleDateString()
                    : t("detail.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {t("detail.certificateIssuedAt")}
                </p>
                <p className="font-mono text-slate-800 mt-0.5">
                  {typedCouncil.certificateIssuedAt
                    ? new Date(
                        typedCouncil.certificateIssuedAt
                      ).toLocaleDateString()
                    : t("detail.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {t("detail.renewedForYear")}
                </p>
                <p className="font-mono text-slate-800 mt-0.5 flex items-center">
                  {typedCouncil.renewedForYear
                    ? typedCouncil.renewedForYear
                    : t("detail.notRenewed")}
                  {typedCouncil.renewalPenaltyApplied && (
                    <span className="ml-2 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-xs border border-amber-200">
                      {t("detail.penaltyApplied")}
                    </span>
                  )}
                </p>
              </div>
              {typedCouncil.cancelledAt && (
                <>
                  <div className="pt-2 border-t border-[#E3E7EB] sm:col-span-1">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">
                      {t("detail.cancelledAt")}
                    </p>
                    <p className="font-mono text-slate-800 mt-0.5">
                      {new Date(typedCouncil.cancelledAt).toLocaleDateString()}
                    </p>
                  </div>
                  {typedCouncil.cancellationReason && (
                    <div className="pt-2 border-t border-[#E3E7EB] sm:col-span-1">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">
                        {t("detail.cancellationReason")}
                      </p>
                      <p className="font-mono text-slate-800 mt-0.5">
                        {t(
                          (CANCELLATION_REASONS[typedCouncil.cancellationReason] ||
                            `detail.cancellationReasons.${typedCouncil.cancellationReason}`) as any
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Member Edirs Card */}
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
            <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1769AA]" />
                {t("detail.membersTitle", { count: memberCount })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {typedCouncil.memberEdirs.length === 0 ? (
                <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-slate-50/50 p-8 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
                  {t("detail.noMembers")}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {typedCouncil.memberEdirs.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border border-[#E3E7EB] rounded-xs p-3.5 bg-white hover:bg-slate-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#0B1F3A]">{member.name}</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {member.registrationNumber
                            ? member.registrationNumber
                            : t("detail.notAvailable")}
                          {" • "}
                          {member.subCity}
                          {member.woreda ? ` • ${member.woreda}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] uppercase font-bold rounded-xs px-2 py-0.5 border ${
                            statusStyles[member.status] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {t(`status.${member.status}`)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xs"
                          disabled={removeMemberMutation.isPending}
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          {t("buttons.removeMember")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Leadership Card */}
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
            <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-2.5 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1769AA]" />
                <span>{t("detail.leader")}</span>
                {Array.isArray(typedCouncil.leadershipMembers) && typedCouncil.leadershipMembers.length > 0 && (
                  <span className="text-[10px] font-mono text-[#1769AA] font-bold bg-[#E8F2FA] px-1.5 py-0.2 rounded-xs border border-[#BCD5EA]">
                    {typedCouncil.leadershipMembers.length + 1}
                  </span>
                )}
              </CardTitle>
              <ManageLeadershipDialog
                council={typedCouncil}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10.5px] font-mono font-bold text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t("manageLeaders")}</span>
                  </Button>
                }
              />
            </CardHeader>
            <CardContent className="p-5 space-y-3.5 text-xs">
              {/* Primary Chairperson */}
              <div className="rounded-xs border border-[#E3E7EB] bg-slate-50/60 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0B1F3A] text-white px-1.5 py-0.2 rounded-xs">
                    {t("chairpersonTitle")}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-900">
                    {typedCouncil.chairpersonName || t("detail.notAvailable")}
                  </span>
                </div>
                {typedCouncil.chairpersonPhone && (
                  <div className="flex items-center gap-2 font-mono text-slate-600 text-[11px] pl-6">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{typedCouncil.chairpersonPhone}</span>
                  </div>
                )}
              </div>

              {/* Office Contact Phone */}
              {typedCouncil.contactPhone && (
                <div className="flex items-center gap-2 font-mono text-slate-600 px-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {t("detail.contactPhone")}: {typedCouncil.contactPhone}
                  </span>
                </div>
              )}

              {/* Additional Leadership Committee Members */}
              {Array.isArray(typedCouncil.leadershipMembers) && typedCouncil.leadershipMembers.length > 0 && (
                <div className="pt-2 border-t border-[#E3E7EB] space-y-2">
                  <p className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {t("executiveCommitteeCount", { count: typedCouncil.leadershipMembers.length })}
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {typedCouncil.leadershipMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="rounded-xs border border-[#E3E7EB] bg-white p-2.5 space-y-1 hover:border-[#BCD5EA] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-800 text-xs truncate">
                            {member.fullName}
                          </span>
                          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider bg-[#E8F2FA] text-[#1769AA] px-1.5 py-0.2 rounded-xs border border-[#BCD5EA] shrink-0">
                            {member.role}
                          </span>
                        </div>
                        {member.phoneNumber && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{member.phoneNumber}</span>
                          </div>
                        )}
                        {member.address && (
                          <div className="text-[10.5px] text-slate-400 truncate">
                            {member.address}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Establishment Card */}
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
            <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1769AA]" />
                {t("detail.location")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-600">
                  {t("detail.established")}:{" "}
                  <span className="text-slate-800 font-semibold">
                    {new Date(typedCouncil.establishmentDate).toLocaleDateString()}
                  </span>
                </span>
              </div>
              <div className="text-slate-700">
                <p className="font-semibold text-[#0B1F3A]">
                  {typedCouncil.subCity}
                  {typedCouncil.woreda ? ` • ${typedCouncil.woreda}` : ""}
                  {typedCouncil.kebele ? ` • ${typedCouncil.kebele}` : ""}
                </p>
                {typedCouncil.address && (
                  <p className="text-slate-500 mt-1">{typedCouncil.address}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}