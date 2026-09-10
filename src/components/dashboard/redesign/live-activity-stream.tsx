"use client";

import React, { useState } from "react";
import { RecentActivity } from "@/api/dashboard/executive";
import {
  Activity,
  Baby,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  HandHeart,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveActivityStreamProps {
  activities?: RecentActivity[];
}

export function LiveActivityStream({ activities = [] }: LiveActivityStreamProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  // Fallback demo activities if API returned empty
  const defaultActivities: RecentActivity[] = [
    {
      id: "act-1",
      type: "CHILD_REGISTRATION",
      title: "New Child Intake Registered",
      description: "Child admitted to Hope Care Center with preliminary health check completed.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "act-2",
      type: "CLIENT_REGISTRATION",
      title: "Elderly Support Case Opened",
      description: "Social worker assigned for monthly nutrition subsidy in Kirkos Sub-City.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "act-3",
      type: "FACILITY_REGISTRATION",
      title: "Monthly Inspection Report Submitted",
      description: "Bole Sanctuary Care Center submitted monthly census report.",
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    },
    {
      id: "act-4",
      type: "EDIR_REGISTRATION",
      title: "Community Edir Mutual Aid Affiliated",
      description: "Gulele Woreda 04 Edir completed council federation affiliation.",
      timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    },
    {
      id: "act-5",
      type: "CHILD_REGISTRATION",
      title: "Adoption Applicant Screening Verified",
      description: "Home visit report validated by Directorate Review Committee.",
      timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    },
  ];

  const displayList = activities && activities.length > 0 ? activities : defaultActivities;

  const filtered = displayList.filter((a) => {
    if (filterType === "ALL") return true;
    return a.type === filterType;
  });

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "CHILD_REGISTRATION":
        return <Baby className="h-4 w-4" />;
      case "CLIENT_REGISTRATION":
        return <Users className="h-4 w-4" />;
      case "FACILITY_REGISTRATION":
        return <Building className="h-4 w-4" />;
      case "EDIR_REGISTRATION":
        return <HandHeart className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "CHILD_REGISTRATION":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "CLIENT_REGISTRATION":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "FACILITY_REGISTRATION":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "EDIR_REGISTRATION":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${Math.max(1, diffMins)}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="rounded-2xl border-border/80 shadow-xs backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Live Bureau Operations & Activity Stream
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Real-time feed of citizen registrations, intake cases, and facility submissions
          </CardDescription>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType("ALL")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
              filterType === "ALL" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("CHILD_REGISTRATION")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
              filterType === "CHILD_REGISTRATION" ? "bg-sky-600 text-white font-semibold" : "bg-muted text-muted-foreground"
            }`}
          >
            Children
          </button>
          <button
            onClick={() => setFilterType("CLIENT_REGISTRATION")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
              filterType === "CLIENT_REGISTRATION" ? "bg-emerald-600 text-white font-semibold" : "bg-muted text-muted-foreground"
            }`}
          >
            Citizens
          </button>
          <button
            onClick={() => setFilterType("FACILITY_REGISTRATION")}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
              filterType === "FACILITY_REGISTRATION" ? "bg-purple-600 text-white font-semibold" : "bg-muted text-muted-foreground"
            }`}
          >
            Facilities
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3.5 p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${getActivityColor(
                  item.type
                )}`}
              >
                {getActivityIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    {item.title}
                  </h5>
                  <span className="shrink-0 text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
