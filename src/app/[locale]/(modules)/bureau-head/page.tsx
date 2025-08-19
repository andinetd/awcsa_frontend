"use client";
import StatsCard from "@/components/shared/card/statistics-card";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import {
  Briefcase,
  HandHelping,
  Search,
  File,
  User,
  HandHeart,
} from "lucide-react";
import React from "react";

const chartData = [
  { day: 1, applications: 3 },
  { day: 2, applications: 4 },
  { day: 3, applications: 8 },
  { day: 4, applications: 3 },
  { day: 5, applications: 5 },
  { day: 6, applications: 20 },
  { day: 7, applications: 10 },
  { day: 8, applications: 1 },
  { day: 9, applications: 2 },
  { day: 10, applications: 7 },
];

const chartData2 = [
  { day: 1, applications: 3 },
  { day: 2, applications: 4 },
  { day: 3, applications: 3 },
  { day: 4, applications: 9 },
  { day: 5, applications: 5 },
  { day: 6, applications: 15 },
  { day: 7, applications: 10 },
  { day: 8, applications: 1 },
  { day: 9, applications: 13 },
  { day: 10, applications: 4 },
];

const chartConfig = {
  applications: {
    label: "Applications",
    color: "oklch(0.5401 0.1128 234.35)",
  },
};

const BureauHead = () => {
  return (
    <div className="w-full space-y-6 p-4">
      {/* Header Section */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8">
        <StatsCard
          chartConfig={chartConfig}
          chartData={chartData2}
          title="Total Children"
          dataKey={"applications"}
          icon={HandHeart}
          value={577}
        />
        <StatsCard
          chartConfig={chartConfig}
          chartData={chartData}
          title="Care centers"
          dataKey={"applications"}
          icon={HandHelping}
          value={45}
        />
      </div>
    </div>
  );
};

export default BureauHead;
