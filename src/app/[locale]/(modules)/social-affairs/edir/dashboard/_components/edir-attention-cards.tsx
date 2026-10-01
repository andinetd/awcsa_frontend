"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EdirAttentionCardsProps {
  expiredEdirs?: number;
  revokedEdirs?: number;
  totalCouncils?: number;
  renewedThisYear?: number;
}

export function EdirAttentionCards({
  expiredEdirs = 0,
  revokedEdirs = 0,
  totalCouncils = 0,
  renewedThisYear = 0,
}: EdirAttentionCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      title: "Expired Accreditations",
      count: expiredEdirs,
      unit: "licenses overdue",
      badge: expiredEdirs > 0 ? "RENEWAL OVERDUE" : "COMPLIANT",
      badgeClass:
        expiredEdirs > 0
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-100 text-slate-600 border-slate-200",
      description:
        "Edir associations with expired annual accreditation certificates requiring renewal documentation and penalty assessments",
      link: "/social-affairs/edir/list",
      actionText: "Process renewal notices",
      accentBorder: "border-l-amber-500",
    },
    {
      title: "Disciplinary & Revoked",
      count: revokedEdirs,
      unit: "sanctioned edirs",
      badge: revokedEdirs > 0 ? "SANCTIONS" : "CLEAN DOCKET",
      badgeClass:
        revokedEdirs > 0
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-slate-100 text-slate-600 border-slate-200",
      description:
        "Associations suspended or revoked due to regulatory non-compliance, financial irregularities, or leadership disputes",
      link: "/social-affairs/edir/list",
      actionText: "Inspect compliance dossiers",
      accentBorder: "border-l-rose-500",
    },
    {
      title: "Zonal & Woreda Councils",
      count: totalCouncils,
      unit: "established councils",
      badge: totalCouncils > 0 ? "FEDERATION" : "INITIALIZING",
      badgeClass: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      description:
        "Umbrella councils representing affiliated neighborhood Edirs at the municipal sub-city and woreda administrative tiers",
      link: "/social-affairs/edir/councils",
      actionText: "Inspect council network",
      accentBorder: "border-l-[#1769AA]",
    },
    {
      title: "Accredited in Current Term",
      count: renewedThisYear,
      unit: "up-to-date edirs",
      badge: renewedThisYear > 0 ? "CERTIFIED" : "PENDING AUDIT",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description:
        "Active associations in full municipal compliance with certified bylaws, executive committees, and bank accounts",
      link: "/social-affairs/edir/list",
      actionText: "View accredited registry",
      accentBorder: "border-l-emerald-500",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          CASES REQUIRING BUREAU ATTENTION
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Municipal compliance &amp; accreditation oversight docket
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <Link
              key={card.title}
              href={card.link}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "rounded-xs border p-3.5 flex flex-col justify-between min-h-[120px] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden group select-none border-l-4 block",
                card.accentBorder,
                isHovered
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-md -translate-y-1"
                  : "bg-white text-slate-900 border-[#E3E7EB] hover:border-slate-300 shadow-2xs"
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "text-xs font-semibold truncate transition-colors duration-200",
                      isHovered ? "text-white" : "text-slate-900"
                    )}
                  >
                    {card.title}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase font-mono border",
                      isHovered
                        ? "bg-white/10 text-white border-white/20"
                        : card.badgeClass
                    )}
                  >
                    {card.badge}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "text-2xl font-bold font-mono tracking-tight transition-colors duration-200",
                      isHovered ? "text-white" : "text-[#0B1F3A]"
                    )}
                  >
                    {card.count.toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      "text-xs transition-colors duration-200",
                      isHovered ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    {card.unit}
                  </span>
                </div>

                <p
                  className={cn(
                    "text-[11px] leading-relaxed line-clamp-2 transition-colors duration-200",
                    isHovered ? "text-slate-300" : "text-slate-500"
                  )}
                >
                  {card.description}
                </p>
              </div>

              <div
                className={cn(
                  "pt-2 mt-2 border-t flex items-center justify-between text-xs font-semibold transition-colors duration-200",
                  isHovered
                    ? "border-white/10 text-[#38BDF8]"
                    : "border-slate-100 text-[#1769AA] group-hover:text-[#12568E]"
                )}
              >
                <span>{card.actionText}</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
