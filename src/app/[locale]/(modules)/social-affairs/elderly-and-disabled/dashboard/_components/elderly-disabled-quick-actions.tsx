"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  HeartHandshake,
  GraduationCap,
  Briefcase,
  Search,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function ElderlyDisabledQuickActions() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard.quickActions");

  const actions = [
    {
      title: t("registry.title"),
      desc: t("registry.desc"),
      icon: Users,
      href: "/social-affairs/elderly-and-disabled/beneficiaries",
      badge: t("registry.badge"),
      color: "text-[#1769AA]",
      bg: "bg-[#E8F2FA]",
    },
    {
      title: t("services.title"),
      desc: t("services.desc"),
      icon: HeartHandshake,
      href: "/social-affairs/elderly-and-disabled/services",
      badge: t("services.badge"),
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      title: t("training.title"),
      desc: t("training.desc"),
      icon: GraduationCap,
      href: "/social-affairs/elderly-and-disabled/training",
      badge: t("training.badge"),
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      title: t("employment.title"),
      desc: t("employment.desc"),
      icon: Briefcase,
      href: "/social-affairs/elderly-and-disabled/jobs",
      badge: t("employment.badge"),
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: t("search.title"),
      desc: t("search.desc"),
      icon: Search,
      href: "/social-affairs/elderly-and-disabled/search",
      badge: t("search.badge"),
      color: "text-indigo-700",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          {t("title")}
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          {t("subtitle")}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.title} href={act.href} className="group block select-none">
              <Card className="rounded-xs border border-[#E3E7EB] bg-white p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xs ${act.bg} ${act.color}`}>
                      <Icon className="size-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono bg-slate-100 text-slate-700 border border-[#E3E7EB]">
                      {act.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono group-hover:text-[#1769AA] transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1769AA] group-hover:text-[#12568E]">
                    <span className="font-mono text-[11px]">{t("openWorkspace")}</span>
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
