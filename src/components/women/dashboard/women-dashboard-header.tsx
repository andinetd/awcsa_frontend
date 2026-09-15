"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import {
  Users,
  Landmark,
  HandHeart,
  Zap,
  GraduationCap,
  Briefcase,
  RefreshCw,
  Printer,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import WomenReportDialog from "@/app/[locale]/(modules)/women/_components/women-report-dialog";

interface WomenDashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalProfiles?: number;
  totalAssociations?: number;
  totalMembers?: number;
  totalEmployments?: number;
  totalTechSupport?: number;
  totalTrainings?: number;
}

export function WomenDashboardHeader({
  onRefresh,
  isRefreshing = false,
  totalProfiles = 0,
  totalAssociations = 0,
  totalMembers = 0,
  totalEmployments = 0,
  totalTechSupport = 0,
  totalTrainings = 0,
}: WomenDashboardHeaderProps) {
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
          <span className="text-[#1769AA]">WOMEN EMPOWERMENT &amp; DEVELOPMENT</span>
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
          <WomenReportDialog category="ASSOCIATION" />
          <Link href="/women/profiles">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white font-medium shadow-2xs cursor-pointer rounded-xs"
            >
              <Plus className="mr-1.5 size-3.5 text-[#38BDF8]" />
              Register Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Title & Executive Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Women Development &amp; Empowerment Administration
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]">
              Active Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 italic mt-0.5">
            Executive oversight of women association federations, employment programs, technology distribution, and vocational training initiatives
          </p>
        </div>

        {/* Quick Module Navigation Links */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/women/profiles">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <Users className="size-3.5 text-slate-400" />
              Profiles
              <span className="font-mono text-[11px] text-slate-500 font-semibold">({totalProfiles})</span>
            </span>
          </Link>
          <Link href="/women/associations">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <Landmark className="size-3.5 text-slate-400" />
              Associations
              <span className="font-mono text-[11px] text-slate-500 font-semibold">({totalAssociations})</span>
            </span>
          </Link>
          <Link href="/women/members">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <Users className="size-3.5 text-slate-400" />
              Members
              <span className="font-mono text-[11px] text-slate-500 font-semibold">({totalMembers})</span>
            </span>
          </Link>
          <Link href="/women/services">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <HandHeart className="size-3.5 text-slate-400" />
              Services
            </span>
          </Link>
          <Link href="/women/employment">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <Briefcase className="size-3.5 text-slate-400" />
              Jobs
              <span className="font-mono text-[11px] text-slate-500 font-semibold">({totalEmployments})</span>
            </span>
          </Link>
          <Link href="/women/technology">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <Zap className="size-3.5 text-slate-400" />
              Tech
              <span className="font-mono text-[11px] text-slate-500 font-semibold">({totalTechSupport})</span>
            </span>
          </Link>
          <Link href="/women/training">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-medium bg-white border border-[#E3E7EB] text-slate-700 hover:border-[#1769AA] hover:text-[#1769AA] transition-colors cursor-pointer">
              <GraduationCap className="size-3.5 text-slate-400" />
              Training
              <span className="font-mono text-[11px] text-slate-500 font-semibold">({totalTrainings})</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
