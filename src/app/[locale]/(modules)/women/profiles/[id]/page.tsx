"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetWomenProfileByIdQuery } from "@/hooks/womens";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  CalendarDays,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Edit,
  ToggleLeft,
} from "lucide-react";
import EditWomenProfileForm from "../_components/edit-women-profile-form";
import StatusToggleDialog from "../_components/status-toggle-dialog";
import { useTranslations } from "next-intl";
import CrossDepartmentHistory from "@/components/shared/cross-department-history";
import { uiTokens } from "@/styles/design-system";

const WomenProfileDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const t = useTranslations("women");

  const { data: profile, isLoading, isError } = useGetWomenProfileByIdQuery(id);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">{t("profileDetail.loading")}</div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-lg text-red-500">{t("profileDetail.error")}</div>
        <Button onClick={() => router.back()}>
          {t("profileDetail.goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-4">
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
              onClick={() => router.push("/women/profiles")}
              className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-600 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
                  {profile.client.firstName} {profile.client.lastName}
                </h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs">
                  {profile.client.cityIdNumber || "—"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{t("profileDetail.title")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {profile.approvalStatus && (
              <span
                className={`px-2.5 py-0.5 rounded-xs text-xs font-semibold border ${
                  profile.approvalStatus === "APPROVED"
                    ? uiTokens.statusTag.primary
                    : profile.approvalStatus === "PENDING"
                      ? uiTokens.statusTag.warning
                      : uiTokens.statusTag.danger
                }`}
              >
                {t(
                  `status.approval.${
                    profile.approvalStatus === "PENDING"
                      ? "PENDING_APPROVAL"
                      : profile.approvalStatus
                  }`,
                )}
              </span>
            )}
            {profile.isActive ? (
              <span className={`px-2.5 py-0.5 rounded-xs text-xs font-semibold border ${uiTokens.statusTag.primary}`}>
                {t("profileDetail.active")}
              </span>
            ) : (
              <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium border ${uiTokens.statusTag.neutral}`}>
                {t("profileDetail.inactive")}
              </span>
            )}
            <Button
              onClick={() => setEditDialogOpen(true)}
              className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer ml-2"
            >
              <Edit className="h-3.5 w-3.5" />
              {t("profileDetail.editProfile")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(true)}
              className="h-8 rounded-xs text-xs font-medium border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] cursor-pointer"
            >
              <ToggleLeft className="h-3.5 w-3.5 mr-1" />
              {t("profileDetail.toggleStatus")}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Information Cards - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Personal Information */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <User className="h-4 w-4 text-[#1769AA]" />
              {t("profileDetail.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div>
              <p className="text-slate-500 font-medium">
                {t("form.cityIdNumber")}
              </p>
              <p className="font-mono font-semibold text-slate-800 mt-0.5">{profile.client.cityIdNumber || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">
                {t("profileDetail.fullName")}
              </p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {profile.client.firstName} {profile.client.lastName}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">
                {t("form.age")}
              </p>
              <p className="font-mono font-semibold text-slate-800 mt-0.5">
                {profile.client.age ??
                  (profile.client.dateOfBirth
                    ? Math.floor(
                        (Date.now() -
                          new Date(profile.client.dateOfBirth).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )
                    : "—")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <Phone className="h-4 w-4 text-[#1769AA]" />
              {t("profileDetail.contactInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div>
              <p className="text-slate-500 font-medium">
                {t("form.phoneNumber")}
              </p>
              <p className="font-mono font-semibold text-slate-800 mt-0.5">{profile.client.phoneNumber || "—"}</p>
            </div>
            {(profile.client.subCity || profile.client.woreda) && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-500 font-medium">
                    {t("form.subCity")}
                  </p>
                  <p className="font-semibold text-slate-800 mt-0.5">{profile.client.subCity || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">
                    {t("form.woreda")}
                  </p>
                  <p className="font-semibold text-slate-800 mt-0.5">{profile.client.woreda || "—"}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-slate-500 font-medium">
                {t("form.fullAddress")}
              </p>
              <p className="font-semibold text-slate-800 mt-0.5">{profile.client.address || "—"}</p>
            </div>
            {profile.client.contactInfo?.email && (
              <div>
                <p className="text-slate-500 font-medium">
                  {t("profileDetail.email")}
                </p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">
                  {profile.client.contactInfo.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education & Career */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <GraduationCap className="h-4 w-4 text-[#1769AA]" />
              {t("profileDetail.educationEmployment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div>
              <p className="text-slate-500 font-medium">
                {t("form.educationLevel")}
              </p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {(() => {
                  const level = profile.educationLevel;
                  if (!level) return "—";
                  try {
                    if (t.has(`form.educationOptions.${level}`)) {
                      return t(`form.educationOptions.${level}`);
                    }
                  } catch {}
                  return level;
                })()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">
                {t("form.careerStatus")}
              </p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {(() => {
                  const status = profile.careerStatus || profile.occupation;
                  if (!status) return "—";
                  try {
                    if (t.has(`form.careerOptions.${status}`)) {
                      return t(`form.careerOptions.${status}`);
                    }
                  } catch {}
                  return status;
                })()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs md:col-span-2 lg:col-span-3">
          <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              <CalendarDays className="h-4 w-4 text-[#1769AA]" />
              {t("profileDetail.additionalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {profile.photoUrl && (
                <div>
                  <p className="text-slate-500 font-medium">
                    {t("form.photoUrl")}
                  </p>
                  <a
                    href={profile.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1769AA] hover:underline text-xs font-semibold mt-0.5 block"
                  >
                    {t("profileDetail.viewPhoto")}
                  </a>
                </div>
              )}
              <div>
                <p className="text-slate-500 font-medium">
                  {t("profileDetail.clientCategory")}
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">{profile.client.clientCategory || "—"}</p>
              </div>
              {profile.createdAt && (
                <div>
                  <p className="text-slate-500 font-medium">
                    {t("profileDetail.registeredOn")}
                  </p>
                  <p className="font-mono text-slate-800 mt-0.5">
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
              {profile.updatedAt && (
                <div>
                  <p className="text-slate-500 font-medium">
                    {t("profileDetail.lastUpdated")}
                  </p>
                  <p className="font-mono text-slate-800 mt-0.5">
                    {new Date(profile.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-department support history */}
      {profile.client?.id && (
        <CrossDepartmentHistory
          clientId={profile.client.id}
          personName={`${profile.client.firstName} ${profile.client.lastName}`}
          cityIdNumber={profile.client.cityIdNumber ?? undefined}
          defaultExpanded={true}
        />
      )}

      <EditWomenProfileForm
        profile={profile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <StatusToggleDialog
        profile={profile}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
};

export default WomenProfileDetail;