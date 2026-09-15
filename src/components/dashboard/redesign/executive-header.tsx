"use client";

import React from "react";
import { ADDIS_ABABA_SUBCITIES, TimeframeOption } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Download,
  MapPin,
  Printer,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface ExecutiveHeaderProps {
  timeframe: TimeframeOption;
  setTimeframe: (val: TimeframeOption) => void;
  selectedSubCity: string;
  setSelectedSubCity: (val: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExportCSV?: () => void;
  onPrint?: () => void;
}

export function ExecutiveHeader({
  timeframe,
  setTimeframe,
  selectedSubCity,
  setSelectedSubCity,
  onRefresh,
  isRefreshing = false,
  onExportCSV,
  onPrint,
}: ExecutiveHeaderProps) {
  const currentDateFormatted = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-3 pt-1 pb-1">
      {/* 1. Top Bureau Institutional Bar & Quick Actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E3E7EB] pb-3">
        <div className="text-xs font-medium text-slate-500">
          <span className="font-semibold text-slate-700">የሴቶችና ሕፃናት ጉዳይ ቢሮ</span>
          <span className="mx-2 text-slate-300">·</span>
          <span>City Government of Addis Ababa, Women, Children &amp; Social Affairs Bureau</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#1769AA]" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E3E7EB] rounded-md hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print brief</span>
          </button>
        </div>
      </div>

      {/* 2. Main Title and Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]">
          Executive dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm italic text-slate-500">
          Municipal operational oversight, beneficiary case tracking, and care-facility compliance across all sub-cities.
        </p>
      </div>

      {/* 3. Operational Jurisdiction & Metadata Line */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-0.5">
        <div className="flex items-center gap-1.5">
          <span>Jurisdiction:</span>
          <Select value={selectedSubCity} onValueChange={setSelectedSubCity}>
            <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs font-bold text-slate-800 shadow-none hover:text-[#1769AA] focus:ring-0 gap-1 cursor-pointer">
              <SelectValue placeholder="All 11 sub-cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All 11 sub-cities</SelectItem>
              {ADDIS_ABABA_SUBCITIES.map((sc) => (
                <SelectItem key={sc} value={sc}>
                  {sc} Sub-City
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Period:</span>
          <Select value={timeframe} onValueChange={(v) => setTimeframe(v as TimeframeOption)}>
            <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs font-bold text-slate-800 shadow-none hover:text-[#1769AA] focus:ring-0 gap-1 cursor-pointer">
              <SelectValue placeholder="FY 2018 E.C." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">FY 2018 E.C.</SelectItem>
              <SelectItem value="this_month">Current Month</SelectItem>
              <SelectItem value="last_month">Previous Month</SelectItem>
              <SelectItem value="quarter">Current Quarter (Q3)</SelectItem>
              <SelectItem value="all">Cumulative Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Reference date:</span>
          <strong className="font-bold text-slate-800">{currentDateFormatted}</strong>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-slate-600 ml-auto">
          <span className="h-2 w-2 rounded-full bg-[#1769AA]" />
          <span>Central data exchange active</span>
        </div>
      </div>
    </div>
  );
}
