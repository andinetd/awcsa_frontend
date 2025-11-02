"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "sonner";
import { useFetchedAdoptionApplicationStore } from "@/stores/fetched-adoption-application";

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
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(false);
  const { application, setApplication } = useFetchedAdoptionApplicationStore();

  useEffect(() => {
    let mounted = true;
    const userId = user?.id;
    if (!userId) return;

    async function fetchApplication() {
      setLoading(true);
      try {
        const url = `${BASE_URL}/public/adoption/applications`;

        const config = {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          timeout: 10000,
        };

        const res = await axios.get(url, config);
        if (!mounted) return;
        // Expecting either a single object or an array — pick the first if array
        const payload = res.data;
        console.log("Fetched application payload:", payload);
        if (!payload) {
          setApplication(null);
          return;
        }

        // Normalise response shape. Backend may return either:
        // - an array of applications
        // - a single application object
        // - an envelope { message, data } where data is array or object
        let app: any = null;
        if (Array.isArray(payload)) {
          app = payload[0] ?? null;
        } else if (payload.data) {
          app = Array.isArray(payload.data)
            ? payload.data[0] ?? null
            : payload.data;
        } else {
          app = payload;
        }

        if (mounted) setApplication(app);
      } catch (err: any) {
        console.error("Failed to load applicant application", err);
        setApplication(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchApplication();
    return () => {
      mounted = false;
    };
  }, [user]);

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
