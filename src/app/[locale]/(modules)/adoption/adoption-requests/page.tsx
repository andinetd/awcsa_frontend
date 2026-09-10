"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/i18n/navigation";
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
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/lib/base-url";
import { useTranslations } from "next-intl";
import { Search, Eye, FileText, X } from "lucide-react";

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
  hasHomeVisitForm?: boolean;
};

const AdoptionRequests = () => {
  const [tab, setTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const token = useAuthStore((s) => s.token);
  const t = useTranslations("adoption");

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

  const [applications, setApplications] = useState<
    BackendAdoptionApplication[]
  >([]);
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
          },
        );

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          toast.error(
            `${t("adoptionRequests.errors.loadFailed")}: ${res.status} ${res.statusText}` +
              (text ? ` - ${text}` : ""),
          );
          setLoading(false);
          return;
        }

        const data = await res.json().catch(() => null);
        if (!mounted) return;
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (data && Array.isArray(data.items)) {
          setApplications(data.items);
        } else {
          toast.error(t("adoptionRequests.errors.unexpectedShape"));
        }
      } catch (err) {
        console.error(err);
        toast.error(t("adoptionRequests.errors.networkError"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchApps();
    return () => {
      mounted = false;
    };
  }, [token, t]);

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

  const getStatusBadge = (status: string) => {
    switch ((status || "").toUpperCase()) {
      case "PENDING_REVIEW":
        return {
          label: t("adoptionRequests.statuses.pending_review"),
          className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
        };
      case "PENDING_HOME_VISIT":
        return {
          label: t("adoptionRequests.statuses.pending_home_visit"),
          className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
        };
      case "PENDING_APPROVAL":
        return {
          label: t("adoptionRequests.statuses.pending_approval"),
          className:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
        };
      case "MATCHED":
        return {
          label: t("adoptionRequests.statuses.matched"),
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
        };
      case "RETURNED":
        return {
          label: t("adoptionRequests.statuses.returned"),
          className:
            "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",
        };
      case "REJECTED":
        return {
          label: t("adoptionRequests.statuses.denied"),
          className:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
        };
      default:
        return {
          label: status || "—",
          className:
            "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header section with search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("adoptionRequests.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {applications.length} total applications
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("adoptionRequests.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-sm bg-card"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="overflow-x-auto pb-2 mb-4">
          <TabsList className="inline-flex h-auto gap-1 bg-muted/60 p-1 rounded-lg">
            {TABS.map((tItem) => {
              const count = tabCounts[tItem.value] ?? 0;
              return (
                <TabsTrigger
                  key={tItem.value}
                  value={tItem.value}
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs px-3 py-1.5 text-xs font-medium rounded-md gap-1.5 transition-all"
                >
                  <span>{tItem.label}</span>
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-semibold rounded-full ${
                      tab === tItem.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/15 text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
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
              <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-2 border-b border-border/40 last:border-0"
                      >
                        <Skeleton className="h-6 w-14 rounded" />
                        <Skeleton className="h-6 flex-1 rounded" />
                        <Skeleton className="h-6 w-32 rounded" />
                        <Skeleton className="h-6 w-28 rounded" />
                        <Skeleton className="h-6 w-24 rounded" />
                        <Skeleton className="h-6 w-20 rounded" />
                      </div>
                    ))}
                  </div>
                ) : list.length === 0 ? (
                  <div className="py-16 text-center text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30 stroke-1" />
                    <p className="font-medium text-sm">
                      {searchQuery
                        ? "No applications match your search query."
                        : t("adoptionRequests.noApplications")}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="w-[90px] font-semibold text-xs uppercase tracking-wider">
                            {t("adoptionRequests.table.applicationId")}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider min-w-[200px]">
                            {t("adoptionRequests.table.applicant")}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider min-w-[140px]">
                            {t("adoptionRequests.table.contact")}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider min-w-[140px]">
                            {t("adoptionRequests.table.location")}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider min-w-[120px]">
                            {t("adoptionRequests.table.submitted")}
                          </TableHead>
                          <TableHead className="font-semibold text-xs uppercase tracking-wider min-w-[130px]">
                            {t("adoptionRequests.table.status")}
                          </TableHead>
                          <TableHead className="text-right font-semibold text-xs uppercase tracking-wider min-w-[100px]">
                            {t("adoptionRequests.table.actions")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((app) => {
                          const badge = getStatusBadge(app.status);
                          return (
                            <TableRow
                              key={app.applicationId}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="font-mono text-xs font-semibold text-primary">
                                #{app.applicationId}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-sm text-foreground">
                                  {app.applicantInfo?.firstName}{" "}
                                  {app.applicantInfo?.lastName}
                                </div>
                                {app.applicantInfo?.cityIdNumber && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    ID: {app.applicantInfo.cityIdNumber}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-foreground font-medium">
                                  {app.applicantInfo?.phoneNumber || "—"}
                                </div>
                                {app.applicantInfo?.occupation && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    {app.applicantInfo.occupation}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-xs text-foreground">
                                  {app.reviewInfo?.subCity ||
                                    app.applicantInfo?.address ||
                                    "—"}
                                </div>
                                {app.reviewInfo?.woreda && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    Woreda {app.reviewInfo.woreda}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(app.reviewInfo?.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`text-[11px] font-medium px-2 py-0.5 ${badge.className}`}
                                >
                                  {badge.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link
                                  href={`/adoption/adoption-requests/${String(
                                    app.applicationId,
                                  )}`}
                                >
                                  <Button
                                    size="sm"
                                    variant={isPending ? "default" : "outline"}
                                    className="h-8 px-3 text-xs gap-1.5 font-medium"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    {isPending
                                      ? t("adoptionRequests.actions.review")
                                      : t("adoptionRequests.actions.view")}
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

export default AdoptionRequests;
