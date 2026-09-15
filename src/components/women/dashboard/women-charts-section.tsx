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

interface WomenChartsSectionProps {
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
  { month: "Apr", registered: 14, supported: 10 },
  { month: "May", registered: 22, supported: 18 },
  { month: "Jun", registered: 19, supported: 15 },
  { month: "Jul", registered: 31, supported: 26 },
  { month: "Aug", registered: 28, supported: 24 },
  { month: "Sep", registered: 25, supported: 20 },
];

export function WomenChartsSection({
  intakeTrends = DEFAULT_INTAKE_TRENDS,
  programBreakdown,
}: WomenChartsSectionProps) {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const defaultBreakdown = [
    { category: "EMPLOYMENT", label: "Employment Placements", count: 18, color: "#1769AA" },
    { category: "TECHNOLOGY", label: "Productive Technology", count: 14, color: "#0B1F3A" },
    { category: "TRAINING", label: "Vocational Skills", count: 22, color: "#F59E0B" },
    { category: "SERVICES", label: "Support Services", count: 16, color: "#10B981" },
  ];

  const breakdown = programBreakdown && programBreakdown.length > 0 ? programBreakdown : defaultBreakdown;
  const totalInterventions = breakdown.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Monthly Beneficiary Inflow vs Support Resolutions (8 Columns) */}
      <div className="lg:col-span-8 rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs">
        <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">
              Monthly Beneficiary Inflow vs. Livelihood Placements &amp; Interventions
            </h3>
            <p className="text-[11px] text-slate-500">
              New profile registrations across all 11 sub-cities compared against wage employment, technology, and training support
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#0B1F3A]" />
              New Registrations
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
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xs border border-[#E3E7EB] bg-white p-2.5 shadow-md text-xs">
                        <p className="font-semibold text-slate-900 font-mono mb-1">{label} Cohort</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 flex items-center gap-1">
                              <span className="size-2 rounded-xs bg-[#0B1F3A]" /> Registered:
                            </span>
                            <span className="font-mono font-bold text-slate-900">{payload[0]?.value}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 flex items-center gap-1">
                              <span className="size-2 rounded-xs bg-[#1769AA]" /> Supported:
                            </span>
                            <span className="font-mono font-bold text-slate-900">{payload[1]?.value}</span>
                          </div>
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

      {/* 2. Program Breakdown Donut Visualizer (4 Columns) */}
      <div className="lg:col-span-4 rounded-xs border border-[#E3E7EB] bg-white p-4 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">
              Intervention Breakdown
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">All Sectors</span>
          </div>

          <div className="relative h-[150px] w-full flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="count"
                  onMouseEnter={(_, index) => setActiveSegment(index)}
                  onMouseLeave={() => setActiveSegment(null)}
                >
                  {breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-opacity duration-200"
                      opacity={activeSegment === null || activeSegment === index ? 1 : 0.4}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xs border border-[#E3E7EB] bg-white px-2 py-1 shadow-sm text-xs">
                          <span className="font-semibold text-slate-800">{data.label}: </span>
                          <span className="font-mono font-bold text-slate-900">{data.count}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Readout */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold font-mono text-[#0B1F3A] leading-tight">
                {totalInterventions}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                Services
              </span>
            </div>
          </div>
        </div>

        {/* Legend List */}
        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
          {breakdown.map((item, index) => (
            <div
              key={item.category}
              onMouseEnter={() => setActiveSegment(index)}
              onMouseLeave={() => setActiveSegment(null)}
              className="flex items-center justify-between text-[11px] py-0.5 px-1.5 rounded-xs cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.label}</span>
              </div>
              <span className="font-mono font-bold text-slate-800 shrink-0 ml-2">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
