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

interface ElderlyDisabledChartsSectionProps {
  intakeTrends?: Array<{
    month: string;
    registered: number;
    supported: number;
  }>;
  programBreakdown?: Array<{
    category: string;
    label: string;
    count: number;
    color: string;
  }>;
}

const DEFAULT_INTAKE_TRENDS = [
  { month: "Apr", registered: 42, supported: 35 },
  { month: "May", registered: 58, supported: 48 },
  { month: "Jun", registered: 51, supported: 44 },
  { month: "Jul", registered: 76, supported: 62 },
  { month: "Aug", registered: 69, supported: 59 },
  { month: "Sep", registered: 64, supported: 55 },
];

export function ElderlyDisabledChartsSection({
  intakeTrends = DEFAULT_INTAKE_TRENDS,
  programBreakdown,
}: ElderlyDisabledChartsSectionProps) {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const defaultBreakdown = [
    { category: "DEVICES", label: "Assistive Devices & Mobility", count: 38, color: "#1769AA" },
    { category: "GERIATRIC", label: "Geriatric & Health Care", count: 28, color: "#0B1F3A" },
    { category: "TRAINING", label: "Accessible Skills Training", count: 22, color: "#F59E0B" },
    { category: "EMPLOYMENT", label: "Inclusive Job Placements", count: 18, color: "#10B981" },
  ];

  const breakdown = programBreakdown && programBreakdown.length > 0 ? programBreakdown : defaultBreakdown;
  const totalInterventions = breakdown.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Monthly Beneficiary Intake vs Support Delivered (8 Columns) */}
      <div className="lg:col-span-8 rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs">
        <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">
              Monthly Inflow vs. Support Interventions Delivered
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              New vulnerability registrations across 11 sub-cities compared against medical, assistive device, and livelihood resolutions
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#0B1F3A]" />
              Registrations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#1769AA]" />
              Interventions Delivered
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
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xs border border-[#E3E7EB] bg-white p-2.5 shadow-md text-xs font-mono">
                        <p className="font-bold text-slate-800 border-b pb-1 mb-1.5">
                          {payload[0].payload.month} Summary
                        </p>
                        <div className="space-y-1">
                          <p className="text-slate-600 flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1">
                              <span className="size-2 rounded-full bg-[#0B1F3A]" />
                              New Intakes:
                            </span>
                            <span className="font-bold text-slate-900">{payload[0].value}</span>
                          </p>
                          <p className="text-slate-600 flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1">
                              <span className="size-2 rounded-full bg-[#1769AA]" />
                              Delivered Aid:
                            </span>
                            <span className="font-bold text-[#1769AA]">{payload[1].value}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="registered" fill="#0B1F3A" radius={[2, 2, 0, 0]} maxBarSize={28} />
              <Bar dataKey="supported" fill="#1769AA" radius={[2, 2, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Program & Welfare Interventions Allocation Donut (4 Columns) */}
      <div className="lg:col-span-4 rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs flex flex-col justify-between">
        <div className="pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">
              Support Program Distribution
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] font-mono">
              {totalInterventions} TOTAL
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Intervention categories delivered across all beneficiaries
          </p>
        </div>

        <div className="relative h-[160px] w-full flex items-center justify-center my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const pct = totalInterventions > 0 ? ((data.count / totalInterventions) * 100).toFixed(1) : "0";
                    return (
                      <div className="rounded-xs border border-[#E3E7EB] bg-white p-2 shadow-md text-xs font-mono">
                        <span className="font-bold text-slate-800 block">{data.label}</span>
                        <span className="text-[#1769AA] font-bold">{data.count} ({pct}%)</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={breakdown}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                onMouseEnter={(_, index) => setActiveSegment(index)}
                onMouseLeave={() => setActiveSegment(null)}
              >
                {breakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.category}`}
                    fill={entry.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-opacity duration-200"
                    opacity={activeSegment === null || activeSegment === index ? 1 : 0.4}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-[#0B1F3A]">
              {totalInterventions}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
              Delivered
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px] font-mono">
          {breakdown.map((item, idx) => {
            const pct = totalInterventions > 0 ? Math.round((item.count / totalInterventions) * 100) : 0;
            return (
              <div
                key={item.category}
                onMouseEnter={() => setActiveSegment(idx)}
                onMouseLeave={() => setActiveSegment(null)}
                className="flex items-center gap-1.5 p-1 rounded-xs hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <span className="size-2 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate text-[11px]">{item.label}</span>
                <span className="font-bold text-slate-900 ml-auto">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
