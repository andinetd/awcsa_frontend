"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  useGetEdirAssociationsQuery,
  useGetEdirCouncilsQuery,
} from "@/hooks/social-affairs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HandHelping,
  ShieldCheck,
  Clock,
  FileX2,
  Ban,
  RefreshCw,
  Building2,
  ChevronRight,
  Home,
  Users2,
} from "lucide-react";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function EdirDashboard() {
  const t = useTranslations("social-affairs.edir.dashboard");
  const { data: edirs, isLoading } = useGetEdirAssociationsQuery();
  const { data: councils, isLoading: councilsLoading } =
    useGetEdirCouncilsQuery();

  if (isLoading || councilsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          {t("loading")}
        </div>
      </div>
    );
  }

  const list: Edir[] = edirs || [];
  const active = list.filter((e) => e.status === "ACTIVE").length;
  const expired = list.filter((e) => e.status === "EXPIRED").length;
  const revoked = list.filter((e) => e.status === "REVOKED").length;
  const cancelled = list.filter((e) => e.status === "CANCELLED").length;
  const currentYear = new Date().getFullYear();
  const renewedThisYear = list.filter(
    (e) => e.lastRenewedAt && new Date(e.lastRenewedAt).getFullYear() === currentYear
  ).length;

  const stats = [
    { key: "total", icon: HandHelping, value: list.length, color: "text-[#1769AA]", bg: "bg-[#E8F2FA]" },
    { key: "active", icon: ShieldCheck, value: active, color: "text-emerald-700", bg: "bg-emerald-50" },
    { key: "renewed", icon: RefreshCw, value: renewedThisYear, color: "text-[#1769AA]", bg: "bg-blue-50" },
    { key: "expired", icon: Clock, value: expired, color: "text-amber-700", bg: "bg-amber-50" },
    { key: "revoked", icon: FileX2, value: revoked, color: "text-rose-700", bg: "bg-rose-50" },
    { key: "cancelled", icon: Ban, value: cancelled, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  const councilList = councils || [];
  const councilStats = [
    { key: "total", icon: Building2, value: councilList.length, color: "text-[#1769AA]", bg: "bg-[#E8F2FA]" },
    { key: "active", icon: ShieldCheck, value: councilList.filter((c) => c.status === "ACTIVE").length, color: "text-emerald-700", bg: "bg-emerald-50" },
    { key: "expired", icon: Clock, value: councilList.filter((c) => c.status === "EXPIRED").length, color: "text-amber-700", bg: "bg-amber-50" },
    { key: "revoked", icon: FileX2, value: councilList.filter((c) => c.status === "REVOKED").length, color: "text-rose-700", bg: "bg-rose-50" },
    { key: "cancelled", icon: Ban, value: councilList.filter((c) => c.status === "CANCELLED").length, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  const recent = [...list]
    .sort(
      (a, b) =>
        new Date(b.registrationDate || b.createdAt || 0).getTime() -
        new Date(a.registrationDate || a.createdAt || 0).getTime()
    )
    .slice(0, 8);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">Social Affairs</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/social-affairs/edir/list" className="hover:text-[#1769AA] transition-colors">
          Edir
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">Dashboard</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Association Stats Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] mb-3 flex items-center gap-2">
          <Users2 className="w-4 h-4 text-[#1769AA]" />
          <span>Edir Associations Overview</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map(({ key, icon: Icon, value, color, bg }) => (
            <Card key={key} className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xs ${bg} ${color} border border-black/5`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-[#0B1F3A]">{value}</p>
                    <p className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                      {t(`stats.${key}`)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Council Stats Grid */}
      <div>
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1769AA]" />
            <span>{t("councilsTitle")}</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{t("councilsSubtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {councilStats.map(({ key, icon: Icon, value, color, bg }) => (
            <Card key={key} className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xs ${bg} ${color} border border-black/5`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-[#0B1F3A]">{value}</p>
                    <p className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                      {t(`stats.${key}`)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Registrations Card */}
      <Card className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs">
        <CardHeader className="border-b border-[#E3E7EB] px-6 py-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("recent")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <p className="text-slate-500 text-xs font-mono py-8 text-center">{t("noRecords")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-[#E3E7EB] text-left">
                  <tr>
                    <th className="px-5 py-3 font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">{t("table.name")}</th>
                    <th className="px-5 py-3 font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">{t("table.registration")}</th>
                    <th className="px-5 py-3 font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">{t("table.location")}</th>
                    <th className="px-5 py-3 font-mono font-bold text-slate-600 uppercase tracking-wider text-[11px]">{t("table.status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E7EB]">
                  {recent.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900">
                        <Link href={`/social-affairs/edir/${e.id}`} className="hover:text-[#1769AA] hover:underline">
                          {e.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-600">
                        {e.registrationNumber
                          ? (e.registrationDate
                              ? new Date(e.registrationDate).toLocaleDateString()
                              : "") + ` • ${e.registrationNumber}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {e.subCity}, {e.woreda}
                      </td>
                      <td className="px-5 py-3">
                        {e.status && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-mono font-semibold border ${
                              statusStyles[e.status] || "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {t(`status.${e.status}`)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}