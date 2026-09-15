"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRightLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Heart,
  HeartHandshake,
  Loader2,
  MapPin,
  Phone,
  RotateCcw,
  Shield,
  ShieldCheck,
  Tag,
  User,
  Users,
  UserCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { useChildDetails } from "@/hooks/adoption/useChildDetails";
import { TransferStatusDialog } from "../_components/transfer-status-dialog";
import { ChildStatus } from "@/types/child-matching-types";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";

const STATUS_BADGES: Record<
  string,
  {
    label: string;
    statusType: "primary" | "navy" | "neutral" | "subtle" | "warning" | "danger" | "success" | "info";
    icon: React.ElementType;
  }
> = {
  FOUND: {
    label: "Found / Abandoned",
    statusType: "warning",
    icon: Clock,
  },
  IN_CARE: {
    label: "In Care (Eligible for Adoption)",
    statusType: "primary",
    icon: Building2,
  },
  IN_ADERA: {
    label: "In Adera (Foster Custody)",
    statusType: "neutral",
    icon: HeartHandshake,
  },
  WITH_BLOOD_RELATIVE: {
    label: "With Blood Relative",
    statusType: "subtle",
    icon: Users,
  },
  ADOPTED: {
    label: "Adopted (Legally Placed)",
    statusType: "navy",
    icon: CheckCircle2,
  },
  RETURNED: {
    label: "Returned (Reunified)",
    statusType: "danger",
    icon: RotateCcw,
  },
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
  subvalue,
}: {
  icon?: React.ElementType;
  label: string;
  value?: React.ReactNode;
  subvalue?: string;
}) => (
  <div className="flex items-start justify-between py-2 border-b border-[#E3E7EB]/60 last:border-0 gap-3">
    <div className="flex items-center gap-2 text-slate-500 text-xs shrink-0">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
      <span>{label}</span>
    </div>
    <div className="text-right min-w-0">
      <div className="text-xs font-semibold text-slate-900 truncate">
        {value || "—"}
      </div>
      {subvalue && (
        <div className="text-[10.5px] text-slate-400 mt-0.5">{subvalue}</div>
      )}
    </div>
  </div>
);

