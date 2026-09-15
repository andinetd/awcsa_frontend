"use client";

import React, { useState } from "react";
import { SubCityStat } from "./types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  ChevronRight,
  Filter,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SubCityAnalyticsProps {
  stats: SubCityStat[];
  onSelectSubCity?: (name: string) => void;
  selectedSubCity?: string;
}

export function SubCityAnalytics({
  stats,
  onSelectSubCity,
  selectedSubCity = "ALL",
}: SubCityAnalyticsProps) {
  const [sortKey, setSortKey] = useState<"beneficiaries" | "compliance" | "facilities">("beneficiaries");

  // Sorting
  const sorted = [...stats].sort((a, b) => {
    if (sortKey === "compliance") return b.complianceRate - a.complianceRate;
    if (sortKey === "facilities") return b.totalFacilities - a.totalFacilities;
    return (b.vulnerableCitizens + b.totalChildren) - (a.vulnerableCitizens + a.totalChildren);
  });

  const cityWideTotal = stats.reduce(
    (acc, s) => acc + s.vulnerableCitizens + s.totalChildren,
    0
  );
  const cityWideFacilities = stats.reduce((acc, s) => acc + s.totalFacilities, 0);
  const cityWideEdirs = stats.reduce((acc, s) => acc + s.activeEdirs, 0);

  // Chart data
  const chartData = sorted.map((s) => ({
    name: s.name,
    Vulnerable: s.vulnerableCitizens,
    Children: s.totalChildren,
  }));

  return (
    <div className="space-y-4">
      {/* 1. Municipal Summary Banner */}
      <div className="rounded-md border border-[#E3E7EB] bg-white p-4 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E7EB] pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
              Sub-City Municipal Administration & Coverage Matrix
            </h3>
            <p className="text-[11px] text-slate-500">
              Comparative casework density, facility distribution, and monthly reporting compliance across all 11 sub-cities
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Rank by:</span>
            <div className="flex items-center rounded-sm border border-[#E3E7EB] bg-[#F7F8FA] p-0.5 text-xs font-medium">
              <button
                onClick={() => setSortKey("beneficiaries")}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  sortKey === "beneficiaries" ? "bg-white text-[#123B5D] font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Caseload
              </button>
              <button
                onClick={() => setSortKey("compliance")}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  sortKey === "compliance" ? "bg-white text-[#123B5D] font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Compliance
              </button>
              <button
                onClick={() => setSortKey("facilities")}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  sortKey === "facilities" ? "bg-white text-[#123B5D] font-bold shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Facilities
              </button>
            </div>
          </div>
        </div>

        {/* Comparative Chart */}
        <div className="mt-4 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E7EB" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: "#E3E7EB" }}
                angle={-25}
                textAnchor="end"
                interval={0}
                tickMargin={6}
                tick={{ fill: "#64748B", fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#E3E7EB" }}
                tickMargin={6}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-sm border border-[#E3E7EB] bg-white p-2.5 text-xs shadow-sm">
                        <p className="font-bold text-[#123B5D] mb-1">{label} Sub-City</p>
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                            <span className="text-slate-600">{entry.name}:</span>
                            <span className="font-mono font-bold text-slate-900">
                              {Number(entry.value).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Vulnerable" name="Elderly & PWD" stackId="a" fill="#168C86" />
              <Bar dataKey="Children" name="Children in Care" stackId="a" fill="#1769AA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-center justify-end gap-5 border-t border-[#E3E7EB] pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[#1769AA] rounded-xs" />
            <span>Children in Care (Civic Blue)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[#168C86] rounded-xs" />
            <span>Elderly & PWD Support (Teal)</span>
          </div>
        </div>
      </div>

      {/* 2. Municipal Matrix Table */}
      <div className="rounded-md border border-[#E3E7EB] bg-white shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E3E7EB] bg-[#F7F8FA] font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">Sub-City Jurisdiction</th>
                <th className="px-4 py-3 text-right">Elderly & PWD</th>
                <th className="px-4 py-3 text-right">Children</th>
                <th className="px-4 py-3 text-right">Total Caseload</th>
                <th className="px-4 py-3 text-center">Facilities</th>
                <th className="px-4 py-3 text-center">Edirs</th>
                <th className="px-4 py-3">Reporting Compliance</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7EB] font-medium text-slate-700">
              {sorted.map((s, idx) => {
                const total = s.vulnerableCitizens + s.totalChildren;
                const isSelected = selectedSubCity === s.name;

                return (
                  <tr
                    key={s.name}
                    className={`hover:bg-[#F7F8FA] transition-colors ${
                      isSelected ? "bg-slate-50 font-bold" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 w-4 text-right">
                          {idx + 1}.
                        </span>
                        <span className="font-bold text-[#123B5D]">{s.name}</span>
                        {isSelected && (
                          <span className="text-[10px] rounded-xs bg-[#1769AA] text-white px-1.5 py-0.5">
                            Selected
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                      {s.vulnerableCitizens.toLocaleString()}
                    </td>

                    <td className="px-4 py-2.5 text-right font-mono text-slate-700">
                      {s.totalChildren.toLocaleString()}
                    </td>

                    <td className="px-4 py-2.5 text-right font-mono font-bold text-[#123B5D]">
                      {total.toLocaleString()}
                    </td>

                    <td className="px-4 py-2.5 text-center font-mono text-slate-600">
                      {s.totalFacilities}
                    </td>

                    <td className="px-4 py-2.5 text-center font-mono text-slate-600">
                      {s.activeEdirs}
                    </td>

                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Progress value={s.complianceRate} className="h-1.5 w-16 bg-slate-100" />
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {s.complianceRate}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => onSelectSubCity?.(s.name)}
                        className="text-[11px] font-semibold text-[#1769AA] hover:underline cursor-pointer inline-flex items-center gap-0.5"
                      >
                        <span>Filter Registry</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
