"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Plus,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { useChildren } from "@/hooks/adoption/useChildren";
import { getColumns } from "./_components/columns";
import { TransferStatusDialog } from "./_components/transfer-status-dialog";
import { Child, ChildStatus } from "@/types/child-matching-types";

const FILTER_TABS: { key: ChildStatus | "ALL"; label: string; icon?: React.ElementType }[] = [
  { key: "ALL", label: "All Children" },
  { key: "IN_CARE", label: "In Care", icon: Building2 },
  { key: "FOUND", label: "Found", icon: Clock },
  { key: "IN_ADERA", label: "In Adera", icon: HeartHandshake },
  { key: "WITH_BLOOD_RELATIVE", label: "Kinship Care", icon: Users },
  { key: "ADOPTED", label: "Adopted", icon: CheckCircle2 },
  { key: "RETURNED", label: "Returned", icon: RotateCcw },
];

const VALID_CHILD_STATUSES: (ChildStatus | "ALL")[] = [
  "ALL",
  "IN_CARE",
  "FOUND",
  "IN_ADERA",
  "WITH_BLOOD_RELATIVE",
  "ADOPTED",
  "RETURNED",
];

function ChildrenPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStatus = searchParams.get("status") as ChildStatus | "ALL" | null;
  const initialStatus =
    urlStatus && VALID_CHILD_STATUSES.includes(urlStatus) ? urlStatus : "ALL";

  const t = useTranslations("adoption");
  const { data: children = [], isLoading, refetch } = useChildren();

  const [selectedStatus, setSelectedStatus] = useState<ChildStatus | "ALL">(initialStatus);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [transferChild, setTransferChild] = useState<Child | null>(null);

  // Synchronize status state when URL changes
  useEffect(() => {
    if (urlStatus && VALID_CHILD_STATUSES.includes(urlStatus) && urlStatus !== selectedStatus) {
      setSelectedStatus(urlStatus);
    } else if (!urlStatus && selectedStatus !== "ALL") {
      setSelectedStatus("ALL");
    }
  }, [urlStatus, selectedStatus]);

  const handleStatusChange = (status: ChildStatus | "ALL") => {
    setSelectedStatus(status);
    const params = new URLSearchParams(window.location.search);
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Filtered dataset
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      // Status filter
      if (selectedStatus !== "ALL" && child.currentStatus !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const firstName = (
          child.serviceData?.formData?.firstName ||
          child.serviceData?.client?.firstName ||
          ""
        ).toLowerCase();
        const lastName = (
          child.serviceData?.formData?.lastName ||
          child.serviceData?.client?.lastName ||
          ""
        ).toLowerCase();
        const facilityCode = (child.childIdFromFacility || "").toLowerCase();
        const facilityName = (child.childCareFacility?.name || "").toLowerCase();
        const placeFound = (child.placeWhereChildFound || "").toLowerCase();

        return (
          firstName.includes(q) ||
          lastName.includes(q) ||
          `${firstName} ${lastName}`.includes(q) ||
          facilityCode.includes(q) ||
          facilityName.includes(q) ||
          placeFound.includes(q)
        );
      }

      return true;
    });
  }, [children, selectedStatus, searchQuery]);

  // Status counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: children.length };
    children.forEach((ch) => {
      const s = ch.currentStatus || "FOUND";
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [children]);

  const columns = useMemo(
    () => getColumns(t, (child) => setTransferChild(child)),
    [t]
  );

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
            <span className="text-[#1769AA] font-semibold">Child Protection &amp; Care</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A]">
            {t("children.list.title") || "Children Records & Welfare Registry"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("children.list.subtitle") ||
              "Institutional intake tracking, facility transfers, kinship tracing, and adoption eligibility."}
          </p>
        </div>
        <Link href="/adoption/children/child-registration/new">
          <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5 shadow-2xs text-xs font-semibold rounded-xs h-8 px-3 cursor-pointer">
            <Plus className="size-3.5" />
            {t("children.list.addNew") || "Register New Child"}
          </Button>
        </Link>
      </div>

      {/* ── Quick Metric Scorecards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#0B1F3A]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Total Registry
          </p>
          <p className="text-xl font-bold font-mono text-[#0B1F3A] mt-0.5">
            {children.length}
          </p>
          <span className="text-[10px] text-slate-400">All recorded minors</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-[#1769AA]">
          <p className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider font-mono">
            In Care (Eligible)
          </p>
          <p className="text-xl font-bold font-mono text-[#1769AA] mt-0.5">
            {counts["IN_CARE"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Institutional centers</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-amber-500">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
            Found / Intake
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {counts["FOUND"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Under initial tracing</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-slate-400">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            In Adera Custody
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {counts["IN_ADERA"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Temporary shelter</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-blue-400">
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
            Kinship Care
          </p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {counts["WITH_BLOOD_RELATIVE"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Extended family</span>
        </div>

        <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs border-l-3 border-l-emerald-600">
          <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-mono">
            Decree Adopted
          </p>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
            {counts["ADOPTED"] || 0}
          </p>
          <span className="text-[10px] text-slate-400">Finalized decrees</span>
        </div>
      </div>

      {/* ── Filters & Search ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.key] ?? 0;
            const active = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleStatusChange(tab.key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-[#E3E7EB]"
                }`}
              >
                {tab.icon && <tab.icon className="size-3.5" />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                    active
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

        {/* Search bar */}
        <div className="relative">
          <Search className="size-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={
              t("children.list.searchPlaceholder") ||
              "Search by child name, facility code (e.g. FAC-001), or intake location..."
            }
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 text-xs h-8 bg-white border-[#E3E7EB] focus:border-[#1769AA] rounded-xs"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table / Content ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-3 shadow-2xs">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">
            {t("children.list.loading") || "Loading registered children..."}
          </div>
        ) : (
          <DataTable columns={columns} data={filteredChildren} />
        )}
      </div>

      {/* ── Status Transfer Modal ────────────────────────────────────────────── */}
      <TransferStatusDialog
        child={transferChild}
        isOpen={Boolean(transferChild)}
        onClose={() => setTransferChild(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

export default function ChildrenPage() {
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
      <ChildrenPageContent />
    </Suspense>
  );
}
