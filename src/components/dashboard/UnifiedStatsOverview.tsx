import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  key: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

interface UnifiedStatsOverviewProps {
  stats: StatItem[];
}

export function UnifiedStatsOverview({ stats }: UnifiedStatsOverviewProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm dark:bg-slate-950/50">
      <CardContent className="p-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.key}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-4 p-4 rounded-xl border ${stat.border} ${stat.bg} transition-colors cursor-default`}
            >
              <div
                className={`p-3 rounded-lg bg-white dark:bg-slate-950 shadow-sm ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {stat.value.toLocaleString()}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
