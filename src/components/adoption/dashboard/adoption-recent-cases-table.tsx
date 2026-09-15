"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye, Filter, ArrowRight, CheckCircle2, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";

export interface AdoptionCaseItem {
  id: number;
  caseCode: string;
  applicantName: string;
  subCity: string;
  woreda: string;
  preference: string;
  status: "PENDING_REVIEW" | "PENDING_HOME_VISIT" | "PENDING_APPROVAL" | "MATCHED" | "FINALIZED";
  statusLabel: string;
  daysInQueue: number;
  assignedWorker: string;
}

const DEFAULT_CASES: AdoptionCaseItem[] = [
  {
    id: 1,
    caseCode: "AD-2024-006",
    applicantName: "Almaz Bekele & Dawit Tadesse",
    subCity: "Bole",
    woreda: "Woreda 03",
    preference: "Female, 0-2 yrs",
    status: "PENDING_APPROVAL",
    statusLabel: "Committee Review",
    daysInQueue: 18,
    assignedWorker: "Sr. Social Worker Rahel G.",
  },
  {
    id: 2,
    caseCode: "AD-2024-005",
    applicantName: "Selamawit Haile & Yohannes K.",
    subCity: "Yeka",
    woreda: "Woreda 08",
    preference: "Male, 1-3 yrs",
    status: "PENDING_HOME_VISIT",
    statusLabel: "Home Visit Scheduled",
    daysInQueue: 12,
    assignedWorker: "Social Worker Ermias M.",
  },
  {
    id: 3,
    caseCode: "AD-2024-004",
    applicantName: "Hanan Mohammed",
    subCity: "Kirkos",
    woreda: "Woreda 02",
    preference: "Either, 0-1 yr",
    status: "PENDING_HOME_VISIT",
    statusLabel: "Home Visit Scheduled",
    daysInQueue: 9,
    assignedWorker: "Social Worker Tigist B.",
  },
  {
    id: 4,
    caseCode: "AD-2024-003",
    applicantName: "Mulugeta Alemu & Aster Mengistu",
    subCity: "Arada",
    woreda: "Woreda 05",
    preference: "Female, 2-4 yrs",
    status: "PENDING_REVIEW",
    statusLabel: "Document Review",
    daysInQueue: 4,
    assignedWorker: "Intake Officer Daniel T.",
  },
  {
    id: 5,
    caseCode: "AD-2024-002",
    applicantName: "Tirhas Gebre & Solomon W.",
    subCity: "Nifas Silk",
    woreda: "Woreda 11",
    preference: "Male, 0-2 yrs",
    status: "MATCHED",
    statusLabel: "Bonding Trial",
    daysInQueue: 45,
    assignedWorker: "Sr. Social Worker Rahel G.",
  },
  {
    id: 6,
    caseCode: "AD-2024-001",
    applicantName: "Bethlehem Tefera",
    subCity: "Gullele",
    woreda: "Woreda 07",
    preference: "Female, 1-3 yrs",
    status: "FINALIZED",
    statusLabel: "Court Decreed",
    daysInQueue: 88,
    assignedWorker: "Legal Officer Meron S.",
  },
];

interface AdoptionRecentCasesTableProps {
  cases?: AdoptionCaseItem[];
}

export function AdoptionRecentCasesTable({
  cases = DEFAULT_CASES,
}: AdoptionRecentCasesTableProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filtered = cases.filter((c) => {
    if (filter !== "ALL" && c.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.applicantName.toLowerCase().includes(q) ||
        c.caseCode.toLowerCase().includes(q) ||
        c.subCity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: AdoptionCaseItem["status"]) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return uiTokens.statusTag.warning;
      case "PENDING_HOME_VISIT":
        return uiTokens.statusTag.info;
      case "PENDING_REVIEW":
        return uiTokens.statusTag.neutral;
      case "MATCHED":
        return "bg-[#F7EEF4] text-[#74345F] border-[#E8CBE0]";
      case "FINALIZED":
        return uiTokens.statusTag.success;
      default:
        return uiTokens.statusTag.neutral;
    }
  };

  return (
    <div className="rounded-sm border border-[#E3E7EB] bg-white p-4 space-y-3">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Adoption Application Queue & Vetting Roster
          </h3>
          <p className="text-[11px] text-slate-500">
            Active prospective applicant cases registered under Addis Ababa jurisdiction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search className="absolute left-2.5 top-2 size-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search case or applicant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7.5 pl-8 text-xs border-[#E3E7EB]"
            />
          </div>
          <Link href="/adoption/adoption-requests">
            <Button
              variant="outline"
              size="sm"
              className="h-7.5 px-2.5 text-xs text-[#1769AA] border-[#E3E7EB] hover:bg-[#E8F2FA]"
            >
              Full Registry
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {[
          { key: "ALL", label: "All Active Cases" },
          { key: "PENDING_REVIEW", label: "Document Review" },
          { key: "PENDING_HOME_VISIT", label: "Home Inspections" },
          { key: "PENDING_APPROVAL", label: "Committee Approvals" },
          { key: "MATCHED", label: "Trial Bonding" },
          { key: "FINALIZED", label: "Court Finalized" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
              filter === tab.key
                ? "bg-[#0B1F3A] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabular Case Queue */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/70 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
              <th className="py-2.5 px-3">Case ID</th>
              <th className="py-2.5 px-3">Applicant Name</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Preference</th>
              <th className="py-2.5 px-3">Assigned Officer</th>
              <th className="py-2.5 px-3">Queue Age</th>
              <th className="py-2.5 px-3">Current Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400">
                  No adoption cases found matching current filters.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {item.caseCode}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium text-slate-900">
                    {item.applicantName}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    {item.subCity}, {item.woreda}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    <span className="bg-[#E8F2FA] text-[#1769AA] px-1.5 py-0.5 rounded text-[10.5px] font-medium border border-[#BCD5EA]/60">
                      {item.preference}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">
                    {item.assignedWorker}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-500">
                    {item.daysInQueue} days
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={cn(
                        uiTokens.statusTag.base,
                        getStatusBadge(item.status)
                      )}
                    >
                      {item.statusLabel}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Link href={`/adoption/adoption-requests`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-[#1769AA] hover:bg-[#E8F2FA] hover:text-[#12568E]"
                      >
                        <Eye className="size-3 mr-1" />
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
