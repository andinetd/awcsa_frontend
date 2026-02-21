"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useExecutiveDashboard } from "@/hooks/dashboard/useExecutiveDashboard";
import { RecentActivity } from "@/api/dashboard/executive";
import { Baby, Users, Building, HandHeart, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { useGetDashboardAnalyticsQuery } from "@/hooks/dashboard/useAnalytics";
import { UnifiedStatsOverview } from "@/components/dashboard/UnifiedStatsOverview";

export default function ExecutiveDashboard() {
  const t = useTranslations("super-admin.dashboard");
  const { data, isLoading } = useExecutiveDashboard();
  const { data: analyticsData } = useGetDashboardAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "CHILD_REGISTRATION":
        return <Baby className="w-4 h-4" />;
      case "CLIENT_REGISTRATION":
        return <Users className="w-4 h-4" />;
      case "FACILITY_REGISTRATION":
        return <Building className="w-4 h-4" />;
      case "EDIR_REGISTRATION":
        return <HandHeart className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "CHILD_REGISTRATION":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CLIENT_REGISTRATION":
        return "bg-green-50 text-green-700 border-green-200";
      case "FACILITY_REGISTRATION":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "EDIR_REGISTRATION":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
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
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 font-lexend">
            {t("title")}
          </h1>
          <p className="text-zinc-500 mt-1">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="activity">
            {t("recentActivity.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Unified Stats Overview */}
          <UnifiedStatsOverview
            stats={[
              {
                key: "children",
                label: t("stats.children"),
                value: data?.overview.totalChildren || 0,
                icon: Baby,
                color: "text-sky-500",
                bg: "bg-sky-50 dark:bg-sky-900/20",
                border: "border-sky-100 dark:border-sky-800",
              },
              {
                key: "people",
                label: t("stats.peopleInNeed"),
                value: data?.overview.totalPeopleRegistered || 0,
                icon: Users,
                color: "text-emerald-500",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                border: "border-emerald-100 dark:border-emerald-800",
              },
              {
                key: "facilities",
                label: t("stats.facilities"),
                value: data?.overview.totalFacilities || 0,
                icon: Building,
                color: "text-cyan-500",
                bg: "bg-cyan-50 dark:bg-cyan-900/20",
                border: "border-cyan-100 dark:border-cyan-800",
              },
              {
                key: "edirs",
                label: t("stats.edirs"),
                value: data?.overview.totalEdirs || 0,
                icon: HandHeart,
                color: "text-teal-500",
                bg: "bg-teal-50 dark:bg-teal-900/20",
                border: "border-teal-100 dark:border-teal-800",
              },
            ]}
          />

          {/* Analytics Charts */}
          {analyticsData && <AnalyticsCharts data={analyticsData} />}
        </TabsContent>

        <TabsContent value="activity">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t("recentActivity.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {data.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-slate-900">
                            {activity.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">
                    {t("recentActivity.noActivity")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
