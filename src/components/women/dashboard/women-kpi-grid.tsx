"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Users,
  Landmark,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WomenKpiGridProps {
  totalProfiles?: number;
  totalAssociations?: number;
  approvedAssociations?: number;
  submittedAssociations?: number;
  draftAssociations?: number;
  totalMembers?: number;
  totalGroups?: number;
  declaredMembers?: number;
  totalEmployments?: number;
  totalTechSupport?: number;
  totalTrainings?: number;
}

export function WomenKpiGrid({
  totalProfiles = 0,
  totalAssociations = 0,
  approvedAssociations = 0,
  submittedAssociations = 0,
  draftAssociations = 0,
  totalMembers = 0,
  totalGroups = 0,
  declaredMembers = 0,
  totalEmployments = 0,
  totalTechSupport = 0,
  totalTrainings = 0,
}: WomenKpiGridProps) {
  const t = useTranslations("women.dashboard.kpis");
  const tMatrix = useTranslations("women.dashboard.matrix");
  const totalInterventions = totalEmployments + totalTechSupport + totalTrainings;
  const isAlert = submittedAssociations > 0;

  const cards = [
    {
      title: t("registeredWomen.title"),
      value: totalProfiles,
      sub: t("registeredWomen.description"),
      icon: Users,
      badgeText: t("registeredWomen.badge"),
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100 text-slate-700",
      link: "/women/profiles",
      isAlert: false,
      actionText: t("registeredWomen.action"),
    },
    {
      title: t("activeAssociations.title"),
      value: totalAssociations,
      sub: `${approvedAssociations} • ${draftAssociations} • ${submittedAssociations}`,
      icon: Landmark,
      badgeText: t("activeAssociations.badge"),
      badgeColor: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      iconBg: "bg-[#E8F2FA] text-[#1769AA]",
      link: "/women/associations",
      isAlert: false,
      actionText: t("activeAssociations.action"),
    },
    {
      title: t("employedWomen.title"),
      value: totalEmployments,
      sub: t("employedWomen.description"),
      icon: Layers,
      badgeText: t("employedWomen.badge"),
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      iconBg: "bg-sky-50 text-sky-700",
      link: "/women/employment",
      isAlert: false,
      actionText: t("employedWomen.action"),
    },
    {
      title: t("techRecipients.title"),
      value: totalTechSupport,
      sub: t("techRecipients.description"),
      icon: Sparkles,
      badgeText: t("techRecipients.badge"),
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-emerald-50 text-emerald-700",
      link: "/women/technology",
      isAlert: false,
      actionText: t("techRecipients.action"),
    },
    {
      title: t("trainedGraduates.title"),
      value: totalTrainings,
      sub: t("trainedGraduates.description"),
      icon: isAlert ? AlertTriangle : ShieldCheck,
      badgeText: t("trainedGraduates.badge"),
      badgeColor: isAlert
        ? "bg-rose-50 text-rose-700 border-rose-200 font-bold"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: isAlert
        ? "bg-rose-500/10 text-rose-600"
        : "bg-emerald-500/10 text-emerald-600",
      link: "/women/training",
      isAlert: isAlert,
      actionText: t("trainedGraduates.action"),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          {tMatrix("summaryCard.title")}
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          {tMatrix("summaryCard.description")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} href={c.link} className="block group">
              <Card
                className={`rounded-xs border bg-white p-3.5 shadow-2xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between h-full ${
                  c.isAlert
                    ? "border-rose-300 hover:border-rose-400"
                    : "border-[#E3E7EB] hover:border-slate-300"
                }`}
              >
                <CardContent className="p-0 space-y-2.5">
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
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {c.sub}
                    </p>
                  </div>
                </CardContent>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-[#1769AA]">
                  <span>{c.actionText}</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
