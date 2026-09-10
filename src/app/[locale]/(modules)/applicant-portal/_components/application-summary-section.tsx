"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFetchedAdoptionApplicationStore } from "@/stores/fetched-adoption-application";
import { useFetchApplicationQuery } from "@/hooks/applicants-portal";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending_review":
      return <Clock className="h-4 w-4" />;
    case "pending_home_visit":
      return <CheckCircle className="h-4 w-4" />;
    case "returned":
      return <Clock className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending_review":
      return "bg-yellow-100 text-yellow-800";
    case "pending_home_visit":
      return "bg-green-100 text-green-800";
    case "matched":
      return "bg-green-100 text-green-800";
    case "returned":
      return "bg-blue-100 text-blue-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ApplicationSummarySection() {
  const t = useTranslations("applicants-portal");
  const [loading, setLoading] = useState(false);
  const { application, setApplication } = useFetchedAdoptionApplicationStore();
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useFetchApplicationQuery();

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (isError && applications === undefined) {
      const err: any = error;
      const status =
        err?.status ||
        err?.response?.status ||
        err?.statusCode ||
        err?.data?.statusCode;
      const message =
        err?.message ||
        err?.data?.message ||
        err?.response?.data?.message ||
        "";

      const isNotFound =
        status === 404 ||
        /No adoption applications found/i.test(String(message));

      if (isNotFound) {
        setApplication(null);
        return;
      }

      toast.error("Failed to load application data.");
      setApplication(null);
      return;
    }

    if (applications && applications.length > 0) {
      setApplication(applications[0]);
    } else {
      setApplication(null);
    }
  }, [applications, isLoading, isError, error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t("appSummary.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">{t("appSummary.loading")}</div>
        ) : application ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mx-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {t("appSummary.applicationId")}
                </p>
                <p className="text-gray-900">
                  {application.id ?? application.applicationId ?? "-"}
                </p>
              </div>
              {(() => {
                const rawStatus =
                  application.status ??
                  application.reviewInfo?.status ??
                  application.applicationInfo?.status ??
                  "";
                const status = String(rawStatus ?? "").toLowerCase();
                const display = status
                  ? t(`statuses.${status}`)
                  : t("adoptionDetail.matching.unknown");

                return (
                  <Badge className={getStatusColor(status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(status)}
                      {display}
                    </span>
                  </Badge>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  {t("appSummary.submittedDate")}
                </p>
                <p className="text-gray-900">
                  {new Date(
                    application.submittedDate ??
                      application.createdAt ??
                      Date.now(),
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  {t("appSummary.lastUpdated")}
                </p>
                <p className="text-gray-900">
                  {new Date(
                    application.lastUpdated ??
                      application.updatedAt ??
                      Date.now(),
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/applicant-portal/portal/application-details`}>
                  {t("appSummary.cta")}
                </Link>
              </Button>
            </div>

            {application.status === "PENDING_REVIEW" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t("appSummary.statuses.pending_review")}
                </p>
              </div>
            )}
            {application.status === "PENDING_HOME_VISIT" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t("appSummary.statuses.pending_home_visit")}
                </p>
              </div>
            )}
            {application.status === "RETURNED" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t("appSummary.statuses.returned")}
                </p>
              </div>
            )}
            {application.status === "REJECTED" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  {t("appSummary.statuses.rejected")}
                </p>
              </div>
            )}
            {application.status === "MATCHED" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                <p className="text-sm text-green-800">
                  {t("appSummary.statuses.matched")}
                </p>
                <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Link href="/applicant-portal/portal/application-details#follow-up-reports">
                    {t("appSummary.submitFollowUpReports")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("appSummary.noApplication")}
            </h3>
            <p className="text-gray-500 mb-4">
              {t("appSummary.noApplicationDesc")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
