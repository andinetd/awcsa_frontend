"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { uiTokens } from "@/styles/design-system";

interface WomenAttentionCardsProps {
  submittedAssociations?: number;
  totalEmployments?: number;
  totalTechSupport?: number;
  totalTrainings?: number;
}

export function WomenAttentionCards({
  submittedAssociations = 0,
  totalEmployments = 0,
  totalTechSupport = 0,
  totalTrainings = 0,
}: WomenAttentionCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      title: "Association Reviews",
      count: submittedAssociations,
      unit: "awaiting approval",
      badge: submittedAssociations > 0 ? "DOCKET" : "RESOLVED",
      statusType: (submittedAssociations > 0 ? "warning" : "neutral") as keyof typeof uiTokens.statusTag,
      description: "Grassroots associations submitted for legal verification, committee approval and charter certification",
      link: "/women/associations",
      actionText: "Clear pending approvals",
    },
    {
      title: "Economic Placements",
      count: totalEmployments,
      unit: "active placements",
      badge: totalEmployments > 0 ? "ACTIVE" : "INTAKE",
      statusType: "primary" as keyof typeof uiTokens.statusTag,
      description: "Beneficiaries placed in wage-employment and micro-enterprise cooperatives across municipal sectors",
      link: "/women/employment",
      actionText: "Review placement roster",
    },
    {
      title: "Technology Grants",
      count: totalTechSupport,
      unit: "equipped recipients",
      badge: totalTechSupport > 0 ? "EQUIPPED" : "ALLOCATING",
      statusType: "navy" as keyof typeof uiTokens.statusTag,
      description: "Productive technology packages delivered to vulnerable women, disabled women, and female entrepreneurs",
      link: "/women/technology",
      actionText: "Inspect equipment ledger",
    },
    {
      title: "Skills & Vocational",
      count: totalTrainings,
      unit: "enrolled / certified",
      badge: totalTrainings > 0 ? "CAPACITY" : "ENROLLING",
      statusType: "primary" as keyof typeof uiTokens.statusTag,
      description: "Entrepreneurship, life skills, and technical trade programs underway in municipal centers",
      link: "/women/training",
      actionText: "Track training cohorts",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          CASES REQUIRING BUREAU ATTENTION
        </h2>
        <span className="text-[11px] text-slate-400">
          Active oversight threshold — 4 operational programs monitored
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
                "rounded-xs border p-3.5 flex flex-col justify-between min-h-[118px] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden group select-none border-l-3 block",
                isHovered
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-lg -translate-y-1 border-l-[#38BDF8]"
                  : "bg-white text-slate-900 border-[#E3E7EB] hover:border-slate-300 shadow-2xs border-l-[#1769AA]"
              )}
            >
              <div className="space-y-1.5">
                {/* Header title & system-token status tag */}
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "text-xs font-medium truncate transition-colors duration-200",
                      isHovered ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    {card.title}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wide border shrink-0 transition-colors duration-200",
                      isHovered
                        ? "bg-white/10 text-white border-white/20"
                        : uiTokens.statusTag[card.statusType]
                    )}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Counter & Units */}
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "text-2xl font-bold font-mono tracking-tight transition-colors duration-200",
                      isHovered ? "text-white" : "text-[#0B1F3A]"
                    )}
                  >
                    {card.count}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] truncate transition-colors duration-200",
                      isHovered ? "text-slate-300" : "text-slate-500"
                    )}
                  >
                    {card.unit}
                  </span>
                </div>

                {/* Description */}
                <p
                  className={cn(
                    "text-[11px] leading-snug line-clamp-2 transition-colors duration-200",
                    isHovered ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {card.description}
                </p>
              </div>

              {/* Action Button & Subtle Target Link */}
              <div
                className={cn(
                  "mt-3 pt-2 border-t flex items-center justify-between text-[11px] font-semibold transition-colors duration-200",
                  isHovered
                    ? "border-white/15 text-[#38BDF8]"
                    : "border-slate-100 text-[#1769AA]"
                )}
              >
                <span>{card.actionText}</span>
                <ArrowRight
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    isHovered ? "translate-x-1" : "group-hover:translate-x-0.5"
                  )}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
