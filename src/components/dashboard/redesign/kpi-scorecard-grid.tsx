"use client";

import React from "react";
import {
  Baby,
  Building,
  CheckCircle2,
  FileCheck2,
  HandHeart,
  Heart,
  Users,
} from "lucide-react";

export interface MasterKPIProps {
  totalBeneficiaries: number;
  totalChildren: number;
  totalFacilities: number;
  inCareCount: number;
  totalVulnerable: number;
  elderlyCount: number;
  disabilityCount: number;
  womenProfilesCount: number;
  womenAssociationsCount: number;
  submittedReports: number;
  pendingReports: number;
  complianceRate: number;
}

export function KPIScorecardGrid({
  totalBeneficiaries,
  totalChildren,
  totalFacilities,
  inCareCount,
  totalVulnerable,
  elderlyCount,
  disabilityCount,
  womenProfilesCount,
  womenAssociationsCount,
  submittedReports,
  pendingReports,
  complianceRate,
}: MasterKPIProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {/* 1. Total beneficiaries */}
      <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none flex flex-col justify-between min-h-[115px]">
        <div>
          <span className="text-xs text-slate-500 font-normal">
            Total beneficiaries
          </span>
          <div className="mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalBeneficiaries}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>Addis Ababa municipal total</span>
          <span className="font-semibold text-[#1769AA]">Verified</span>
        </div>
      </div>

      {/* 2. Child welfare & care */}
      <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none flex flex-col justify-between min-h-[115px]">
        <div>
          <span className="text-xs text-slate-500 font-normal">
            Child welfare &amp; care
          </span>
          <div className="mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalChildren}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>In {totalFacilities || 5} residential facilities</span>
          <span className="font-semibold text-slate-800">{inCareCount || 1} in-care</span>
        </div>
      </div>

      {/* 3. Social support & PWD */}
      <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none flex flex-col justify-between min-h-[115px]">
        <div>
          <span className="text-xs text-slate-500 font-normal">
            Social support &amp; PWD
          </span>
          <div className="mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {totalVulnerable}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>Elderly {elderlyCount} · PWD {disabilityCount}</span>
        </div>
      </div>

      {/* 4. Women's affairs */}
      <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none flex flex-col justify-between min-h-[115px]">
        <div>
          <span className="text-xs text-slate-500 font-normal">
            Women's affairs
          </span>
          <div className="mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {womenProfilesCount}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>Associations registered</span>
          <span className="font-semibold text-slate-800">{womenAssociationsCount || 6} groups</span>
        </div>
      </div>

      {/* 5. Reporting compliance */}
      <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none flex flex-col justify-between min-h-[115px]">
        <div>
          <span className="text-xs text-slate-500 font-normal">
            Reporting compliance
          </span>
          <div className="mt-1">
            <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {complianceRate}%
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>On-time submissions</span>
          <span className="font-semibold text-slate-800">{pendingReports} pending</span>
        </div>
      </div>
    </div>
  );
}
