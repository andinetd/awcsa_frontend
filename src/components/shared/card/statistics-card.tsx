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
    <Card className="w-full max-w-sm bg-white border border-zinc-200 rounded-lg group hover:bg-secondary/65 hover:border-secondary transition-all ease-linear duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-zinc-50 rounded-full border-zinc-200 border">
            <Icon className="h-4 w-4 " />
          </div>
        </div>
        <div className="h-16 w-36">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="linear"
                  dataKey={dataKey}
                  stroke={`var(--color-${dataKey})`}
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium text-zinc-500">{title}</p>
        <div className="flex items-baseline space-x-3">
          <div className="text-4xl font-medium text-zinc-900 group-hover:text-primary">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
