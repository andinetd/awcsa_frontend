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
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ElderlyDisabledQuickActions() {
  const actions = [
    {
      title: "Beneficiaries Registry",
      desc: "Comprehensive registry of verified elderly and disabled citizens, Fayda ID validation, and case history records",
      icon: Users,
      href: "/social-affairs/elderly-and-disabled/beneficiaries",
      badge: "PRIMARY REGISTRY",
      color: "text-[#1769AA]",
      bg: "bg-[#E8F2FA]",
    },
    {
      title: "Support Services & Aid",
      desc: "Track assistive devices, physical therapy, medical referrals, nutritional rations, and home visits",
      icon: HeartHandshake,
      href: "/social-affairs/elderly-and-disabled/services?tab=services",
      badge: "WELFARE DELIVERY",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      title: "Vocational Skills Training",
      desc: "Manage skills training cohorts, accessible artisan workshops, technical skills, and COC certifications",
      icon: GraduationCap,
      href: "/social-affairs/elderly-and-disabled/services?tab=training",
      badge: "CAPACITY BUILDING",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      title: "Inclusive Employment",
      desc: "Liaison with public and private employers to secure wage placements and cooperative micro-enterprises",
      icon: Briefcase,
      href: "/social-affairs/elderly-and-disabled/services?tab=jobs",
      badge: "LIVELIHOODS",
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: "Beneficiary Search",
      desc: "Cross-department query tool by Fayda ID, City ID, biometric verification status, phone, or name",
      icon: Search,
      href: "/social-affairs/elderly-and-disabled/search",
      badge: "AUDIT & LOOKUP",
      color: "text-indigo-700",
      bg: "bg-indigo-50",
    },
    {
      title: "Welfare Dossiers & Audits",
      desc: "Inspect case notes, eligibility assessments, verification timeline, and municipal protection reports",
      icon: ShieldCheck,
      href: "/social-affairs/elderly-and-disabled/beneficiaries",
      badge: "COMPLIANCE",
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          PRIMARY SOCIAL PROTECTION MODULES &amp; WORKFLOWS
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Quick access to operational registers
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
