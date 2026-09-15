"use client";

import React from "react";
import Link from "next/link";
import { 
  Baby, 
  Users, 
  Building2, 
  RefreshCw, 
  Printer, 
  MapPin, 
  Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdoptionHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalChildren?: number;
  totalApplicants?: number;
  totalFacilities?: number;
}

export function AdoptionHeader({
  onRefresh,
  isRefreshing = false,
  totalChildren = 8,
  totalApplicants = 6,
  totalFacilities = 5,
}: AdoptionHeaderProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-3">
      {/* Institutional Hierarchy & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E7EB] pb-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500 font-mono">
          <span className="flex size-2 rounded-full bg-[#1769AA]" />
          <span>ADDIS ABABA CITY ADMINISTRATION</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">BUREAU OF WOMEN & SOCIAL AFFAIRS</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1769AA]">CHILD WELFARE & ADOPTION</span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${isRefreshing ? "animate-spin text-[#1769AA]" : "text-slate-500"}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer"
          >
            <Printer className="mr-1.5 size-3.5 text-slate-500" />
            Print Brief
          </Button>
          <Link href="/adoption/children/child-registration/new">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white font-medium shadow-2xs cursor-pointer"
            >
              <Baby className="mr-1.5 size-3.5 text-[#38BDF8]" />
              Register Minor
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Title & Executive Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Child Welfare & Adoption Administration
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]">
              Active Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 italic mt-0.5">
            Executive oversight of minor custody, care facility compliance, kinship placements, and adoption screening funnels
          </p>
        </div>

        {/* Quick Module Navigation Links */}
        <div className="flex items-center gap-2">
          <Link href="/adoption/adoption-requests">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-[#E3E7EB] text-[#1769AA] hover:bg-[#E8F2FA] font-medium bg-white cursor-pointer"
            >
              <Users className="mr-1.5 size-3.5 text-[#1769AA]" />
              Manage Applications ({totalApplicants})
            </Button>
          </Link>
          <Link href="/adoption/care-centers">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 font-medium bg-white cursor-pointer"
            >
              <Building2 className="mr-1.5 size-3.5 text-slate-500" />
              Care Centers ({totalFacilities})
            </Button>
          </Link>
        </div>
      </div>

      {/* Jurisdictional Metadata Bar */}
      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11.5px] text-slate-600 bg-white border border-[#E3E7EB] px-3.5 py-1.5 rounded-md">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3 text-slate-400" />
          <strong className="font-semibold text-slate-800">Jurisdiction:</strong> All 11 Sub-cities & Registered Municipal Centers
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1.5 font-mono">
          <Calendar className="size-3 text-slate-400" />
          <strong className="font-semibold text-slate-800 font-sans">Period:</strong> FY 2018 E.C.
        </span>
        <span className="text-slate-300">|</span>
        <span className="font-mono">
          <strong className="font-semibold text-slate-800 font-sans">As of:</strong> {currentDate}
        </span>
        <span className="text-slate-300">|</span>
        <span className="inline-flex items-center gap-1 text-[#15803D] font-medium">
          <span className="size-1.5 rounded-full bg-[#15803D] animate-pulse" />
          Central Judicial & Welfare Exchange Synced
        </span>
      </div>
    </div>
  );
}
