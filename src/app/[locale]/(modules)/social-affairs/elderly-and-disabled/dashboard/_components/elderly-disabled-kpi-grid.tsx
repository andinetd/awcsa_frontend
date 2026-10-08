"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Accessibility,
  HeartHandshake,
  UserCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ElderlyDisabledKpiGridProps {
  totalBeneficiaries?: number;
  elderlyTotal?: number;
  disabledTotal?: number;
  totalServices?: number;
  totalJobs?: number;
  totalTrainings?: number;
  pendingEligibility?: number;
  pendingConfirmation?: number;
  requestedServices?: number;
}

export function ElderlyDisabledKpiGrid({
  totalBeneficiaries = 0,
  elderlyTotal = 0,
  disabledTotal = 0,
  totalServices = 0,
  totalJobs = 0,
  totalTrainings = 0,
  pendingEligibility = 0,
  pendingConfirmation = 0,
  requestedServices = 0,
}: ElderlyDisabledKpiGridProps) {
  const triageTotal = pendingEligibility + pendingConfirmation + requestedServices;

  const cards = [
    {
      title: "Total Beneficiaries",
      value: totalBeneficiaries,
      sub: `${elderlyTotal.toLocaleString()} Elderly • ${disabledTotal.toLocaleString()} Disabled`,
      icon: Users,
      badgeText: "CENSUS",
      badgeColor: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      iconBg: "bg-[#1769AA]/10 text-[#1769AA]",
      link: "/social-affairs/elderly-and-disabled/beneficiaries",
    },
    {
      title: "Persons with Disabilities",
      value: disabledTotal,
      sub: "Physical, sensory, mental & multiple impairments",
      icon: Accessibility,
      badgeText: "INCLUSIVE",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      iconBg: "bg-amber-500/10 text-amber-600",
      link: "/social-affairs/elderly-and-disabled/beneficiaries",
    },
    {
      title: "Vulnerable Elderly",
      value: elderlyTotal,
      sub: "Aged 60+ social safety net & geriatric protection",
      icon: UserCheck,
      badgeText: "GERIATRIC",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      iconBg: "bg-purple-500/10 text-purple-600",
      link: "/social-affairs/elderly-and-disabled/beneficiaries",
    },
    {
      title: "Services & Assistive Devices",
      value: totalServices,
      sub: `${totalTrainings.toLocaleString()} in Skills Cohorts • ${totalJobs.toLocaleString()} Placements`,
      icon: HeartHandshake,
      badgeText: "DELIVERED",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      link: "/social-affairs/elderly-and-disabled/services",
    },
    {
      title: "Action Docket (Triage Queue)",
      value: triageTotal,
      sub: `${pendingEligibility} Vetting • ${pendingConfirmation} Confirmation • ${requestedServices} Intake`,
      icon: AlertTriangle,
      badgeText: triageTotal > 0 ? "ACTION REQUIRED" : "RESOLVED",
      badgeColor:
        triageTotal > 0
          ? "bg-rose-50 text-rose-700 border-rose-200 font-bold"
          : "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg:
        triageTotal > 0
          ? "bg-rose-500/10 text-rose-600"
          : "bg-emerald-500/10 text-emerald-600",
      link: "/social-affairs/elderly-and-disabled/services",
      isAlert: triageTotal > 0,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          EXECUTIVE SOCIAL PROTECTION SCORECARD
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Consolidated registry, assistance &amp; triage statistics
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
