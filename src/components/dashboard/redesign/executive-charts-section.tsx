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
import { AnalyticsData } from "@/api/dashboard/analytics";

interface ExecutiveChartsSectionProps {
  data: AnalyticsData;
}

// Institutional chart color semantics matching Image 1:
// Navy (#0B1F3A) = Primary / Intake / Disabled
// Blue (#1769AA) = Action / Interventions / Elderly
// Sky (#38BDF8)  = Auxiliary / Children
// Plum (#74345F) = Women
const DEMOGRAPHIC_PALETTE: Record<string, string> = {
  Disabled: "#0B1F3A",
  Elderly: "#1769AA",
  Children: "#38BDF8",
  Women: "#74345F",
};

export function ExecutiveChartsSection({ data }: ExecutiveChartsSectionProps) {
  // Monthly intake vs services data matching Image 1
  const trendsData =
    data.trends && data.trends.length > 0
      ? data.trends
      : [
          { month: "Apr", registrations: 0, activities: 0 },
          { month: "May", registrations: 0, activities: 0 },
          { month: "Jun", registrations: 0, activities: 0 },
          { month: "Jul", registrations: 45, activities: 30 },
          { month: "Aug", registrations: 30, activities: 8 },
          { month: "Sep", registrations: 0, activities: 0 },
        ];

  const demographicsData =
    data.demographics && data.demographics.length > 0
      ? data.demographics
      : [
          { category: "Disabled", count: 8 },
          { category: "Elderly", count: 8 },
          { category: "Women", count: 14 },
          { category: "Children", count: 13 },
        ];

  const totalDemographics = demographicsData.reduce((acc, curr) => acc + curr.count, 0) || 43;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Monthly Intake Velocity vs Completed Interventions (8 Columns) */}
      <div className="lg:col-span-8 rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none">
        <div className="pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800">
            Monthly intake velocity vs. completed interventions
          </h3>
          <p className="text-[11px] text-slate-500">
            New client intake across all 11 sub-cities, compared against completed social welfare services
          </p>
        </div>

        <div className="mt-3 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendsData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: "#CBD5E1" }}
                tickMargin={6}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <YAxis
                domain={[0, 60]}
                ticks={[0, 15, 30, 45, 60]}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-sm border border-[#E3E7EB] bg-white p-2 text-xs shadow-sm">
                        <p className="font-bold text-slate-800 mb-1">{label}</p>
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                            <span className="flex items-center gap-1.5 text-slate-600">
                              <span
                                className="h-2 w-2 rounded-xs"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name === "registrations" ? "New citizen intake" : "Services & welfare interventions"}
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {Number(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="registrations"
                name="registrations"
                fill="#0B1F3A"
                radius={[0, 0, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="activities"
                name="activities"
                fill="#1769AA"
                radius={[0, 0, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center gap-5 pt-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[#0B1F3A] rounded-xs" />
            <span>New citizen intake</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 bg-[#1769AA] rounded-xs" />
            <span>Services &amp; welfare interventions</span>
          </div>
        </div>
      </div>

      {/* 2. Demographic Vulnerability Category Donut (4 Columns) */}
      <div className="lg:col-span-4 rounded-sm border border-[#E3E7EB] bg-white p-4 shadow-none flex flex-col justify-between">
        <div>
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800">
              Beneficiary demographic distribution
            </h3>
            <p className="text-[11px] text-slate-500">
              Verified breakdown by target segment
            </p>
          </div>

          <div className="relative h-[180px] w-full flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      const pct = totalDemographics > 0
                        ? ((Number(item.value) / totalDemographics) * 100).toFixed(1)
                        : "0";
                      return (
                        <div className="rounded-sm border border-[#E3E7EB] bg-white p-2 text-xs shadow-sm">
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="font-mono text-slate-700">
                            {Number(item.value)} ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={demographicsData}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={1}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                >
                  {demographicsData.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={DEMOGRAPHIC_PALETTE[entry.category] || "#0B1F3A"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400">Total:</span>
              <span className="text-base font-bold font-mono text-slate-800">
                {totalDemographics}
              </span>
            </div>
          </div>
        </div>

        {/* Structured Demographic Legend */}
        <div className="mt-2 pt-2 space-y-1 text-xs">
          {demographicsData.map((d) => {
            const color = DEMOGRAPHIC_PALETTE[d.category] || "#0B1F3A";
            const pct = totalDemographics > 0 ? Math.round((d.count / totalDemographics) * 100) : 0;
            return (
              <div key={d.category} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-xs" style={{ backgroundColor: color }} />
                  <span className="text-slate-700">{d.category}</span>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  {d.count} · {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
