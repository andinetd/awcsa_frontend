"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { uiTokens } from "@/styles/design-system";

interface OperationalAlertBannerProps {
  overdueReportsCount: number;
  pendingReportsCount: number;
  openComplaintsCount: number;
  pendingAdoptionReviewsCount: number;
  onNavigateToTab?: (tabKey: string) => void;
}

export function OperationalAlertBanner({
  overdueReportsCount,
  pendingReportsCount,
  openComplaintsCount,
  pendingAdoptionReviewsCount,
  onNavigateToTab,
}: OperationalAlertBannerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      title: "Facility compliance",
      count: overdueReportsCount,
      unit: "overdue submissions",
      badge: overdueReportsCount > 0 ? "OVERDUE" : "COMPLIANT",
      statusType: (overdueReportsCount > 0 ? "navy" : "neutral") as keyof typeof uiTokens.statusTag,
      description:
        overdueReportsCount > 0
          ? "Accredited care centers past monthly deadline."
          : "All care centers current on monthly submissions.",
      actionText: "Review facility submissions",
      tabKey: "reports",
    },
    {
      title: "Monthly reports review",
      count: pendingReportsCount,
      unit: "awaiting clearance",
      badge: pendingReportsCount > 0 ? "CLEARANCE" : "RESOLVED",
      statusType: (pendingReportsCount > 0 ? "primary" : "neutral") as keyof typeof uiTokens.statusTag,
      description: "Submitted facility dossiers awaiting bureau verification.",
      actionText: "Process pending approvals",
      tabKey: "reports",
    },
    {
      title: "Citizen grievances",
      count: openComplaintsCount,
      unit: "unresolved inquiries",
      badge: openComplaintsCount > 0 ? "ATTENTION" : "RESOLVED",
      statusType: (openComplaintsCount > 0 ? "primary" : "neutral") as keyof typeof uiTokens.statusTag,
      description: "Citizen service delivery appeals and neglect reports.",
      actionText: "Inspect complaint registry",
      tabKey: "complaints",
    },
    {
      title: "Adoption assessment",
      count: pendingAdoptionReviewsCount,
      unit: "home visits pending",
      badge: pendingAdoptionReviewsCount > 0 ? "VETTING" : "CURRENT",
      statusType: (pendingAdoptionReviewsCount > 0 ? "primary" : "neutral") as keyof typeof uiTokens.statusTag,
      description: "Applicant screening dossiers awaiting social worker verification.",
      actionText: "View child welfare funnel",
      tabKey: "directorates",
    },
  ];

  return (
    <section aria-label="Operational Attention Queue" className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          CASES REQUIRING BUREAU ATTENTION
        </h2>
        <span className="text-[11px] text-slate-400">
          Active oversight threshold — 4 items monitored
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={card.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onNavigateToTab?.(card.tabKey)}
              className={cn(
                "rounded-sm border p-3.5 flex flex-col justify-between min-h-[118px] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden group select-none border-l-3",
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
                      isHovered ? "text-slate-200 font-semibold" : "text-slate-600"
                    )}
                  >
                    {card.title}
                  </span>

                  <span
                    className={cn(
                      uiTokens.statusTag.base,
                      isHovered
                        ? uiTokens.statusTag.activeHover
                        : uiTokens.statusTag[card.statusType]
                    )}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Big Metric + Unit */}
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "text-2xl font-bold font-mono tracking-tight transition-all duration-200",
                      isHovered ? "text-white scale-105 origin-left" : "text-slate-900"
                    )}
                  >
                    {card.count}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors duration-200",
                      isHovered ? "text-slate-200" : "text-slate-700"
                    )}
                  >
                    {card.unit}
                  </span>
                </div>

                {/* Description */}
                <p
                  className={cn(
                    "text-[11px] line-clamp-2 leading-relaxed transition-colors duration-200",
                    isHovered ? "text-slate-300" : "text-slate-500"
                  )}
                >
                  {card.description}
                </p>
              </div>

              {/* Action Link with Sliding Arrow */}
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToTab?.(card.tabKey);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-medium transition-colors duration-200 cursor-pointer",
                    isHovered
                      ? "text-[#38BDF8] hover:text-white"
                      : "text-[#1769AA] hover:text-[#12568E]"
                  )}
                >
                  <span>{card.actionText}</span>
                  <ArrowRight
                    className={cn(
                      "size-3 transition-transform duration-200",
                      isHovered ? "translate-x-1 text-[#38BDF8]" : "text-slate-400"
                    )}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
