"use client";

import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AdoptionChartsSectionProps {
  intakeTrends?: Array<{
    month: string;
    intake: number;
    placements: number;
  }>;
  statusBreakdown?: Array<{
    status: string;
    label: string;
    count: number;
    color: string;
  }>;
}

const DEFAULT_INTAKE_TRENDS = [
  { month: "Apr", intake: 2, placements: 1 },
  { month: "May", intake: 3, placements: 2 },
  { month: "Jun", intake: 1, placements: 1 },
  { month: "Jul", intake: 5, placements: 3 },
  { month: "Aug", intake: 4, placements: 2 },
  { month: "Sep", intake: 2, placements: 1 },
];

const DEFAULT_STATUS_BREAKDOWN = [
  { status: "FOUND", label: "Found / In-Processing", count: 2, color: "#F59E0B" },
  { status: "IN_CARE", label: "Residential Care Centers", count: 1, color: "#0B1F3A" },
  { status: "IN_ADERA", label: "Adera Custody Placements", count: 2, color: "#1769AA" },
  { status: "WITH_BLOOD_RELATIVE", label: "Kinship / Relatives", count: 2, color: "#38BDF8" },
  { status: "ADOPTED", label: "Domestic Adoption Finalized", count: 1, color: "#10B981" },
];

export function AdoptionChartsSection({
  intakeTrends = DEFAULT_INTAKE_TRENDS,
  statusBreakdown = DEFAULT_STATUS_BREAKDOWN,
}: AdoptionChartsSectionProps) {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const totalMinors = statusBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 8;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Monthly Child Inflow vs Placement Resolutions (8 Columns) */}
      <div className="lg:col-span-8 rounded-sm border border-[#E3E7EB] bg-white p-4">
        <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Monthly Minor Inflow vs. Legal Placements & Resolutions
            </h3>
            <p className="text-[11px] text-slate-500">
              New child intake across all 11 sub-cities compared against reunifications, kinship custody, and finalized adoptions
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#0B1F3A]" />
              New Minor Intake
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#1769AA]" />
              Placements & Decrees
            </span>
          </div>
        </div>

        <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={intakeTrends}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                fontSize={11}
                tick={{ fill: "#64748B" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tick={{ fill: "#64748B" }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded border border-[#E3E7EB] bg-white px-2.5 py-1.5 shadow-sm text-xs">
                        <div className="font-semibold text-slate-800 mb-1">{label}</div>
                        <div className="flex items-center justify-between gap-4 text-slate-600 text-[11px]">
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-xs bg-[#0B1F3A]" />
                            New Intake:
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-600 text-[11px]">
                          <span className="flex items-center gap-1">
                            <span className="size-2 rounded-xs bg-[#1769AA]" />
                            Placements:
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {payload[1]?.value}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="intake" fill="#0B1F3A" radius={[2, 2, 0, 0]} maxBarSize={28} />
              <Bar dataKey="placements" fill="#1769AA" radius={[2, 2, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Legal Status & Placement Distribution Donut (4 Columns) */}
      <div className="lg:col-span-4 rounded-sm border border-[#E3E7EB] bg-white p-4 flex flex-col justify-between">
        <div className="pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Child Legal Status & Placement
          </h3>
          <p className="text-[11px] text-slate-500">
            Distribution across {totalMinors} tracked minors in jurisdiction
          </p>
        </div>

        <div className="relative my-2 h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percent = Math.round((data.count / totalMinors) * 100);
                    return (
                      <div className="rounded border border-[#E3E7EB] bg-white px-2.5 py-1.5 shadow-sm text-xs">
                        <div className="font-semibold text-slate-800">{data.label}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {data.count} children ({percent}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={statusBreakdown}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                onMouseEnter={(_, index) => setActiveSegment(index)}
                onMouseLeave={() => setActiveSegment(null)}
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={activeSegment === index ? "#0F172A" : "#FFFFFF"}
                    strokeWidth={activeSegment === index ? 1.5 : 1}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Total Label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Total
            </span>
            <span className="text-lg font-bold font-mono text-[#0F172A] leading-none">
              {totalMinors}
            </span>
            <span className="text-[9.5px] text-slate-400">Minors</span>
          </div>
        </div>

        {/* Legend breakdown list */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          {statusBreakdown.map((item, idx) => {
            const percent = Math.round((item.count / totalMinors) * 100);
            return (
              <div
                key={idx}
                className="flex items-center justify-between text-[11px] hover:bg-slate-50 px-1.5 py-0.5 rounded cursor-default"
                onMouseEnter={() => setActiveSegment(idx)}
                onMouseLeave={() => setActiveSegment(null)}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="size-2 rounded-xs shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-slate-500 shrink-0">
                  <span className="font-semibold text-slate-900">{item.count}</span>
                  <span className="text-[10px] text-slate-400">({percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
