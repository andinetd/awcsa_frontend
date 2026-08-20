"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useGetEdirAssociationsQuery } from "@/hooks/social-affairs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HandHelping,
  ShieldCheck,
  Clock,
  FileX2,
  Ban,
  RefreshCw,
} from "lucide-react";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  EXPIRED: "bg-amber-100 text-amber-700",
  REVOKED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

export default function EdirDashboard() {
  const t = useTranslations("social-affairs.edir.dashboard");
  const { data: edirs, isLoading } = useGetEdirAssociationsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">{t("loading")}</div>
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
    { key: "total", icon: HandHelping, value: list.length, color: "text-primary" },
    { key: "active", icon: ShieldCheck, value: active, color: "text-green-600" },
    { key: "renewed", icon: RefreshCw, value: renewedThisYear, color: "text-blue-600" },
    { key: "expired", icon: Clock, value: expired, color: "text-amber-600" },
    { key: "revoked", icon: FileX2, value: revoked, color: "text-red-600" },
    { key: "cancelled", icon: Ban, value: cancelled, color: "text-gray-500" },
  ];

  const recent = [...list]
    .sort(
      (a, b) =>
        new Date(b.registrationDate || b.createdAt || 0).getTime() -
        new Date(a.registrationDate || a.createdAt || 0).getTime()
    )
    .slice(0, 8);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(({ key, icon: Icon, value, color }) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full bg-zinc-100/80 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-900">{value}</p>
                  <p className="text-sm text-muted-foreground">{t(`stats.${key}`)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("recent")}</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">{t("noRecords")}</p>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">{t("table.name")}</th>
                    <th className="px-4 py-2 font-medium">{t("table.registration")}</th>
                    <th className="px-4 py-2 font-medium">{t("table.location")}</th>
                    <th className="px-4 py-2 font-medium">{t("table.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="px-4 py-2 font-medium">{e.name}</td>
                      <td className="px-4 py-2">
                        {e.registrationNumber
                          ? (e.registrationDate
                              ? new Date(e.registrationDate).toLocaleDateString()
                              : "") + ` • ${e.registrationNumber}`
                          : "—"}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {e.subCity}, {e.woreda}
                      </td>
                      <td className="px-4 py-2">
                        {e.status && (
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              statusStyles[e.status] || "bg-gray-100 text-gray-700"
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