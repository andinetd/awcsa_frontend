"use client";

import React, { useState } from "react";
import { SubCityStat } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Building,
  CheckCircle2,
  ChevronRight,
  Filter,
  Heart,
  MapPin,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const [sortBy, setSortBy] = useState<"beneficiaries" | "compliance" | "facilities">("beneficiaries");

  // Sorted list based on chosen criteria
  const sortedStats = [...stats].sort((a, b) => {
    if (sortBy === "compliance") return b.complianceRate - a.complianceRate;
    if (sortBy === "facilities") return b.totalFacilities - a.totalFacilities;
    return b.vulnerableCitizens + b.totalChildren - (a.vulnerableCitizens + a.totalChildren);
  });

  const cityWideTotalBeneficiaries = stats.reduce(
    (acc, s) => acc + s.vulnerableCitizens + s.totalChildren,
    0
  );
  const cityWideTotalFacilities = stats.reduce((acc, s) => acc + s.totalFacilities, 0);
  const cityWideTotalEdirs = stats.reduce((acc, s) => acc + s.activeEdirs, 0);
  const cityWideAvgCompliance =
    Math.round(stats.reduce((acc, s) => acc + s.complianceRate, 0) / (stats.length || 1));

  // Chart data
  const chartData = sortedStats.map((s) => ({
    name: s.name,
    Vulnerable: s.vulnerableCitizens,
    Children: s.totalChildren,
  }));

  return (
    <div className="space-y-6">
      {/* City-Wide Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border/80 bg-card/80">
          <span className="text-xs font-medium text-muted-foreground">Monitored Sub-Cities</span>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">11 Municipalities</h4>
          <p className="text-xs text-muted-foreground mt-1">Complete municipal coverage</p>
        </Card>

        <Card className="p-4 border-border/80 bg-card/80">
          <span className="text-xs font-medium text-muted-foreground">Total Citizens Mapped</span>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {cityWideTotalBeneficiaries.toLocaleString()}
          </h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">City-wide registry count</p>
        </Card>

        <Card className="p-4 border-border/80 bg-card/80">
          <span className="text-xs font-medium text-muted-foreground">Community Edirs Mapped</span>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {cityWideTotalEdirs.toLocaleString()}
          </h4>
          <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">Grassroots burial associations</p>
        </Card>

        <Card className="p-4 border-border/80 bg-card/80">
          <span className="text-xs font-medium text-muted-foreground">City Avg Compliance</span>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {cityWideAvgCompliance}%
          </h4>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Monthly report timeliness</p>
        </Card>
      </div>

      {/* Sub-City Distribution Chart */}
      <Card className="overflow-hidden rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
                <MapPin className="h-4 w-4" />
              </span>
              <CardTitle className="text-base sm:text-lg font-bold">
                Beneficiary Density by Sub-City
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              Distribution of vulnerable citizens and children under active social monitoring
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Sort By:</span>
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5 font-medium">
              <button
                onClick={() => setSortBy("beneficiaries")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  sortBy === "beneficiaries" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setSortBy("compliance")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  sortBy === "compliance" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Compliance
              </button>
              <button
                onClick={() => setSortBy("facilities")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  sortBy === "facilities" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Facilities
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-border/80 bg-popover/95 p-3 shadow-lg text-xs">
                          <p className="font-bold text-foreground mb-1">{label} Sub-City</p>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
                              <span className="text-muted-foreground">{entry.name}:</span>
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
                <Bar dataKey="Vulnerable" name="Vulnerable Adults" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Children" name="Children in Care" stackId="a" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sub-City Leaderboard Table */}
      <Card className="overflow-hidden rounded-2xl border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Sub-City Municipal Scorecard & Rankings
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Comparative metrics and compliance performance across Addis Ababa sub-cities
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/50 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Rank & Sub-City</th>
                <th className="px-4 py-3 text-right">Vulnerable Citizens</th>
                <th className="px-4 py-3 text-right">Children</th>
                <th className="px-4 py-3 text-center">Facilities</th>
                <th className="px-4 py-3 text-center">Edirs</th>
                <th className="px-4 py-3 text-right">City Share %</th>
                <th className="px-4 py-3">Compliance Score</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {sortedStats.map((sc, index) => {
                const total = sc.vulnerableCitizens + sc.totalChildren;
                const sharePct = cityWideTotalBeneficiaries > 0
                  ? ((total / cityWideTotalBeneficiaries) * 100).toFixed(1)
                  : "0";
                const isSelected = selectedSubCity === sc.name;

                return (
                  <tr
                    key={sc.name}
                    className={`hover:bg-muted/40 transition-colors ${
                      isSelected ? "bg-primary/5 font-bold" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-mono font-bold ${
                            index === 0
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : index === 1
                              ? "bg-slate-500/20 text-slate-600 dark:text-slate-300"
                              : index === 2
                              ? "bg-amber-700/20 text-amber-800 dark:text-amber-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-bold text-foreground">{sc.name}</span>
                          {isSelected && (
                            <Badge className="ml-2 text-[10px] bg-primary text-primary-foreground py-0 px-1.5">
                              Active Filter
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                      {sc.vulnerableCitizens.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                      {sc.totalChildren.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-muted-foreground">
                      {sc.totalFacilities}
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-muted-foreground">
                      {sc.activeEdirs}
                    </td>

                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                      {sharePct}%
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={sc.complianceRate} className="h-2 w-20" />
                        <span className="font-mono text-xs font-bold text-foreground">
                          {sc.complianceRate}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onSelectSubCity?.(sc.name)}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                      >
                        <span>Filter</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
