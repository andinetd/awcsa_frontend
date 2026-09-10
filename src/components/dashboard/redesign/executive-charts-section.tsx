"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsData } from "@/api/dashboard/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Layers,
  PieChart as PieIcon,
  TrendingUp,
  Users,
} from "lucide-react";

interface ExecutiveChartsSectionProps {
  data: AnalyticsData;
}

// Modern harmonious color palette
const DEMO_COLORS: Record<string, { fill: string; text: string; bg: string }> = {
  Children: { fill: "#38bdf8", text: "text-sky-500", bg: "bg-sky-500/15" },
  Women: { fill: "#f43f5e", text: "text-rose-500", bg: "bg-rose-500/15" },
  Elderly: { fill: "#a855f7", text: "text-purple-500", bg: "bg-purple-500/15" },
  Disabled: { fill: "#10b981", text: "text-emerald-500", bg: "bg-emerald-500/15" },
};

export function ExecutiveChartsSection({ data }: ExecutiveChartsSectionProps) {
  const [trendView, setTrendView] = useState<"all" | "registrations" | "activities">("all");

  // Fallback demo trends if data.trends is empty
  const trendsData =
    data.trends && data.trends.length > 0
      ? data.trends
      : [
          { month: "Jan", registrations: 420, activities: 680 },
          { month: "Feb", registrations: 510, activities: 740 },
          { month: "Mar", registrations: 630, activities: 890 },
          { month: "Apr", registrations: 710, activities: 950 },
          { month: "May", registrations: 840, activities: 1120 },
          { month: "Jun", registrations: 960, activities: 1280 },
        ];

  // Fallback demo demographics
  const demographicsData =
    data.demographics && data.demographics.length > 0
      ? data.demographics
      : [
          { category: "Children", count: 1420 },
          { category: "Women", count: 1280 },
          { category: "Elderly", count: 2150 },
          { category: "Disabled", count: 1700 },
        ];

  const totalDemographics = demographicsData.reduce((acc, curr) => acc + curr.count, 0);

  // Fallback performance
  const performanceData =
    data.performance && data.performance.length > 0
      ? data.performance
      : [
          { department: "Child Welfare", output: 94, efficiency: 88 },
          { department: "Elderly & Disability", output: 86, efficiency: 91 },
          { department: "Women Affairs", output: 92, efficiency: 85 },
          { department: "Edir Councils", output: 89, efficiency: 94 },
          { department: "Facility Inspection", output: 78, efficiency: 82 },
        ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Main Trend: Registration vs Service Delivery */}
      <Card className="lg:col-span-8 overflow-hidden rounded-2xl border-border/80 shadow-xs backdrop-blur-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </span>
              <CardTitle className="text-base sm:text-lg font-bold">
                Registration Velocity & Service Delivery
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              Monthly trends in new client intake vs completed social welfare interventions
            </CardDescription>
          </div>

          {/* Toggle pills */}
          <div className="flex items-center rounded-lg border border-border/70 bg-muted/50 p-0.5 text-xs font-medium">
            <button
              onClick={() => setTrendView("all")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                trendView === "all"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Combined
            </button>
            <button
              onClick={() => setTrendView("registrations")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                trendView === "registrations"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setTrendView("activities")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                trendView === "activities"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Interventions
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendsData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-lg backdrop-blur-md text-xs">
                          <p className="font-bold text-foreground mb-1.5">{label}</p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                {entry.name === "registrations" ? "New Registrations" : "Interventions Delivered"}
                              </span>
                              <span className="font-mono font-bold text-foreground">
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
                {(trendView === "all" || trendView === "registrations") && (
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    name="registrations"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRegistrations)"
                  />
                )}
                {(trendView === "all" || trendView === "activities") && (
                  <Area
                    type="monotone"
                    dataKey="activities"
                    name="activities"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorActivities)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-sky-600" />
              <span>New Registrations (Intake)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-emerald-500" />
              <span>Completed Interventions & Support Services</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Demographic Breakdown Donut */}
      <Card className="lg:col-span-4 overflow-hidden rounded-2xl border-border/80 shadow-xs backdrop-blur-md flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <PieIcon className="h-4 w-4" />
            </span>
            <CardTitle className="text-base sm:text-lg font-bold">
              Beneficiary Demographics
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Distribution across vulnerable target segments
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Chart with center aggregate text */}
          <div className="relative h-[210px] w-full flex items-center justify-center">
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
                        <div className="rounded-xl border border-border/80 bg-popover/95 p-2.5 shadow-lg text-xs">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="font-mono text-muted-foreground mt-0.5">
                            {Number(item.value).toLocaleString()} citizens ({pct}%)
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
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="hsl(var(--card))"
                >
                  {demographicsData.map((entry) => {
                    const cfg = DEMO_COLORS[entry.category] || { fill: "#64748b" };
                    return <Cell key={entry.category} fill={cfg.fill} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs uppercase font-medium text-muted-foreground">Total</span>
              <span className="text-xl font-extrabold text-foreground font-lexend tabular-nums">
                {totalDemographics.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Demographic detailed legend list */}
          <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
            {demographicsData.map((d) => {
              const cfg = DEMO_COLORS[d.category] || { fill: "#64748b", text: "text-foreground", bg: "bg-muted" };
              const pct = totalDemographics > 0 ? Math.round((d.count / totalDemographics) * 100) : 0;
              return (
                <div key={d.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cfg.fill }} />
                    <span className="font-medium text-foreground">{d.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">{d.count.toLocaleString()}</span>
                    <span className="font-semibold text-foreground w-9 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3. Departmental Performance & Efficiency Scorecard */}
      <Card className="lg:col-span-12 overflow-hidden rounded-2xl border-border/80 shadow-xs backdrop-blur-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
                <Layers className="h-4 w-4" />
              </span>
              <CardTitle className="text-base sm:text-lg font-bold">
                Directorate Operational Scorecard & Target Output
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              Benchmark comparison between service output volume and overall resolution efficiency score (%)
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis
                  dataKey="department"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-lg text-xs">
                          <p className="font-bold text-foreground mb-1">{label}</p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                              <span className="text-muted-foreground">{entry.name}:</span>
                              <span className="font-mono font-bold text-foreground">
                                {entry.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="output" name="Output Achievement (%)" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={38} />
                <Bar dataKey="efficiency" name="Operational Efficiency (%)" fill="#14b8a6" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-center gap-6 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#0284c7]" />
              <span>Output Achievement (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#14b8a6]" />
              <span>Operational Efficiency (%)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
