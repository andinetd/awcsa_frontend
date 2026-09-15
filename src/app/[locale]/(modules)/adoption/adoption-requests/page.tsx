"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Search, Eye, FileText, X } from "lucide-react";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";
import { useAdoptionApplicationsQuery } from "@/hooks/adoption/adoption-requests";
import type { BackendAdoptionApplication } from "@/api/adoption/adoption-requests/getAdoptionApplications";
export type { BackendAdoptionApplication };

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
  subCity?: string;
  woreda?: string;
  houseNumber?: string;
};

export type BackendApplicationInfo = {
  serviceDataId?: number;
  submittedAt?: string;
  status?: string;
  rejectionReason?: string;
  submissionDate?: string;
  applicant?: {
    applicantId?: number;
    fullName?: string;
    nationalId?: string;
    phoneNumber?: string;
    email?: string;
  };
  attachments?: Array<{
    fileName?: string;
    fileUrl?: string;
    url?: string;
    fileType?: string;
  }>;
};

export type BackendReviewInfo = {
  region?: string;
  subCity?: string;
  woreda?: string;
  kebele?: string;
  houseNo?: string;
  createdAt?: string;
  updatedAt?: string;
};

const VALID_ADOPTION_TABS = [
  "pending",
  "returned",
  "pending_home_visit",
  "pending_approval",
  "matched",
  "denied",
];

const TAB_STORAGE_KEY = "adoption_requests_active_tab";

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

const AdoptionRequestsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");

  const [tab, setTab] = useState(() => {
    if (queryTab && VALID_ADOPTION_TABS.includes(queryTab)) {
      return queryTab;
    }
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(TAB_STORAGE_KEY);
      if (saved && VALID_ADOPTION_TABS.includes(saved)) {
        return saved;
      }
    }
    return "pending";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("adoption");
  const {
    data: applications = [],
    isLoading: loading,
  } = useAdoptionApplicationsQuery("ALL");

  // Keep tab in sync if URL query parameter changes
  useEffect(() => {
    if (queryTab && VALID_ADOPTION_TABS.includes(queryTab) && queryTab !== tab) {
      setTab(queryTab);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(TAB_STORAGE_KEY, queryTab);
      }
    }
  }, [queryTab, tab]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TAB_STORAGE_KEY, newTab);
    }
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("tab", newTab);
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  const TABS = [
    { value: "pending", label: t("adoptionRequests.tabs.pending") },
    { value: "returned", label: t("adoptionRequests.tabs.returned") },
    {
      value: "pending_home_visit",
      label: t("adoptionRequests.tabs.pending_home_visit"),
    },
    {
      value: "pending_approval",
      label: t("adoptionRequests.tabs.pending_approval"),
    },
    { value: "matched", label: t("adoptionRequests.tabs.matched") },
    { value: "denied", label: t("adoptionRequests.tabs.denied") },
  ];

  const getStatusBadge = (
    status: string
  ): {
    label: string;
    statusType: "primary" | "navy" | "neutral" | "subtle" | "warning" | "danger" | "success" | "info";
  } => {
    switch ((status || "").toUpperCase()) {
      case "PENDING_REVIEW":
        return {
          label: t("adoptionRequests.statuses.pending_review") || "Awaiting Review",
          statusType: "warning",
        };
      case "PENDING_HOME_VISIT":
        return {
          label: t("adoptionRequests.statuses.pending_home_visit") || "Home Inspection",
          statusType: "primary",
        };
      case "PENDING_APPROVAL":
        return {
          label: t("adoptionRequests.statuses.pending_approval") || "Committee Docket",
          statusType: "navy",
        };
      case "MATCHED":
        return {
          label: t("adoptionRequests.statuses.matched") || "Matched",
          statusType: "primary",
        };
      case "RETURNED":
        return {
          label: t("adoptionRequests.statuses.returned") || "Returned for Correction",
          statusType: "neutral",
        };
      case "REJECTED":
        return {
          label: t("adoptionRequests.statuses.denied") || "Denied",
          statusType: "danger",
        };
      default:
        return {
          label: status || "—",
          statusType: "neutral",
        };
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Count applications per tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      returned: 0,
      pending_home_visit: 0,
      pending_approval: 0,
      matched: 0,
      denied: 0,
    };
    for (const app of applications) {
      const tabKey = mapStatusToTab(app.status);
      if (counts[tabKey] !== undefined) {
        counts[tabKey]++;
      }
    }
    return counts;
  }, [applications]);

  // Filter applications by UI tab value and optional search query
  const filteredApps = (status: string) => {
    return applications.filter((app) => {
      const matchesTab = mapStatusToTab(app.status) === status;
      if (!matchesTab) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const fullName = `${app.applicantInfo?.firstName ?? ""} ${app.applicantInfo?.lastName ?? ""}`.toLowerCase();
      const phone = (app.applicantInfo?.phoneNumber ?? "").toLowerCase();
      const cityId = (app.applicantInfo?.cityIdNumber ?? "").toLowerCase();
      const appId = String(app.applicationId);
      const subCity = (app.reviewInfo?.subCity ?? "").toLowerCase();
      const woreda = (app.reviewInfo?.woreda ?? "").toLowerCase();
      const address = (app.applicantInfo?.address ?? "").toLowerCase();

      return (
        fullName.includes(q) ||
        phone.includes(q) ||
        cityId.includes(q) ||
        appId.includes(q) ||
        subCity.includes(q) ||
        woreda.includes(q) ||
        address.includes(q)
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-3 sm:p-5 lg:p-6 space-y-4 max-w-7xl mx-auto text-slate-800">
      {/* ── Institutional Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E3E7EB]">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-0.5">
            <span>Addis Ababa City Administration</span>
            <span>·</span>
            <span>Women &amp; Social Affairs Bureau</span>
            <span>·</span>
            <span className="text-[#1769AA] font-semibold">Child Welfare &amp; Adoption</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
            {t("adoptionRequests.title") || "Adoption Applications & Vetting Docket"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-stage applicant vetting: document intake, home suitability inspection, committee approval, and matching.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder={t("adoptionRequests.searchPlaceholder") || "Search applicant by name, ID, phone, sub-city..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8 h-8 text-xs bg-white border-[#E3E7EB] focus:border-[#1769AA] rounded-xs shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Pipeline Metric Strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Total Dossiers
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {applications.length}
          </p>
          <span className="text-[10px] text-slate-400">All registered files</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-amber-500">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
            Initial Review
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {tabCounts.pending || 0}
          </p>
          <span className="text-[10px] text-slate-400">Awaiting clearance</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#1769AA]">
          <p className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider font-mono">
            Home Inspection
          </p>
          <p className="text-xl font-bold font-mono text-[#1769AA] mt-0.5">
            {tabCounts.pending_home_visit || 0}
          </p>
          <span className="text-[10px] text-slate-400">Social work visits</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
            Committee Docket
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {tabCounts.pending_approval || 0}
          </p>
          <span className="text-[10px] text-slate-400">Ready for decree</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-emerald-600">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
            Matched Minors
          </p>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
            {tabCounts.matched || 0}
          </p>
          <span className="text-[10px] text-slate-400">Trial placement</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-slate-400">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">
            Returned / Denied
          </p>
          <p className="text-xl font-bold font-mono text-slate-700 mt-0.5">
            {(tabCounts.returned || 0) + (tabCounts.denied || 0)}
          </p>
          <span className="text-[10px] text-slate-400">Action required / closed</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full space-y-3">
        <div className="overflow-x-auto pb-0.5 bg-white border border-[#E3E7EB] rounded-xs p-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            {TABS.map((tItem) => {
              const count = tabCounts[tItem.value] ?? 0;
              const isActive = tab === tItem.value;
              return (
                <button
                  key={tItem.value}
                  type="button"
                  onClick={() => handleTabChange(tItem.value)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-[#E3E7EB]"
                  }`}
                >
                  <span>{tItem.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content rendered as modern List Table */}
        {TABS.map((tabItem) => {
          const list = filteredApps(tabItem.value);
          const isPending = tabItem.value === "pending";

          return (
            <TabsContent
              key={tabItem.value}
              value={tabItem.value}
              className="w-full mt-0"
            >
              <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-2 border-b border-[#E3E7EB] last:border-0"
                      >
                        <Skeleton className="h-6 w-14 rounded-xs" />
                        <Skeleton className="h-6 flex-1 rounded-xs" />
                        <Skeleton className="h-6 w-32 rounded-xs" />
                        <Skeleton className="h-6 w-28 rounded-xs" />
                        <Skeleton className="h-6 w-24 rounded-xs" />
                        <Skeleton className="h-6 w-20 rounded-xs" />
                      </div>
                    ))}
                  </div>
                ) : list.length === 0 ? (
                  <div className="py-16 text-center text-slate-500">
                    <FileText className="size-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="font-semibold text-xs text-slate-600">
                      {searchQuery
                        ? "No applications match your search query."
                        : t("adoptionRequests.noApplications") || "No adoption dossiers in this docket."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[#F8FAFC] border-b border-[#E3E7EB]">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[90px] font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono">
                            {t("adoptionRequests.table.applicationId") || "App ID"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[200px]">
                            {t("adoptionRequests.table.applicant") || "Applicant Name & ID"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[140px]">
                            {t("adoptionRequests.table.contact") || "Contact"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[140px]">
                            {t("adoptionRequests.table.location") || "Jurisdiction"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[120px]">
                            {t("adoptionRequests.table.submitted") || "Filing Date"}
                          </TableHead>
                          <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[130px]">
                            {t("adoptionRequests.table.status") || "Vetting Stage"}
                          </TableHead>
                          <TableHead className="text-right font-bold text-[11px] uppercase tracking-wider text-slate-600 font-mono min-w-[100px]">
                            {t("adoptionRequests.table.actions") || "Action"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((app) => {
                          const badge = getStatusBadge(app.status);
                          return (
                            <TableRow
                              key={app.applicationId}
                              className="hover:bg-slate-50/80 transition-colors border-b border-[#E3E7EB]"
                            >
                              <TableCell className="font-mono text-xs font-bold text-[#1769AA]">
                                #{app.applicationId}
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold text-xs text-slate-900">
                                  {app.applicantInfo?.firstName}{" "}
                                  {app.applicantInfo?.lastName}
                                </div>
                                {app.applicantInfo?.cityIdNumber && (
                                  <div className="font-mono text-[10.5px] text-slate-500 mt-0.5">
                                    ID: {app.applicantInfo.cityIdNumber}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-slate-800 font-mono font-medium">
                                  {app.applicantInfo?.phoneNumber || "—"}
                                </div>
                                {app.applicantInfo?.occupation && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {app.applicantInfo.occupation}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-slate-700">
                                  {app.reviewInfo?.subCity ||
                                    app.applicantInfo?.address ||
                                    "—"}
                                </div>
                                {app.reviewInfo?.woreda && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    Woreda {app.reviewInfo.woreda}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-slate-600 font-mono whitespace-nowrap">
                                {formatDate(app.reviewInfo?.createdAt)}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={cn(
                                    uiTokens.statusTag.base,
                                    uiTokens.statusTag[badge.statusType]
                                  )}
                                >
                                  {badge.label}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={`/adoption/adoption-requests/${String(
                                    app.applicationId,
                                  )}?fromTab=${tab}`}
                                >
                                  <Button
                                    size="sm"
                                    className={cn(
                                      "h-6.5 px-2.5 text-xs gap-1 font-semibold rounded-xs cursor-pointer shadow-none",
                                      isPending
                                        ? "bg-[#1769AA] hover:bg-[#12568E] text-white"
                                        : "border border-[#E3E7EB] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#1769AA]"
                                    )}
                                  >
                                    <Eye className="size-3" />
                                    <span>
                                      {isPending
                                        ? t("adoptionRequests.actions.review") || "Review"
                                        : t("adoptionRequests.actions.view") || "View"}
                                    </span>
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default function AdoptionRequests() {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <AdoptionRequestsContent />
    </Suspense>
  );
}
