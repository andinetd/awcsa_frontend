"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, CheckCircle, FileText, Eye } from "lucide-react";
import { useFetchedAdoptionApplicationStore } from "@/stores/fetched-adoption-application";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import Link from "next/link";
import { formatAge } from "@/lib/utils";
import { DynamicBreadcrumb } from "@/components/shared/dynamic-breadcrumb";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/shared/language-switcher";
import { ArrowLeft } from "lucide-react";
import router from "next/router";
import { useFetchApplicationQuery } from "@/hooks/applicants-portal";
import { FollowUpReportsSection } from "@/app/[locale]/(modules)/adoption/adoption-requests/_components/follow-up-reports-section";

export default function Details() {
  const { application: storedApp, setApplication } = useFetchedAdoptionApplicationStore();
  const { data: fetchedApps, isLoading: isFetching } = useFetchApplicationQuery();
  const application =
    storedApp ??
    (fetchedApps && fetchedApps.length > 0 ? fetchedApps[0] : null);

  useEffect(() => {
    if (
      fetchedApps &&
      fetchedApps.length > 0 &&
      (!storedApp || (!storedApp.matchId && fetchedApps[0].matchId))
    ) {
      setApplication(fetchedApps[0]);
    }
  }, [fetchedApps, storedApp, setApplication]);

  const { token } = useAuthStore();
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const t = useTranslations("applicants-portal");

  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          // ignore
        }
      });
    };
  }, [objectUrls]);

  const getFileByField = (fieldName: string) => {
    return application?.files?.find(
      (f: any) => f.fieldName === fieldName || f.fileName === fieldName,
    );
  };

  const viewRemoteFile = async (publicId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/adoption/files/${publicId}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setObjectUrls((s) => [...s, url]);
      window.open(url, "_blank");
    } catch (e: any) {
      console.error("Unable to preview file", e);
      toast.error(t("review.unableToPreview"));
    }
  };

  const fileCard = (f: any, label?: string) => {
    if (!f) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between"></div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {label ?? t("applicationDetails.noFile")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("applicationDetails.noFileUploaded")}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between"></div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {f.fileName ?? f.publicId}
              </p>
              <p className="text-xs text-gray-500">
                {f.fileType ?? t("applicationDetails.fields.file")}
              </p>
            </div>
            <div className="ml-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:cursor-pointer border-blue-200 rounded-lg text-blue-500 hover:text-blue-600"
                onClick={() => viewRemoteFile(f.publicId)}
              >
                <Eye className="text-sm" /> {t("applicationDetails.view")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!application) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t("applicationDetails.noApplication")}</p>
      </div>
    );
  }

  const form = application.formData ?? application.applicationInfo ?? {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/applicant-portal/portal">
            <Button variant="ghost" size="icon" className="rounded-full shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("applicationDetails.title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">{t("applicationDetails.subtitle")}</p>
          </div>
        </div>
        <div className="self-end sm:self-auto">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("applicationDetails.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.id")}
                </span>
                {fileCard(
                  getFileByField("idDocument"),
                  t("applicationDetails.fields.id"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.birthCertificate")}:
                </span>
                {fileCard(
                  getFileByField("birthCertificate"),
                  t("applicationDetails.fields.birthCertificate"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.incomeDocument")}:
                </span>
                {fileCard(
                  getFileByField("incomeDocument"),
                  t("applicationDetails.fields.incomeDocument"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.medical")}:
                </span>
                {fileCard(
                  getFileByField("medicalDocument"),
                  t("applicationDetails.fields.medical"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.criminalDocument")}:
                </span>
                {fileCard(
                  getFileByField("criminalClearance"),
                  t("applicationDetails.fields.criminalDocument"),
                )}
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {t("applicationDetails.details")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.cityIdNumber")}
                  </span>
                  <p className="text-gray-900">
                    {form.cityIdNumber ??
                      application.client?.cityIdNumber ??
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.dateOfBirth")}
                  </span>
                  <p className="text-gray-900">
                    {form.dateOfBirth ?? application.client?.dateOfBirth ?? "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.address")}
                  </span>
                  <p className="text-gray-900">
                    {form.address ?? application.client?.address ?? "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.educationLevel")}
                  </span>
                  <p className="text-gray-900">
                    {form.educationLevel ??
                      application.adoptionData?.educationLevel ??
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.occupation")}
                  </span>
                  <p className="text-gray-900">
                    {form.occupation ??
                      application.adoptionData?.occupation ??
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.monthlyIncome")}
                  </span>
                  <p className="text-gray-900">
                    {String(
                      form.monthlyIncome ??
                        application.adoptionData?.monthlyIncome ??
                        "-",
                    )}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.spouseCityIdNumber")}
                  </span>
                  <p className="text-gray-900">
                    {form.spouseCityIdNumber ??
                      application.adoptionData?.spouseCityIdNumber ??
                      "-"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.preferredChildren")}
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.ageMin")}
                      </p>
                      <p className="text-gray-900">
                        {formatAge(form.preferredChildren?.ageRange?.min) ??
                          formatAge(
                            application.adoptionData?.preferredChildren
                              ?.ageRange?.min,
                          ) ??
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.ageMax")}
                      </p>
                      <p className="text-gray-900">
                        {formatAge(form.preferredChildren?.ageRange?.max) ??
                          formatAge(
                            application.adoptionData?.preferredChildren
                              ?.ageRange?.max,
                          ) ??
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.number")}
                      </p>
                      <p className="text-gray-900">
                        {form.preferredChildren?.number ??
                          application.adoptionData?.preferredChildren?.number ??
                          "-"}
                      </p>
                    </div>
                    <div className="md:col-span-3 mt-1">
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.preferredSex")}
                      </p>
                      <p className="text-gray-900">
                        {form.preferredChildren?.sex ??
                          application.adoptionData?.preferredChildren?.sex ??
                          "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("applicationDetails.additionalDocs")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.marriageCertificate")}
                </span>
                {fileCard(
                  getFileByField("marriageCertificate") ??
                    getFileByField("marriage_certificate"),
                  t("applicationDetails.fields.marriageCertificate"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.maritalStatus")}:
                </span>
                {fileCard(
                  getFileByField("maritalStatusDocument"),
                  t("applicationDetails.fields.maritalStatus"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.wellBeing")}:
                </span>
                {fileCard(
                  getFileByField("psychologicalWellbeing"),
                  t("applicationDetails.fields.wellBeing"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.photo")}:
                </span>
                {fileCard(
                  getFileByField("photo"),
                  t("applicationDetails.fields.photo"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.criminalDocument")}:
                </span>
                {fileCard(
                  getFileByField("criminalClearance"),
                  t("applicationDetails.fields.criminalDocument"),
                )}
              </div>
            </div>
            {application.remark &&
              (application.status === "RETURNED" ||
                application.status === "PENDING_REVIEW") && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    {t("applicationDetails.reviewerComment")}
                  </h4>
                  <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-gray-900">
                    {application.remark}
                  </div>
                </div>
              )}

            {application.status === "RETURNED" && (
              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/applicant-portal/portal/resubmit-application`}>
                    {t("form.resubmit")}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Post-Match Follow-Up Reports Section */}
      {(application.status || "").toUpperCase() === "MATCHED" && (
        <div id="follow-up-reports" className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-emerald-900">
                  {t("applicationDetails.matchedBannerTitle")}
                </h3>
                <p className="text-sm text-emerald-800 mt-1">
                  {t("applicationDetails.matchedBannerDesc")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <FollowUpReportsSection
              matchId={application.matchId ?? application.adoptionMatches?.[0]?.id}
              matchStatus={application.matchStatus ?? application.adoptionMatches?.[0]?.status ?? "ACTIVE"}
              isOfficer={false}
            />
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">
              {t("applicationDetails.submitted")}
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              {t("applicationDetails.submittedOn")}{" "}
              {new Date(
                application.createdAt ?? Date.now(),
              ).toLocaleDateString()}
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
