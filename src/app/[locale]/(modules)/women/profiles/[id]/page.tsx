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
    <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/women/profiles")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {profile.client.firstName} {profile.client.lastName}
            </h1>
            <p className="text-muted-foreground">{t("profileDetail.title")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profile.approvalStatus && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.approvalStatus === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : profile.approvalStatus === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
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
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {t("profileDetail.active")}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
              {t("profileDetail.inactive")}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => setEditDialogOpen(true)}>
          <Edit className="h-4 h-4 mr-2" />
          {t("profileDetail.editProfile")}
        </Button>
        <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
          <ToggleLeft className="h-4 h-4 mr-2" />
          {t("profileDetail.toggleStatus")}
        </Button>
      </div>

      {/* Profile Information Cards - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 h-5" />
              {t("profileDetail.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.cityIdNumber")}
              </p>
              <p className="font-medium">{profile.client.cityIdNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("profileDetail.fullName")}
              </p>
              <p className="font-medium">
                {profile.client.firstName} {profile.client.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.age")}
              </p>
              <p className="font-medium">
                {profile.client.age ??
                  (profile.client.dateOfBirth
                    ? Math.floor(
                        (Date.now() -
                          new Date(profile.client.dateOfBirth).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )
                    : "-")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="h-5 h-5" />
              {t("profileDetail.contactInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.phoneNumber")}
              </p>
              <p className="font-medium">{profile.client.phoneNumber || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.addressTitle")}
              </p>
              <p className="font-medium">{profile.client.address || "-"}</p>
            </div>
            {profile.client.contactInfo?.email && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("profileDetail.email")}
                </p>
                <p className="font-medium">
                  {profile.client.contactInfo.email}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education & Career */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-5 h-5" />
              {t("profileDetail.educationEmployment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("form.educationLevel")}
              </p>
              <p className="font-medium">
                {(() => {
                  const level = profile.educationLevel;
                  if (!level) return "-";
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
              <p className="text-sm text-muted-foreground">
                {t("form.careerStatus")}
              </p>
              <p className="font-medium">
                {(() => {
                  const status = profile.careerStatus || profile.occupation;
                  if (!status) return "-";
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
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 h-5" />
              {t("profileDetail.additionalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.photoUrl && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("form.photoUrl")}
                  </p>
                  <a
                    href={profile.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {t("profileDetail.viewPhoto")}
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("profileDetail.clientCategory")}
                </p>
                <p className="font-medium">{profile.client.clientCategory}</p>
              </div>
              {profile.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("profileDetail.registeredOn")}
                  </p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
              {profile.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("profileDetail.lastUpdated")}
                  </p>
                  <p className="font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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