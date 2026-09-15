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
import { Download, Printer, RefreshCw } from "lucide-react";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";

interface ExecutiveHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  timeframe: TimeframeOption;
  setTimeframe: (val: TimeframeOption) => void;
  selectedSubCity: string;
  setSelectedSubCity: (val: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExportCSV?: () => void;
  onPrint?: () => void;
  actionBacklogCount?: number;
  facilityReportsCount?: number;
  subCitiesCount?: number;
  openComplaintsCount?: number;
}

export function ExecutiveHeader({
  activeTab,
  setActiveTab,
  timeframe,
  setTimeframe,
  selectedSubCity,
  setSelectedSubCity,
  onRefresh,
  isRefreshing = false,
  onExportCSV,
  onPrint,
  actionBacklogCount = 6,
  facilityReportsCount = 12,
  subCitiesCount = 11,
  openComplaintsCount = 3,
}: ExecutiveHeaderProps) {
  const currentDateFormatted = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tabs = [
    { id: "overview", label: "Overview & Performance" },
    { id: "attention", label: "Action Backlog", count: actionBacklogCount },
    { id: "reports", label: "Care Facility Reports", count: facilityReportsCount },
    { id: "subcities", label: "Sub-City Municipalities", count: subCitiesCount },
    { id: "complaints", label: "Citizen Grievances", count: openComplaintsCount },
  ];

  return (
    <div className="space-y-2">
      {/* 1. Primary Unified Tab & Filter Command Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E3E7EB] pb-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px text-xs font-semibold">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-2.5 pt-1 px-2.5 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap border-b-2",
                  isActive
                    ? "border-[#1769AA] text-[#0F172A]"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                )}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 font-mono text-[10px] rounded-xs transition-colors",
                      isActive
                        ? "bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters & Actions Toolbar */}
        <div className="flex items-center gap-2 pb-2 lg:pb-1 flex-wrap text-xs">
          {/* Jurisdiction Filter */}
          <div className="flex items-center gap-1 bg-white border border-[#E3E7EB] rounded-xs px-2 py-1">
            <span className="text-slate-400 text-[11px]">Jurisdiction:</span>
            <Select value={selectedSubCity} onValueChange={setSelectedSubCity}>
              <SelectTrigger className="h-4 border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 shadow-none hover:text-[#1769AA] focus:ring-0 gap-1 cursor-pointer">
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

          {/* Period Filter */}
          <div className="flex items-center gap-1 bg-white border border-[#E3E7EB] rounded-xs px-2 py-1">
            <span className="text-slate-400 text-[11px]">Period:</span>
            <Select
              value={timeframe}
              onValueChange={(v) => setTimeframe(v as TimeframeOption)}
            >
              <SelectTrigger className="h-4 border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 shadow-none hover:text-[#1769AA] focus:ring-0 gap-1 cursor-pointer">
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

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard metrics"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-[#E3E7EB] bg-white rounded-xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={cn("size-3", isRefreshing && "animate-spin text-[#1769AA]")}
            />
            <span>Refresh</span>
          </button>

          {/* Export CSV Action */}
          <button
            onClick={onExportCSV}
            title="Export summary data as CSV"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-[#E3E7EB] bg-white rounded-xs transition-colors cursor-pointer"
          >
            <Download className="size-3 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Print Action */}
          <button
            onClick={onPrint}
            title="Print operational brief"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-[#E3E7EB] rounded-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="size-3 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Context & Sync Indicator Line */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">የሴቶችና ሕፃናት ጉዳይ ቢሮ</span>
          <span className="text-slate-300">·</span>
          <span>City Government of Addis Ababa · Women, Children &amp; Social Affairs Bureau</span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Reference date: <strong className="font-semibold text-slate-700">{currentDateFormatted}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
            <span className="size-1.5 rounded-full bg-[#1769AA] animate-pulse" />
            Central data exchange active
          </span>
        </div>
      </div>
    </div>
  );
}
