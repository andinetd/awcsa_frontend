import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  value: string | number;

  chartData: Array<{ [key: string]: any }>;
  chartConfig: { [key: string]: { label: string; color: string } };
  dataKey: string;
}

const StatsCard = ({
  title,
  icon: Icon,
  value,

  chartData,
  chartConfig,
  dataKey,
}: StatCardProps) => {
  return (
    <Card className="w-full max-w-sm bg-white border border-zinc-200 rounded-xl group hover:shadow-lg hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all ease-in-out duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 bg-zinc-100/80 rounded-full group-hover:bg-white group-hover:shadow-sm transition-colors duration-300">
            <Icon className="h-5 w-5 text-zinc-600 group-hover:text-primary transition-colors duration-300" />
          </div>
        </div>
        <div className="h-16 w-36">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={`var(--color-${dataKey})`}
                  strokeWidth={2}
                  dot={false}
                  strokeOpacity={0.8}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="font-medium text-sm text-zinc-500">{title}</p>
        <div className="flex items-baseline space-x-3">
          <div className="text-3xl font-bold text-zinc-900 tracking-tight">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
