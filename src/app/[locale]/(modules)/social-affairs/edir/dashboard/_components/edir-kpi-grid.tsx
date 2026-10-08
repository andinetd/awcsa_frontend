"use client";

import React from "react";
import Link from "next/link";
import {
  HandHelping,
  ShieldCheck,
  Building2,
  Users2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface EdirKpiGridProps {
  totalEdirs?: number;
  activeEdirs?: number;
  expiredEdirs?: number;
  revokedEdirs?: number;
  cancelledEdirs?: number;
  totalCouncils?: number;
  renewedThisYear?: number;
  totalMembers?: number;
  femaleMembers?: number;
  maleMembers?: number;
}

export function EdirKpiGrid({
  totalEdirs = 0,
  activeEdirs = 0,
  expiredEdirs = 0,
  revokedEdirs = 0,
  cancelledEdirs = 0,
  totalCouncils = 0,
  renewedThisYear = 0,
  totalMembers = 0,
  femaleMembers = 0,
  maleMembers = 0,
}: EdirKpiGridProps) {
  const t = useTranslations("social-affairs.edir.dashboard.kpis");

  const complianceRate =
    totalEdirs > 0 ? Math.round((activeEdirs / totalEdirs) * 100) : 0;

  const femalePercent =
    totalMembers > 0 ? Math.round((femaleMembers / totalMembers) * 100) : 0;
  const malePercent =
    totalMembers > 0 ? Math.round((maleMembers / totalMembers) * 100) : 0;

  const attentionRequired = expiredEdirs + revokedEdirs;

  const cards = [
    {
      title: t("totalEdirsTitle"),
      value: totalEdirs,
      sub: t("totalEdirsSub", {
        active: activeEdirs.toLocaleString(),
        expired: expiredEdirs.toLocaleString(),
      }),
      icon: HandHelping,
      badgeText: t("directoryBadge"),
      badgeColor: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      iconBg: "bg-[#1769AA]/10 text-[#1769AA]",
      link: "/social-affairs/edir/list",
    },
    {
      title: t("activeStandingTitle"),
      value: activeEdirs,
      sub: t("activeStandingSub", { rate: complianceRate }),
      icon: ShieldCheck,
      badgeText: t("accreditedBadge", { rate: complianceRate }),
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      link: "/social-affairs/edir/list",
    },
    {
      title: t("umbrellaCouncilsTitle"),
      value: totalCouncils,
      sub: t("umbrellaCouncilsSub"),
      icon: Building2,
      badgeText: t("councilsBadge"),
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-500/10 text-blue-600",
      link: "/social-affairs/edir/councils",
    },
    {
      title: t("communityReachTitle"),
      value: totalMembers,
      sub: t("communityReachSub", {
        femalePct: femalePercent,
        female: femaleMembers.toLocaleString(),
        malePct: malePercent,
        male: maleMembers.toLocaleString(),
      }),
      icon: Users2,
      badgeText: t("citizenBaseBadge"),
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      iconBg: "bg-purple-500/10 text-purple-600",
      link: "/social-affairs/edir/list",
    },
    {
      title: t("actionDocketTitle"),
      value: attentionRequired,
      sub: t("actionDocketSub", {
        expired: expiredEdirs,
        revoked: revokedEdirs,
      }),
      icon: AlertTriangle,
      badgeText: attentionRequired > 0 ? t("actionRequiredBadge") : t("compliantBadge"),
      badgeColor:
        attentionRequired > 0
          ? "bg-rose-50 text-rose-700 border-rose-200 font-bold"
          : "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg:
        attentionRequired > 0
          ? "bg-rose-500/10 text-rose-600"
          : "bg-emerald-500/10 text-emerald-600",
      link: "/social-affairs/edir/list",
      isAlert: attentionRequired > 0,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          {t("sectionTitle")}
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          {t("sectionSubtitle")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} href={c.link} className="block group">
              <Card
                className={`rounded-xs border bg-white p-4 shadow-2xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between h-full ${
                  c.isAlert
                    ? "border-rose-300 hover:border-rose-400"
                    : "border-[#E3E7EB] hover:border-slate-300"
                }`}
              >
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xs ${c.iconBg}`}>
                      <Icon className="size-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono border ${c.badgeColor}`}
                    >
                      {c.badgeText}
                    </span>
                  </div>

                  <div>
                    <p className="text-2xl font-bold font-mono tracking-tight text-[#0B1F3A]">
                      {c.value.toLocaleString()}
                    </p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 group-hover:text-[#1769AA] transition-colors">
                      {c.title}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <p className="text-slate-500 line-clamp-1 font-mono">
                      {c.sub}
                    </p>
                    <ArrowRight className="size-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
