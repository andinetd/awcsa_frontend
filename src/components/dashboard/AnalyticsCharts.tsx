"use client";

import React from "react";
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
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AnalyticsData } from "@/api/dashboard/analytics";

import { useTranslations } from "next-intl";

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const t = useTranslations("executive.dashboard.analytics");

  // Trends Configuration
  const trendsConfig = {
    registrations: {
      label: t("trends.registrations"),
      color: "#0ea5e9", // Sky 500 (Blue)
    },
    activities: {
      label: t("trends.activities"),
      color: "#10b981", // Emerald 500 (Green)
    },
  } satisfies ChartConfig;

  // Performance Configuration
  const performanceConfig = {
    output: {
      label: t("performance.output"),
      color: "#06b6d4", // Cyan 500 (Blue-Green)
    },
    efficiency: {
      label: t("performance.efficiency"),
      color: "#14b8a6", // Teal 500 (Teal)
    },
  } satisfies ChartConfig;

  // Demographics Configuration
  const demographicsConfig = {
    count: {
      label: t("demographics.count"),
    },
    Elderly: {
      label: t("demographics.elderly"),
      color: "#0ea5e9", // Sky 500
    },
    Children: {
      label: t("demographics.children"),
      color: "#10b981", // Emerald 500
    },
    Women: {
      label: t("demographics.women"),
      color: "#06b6d4", // Cyan 500
    },
    Disabled: {
      label: t("demographics.disabled"),
      color: "#14b8a6", // Teal 500
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Trends Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>{t("trends.title")}</CardTitle>
          <CardDescription>{t("trends.description")}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer
            config={trendsConfig}
            className="max-h-[300px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data.trends}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient
                  id="fillRegistrations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-registrations)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-registrations)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillActivities" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-activities)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-activities)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="registrations"
                type="natural"
                fill="url(#fillRegistrations)"
                fillOpacity={0.4}
                stroke="var(--color-registrations)"
                stackId="a"
              />
              <Area
                dataKey="activities"
                type="natural"
                fill="url(#fillActivities)"
                fillOpacity={0.4}
                stroke="var(--color-activities)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Demographics Chart */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>{t("demographics.title")}</CardTitle>
          <CardDescription>{t("demographics.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={demographicsConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data.demographics}
                dataKey="count"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                {data.demographics.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`var(--color-${entry.category})`}
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>{t("performance.title")}</CardTitle>
          <CardDescription>{t("performance.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={performanceConfig}
            className="max-h-[300px] w-full"
          >
            <BarChart accessibilityLayer data={data.performance}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="output" fill="var(--color-output)" radius={4} />
              <Bar
                dataKey="efficiency"
                fill="var(--color-efficiency)"
                radius={4}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
