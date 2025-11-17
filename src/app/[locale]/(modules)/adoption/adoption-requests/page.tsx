"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
};

// // Example/mock data shaped like the backend payload the server returns.
// export const mockApplications: BackendAdoptionApplication[] = [
//   {
//     applicationId: 1,
//     status: "PENDING_REVIEW",
//     applicantInfo: {
//       firstName: "Abel",
//       lastName: "Mulat",
//       dateOfBirth: "2000-06-18T00:00:00.000Z",
//       phoneNumber: "0911677687",
//       cityIdNumber: "ET123456",
//       spouseCityIdNumber: null,
//       address: "address",
//       educationLevel: "secondary",
//       occupation: "Doctor",
//       monthlyIncome: 12000,
//       familyMembersCount: null,
//     },
//     applicationInfo: {
//       eligibleDate: null,
//       spouseAgreement: true,
//       preferredChildren: {
//         sex: "MALE",
//         number: 1,
//         ageRange: { min: 10, max: 14 },
//       },
//       documents: [
//         {
//           publicId: "8dda04e9-df20-41c0-b870-89f0b786bdc5",
//           fieldName: "marriageCertificate",
//           fileType: "application/pdf",
//           fileName: "Abel Mulat.pdf",
//         },
//         {
//           publicId: "46cd2086-cc95-4978-b865-181b240c59a2",
//           fieldName: "maritalStatusDocument",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_5..pdf",
//         },
//         {
//           publicId: "fb052d1a-3171-4bb2-993e-ac08f6c0a7bd",
//           fieldName: "photo",
//           fileType: "image/jpeg",
//           fileName: "wallpaperflare.com_wallpaper (6).jpg",
//         },
//         {
//           publicId: "8ceb2e09-46ec-4092-8c2b-3a37781169b3",
//           fieldName: "incomeDocument",
//           fileType: "application/pdf",
//           fileName: "HCI Activity 01.pdf",
//         },
//         {
//           publicId: "31797884-b8ea-4dd5-85a3-a53b36b9b19b",
//           fieldName: "psychologicalWellbeing",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_06.pdf",
//         },
//         {
//           publicId: "d8618568-b49e-4672-867a-61d0eae6f6ca",
//           fieldName: "medicalDocument",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_06.pdf",
//         },
//         {
//           publicId: "8199944d-720c-4789-926b-0af8b04b6a99",
//           fieldName: "criminalClearance",
//           fileType: "application/pdf",
//           fileName: "FLAT_Assignment_ETS0029_14.pdf",
//         },
//         {
//           publicId: "b9d5d9d0-772e-4523-a185-f143e9a7621a",
//           fieldName: "birthCertificate",
//           fileType: "application/pdf",
//           fileName: "COA_Assignment_ETS0028_14_&_ET0029_14.pdf",
//         },
//         {
//           publicId: "6a4a05d0-a643-4513-bb42-1650cc9cd791",
//           fieldName: "idDocument",
//           fileType: "application/pdf",
//           fileName: "COA_Assignment_ETS0028_14_&_ET0029_14.pdf",
//         },
//       ],
//     },
//     reviewInfo: {
//       remark: null,
//       subCity: null,
//       woreda: null,
//       createdAt: "2025-10-23T18:24:38.720Z",
//       updatedAt: "2025-10-23T18:24:38.720Z",
//     },
//   },
//   {
//     applicationId: 2,
//     status: "PENDING_REVIEW",
//     applicantInfo: {
//       firstName: "Abel",
//       lastName: "Mulat",
//       dateOfBirth: "2000-06-18T00:00:00.000Z",
//       phoneNumber: "0911677687",
//       cityIdNumber: "ET123456",
//       spouseCityIdNumber: null,
//       address: "address",
//       educationLevel: "secondary",
//       occupation: "Doctor",
//       monthlyIncome: 12000,
//       familyMembersCount: null,
//     },
//     applicationInfo: {
//       eligibleDate: null,
//       spouseAgreement: true,
//       preferredChildren: {
//         sex: "MALE",
//         number: 1,
//         ageRange: { min: 12, max: 14 },
//       },
//       documents: [
//         {
//           publicId: "8dda04e9-df20-41c0-b870-89f0b786bdc5",
//           fieldName: "marriageCertificate",
//           fileType: "application/pdf",
//           fileName: "Abel Mulat.pdf",
//         },
//         {
//           publicId: "46cd2086-cc95-4978-b865-181b240c59a2",
//           fieldName: "maritalStatusDocument",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_5..pdf",
//         },
//         {
//           publicId: "0ff232a3-487a-4a2b-ac5c-5ebeb32e66df",
//           fieldName: "photo",
//           fileType: "application/pdf",
//           fileName: "ETS0029_In_Depth_Activity_3.pdf",
//         },
//         {
//           publicId: "8ceb2e09-46ec-4092-8c2b-3a37781169b3",
//           fieldName: "incomeDocument",
//           fileType: "application/pdf",
//           fileName: "HCI Activity 01.pdf",
//         },
//         {
//           publicId: "31797884-b8ea-4dd5-85a3-a53b36b9b19b",
//           fieldName: "psychologicalWellbeing",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_06.pdf",
//         },
//         {
//           publicId: "d8618568-b49e-4672-867a-61d0eae6f6ca",
//           fieldName: "medicalDocument",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_06.pdf",
//         },
//         {
//           publicId: "8199944d-720c-4789-926b-0af8b04b6a99",
//           fieldName: "criminalClearance",
//           fileType: "application/pdf",
//           fileName: "FLAT_Assignment_ETS0029_14.pdf",
//         },
//         {
//           publicId: "b9d5d9d0-772e-4523-a185-f143e9a7621a",
//           fieldName: "birthCertificate",
//           fileType: "application/pdf",
//           fileName: "COA_Assignment_ETS0028_14_&_ET0029_14.pdf",
//         },
//         {
//           publicId: "6a4a05d0-a643-4513-bb42-1650cc9cd791",
//           fieldName: "idDocument",
//           fileType: "application/pdf",
//           fileName: "COA_Assignment_ETS0028_14_&_ET0029_14.pdf",
//         },
//       ],
//     },
//     reviewInfo: {
//       remark: null,
//       subCity: null,
//       woreda: null,
//       createdAt: "2025-10-23T19:12:36.080Z",
//       updatedAt: "2025-10-23T19:12:36.080Z",
//     },
//   },
//   {
//     applicationId: 3,
//     status: "PENDING_REVIEW",
//     applicantInfo: {
//       firstName: "Abel",
//       lastName: "Mulat",
//       dateOfBirth: "2000-06-18T00:00:00.000Z",
//       phoneNumber: "0911677687",
//       cityIdNumber: "ET123456",
//       spouseCityIdNumber: null,
//       address: "address",
//       educationLevel: "secondary",
//       occupation: "Doctor",
//       monthlyIncome: 12000,
//       familyMembersCount: null,
//     },
//     applicationInfo: {
//       eligibleDate: null,
//       spouseAgreement: true,
//       preferredChildren: {
//         sex: "FEMALE",
//         number: 1,
//         ageRange: { min: 10, max: 12 },
//       },
//       documents: [
//         {
//           publicId: "8dda04e9-df20-41c0-b870-89f0b786bdc5",
//           fieldName: "marriageCertificate",
//           fileType: "application/pdf",
//           fileName: "Abel Mulat.pdf",
//         },
//         {
//           publicId: "46cd2086-cc95-4978-b865-181b240c59a2",
//           fieldName: "maritalStatusDocument",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_5..pdf",
//         },
//         {
//           publicId: "0ff232a3-487a-4a2b-ac5c-5ebeb32e66df",
//           fieldName: "photo",
//           fileType: "application/pdf",
//           fileName: "ETS0029_In_Depth_Activity_3.pdf",
//         },
//         {
//           publicId: "8ceb2e09-46ec-4092-8c2b-3a37781169b3",
//           fieldName: "incomeDocument",
//           fileType: "application/pdf",
//           fileName: "HCI Activity 01.pdf",
//         },
//         {
//           publicId: "31797884-b8ea-4dd5-85a3-a53b36b9b19b",
//           fieldName: "psychologicalWellbeing",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_06.pdf",
//         },
//         {
//           publicId: "d8618568-b49e-4672-867a-61d0eae6f6ca",
//           fieldName: "medicalDocument",
//           fileType: "application/pdf",
//           fileName: "HCI_In_Depth_Activity_06.pdf",
//         },
//         {
//           publicId: "8199944d-720c-4789-926b-0af8b04b6a99",
//           fieldName: "criminalClearance",
//           fileType: "application/pdf",
//           fileName: "FLAT_Assignment_ETS0029_14.pdf",
//         },
//         {
//           publicId: "b9d5d9d0-772e-4523-a185-f143e9a7621a",
//           fieldName: "birthCertificate",
//           fileType: "application/pdf",
//           fileName: "COA_Assignment_ETS0028_14_&_ET0029_14.pdf",
//         },
//         {
//           publicId: "6a4a05d0-a643-4513-bb42-1650cc9cd791",
//           fieldName: "idDocument",
//           fileType: "application/pdf",
//           fileName: "COA_Assignment_ETS0028_14_&_ET0029_14.pdf",
//         },
//       ],
//     },
//     reviewInfo: {
//       remark: null,
//       subCity: null,
//       woreda: null,
//       createdAt: "2025-10-23T20:21:35.946Z",
//       updatedAt: "2025-10-23T20:21:35.946Z",
//     },
//   },
// ];

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "pending_home_visit", label: "Pending Home Visit" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "denied", label: "Denied" },
  { value: "returned", label: "Returned to Applicant" },
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
      case "ACCEPTED":
        return "accepted";
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
                <div className="text-gray-500 italic">
                  No applications found.
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
