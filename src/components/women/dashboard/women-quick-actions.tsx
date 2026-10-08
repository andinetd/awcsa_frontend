"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Users,
  Landmark,
  HandHeart,
  Zap,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";

export function WomenQuickActions() {
  const t = useTranslations("women.dashboard.quickActionsList");

  const actions = [
    {
      title: t("actions.profiles.title"),
      description: t("actions.profiles.description"),
      href: "/women/profiles",
      icon: Users,
      badge: t("actions.profiles.badge"),
    },
    {
      title: t("actions.associations.title"),
      description: t("actions.associations.description"),
      href: "/women/associations",
      icon: Landmark,
      badge: t("actions.associations.badge"),
    },
    {
      title: t("actions.members.title"),
      description: t("actions.members.description"),
      href: "/women/members",
      icon: Users,
      badge: t("actions.members.badge"),
    },
    {
      title: t("actions.services.title"),
      description: t("actions.services.description"),
      href: "/women/services",
      icon: HandHeart,
      badge: t("actions.services.badge"),
    },
    {
      title: t("actions.technology.title"),
      description: t("actions.technology.description"),
      href: "/women/technology",
      icon: Zap,
      badge: t("actions.technology.badge"),
    },
    {
      title: t("actions.training.title"),
      description: t("actions.training.description"),
      href: "/women/training",
      icon: GraduationCap,
      badge: t("actions.training.badge"),
    },
    {
      title: t("actions.employment.title"),
      description: t("actions.employment.description"),
      href: "/women/employment",
      icon: Briefcase,
      badge: t("actions.employment.badge"),
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
          <Layers className="size-3.5 text-[#1769AA]" />
          {t("title")}
        </h2>
        <span className="text-[11px] text-slate-400">
          {t("subtitle")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.href}
              href={act.href}
              className="rounded-xs border border-[#E3E7EB] bg-white p-3.5 hover:border-[#BCD5EA] hover:bg-[#E8F2FA]/40 transition-all duration-200 shadow-2xs group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="size-7 rounded-xs bg-[#E8F2FA] text-[#1769AA] flex items-center justify-center group-hover:bg-[#1769AA] group-hover:text-white transition-colors">
                    <Icon className="size-3.5" />
                  </div>
                  <span className="text-[10.5px] font-semibold text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded-xs">
                    {act.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#1769AA] transition-colors">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {act.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-[#1769AA]">
                <span>{t("openModule")}</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
