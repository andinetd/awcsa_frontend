"use client";

import React from "react";
import Link from "next/link";
import {
  HandHelping,
  RefreshCw,
  Printer,
  Plus,
  ShieldCheck,
  Building2,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NewEdirForm from "../../list/_components/new-edir-form";
import NewCouncilForm from "../../councils/_components/new-council-form";
import GenerateReportDialog from "../../list/_components/generate-report-dialog";

interface EdirDashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalEdirs?: number;
  activeEdirs?: number;
  totalCouncils?: number;
  renewedThisYear?: number;
}

export function EdirDashboardHeader({
  onRefresh,
  isRefreshing = false,
  totalEdirs = 0,
  activeEdirs = 0,
  totalCouncils = 0,
  renewedThisYear = 0,
}: EdirDashboardHeaderProps) {
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
          <span className="text-[#1769AA]">TRADITIONAL EDIR &amp; COMMUNITY ASSOCIATIONS</span>
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
          <GenerateReportDialog />
          <NewCouncilForm
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
              >
                <Plus className="mr-1.5 size-3.5 text-[#1769AA]" />
                New Council
              </Button>
            }
          />
          <NewEdirForm
            trigger={
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white font-medium shadow-2xs cursor-pointer rounded-xs"
              >
                <Plus className="mr-1.5 size-3.5 text-[#38BDF8]" />
                Register Edir
              </Button>
            }
          />
        </div>
      </div>

      {/* Main Title & Executive Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Traditional Edir Associations &amp; Community Councils
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]">
              Active Accreditation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Municipal accreditation, annual legal renewal, institutional oversight, and federated council representation across Addis Ababa grassroots associations.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <HandHelping className="size-3.5 text-[#1769AA]" />
            <span className="text-slate-500 font-mono text-[11px]">Edir Total:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {totalEdirs.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span className="text-slate-500 font-mono text-[11px]">Active:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {activeEdirs.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <Building2 className="size-3.5 text-blue-600" />
            <span className="text-slate-500 font-mono text-[11px]">Councils:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {totalCouncils.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-[#E3E7EB] px-2.5 py-1 rounded-xs">
            <Users2 className="size-3.5 text-amber-600" />
            <span className="text-slate-500 font-mono text-[11px]">Renewed {new Date().getFullYear()}:</span>
            <span className="font-bold text-slate-900 font-mono text-[11px]">
              {renewedThisYear.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
