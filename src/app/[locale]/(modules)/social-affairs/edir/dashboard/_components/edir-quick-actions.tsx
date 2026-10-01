"use client";

import React from "react";
import Link from "next/link";
import {
  HandHelping,
  Building2,
  FileCheck2,
  Users2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EdirQuickActions() {
  const actions = [
    {
      title: "Edir Associations Registry",
      desc: "Comprehensive directory of verified traditional community associations, registration numbers, bylaws, and leadership profiles",
      icon: HandHelping,
      href: "/social-affairs/edir/list",
      badge: "PRIMARY REGISTRY",
      color: "text-[#1769AA]",
      bg: "bg-[#E8F2FA]",
    },
    {
      title: "Federated Councils Directory",
      desc: "Sub-city and woreda umbrella councils representing affiliated grassroots edirs, council charters, and executive committees",
      icon: Building2,
      href: "/social-affairs/edir/councils",
      badge: "GOVERNANCE",
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: "Accreditation & Renewals",
      desc: "Annual license verification, legal charter reissue, compliance audits, and penalty assessments for expired associations",
      icon: FileCheck2,
      href: "/social-affairs/edir/list",
      badge: "LEGAL ACCREDITATION",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      title: "Household Membership",
      desc: "Census of participating community households, emergency mutual funds, burial assistance, and neighborhood social welfare",
      icon: Users2,
      href: "/social-affairs/edir/list",
      badge: "COMMUNITY REACH",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      title: "Regulatory Compliance & Disputes",
      desc: "Oversight of sanctioned, revoked, or dissolved associations, dispute resolutions, and legal audit investigations",
      icon: ShieldAlert,
      href: "/social-affairs/edir/list",
      badge: "ENFORCEMENT",
      color: "text-rose-700",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          PRIMARY EDIR MODULES &amp; GOVERNANCE WORKFLOWS
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Direct navigation to operational registers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    <span className="font-mono text-[11px]">Open module workspace</span>
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
