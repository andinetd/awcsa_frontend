"use client";

import React from "react";
import { ADDIS_ABABA_SUBCITIES, TimeframeOption } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  MapPin,
  Printer,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExecutiveHeaderProps {
  timeframe: TimeframeOption;
  setTimeframe: (val: TimeframeOption) => void;
  selectedSubCity: string;
  setSelectedSubCity: (val: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExportCSV?: () => void;
  onPrint?: () => void;
}

export function ExecutiveHeader({
  timeframe,
  setTimeframe,
  selectedSubCity,
  setSelectedSubCity,
  onRefresh,
  isRefreshing = false,
  onExportCSV,
  onPrint,
}: ExecutiveHeaderProps) {
  const timeframeLabels: Record<TimeframeOption, string> = {
    today: "Today",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    quarter: "Quarterly",
    ytd: "Year to Date",
    all: "All Time",
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-6 md:p-8 shadow-sm backdrop-blur-md">
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Title & Live Meta */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Executive Command Center
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {todayFormatted}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-lexend">
            Bureau of Women & Social Affairs
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Unified strategic dashboard overseeing child welfare, social assistance, vulnerable citizen protection, and monthly facility compliance across Addis Ababa.
          </p>
        </div>

        {/* Right: Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Sub-City Selector */}
          <div className="w-[180px]">
            <Select value={selectedSubCity} onValueChange={setSelectedSubCity}>
              <SelectTrigger className="h-9 bg-background/80 text-xs font-medium backdrop-blur-sm border-border hover:bg-background transition-colors">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary" />
                <SelectValue placeholder="All Sub-Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sub-Cities (City-wide)</SelectItem>
                {ADDIS_ABABA_SUBCITIES.map((subCity) => (
                  <SelectItem key={subCity} value={subCity}>
                    {subCity} Sub-City
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Quick Buttons */}
          <div className="hidden sm:flex items-center rounded-lg border border-border/80 bg-background/60 p-0.5 backdrop-blur-sm">
            {(["30d", "quarter", "ytd", "all"] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  timeframe === tf
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-9 gap-1.5 bg-background/80 text-xs font-medium backdrop-blur-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </Button>

          {/* Export & Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-sm transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Report</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">Export Executive Data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExportCSV} className="text-xs cursor-pointer">
                <Download className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Export CSV Dataset
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPrint} className="text-xs cursor-pointer">
                <Printer className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                Print / Save as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