export default function ChildDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("adoption");

  const childId = Number(params.id);
  const { data: child, isLoading, isError } = useChildDetails(childId);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-600">
          {t("children.details.loading") || "Loading comprehensive child record..."}
        </p>
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {t("children.details.notFoundTitle") || "Child Record Not Found"}
          </h2>
          <p className="text-xs text-slate-500">
            {t("children.details.notFoundDesc") ||
              "The requested child record does not exist or you do not have permission to view it."}
          </p>
          <Link href="/adoption/children">
            <Button variant="outline" className="w-full">
              {t("children.details.backToList") || "Back to Children List"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formData = child.serviceData?.formData;
  const client = child.serviceData?.client;

  const firstName = formData?.firstName || client?.firstName || "—";
  const lastName = formData?.lastName || client?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const dob = formData?.dateOfBirth || client?.dateOfBirth;
  const age = dob
    ? new Date().getFullYear() - new Date(dob).getFullYear()
    : "—";
  const sex = (formData?.sex || client?.contactInfo?.sex || "—").toUpperCase();

  const currentStatus = (child.currentStatus as ChildStatus) || "FOUND";
  const statusCfg = STATUS_BADGES[currentStatus] || {
    label: currentStatus,
    statusType: "neutral" as const,
    icon: Clock,
  };
  const StatusIcon = statusCfg.icon;

  const latestMatch = child.adoptionMatches?.[0];
  const latestReunification = child.reunifications?.[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      {/* ── Institutional Header Bar ─────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>Addis Ababa City Administration</span>
          <span>·</span>
          <span>Women &amp; Social Affairs Bureau</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            Child Protection &amp; Care
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <Link href="/adoption/children">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xs size-8 border-[#E3E7EB] hover:bg-slate-50 shrink-0 cursor-pointer"
              >
                <ArrowLeft className="size-4 text-slate-600" />
              </Button>
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
                  {fullName}
                </h1>
                <span
                  className={cn(
                    uiTokens.statusTag.base,
                    uiTokens.statusTag[statusCfg.statusType] || uiTokens.statusTag.neutral,
                    "px-2 py-0.5 text-xs font-semibold gap-1 rounded-xs"
                  )}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusCfg.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                {child.childIdFromFacility && (
                  <span className="font-mono bg-[#E8F2FA] text-[#1769AA] px-2 py-0.5 rounded-xs border border-[#BCD5EA] font-semibold">
                    {child.childIdFromFacility}
                  </span>
                )}
                {child.childCareFacility?.name && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {child.childCareFacility.name}
                  </span>
                )}
                <span>
                  Registered:{" "}
                  {child.createdAt
                    ? new Date(child.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              onClick={() => setIsTransferOpen(true)}
              className="bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 shadow-2xs text-xs font-semibold rounded-xs h-8 px-3 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {t("children.details.transferStatusBtn") || "Transfer Status"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Status Banners ─────────────────────────────────────────────────── */}
      {currentStatus === "IN_CARE" && (
        <div className="bg-[#0B1F3A] text-white rounded-xs p-4 border border-[#0B1F3A] shadow-2xs flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xs border border-white/10 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                {t("children.details.inCareBannerTitle") ||
                  "Child Eligible for Adoption Matching"}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {t("children.details.inCareBannerDesc") ||
                  "This child is placed in institutional care and can be selected for matching with approved adoptive parents."}
              </p>
            </div>
          </div>
          <Link href="/adoption/adoption-requests">
            <Button
              size="sm"
              className="bg-white text-[#0B1F3A] hover:bg-slate-100 text-xs font-semibold rounded-xs h-8 px-3 shadow-2xs cursor-pointer"
            >
              {t("children.details.viewAdoptionRequests") ||
                "View Adoption Requests"}
            </Button>
          </Link>
        </div>
      )}

      {currentStatus === "RETURNED" && (
        <div className="bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs p-4 flex items-start gap-3 text-slate-900 shadow-2xs border-l-3 border-l-red-600">
          <div className="p-2 bg-red-50 rounded-xs shrink-0 text-red-700">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-[#0B1F3A] text-sm mb-0.5">
              {t("children.details.returnedBannerTitle") ||
                "Reunified with Biological Family"}
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              {child.reasonForReturn ||
                latestReunification?.reunificationReason ||
                "Child was returned to biological family following formal reunification procedures."}
            </p>
          </div>
        </div>
      )}

      {/* ── 2-Column Details Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Card */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
              <User className="size-3.5 text-[#1769AA]" />
              {t("children.details.biodataTitle") || "Child Biodata & Identity"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-4">
            <InfoRow
              icon={User}
              label={t("children.registration.fields.firstName") || "First Name"}
              value={firstName}
            />
            <InfoRow
              icon={User}
              label={t("children.registration.fields.lastName") || "Last Name"}
              value={lastName}
            />
            <InfoRow
              label={t("children.columns.gender") || "Sex / Gender"}
              value={sex}
            />
            <InfoRow
              icon={Calendar}
              label={t("children.registration.fields.dateOfBirth") || "Date of Birth"}
              value={dob ? new Date(dob).toLocaleDateString() : "—"}
              subvalue={age !== "—" ? `${age} years old` : undefined}
            />
            <InfoRow
              icon={Tag}
              label={t("children.details.cityId") || "City ID / National ID"}
              value={client?.cityIdNumber || "—"}
            />
            <InfoRow
              icon={Building2}
              label={t("children.details.facilityChildId") || "Facility Child ID"}
              value={child.childIdFromFacility || "—"}
            />
            {child.additionalInfo && (
              <div className="pt-3 mt-2 border-t border-[#E3E7EB]">
                <p className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500 mb-1">
                  {t("children.details.additionalNotes") || "Special Observations"}
                </p>
                <p className="text-xs text-slate-700 bg-[#F7F8FA] border border-[#E3E7EB] p-2.5 rounded-xs leading-relaxed">
                  {child.additionalInfo}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institutional Placement & Care Center Card */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
              <Building2 className="size-3.5 text-[#1769AA]" />
              {t("children.details.placementTitle") || "Care Facility & Placement"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-4">
            <InfoRow
              icon={Building2}
              label={t("children.details.careCenter") || "Care Facility"}
              value={child.childCareFacility?.name || "Not assigned to facility"}
            />
            <InfoRow
              icon={MapPin}
              label={t("children.details.location") || "Facility Location"}
              value={
                [
                  child.childCareFacility?.place,
                  child.childCareFacility?.subCity,
                  child.childCareFacility?.region,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"
              }
            />
            <InfoRow
              icon={Phone}
              label={t("children.details.facilityContact") || "Facility Contact"}
              value={child.childCareFacility?.phone || "—"}
            />
            <InfoRow
              icon={User}
              label={t("children.details.contactPerson") || "Contact Person"}
              value={child.childCareFacility?.contactPerson || "—"}
            />

            {/* Custodian details if under kinship / foster care */}
            <div className="mt-4 pt-3 border-t border-[#E3E7EB]">
              <p className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700 mb-2 flex items-center gap-1.5">
                <HeartHandshake className="size-3.5 text-[#1769AA]" />
                {t("children.details.custodianTitle") || "Assigned Custodian / Guardian"}
              </p>
              {child.custodian ? (
                <div className="bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs p-3 space-y-1">
                  <p className="text-xs font-bold text-[#0B1F3A]">
                    {child.custodian.firstName} {child.custodian.lastName}
                  </p>
                  <p className="text-xs text-slate-600">
                    Phone: {child.custodian.phoneNumber || "—"} | City ID:{" "}
                    {child.custodian.cityIdNumber || "—"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Address: {child.custodian.address || "—"}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {t("children.details.noCustodian") ||
                    "No individual custodian currently assigned."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Intake Background & Origin Card */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
              <Clock className="size-3.5 text-[#1769AA]" />
              {t("children.details.intakeTitle") || "Intake History & Origin"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-4">
            <InfoRow
              icon={MapPin}
              label={t("children.registration.fields.addressFound") || "Place Where Child Found"}
              value={child.placeWhereChildFound || "—"}
            />
            <InfoRow
              icon={Calendar}
              label={t("children.registration.fields.foundDate") || "Date & Time Found"}
              value={
                child.timeWhenChildFound
                  ? new Date(child.timeWhenChildFound).toLocaleString()
                  : "—"
              }
            />
            <InfoRow
              icon={Shield}
              label={t("children.registration.fields.socialWorkerId") || "Intake Social Worker ID"}
              value={child.socialWorkerCityIdNumber || "—"}
            />
            {child.reasonForReturn && (
              <InfoRow
                icon={RotateCcw}
                label={t("children.details.reasonForReturn") || "Return / Re-admission Reason"}
                value={child.reasonForReturn}
              />
            )}
          </CardContent>
        </Card>

        {/* Adoption & Placement Timeline Card */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
              <Heart className="size-3.5 text-[#1769AA]" />
              {t("children.details.adoptionHistoryTitle") || "Adoption & Matching Record"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-4">
            {latestMatch ? (
              <div className="space-y-3">
                <div className="bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
                      Match #{latestMatch.id}
                    </span>
                    <span className={cn(uiTokens.statusTag.base, uiTokens.statusTag.primary, "px-2 py-0.5 rounded-xs")}>
                      {latestMatch.status}
                    </span>
                  </div>
                  <InfoRow
                    label="Adoptive Parent"
                    value={
                      latestMatch.adopter
                        ? `${latestMatch.adopter.firstName} ${latestMatch.adopter.lastName}`
                        : "—"
                    }
                    subvalue={
                      latestMatch.adopter?.phoneNumber
                        ? `Phone: ${latestMatch.adopter.phoneNumber}`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Matched On"
                    value={new Date(latestMatch.matchedAt).toLocaleDateString()}
                  />
                  {latestMatch.matchedBy && (
                    <InfoRow
                      label="Matched By Officer"
                      value={`${latestMatch.matchedBy.firstName} ${latestMatch.matchedBy.lastName}`}
                      subvalue={latestMatch.matchedBy.employeeRole}
                    />
                  )}
                </div>

                {latestMatch.application?.id && (
                  <Link
                    href={`/adoption/adoption-requests/${latestMatch.application.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-[#1769AA] font-semibold hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Associated Adoption Application #{latestMatch.application.id}
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Heart className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
                <p className="text-xs font-medium">
                  {t("children.details.noAdoptionMatch") ||
                    "This child has not been matched with an adoptive parent yet."}
                </p>
                {currentStatus === "IN_CARE" && (
                  <p className="text-[11px] text-[#1769AA] mt-1 font-medium">
                    Eligible for matching when approved applications are reviewed.
                  </p>
                )}
              </div>
            )}

            {/* Reunification history if any */}
            {latestReunification && (
              <div className="mt-4 pt-3 border-t border-[#E3E7EB]">
                <p className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700 mb-2 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#1769AA]" />
                  Biological Parent Reunification
                </p>
                <div className="bg-[#F7F8FA] border border-[#E3E7EB] rounded-xs p-3 text-xs space-y-1 text-slate-700">
                  <p>
                    <strong>Parents:</strong> {latestReunification.fatherName || "—"} /{" "}
                    {latestReunification.motherName || "—"}
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    {latestReunification.contactPhoneNumber || "—"}
                  </p>
                  <p>
                    <strong>Court Order:</strong>{" "}
                    {latestReunification.courtOrderNumber || "—"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      latestReunification.reunificationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Transfer & Placement History Audit Trail ────────────────────────── */}
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
        <CardHeader className="bg-[#F7F8FA] border-b border-[#E3E7EB] py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-2 font-mono">
              <ArrowRightLeft className="size-3.5 text-[#1769AA]" />
              {t("children.details.transferHistoryTitle") ||
                "Placement & Status Transfer History"}
            </CardTitle>
            {child.transferHistory && child.transferHistory.length > 0 && (
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] rounded-xs border border-[#BCD5EA]">
                {child.transferHistory.length}{" "}
                {child.transferHistory.length === 1
                  ? t("children.details.recordSingular") || "record"
                  : t("children.details.recordPlural") || "records"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 px-4 pb-4">
          {child.transferHistory && child.transferHistory.length > 0 ? (
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E3E7EB]">
              {child.transferHistory.map((item, index) => {
                const fromMeta = STATUS_BADGES[item.fromStatus] || {
                  label: item.fromStatus,
                  statusType: "neutral" as const,
                  icon: Clock,
                };
                const toMeta = STATUS_BADGES[item.toStatus] || {
                  label: item.toStatus,
                  statusType: "neutral" as const,
                  icon: Clock,
                };
                const ToIcon = toMeta.icon;

                return (
                  <div key={item.id || index} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-[#1769AA] flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1769AA]" />
                    </div>

                    <div className="bg-[#F7F8FA] hover:bg-slate-50 border border-[#E3E7EB] hover:border-[#BCD5EA] rounded-xs p-3.5 transition-colors">
                      {/* Transition Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              uiTokens.statusTag.base,
                              uiTokens.statusTag[fromMeta.statusType] || uiTokens.statusTag.neutral,
                              "rounded-xs"
                            )}
                          >
                            {fromMeta.label}
                          </span>
                          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                          <span
                            className={cn(
                              uiTokens.statusTag.base,
                              uiTokens.statusTag[toMeta.statusType] || uiTokens.statusTag.neutral,
                              "rounded-xs font-bold"
                            )}
                          >
                            <ToIcon className="w-3 h-3 mr-1" />
                            {toMeta.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(item.transferredAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Transferred By */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1769AA]" />
                        <span>
                          {t("children.details.authorizedBy") ||
                            "Authorized by"}
                          :{" "}
                          <strong className="text-slate-800">
                            {item.transferredBy
                              ? `${item.transferredBy.firstName} ${item.transferredBy.lastName}`
                              : t("children.details.socialWorker") ||
                                "Social Worker / Officer"}
                          </strong>
                          {item.transferredBy?.employeeRole && (
                            <span className="text-slate-400 ml-1">
                              ({item.transferredBy.employeeRole})
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Destination Placement Details */}
                      {item.toStatus === "IN_CARE" &&
                        item.childCareFacility && (
                          <div className="bg-white border border-[#BCD5EA] rounded-xs p-2.5 text-xs text-slate-900 mb-2 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[#1769AA] shrink-0" />
                              <div>
                                <p className="font-semibold text-[#0B1F3A]">
                                  {item.childCareFacility.name}
                                </p>
                                {item.childCareFacility.place && (
                                  <p className="text-[11px] text-slate-500">
                                    {item.childCareFacility.place}
                                  </p>
                                )}
                              </div>
                            </div>
                            {item.childIdFromFacility && (
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block uppercase font-mono font-medium">
                                  {t("children.details.facilityChildId") ||
                                    "Facility ID"}
                                </span>
                                <span className="font-mono font-bold text-xs bg-[#E8F2FA] px-2 py-0.5 rounded-xs border border-[#BCD5EA] text-[#1769AA]">
                                  {item.childIdFromFacility}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                      {/* Custodian / Kinship details if recorded in history */}
                      {(item.toStatus === "IN_ADERA" ||
                        item.toStatus === "WITH_BLOOD_RELATIVE") &&
                        item.custodianDetails && (
                          <div className="bg-white border border-[#E3E7EB] rounded-xs p-2.5 text-xs text-slate-800 mb-2">
                            <div className="flex items-center gap-1.5 font-semibold mb-1 text-[#0B1F3A]">
                              <UserCheck className="w-3.5 h-3.5 text-[#1769AA]" />
                              <span>
                                {item.toStatus === "WITH_BLOOD_RELATIVE"
                                  ? t("children.details.relativeGuardian") ||
                                    "Kinship Guardian"
                                  : t("children.details.fosterCustodian") ||
                                    "Foster Custodian"}
                                : {item.custodianDetails.fullName || "—"}
                                {item.custodianDetails.relationship && (
                                  <span className="font-normal text-slate-500 ml-1">
                                    ({item.custodianDetails.relationship})
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                              {item.custodianDetails.phoneNumber && (
                                <span>
                                  Phone: {item.custodianDetails.phoneNumber}
                                </span>
                              )}
                              {item.custodianDetails.cityIdNumber && (
                                <span>
                                  ID: {item.custodianDetails.cityIdNumber}
                                </span>
                              )}
                              {item.custodianDetails.address && (
                                <span>
                                  Address: {item.custodianDetails.address}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Transfer Reason / Notes */}
                      {item.reason && (
                        <div className="text-xs text-slate-600 mt-1 bg-white border border-[#E3E7EB] rounded-xs p-2">
                          <span className="font-semibold text-slate-700">
                            {t("children.details.transferReason") ||
                              "Reason / Notes"}
                            :
                          </span>{" "}
                          {item.reason}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-1 opacity-40 text-slate-300" />
              <p className="text-xs font-medium">
                {t("children.details.noTransferHistory") ||
                  "Initial intake registration. No subsequent status transfers have been recorded for this child."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Transfer Status Dialog Modal ────────────────────────────────────── */}
      <TransferStatusDialog
        child={child}
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
    </div>
  );
}
