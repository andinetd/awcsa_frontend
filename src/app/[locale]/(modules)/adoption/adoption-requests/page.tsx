"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/custom/custom-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/lib/base-url";

export type BackendDocument = {
  publicId: string;
  fieldName: string;
  fileType: string;
  fileName: string;
};

export type BackendApplicantInfo = {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  cityIdNumber?: string;
  spouseCityIdNumber?: string | null;
  address?: string;
  educationLevel?: string;
  occupation?: string;
  monthlyIncome?: number | null;
  familyMembersCount?: number | null;
};

export type BackendApplicationInfo = {
  eligibleDate?: string | null;
  spouseAgreement?: boolean;
  preferredChildren?: {
    sex?: string;
    number?: number;
    ageRange?: { min?: number; max?: number };
  } | null;
  documents: BackendDocument[];
};

export type BackendReviewInfo = {
  remark?: string | null;
  subCity?: string | null;
  woreda?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BackendAdoptionApplication = {
  applicationId: number;
  status: string;
  applicantInfo: BackendApplicantInfo;
  applicationInfo: BackendApplicationInfo;
  reviewInfo?: BackendReviewInfo;
  matchedChildId?: number | null;
};


const TABS = [
  { value: "pending", label: "Pending" },
  { value: "returned", label: "Returned to Applicant" },
  { value: "pending_home_visit", label: "Pending Home Visit" },
  { value: "pending_approval", label: "Pending Approval" }, 
  { value: "matched", label: "Matched" },
  { value: "denied", label: "Denied" },  
];

const AdoptionRequests = () => {
  const router = useRouter();
  const [tab, setTab] = useState("pending");
  const token = useAuthStore((s) => s.token);

  // applications state — start with mock data for fast dev, then replace when fetch completes
  const [applications, setApplications] =
    useState<BackendAdoptionApplication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchApps() {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/adoption/applications?Status=ALL`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          toast.error(
            `Failed to load applications: ${res.status} ${res.statusText}` +
              (text ? ` - ${text}` : "")
          );
          setLoading(false);
          return;
        }

        const data = await res.json().catch(() => null);
        if (!mounted) return;
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (data && Array.isArray(data.items)) {
          // fallback if API wraps results
          setApplications(data.items);
        } else {
          // unknown shape — keep mock and warn
          toast.error("Unexpected applications response shape");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error loading applications");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchApps();
    return () => {
      mounted = false;
    };
  }, [token]);

  // Map backend statuses to tab values used in the UI
  const mapStatusToTab = (status: string) => {
    switch ((status || "").toUpperCase()) {
      case "PENDING_REVIEW":
        return "pending";
      case "PENDING_HOME_VISIT":
        return "pending_home_visit";
      case "PENDING_APPROVAL":
        return "pending_approval";
      case "MATCHED":
        return "matched";
      case "REJECTED":
        return "denied";
      case "RETURNED":
        return "returned";
      default:
        return status?.toLowerCase() || "pending";
    }
  };

  // Filter applications by UI tab value
  const filteredApps = (status: string) =>
    applications.filter((app) => mapStatusToTab(app.status) === status);

  return (
    <div className="p-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="capitalize">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="w-full">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="text-gray-500 italic">Loading...</div>
              ) : filteredApps(t.value).length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No applications found in this category.
                </div>
              ) : (
                filteredApps(t.value).map((app, idx) => (
                  <Card
                    key={app.applicationId}
                    className="p-5 flex flex-col gap-2 shadow-md border border-gray-200"
                  >
                    <div className="font-bold text-lg mb-1">
                      {`${app.applicantInfo.firstName} ${app.applicantInfo.lastName}`}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Application ID: {String(app.applicationId)}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      Submitted:{" "}
                      {new Date(
                        app.reviewInfo?.createdAt ?? ""
                      ).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        href={`/adoption/adoption-requests/${String(
                          app.applicationId
                        )}`}
                        passHref
                      >
                        <Button size="sm">
                          {t.value === "pending" ? "Review" : "View"}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdoptionRequests;
