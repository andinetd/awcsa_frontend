"use client";

import StatsCard from "@/components/shared/card/statistics-card";
import { Baby, Building, Heart, FileText, Plus } from "lucide-react";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const chartData = [
  { day: 1, value: 3 },
  { day: 2, value: 4 },
  { day: 3, value: 8 },
  { day: 4, value: 3 },
  { day: 5, value: 5 },
  { day: 6, value: 12 },
  { day: 7, value: 10 },
];

const chartConfig = {
  children: { label: "Children", color: "hsl(var(--chart-1))" },
  centers: { label: "Centers", color: "hsl(var(--chart-2))" },
  requests: { label: "Requests", color: "hsl(var(--chart-3))" },
  benefits: { label: "Benefits", color: "hsl(var(--chart-4))" },
};

export default function AdoptionDashboard() {
  const { data: careCenters } = useGetCareCentersQuery();

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
            Adoption Services
          </h1>
          <p className="text-zinc-500 mt-1">
            Overview of children, care centers, and adoption requests.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/adoption/adoption-requests">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Children"
          icon={Baby}
          value={124}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="children"
        />
        <StatsCard
          title="Care Centers"
          icon={Building}
          value={careCenters?.length || 0}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="centers"
        />
        <StatsCard
          title="Adoption Requests"
          icon={FileText}
          value={42}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="requests"
        />
        <StatsCard
          title="Support Benefits"
          icon={Heart}
          value={86}
          chartData={chartData}
          chartConfig={chartConfig}
          dataKey="benefits"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">
            Recent Activity
          </h2>
          <div className="min-h-[400px] rounded-xl border border-zinc-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-zinc-50 rounded-full">
              <FileText className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-900 font-medium">
                No recent applications
              </p>
              <p className="text-sm text-zinc-500">
                Newly submitted adoption requests will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">Quick Actions</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            <Link href="/adoption/children" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Baby className="w-4 h-4 text-zinc-500" />
                Manage Children
              </Button>
            </Link>
            <Link href="/adoption/care-centers" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Building className="w-4 h-4 text-zinc-500" />
                Care center list
              </Button>
            </Link>
            <Link href="/adoption/adoption-requests" className="block">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <Heart className="w-4 h-4 text-zinc-500" />
                Adoption Requests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
