"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
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
  const actions = [
    {
      title: "Women Profiles Directory",
      description: "Manage individual municipal profiles, career statuses and education records",
      href: "/women/profiles",
      icon: Users,
      badge: "Registry",
    },
    {
      title: "Women Associations",
      description: "Chartered grassroots associations, legal documentation and reviews",
      href: "/women/associations",
      icon: Landmark,
      badge: "Cooperatives",
    },
    {
      title: "Association Members",
      description: "Cross-department individual membership directory and leadership roles",
      href: "/women/members",
      icon: Users,
      badge: "Roster",
    },
    {
      title: "Support Interventions",
      description: "Social and material support delivery logs, monitoring and beneficiary history",
      href: "/women/services",
      icon: HandHeart,
      badge: "Interventions",
    },
    {
      title: "Technology Support",
      description: "Productive equipment and machinery grants to female entrepreneurs",
      href: "/women/technology",
      icon: Zap,
      badge: "Equipment",
    },
    {
      title: "Vocational Training",
      description: "Entrepreneurship cohorts, skills certifications and attendance monitoring",
      href: "/women/training",
      icon: GraduationCap,
      badge: "Capacity",
    },
    {
      title: "Employment Placements",
      description: "Wage employment and self-employment cooperative linkages",
      href: "/women/employment",
      icon: Briefcase,
      badge: "Economic",
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
          <Layers className="size-3.5 text-[#1769AA]" />
          PRIMARY MODULE WORKFLOWS &amp; DIRECTORIES
        </h2>
        <span className="text-[11px] text-slate-400">
          Direct navigation to core operations
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
                <span>Open module</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
