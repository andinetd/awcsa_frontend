"use client";

import React from "react";
import {
  HandHelping,
  ShieldCheck,
  Building2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EdirKpiGridProps {
  totalEdirs?: number;
  activeEdirs?: number;
  expiredEdirs?: number;
  revokedEdirs?: number;
  cancelledEdirs?: number;
  totalCouncils?: number;
  renewedThisYear?: number;
}

export function EdirKpiGrid({
  totalEdirs = 0,
  activeEdirs = 0,
  expiredEdirs = 0,
  revokedEdirs = 0,
  cancelledEdirs = 0,
  totalCouncils = 0,
  renewedThisYear = 0,
}: EdirKpiGridProps) {
  const currentYear = new Date().getFullYear();
  const complianceRate =
    totalEdirs > 0 ? Math.round((activeEdirs / totalEdirs) * 100) : 0;

  const cards = [
    {
      title: "Total Registered Edirs",
      value: totalEdirs,
      sub: `${activeEdirs.toLocaleString()} Active • ${expiredEdirs.toLocaleString()} Expired`,
      icon: HandHelping,
      badgeText: "DIRECTORY",
      badgeColor: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      iconBg: "bg-[#1769AA]/10 text-[#1769AA]",
    },
    {
      title: "Active Legal Standing",
      value: activeEdirs,
      sub: `${complianceRate}% overall municipal compliance rate`,
      icon: ShieldCheck,
      badgeText: "ACCREDITED",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Umbrella Councils",
      value: totalCouncils,
      sub: "Woreda & sub-city federated councils coordinating edirs",
      icon: Building2,
      badgeText: "COUNCILS",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Renewed in Current Term",
      value: renewedThisYear,
      sub: `Annual audits completed for ${currentYear}`,
      icon: RefreshCw,
      badgeText: "AUDITED",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      iconBg: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Sanctioned & Cancelled",
      value: revokedEdirs + cancelledEdirs,
      sub: `${revokedEdirs} Revoked • ${cancelledEdirs} Cancelled / Dissolved`,
      icon: AlertTriangle,
      badgeText: "SANCTIONED",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      iconBg: "bg-rose-500/10 text-rose-600",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          MASTER COMMUNITY ASSOCIATIONS SCORECARD
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Consolidated accreditation &amp; federation statistics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card
              key={c.title}
              className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
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
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {c.title}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 line-clamp-1 font-mono">
                    {c.sub}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
