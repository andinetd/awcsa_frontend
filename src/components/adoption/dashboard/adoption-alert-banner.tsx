"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { uiTokens } from "@/styles/design-system";

interface AdoptionAlertBannerProps {
  pendingHomeVisits?: number;
  pendingReports?: number;
  pendingApprovals?: number;
  inCareCount?: number;
}

export function AdoptionAlertBanner({
  pendingHomeVisits = 0,
  pendingReports = 0,
  pendingApprovals = 0,
  inCareCount = 0,
}: AdoptionAlertBannerProps) {
  const t = useTranslations("adoption");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      title: t("dashboard.alerts.homeInspections.title"),
      count: pendingHomeVisits,
      unit: t("dashboard.alerts.homeInspections.unit"),
      badge: pendingHomeVisits > 0 
        ? t("dashboard.alerts.homeInspections.scheduledBadge") 
        : t("dashboard.alerts.homeInspections.completedBadge"),
      statusType: (pendingHomeVisits > 0 ? "primary" : "neutral") as keyof typeof uiTokens.statusTag,
      description: t("dashboard.alerts.homeInspections.description"),
      link: "/adoption/adoption-requests?tab=pending_home_visit",
      actionText: t("dashboard.alerts.homeInspections.actionText"),
    },
    {
      title: t("dashboard.alerts.facilityCompliance.title"),
      count: pendingReports,
      unit: t("dashboard.alerts.facilityCompliance.unit"),
      badge: pendingReports === 0 
        ? t("dashboard.alerts.facilityCompliance.compliantBadge") 
        : t("dashboard.alerts.facilityCompliance.overdueBadge"),
      statusType: (pendingReports === 0 ? "neutral" : "navy") as keyof typeof uiTokens.statusTag,
      description:
        pendingReports === 0
          ? t("dashboard.alerts.facilityCompliance.descriptionCompliant")
          : t("dashboard.alerts.facilityCompliance.descriptionOverdue", { count: pendingReports }),
      link: "/adoption/care-centers",
      actionText: t("dashboard.alerts.facilityCompliance.actionText"),
    },
    {
      title: t("dashboard.alerts.committeeClearance.title"),
      count: pendingApprovals,
      unit: t("dashboard.alerts.committeeClearance.unit"),
      badge: pendingApprovals > 0 
        ? t("dashboard.alerts.committeeClearance.docketBadge") 
        : t("dashboard.alerts.committeeClearance.resolvedBadge"),
      statusType: (pendingApprovals > 0 ? "primary" : "neutral") as keyof typeof uiTokens.statusTag,
      description: t("dashboard.alerts.committeeClearance.description"),
      link: "/adoption/adoption-requests?tab=pending_approval",
      actionText: t("dashboard.alerts.committeeClearance.actionText"),
    },
    {
      title: t("dashboard.alerts.placementPipeline.title"),
      count: inCareCount,
      unit: t("dashboard.alerts.placementPipeline.unit"),
      badge: inCareCount > 0 
        ? t("dashboard.alerts.placementPipeline.inCareBadge") 
        : t("dashboard.alerts.placementPipeline.placedBadge"),
      statusType: (inCareCount > 0 ? "primary" : "neutral") as keyof typeof uiTokens.statusTag,
      description: t("dashboard.alerts.placementPipeline.description"),
      link: "/adoption/children",
      actionText: t("dashboard.alerts.placementPipeline.actionText"),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          {t("dashboard.alerts.sectionTitle")}
        </h2>
        <span className="text-[11px] text-slate-400">
          {t("dashboard.alerts.sectionSubtitle")}
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
                "rounded-sm border p-3.5 flex flex-col justify-between min-h-[118px] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden group select-none border-l-3 block",
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
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-medium transition-colors duration-200",
                    isHovered
                      ? "text-[#38BDF8] group-hover:text-white"
                      : "text-[#1769AA] group-hover:text-[#12568E]"
                  )}
                >
                  <span>{card.actionText}</span>
                  <ArrowRight
                    className={cn(
                      "size-3 transition-transform duration-200",
                      isHovered ? "translate-x-1 text-[#38BDF8]" : "text-slate-400"
                    )}
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
