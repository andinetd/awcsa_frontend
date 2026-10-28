"use client";

import React from "react";
import { useGetUserActivityStatistics } from "@/hooks/super-admin";
import {
  Users,
  Activity,
  LogIn,
  ShieldAlert,
  Clock,
  Laptop,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";

export function UserActivityStats() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGetUserActivityStatistics();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        <RefreshCw className="h-8 w-8 animate-spin mb-3 text-primary" />
        <p className="text-sm">Loading activity and login statistics...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
        <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <h3 className="font-semibold text-lg">Unable to load activity statistics</h3>
        <p className="text-sm mt-1 text-red-600">
          Please check your permissions or network connection.
        </p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const {
    activeUsersNow,
    totalActiveSessions,
    loginsToday,
    loginsThisWeek,
    loginsThisMonth,
    totalRegisteredUsers,
    dailyLoginsTrend,
    usersByAccountType,
    usersByStatus,
    recentLogins,
  } = data;

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-lexend">
            User Activity & Login Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time statistics across active sessions, staff logins, and registered accounts
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isFetching}
          className="flex items-center gap-2 self-start"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users Now */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Now
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {activeUsersNow}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              unique users
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {totalActiveSessions} active session{totalActiveSessions === 1 ? "" : "s"} (last 15m)
          </p>
        </div>

        {/* Logins Today */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Logins Today
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <LogIn className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {loginsToday}
            </span>
            <span className="text-xs text-slate-500 font-medium">sessions</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Since 00:00 midnight</p>
        </div>

        {/* 7-Day Logins */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Last 7 Days
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {loginsThisWeek}
            </span>
            <span className="text-xs text-slate-500 font-medium">logins</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {loginsThisMonth} total this month
          </p>
        </div>

        {/* Total Accounts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalRegisteredUsers}
            </span>
            <span className="text-xs text-slate-500 font-medium">registered</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            {Object.entries(usersByAccountType).map(([type, count]) => (
              <span
                key={type}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 14-Day Login Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-lexend">
              Daily Login Frequency (Past 14 Days)
            </h3>
            <p className="text-xs text-slate-500">
              Tracking total sign-in sessions and unique active visitors per day
            </p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dailyLoginsTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(d) => d.slice(5)} // MM-DD
              />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="logins"
                name="Total Logins"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLogins)"
              />
              <Area
                type="monotone"
                dataKey="uniqueUsers"
                name="Unique Users"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lower Row: Account Status Distribution + Recent Login Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 font-lexend">
            Account Status Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(usersByStatus).map(([status, count]) => {
              const pct = totalRegisteredUsers
                ? Math.round((count / totalRegisteredUsers) * 100)
                : 0;
              const isOk = status === "ACTIVE";
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isOk ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      {status}
                    </span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        isOk ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Login Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-3 font-lexend">
            Recent Login Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3">User</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Login Time</th>
                  <th className="py-2 px-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentLogins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-slate-400 italic"
                    >
                      No recent login records found
                    </td>
                  </tr>
                ) : (
                  recentLogins.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900">
                          {session.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {session.email}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          {session.role || session.accountType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(session.issuedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(session.lastActivityAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
