"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  RefreshCw,
  Printer,
  Plus,
  Search,
  HeartHandshake,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BeneficiaryReportDialog from "../../_components/report-dialog";

interface ElderlyDisabledDashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalBeneficiaries?: number;
  elderlyTotal?: number;
  disabledTotal?: number;
  totalServices?: number;
  totalTrainings?: number;
  totalJobs?: number;
}

export function ElderlyDisabledDashboardHeader({
  onRefresh,
  isRefreshing = false,
  totalBeneficiaries = 0,
  elderlyTotal = 0,
  disabledTotal = 0,
  totalServices = 0,
  totalTrainings = 0,
  totalJobs = 0,
}: ElderlyDisabledDashboardHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Institutional Hierarchy & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E7EB] pb-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500 font-mono">
          <span className="flex size-2 rounded-full bg-[#1769AA]" />
          <span>ADDIS ABABA CITY ADMINISTRATION</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">BUREAU OF WOMEN &amp; SOCIAL AFFAIRS</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1769AA]">DISABILITY &amp; ELDERLY PROTECTION</span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${
                isRefreshing ? "animate-spin text-[#1769AA]" : "text-slate-500"
              }`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
          >
            <Printer className="mr-1.5 size-3.5 text-slate-500" />
            Print Brief
          </Button>
          <Link href="/social-affairs/elderly-and-disabled/search">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
            >
              <Search className="mr-1.5 size-3.5 text-slate-500" />
              Search
            </Button>
          </Link>
          <BeneficiaryReportDialog />
          <Link href="/social-affairs/elderly-and-disabled/beneficiaries">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white font-medium shadow-2xs cursor-pointer rounded-xs"
            >
              <Plus className="mr-1.5 size-3.5 text-[#38BDF8]" />
              Register Beneficiary
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Title & Executive Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Disability &amp; Elderly Social Protection Administration
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]">
              Active Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Integrated municipal oversight of vulnerable elderly citizens, persons with disabilities, assistive device allocation, vocational skill cohorts, and economic placements across 11 sub-cities.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <Users className="size-3.5 text-[#1769AA]" />
            <span className="text-slate-500 font-mono text-[11px]">Beneficiaries:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {totalBeneficiaries.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <HeartHandshake className="size-3.5 text-emerald-600" />
            <span className="text-slate-500 font-mono text-[11px]">Services:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {totalServices.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <GraduationCap className="size-3.5 text-amber-600" />
            <span className="text-slate-500 font-mono text-[11px]">Skills:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {totalTrainings.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <Briefcase className="size-3.5 text-blue-600" />
            <span className="text-slate-500 font-mono text-[11px]">Jobs:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {totalJobs.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
