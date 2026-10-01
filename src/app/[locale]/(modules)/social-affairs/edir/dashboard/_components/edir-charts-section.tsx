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

interface EdirChartsSectionProps {
  intakeTrends?: Array<{
    month: string;
    registered: number;
    renewed: number;
  }>;
  statusBreakdown?: Array<{
    status: string;
    label: string;
    count: number;
    color: string;
  }>;
}

const DEFAULT_INTAKE_TRENDS = [
  { month: "Apr", registered: 24, renewed: 18 },
  { month: "May", registered: 32, renewed: 26 },
  { month: "Jun", registered: 28, renewed: 22 },
  { month: "Jul", registered: 45, renewed: 38 },
  { month: "Aug", registered: 39, renewed: 31 },
  { month: "Sep", registered: 35, renewed: 29 },
];

export function EdirChartsSection({
  intakeTrends = DEFAULT_INTAKE_TRENDS,
  statusBreakdown,
}: EdirChartsSectionProps) {
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const defaultStatus = [
    { status: "ACTIVE", label: "Active Accreditation", count: 85, color: "#10B981" },
    { status: "EXPIRED", label: "Expired Licenses", count: 24, color: "#F59E0B" },
    { status: "REVOKED", label: "Revoked / Sanctioned", count: 8, color: "#EF4444" },
    { status: "CANCELLED", label: "Cancelled / Dissolved", count: 5, color: "#64748B" },
  ];

  const breakdown = statusBreakdown && statusBreakdown.length > 0 ? statusBreakdown : defaultStatus;
  const totalEdirs = breakdown.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Monthly Registration Inflow vs Renewals (8 Columns) */}
      <div className="lg:col-span-8 rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs">
        <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">
              Monthly Edir Registration vs. Annual License Renewals
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              New community association charter applications compared against municipal renewal certifications
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#0B1F3A]" />
              New Registrations
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#1769AA]" />
              Annual Renewals
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
                              New Edirs:
                            </span>
                            <span className="font-bold text-slate-900">{payload[0].value}</span>
                          </p>
                          <p className="text-slate-600 flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1">
                              <span className="size-2 rounded-full bg-[#1769AA]" />
                              Renewals:
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
              <Bar dataKey="renewed" fill="#1769AA" radius={[2, 2, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Accreditation Standing Donut (4 Columns) */}
      <div className="lg:col-span-4 rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs flex flex-col justify-between">
        <div className="pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">
              Accreditation Status
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] font-mono">
              {totalEdirs} EDIRS
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Legal certification &amp; regulatory standing breakdown
          </p>
        </div>

        <div className="relative h-[160px] w-full flex items-center justify-center my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const pct = totalEdirs > 0 ? ((data.count / totalEdirs) * 100).toFixed(1) : "0";
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
                    key={`cell-${entry.status}`}
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
              {totalEdirs}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
              Associations
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 text-[11px] font-mono">
          {breakdown.map((item, idx) => {
            const pct = totalEdirs > 0 ? Math.round((item.count / totalEdirs) * 100) : 0;
            return (
              <div
                key={item.status}
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
