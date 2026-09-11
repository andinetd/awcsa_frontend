"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
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

export default function ChildrenPage() {
  const t = useTranslations("adoption");
  const { data: children = [], isLoading, refetch } = useChildren();

  const [selectedStatus, setSelectedStatus] = useState<ChildStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [transferChild, setTransferChild] = useState<Child | null>(null);

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
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 max-w-7xl space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("children.list.title") || "Children Records & Welfare Registry"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t("children.list.subtitle") ||
              "Track child institutional intake, status transfers, care facilities, and adoption eligibility."}
          </p>
        </div>
        <Link href="/adoption/children/child-registration/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            {t("children.list.addNew") || "Register New Child"}
          </Button>
        </Link>
      </div>

      {/* ── Quick Stats Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Total
          </p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">
            {children.length}
          </p>
        </div>
        <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">
            In Care (Eligible)
          </p>
          <p className="text-xl font-bold text-blue-900 mt-0.5">
            {counts["IN_CARE"] || 0}
          </p>
        </div>
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
            Found
          </p>
          <p className="text-xl font-bold text-amber-900 mt-0.5">
            {counts["FOUND"] || 0}
          </p>
        </div>
        <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-purple-700 uppercase tracking-wide">
            In Adera
          </p>
          <p className="text-xl font-bold text-purple-900 mt-0.5">
            {counts["IN_ADERA"] || 0}
          </p>
        </div>
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">
            Kinship Care
          </p>
          <p className="text-xl font-bold text-indigo-900 mt-0.5">
            {counts["WITH_BLOOD_RELATIVE"] || 0}
          </p>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 shadow-xs">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
            Adopted
          </p>
          <p className="text-xl font-bold text-emerald-900 mt-0.5">
            {counts["ADOPTED"] || 0}
          </p>
        </div>
      </div>

      {/* ── Filters & Search ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.key] ?? 0;
            const active = selectedStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500 border border-slate-200"
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={
              t("children.list.searchPlaceholder") ||
              "Search by child name, facility child code (e.g. FAC-001), or intake location..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9 bg-slate-50 border-slate-200 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table / Content ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
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
