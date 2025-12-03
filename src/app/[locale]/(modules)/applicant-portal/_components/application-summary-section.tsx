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
  const applicationMessages = useTranslations("applicationMessages");
  const [loading, setLoading] = useState(false);
  const { application, setApplication } = useFetchedAdoptionApplicationStore();
  const { data: applications , isLoading, isError } = useFetchApplicationQuery();
  
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (isError) {
      if (applications === undefined){
         toast.error("Failed to load application data.");
      }
      setApplication(null);
      return;
    }

    if (applications && applications.length > 0) {
      setApplication(applications[0]);
    } else {
      setApplication(null);
    }
  }, [applications, isLoading, isError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Application Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : application ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mx-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Application ID
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
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : "Unknown";

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
                  Submitted Date
                </p>
                <p className="text-gray-900">
                  {new Date(
                    application.submittedDate ??
                      application.createdAt ??
                      Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">
                  Last Updated
                </p>
                <p className="text-gray-900">
                  {new Date(
                    application.lastUpdated ??
                      application.updatedAt ??
                      Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/applicant-portal/portal/application-details`}>
                  {applicationMessages("appSummary.cta")}
                </Link>
              </Button>
            </div>

            {application.status === "PENDING_REVIEW" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your application is currently under review. We will notify you
                  once there are updates.
                </p>
              </div>
            )}
            {application.status === "PENDING_HOME_VISIT" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your application is currently pending a home visit. We will
                  notify you once there are updates.
                </p>
              </div>
            )}
            {application.status === "RETURNED" && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your application has been returned by the expert with
                  comments. Please review the feedback provided and resubmit
                  your application after addressing the comments.
                </p>
              </div>
            )}
            {application.status === "REJECTED" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  We regret to inform you that your adoption application has
                  been rejected. For more information, please contact our support
                  team.
                </p>
              </div>
            )}
            {application.status === "MATCHED" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Congratulations! Your adoption application has been matched. Our team will reach out to you with the next steps.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Application Found
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't submitted an adoption application yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
