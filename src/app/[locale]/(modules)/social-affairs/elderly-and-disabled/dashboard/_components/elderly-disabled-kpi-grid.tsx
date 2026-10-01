"use client";

import React from "react";
import {
  Users,
  Accessibility,
  HeartHandshake,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ElderlyDisabledKpiGridProps {
  totalBeneficiaries?: number;
  elderlyTotal?: number;
  disabledTotal?: number;
  totalServices?: number;
  totalJobs?: number;
  totalTrainings?: number;
}

export function ElderlyDisabledKpiGrid({
  totalBeneficiaries = 0,
  elderlyTotal = 0,
  disabledTotal = 0,
  totalServices = 0,
  totalJobs = 0,
  totalTrainings = 0,
}: ElderlyDisabledKpiGridProps) {
  const cards = [
    {
      title: "Total Beneficiaries",
      value: totalBeneficiaries,
      sub: `${elderlyTotal.toLocaleString()} Elderly • ${disabledTotal.toLocaleString()} Disabled`,
      icon: Users,
      badgeText: "CENSUS",
      badgeColor: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      iconBg: "bg-[#1769AA]/10 text-[#1769AA]",
    },
    {
      title: "Persons with Disabilities",
      value: disabledTotal,
      sub: "Physical, sensory, mental & multiple impairments",
      icon: Accessibility,
      badgeText: "INCLUSIVE",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      iconBg: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Vulnerable Elderly",
      value: elderlyTotal,
      sub: "Aged 60+ receiving social safety net & medical aid",
      icon: UserCheck,
      badgeText: "GERIATRIC",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      iconBg: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Services & Assistive Devices",
      value: totalServices,
      sub: "Wheelchairs, prosthetics, medical & material aid",
      icon: HeartHandshake,
      badgeText: "DELIVERED",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Economic Placements",
      value: totalJobs,
      sub: `${totalTrainings.toLocaleString()} vocational skills trainees enrolled`,
      icon: Briefcase,
      badgeText: "LIVELIHOODS",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-500/10 text-blue-600",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          MASTER SOCIAL PROTECTION SCORECARD
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Consolidated registry statistics
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
