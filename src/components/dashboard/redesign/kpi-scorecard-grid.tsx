"use client";

import React from "react";
import { motion } from "framer-motion";
import { MetricCardData } from "./types";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Baby,
  Heart,
  HandHeart,
  FileCheck2,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KPIScorecardGridProps {
  cards: MetricCardData[];
}

const iconMap: Record<string, LucideIcon> = {
  beneficiaries: Users,
  children: Baby,
  vulnerable: Heart,
  women: HandHeart,
  compliance: FileCheck2,
};

const themeColorMap = {
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    border: "border-blue-500/20 dark:border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    stroke: "#3b82f6",
    gradient: "from-blue-500/20 to-transparent",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    border: "border-emerald-500/20 dark:border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    stroke: "#10b981",
    gradient: "from-emerald-500/20 to-transparent",
  },
  violet: {
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
    border: "border-violet-500/20 dark:border-violet-500/30",
    text: "text-violet-600 dark:text-violet-400",
    stroke: "#8b5cf6",
    gradient: "from-violet-500/20 to-transparent",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
    border: "border-rose-500/20 dark:border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    stroke: "#f43f5e",
    gradient: "from-rose-500/20 to-transparent",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    border: "border-amber-500/20 dark:border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    stroke: "#f59e0b",
    gradient: "from-amber-500/20 to-transparent",
  },
  teal: {
    bg: "bg-teal-500/10 dark:bg-teal-500/15",
    border: "border-teal-500/20 dark:border-teal-500/30",
    text: "text-teal-600 dark:text-teal-400",
    stroke: "#14b8a6",
    gradient: "from-teal-500/20 to-transparent",
  },
};

export function KPIScorecardGrid({ cards }: KPIScorecardGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
    >
      {cards.map((card) => {
        const Icon = iconMap[card.id] || Users;
        const theme = themeColorMap[card.colorTheme] || themeColorMap.blue;
        const formattedVal =
          typeof card.value === "number"
            ? card.value.toLocaleString()
            : card.value;

        return (
          <motion.div
            key={card.id}
            variants={item}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-card/80 p-5 shadow-xs backdrop-blur-md transition-all hover:shadow-md hover:border-primary/40`}
          >
            {/* Top row: Icon and Trend pill */}
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${theme.border} ${theme.bg} ${theme.text}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {card.changePercent !== undefined && (
                <div
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    card.changeType === "negative"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {card.changeType === "negative" ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  <span>
                    {card.changePercent > 0 ? "+" : ""}
                    {card.changePercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Title & Large Figure */}
            <div className="mt-3.5 space-y-0.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-foreground font-lexend tabular-nums">
                  {formattedVal}
                </h3>
              </div>
            </div>

            {/* Subtitle / context description */}
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {card.subtitle}
            </p>

            {/* Mini Sparkline Chart */}
            {card.sparkline && card.sparkline.length > 0 && (
              <div className="mt-3 h-10 w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={card.sparkline}
                    margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={`spark-${card.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={theme.stroke}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor={theme.stroke}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={theme.stroke}
                      strokeWidth={2}
                      fill={`url(#spark-${card.id})`}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Secondary Metric Footnote */}
            {card.secondaryMetric && (
              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {card.secondaryMetric.label}
                </span>
                <span className="font-semibold text-foreground flex items-center gap-0.5">
                  {card.secondaryMetric.value}
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
