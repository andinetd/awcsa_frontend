"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
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

const STATUS_BADGES: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  FOUND: {
    label: "Found / Abandoned",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    icon: Clock,
  },
  IN_CARE: {
    label: "In Care (Eligible for Adoption)",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Building2,
  },
  IN_ADERA: {
    label: "In Adera (Foster Custody)",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: HeartHandshake,
  },
  WITH_BLOOD_RELATIVE: {
    label: "With Blood Relative",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: Users,
  },
  ADOPTED: {
    label: "Adopted (Legally Placed)",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: CheckCircle2,
  },
  RETURNED: {
    label: "Returned (Reunified)",
    color: "bg-rose-100 text-rose-800 border-rose-300",
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
  <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0 gap-3">
    <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm shrink-0">
      {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      <span>{label}</span>
    </div>
    <div className="text-right min-w-0">
      <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
        {value || "—"}
      </div>
      {subvalue && (
        <div className="text-[11px] text-slate-400 mt-0.5">{subvalue}</div>
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
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: Clock,
  };
  const StatusIcon = statusCfg.icon;

  const latestMatch = child.adoptionMatches?.[0];
  const latestReunification = child.reunifications?.[0];

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 max-w-7xl space-y-6 animate-fadeIn">
      {/* ── Header Bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/adoption/children">
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {fullName}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${statusCfg.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              {child.childIdFromFacility && (
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-indigo-700 font-semibold">
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm text-xs sm:text-sm cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
            {t("children.details.transferStatusBtn") || "Transfer Status"}
          </Button>
        </div>
      </div>

      {/* ── Status Banners ─────────────────────────────────────────────────── */}
      {currentStatus === "IN_CARE" && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-md flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {t("children.details.inCareBannerTitle") ||
                  "Child Eligible for Adoption Matching"}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {t("children.details.inCareBannerDesc") ||
                  "This child is placed in institutional care and can be selected for matching with approved adoptive parents."}
              </p>
            </div>
          </div>
          <Link href="/adoption/adoption-requests">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-indigo-700 hover:bg-blue-50 text-xs font-bold"
            >
              {t("children.details.viewAdoptionRequests") ||
                "View Adoption Requests"}
            </Button>
          </Link>
        </div>
      )}

      {currentStatus === "RETURNED" && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-start gap-3 text-rose-900 shadow-sm">
          <div className="p-2 bg-rose-100 rounded-lg shrink-0">
            <RotateCcw className="w-5 h-5 text-rose-700" />
          </div>
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-rose-950 text-sm mb-0.5">
              {t("children.details.returnedBannerTitle") ||
                "Reunified with Biological Family"}
            </h4>
            <p className="text-rose-800 leading-relaxed">
              {child.reasonForReturn ||
                latestReunification?.reunificationReason ||
                "Child was returned to biological family following formal reunification procedures."}
            </p>
          </div>
        </div>
      )}

      {/* ── 2-Column Details Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              {t("children.details.biodataTitle") || "Child Biodata & Identity"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
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
              <div className="pt-3 mt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  {t("children.details.additionalNotes") || "Special Observations"}
                </p>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                  {child.additionalInfo}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institutional Placement & Care Center Card */}
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              {t("children.details.placementTitle") || "Care Facility & Placement"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
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
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                {t("children.details.custodianTitle") || "Assigned Custodian / Guardian"}
              </p>
              {child.custodian ? (
                <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-3 space-y-1">
                  <p className="text-xs font-bold text-purple-900">
                    {child.custodian.firstName} {child.custodian.lastName}
                  </p>
                  <p className="text-xs text-purple-700">
                    Phone: {child.custodian.phoneNumber || "—"} | City ID:{" "}
                    {child.custodian.cityIdNumber || "—"}
                  </p>
                  <p className="text-[11px] text-purple-600">
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
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              {t("children.details.intakeTitle") || "Intake History & Origin"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
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
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              {t("children.details.adoptionHistoryTitle") || "Adoption & Matching Record"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {latestMatch ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      Match #{latestMatch.id}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold border border-emerald-300">
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
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
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
                  <p className="text-[11px] text-blue-600 mt-1">
                    Eligible for matching when approved applications are reviewed.
                  </p>
                )}
              </div>
            )}

            {/* Reunification history if any */}
            {latestReunification && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Biological Parent Reunification
                </p>
                <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3 text-xs space-y-1 text-slate-700">
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

      {/* ── Transfer Status Dialog Modal ────────────────────────────────────── */}
      <TransferStatusDialog
        child={child}
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
    </div>
  );
}
