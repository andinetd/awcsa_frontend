"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ElderlyDisabledAttentionCardsProps {
  pendingEligibility?: number;
  pendingConfirmation?: number;
  requestedServices?: number;
  totalTrainings?: number;
}

export function ElderlyDisabledAttentionCards({
  pendingEligibility = 0,
  pendingConfirmation = 0,
  requestedServices = 0,
  totalTrainings = 0,
}: ElderlyDisabledAttentionCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [
    {
      title: "Eligibility Vetting",
      count: pendingEligibility,
      unit: "cases pending",
      badge: pendingEligibility > 0 ? "VETTING" : "RESOLVED",
      badgeClass:
        pendingEligibility > 0
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-100 text-slate-600 border-slate-200",
      description:
        "Registered citizens awaiting medical verification, disability degree grading, and municipal vulnerability confirmation",
      link: "/social-affairs/elderly-and-disabled/beneficiaries",
      actionText: "Review pending dossiers",
      accentBorder: "border-l-amber-500",
    },
    {
      title: "Service Confirmation",
      count: pendingConfirmation,
      unit: "awaiting confirmation",
      badge: pendingConfirmation > 0 ? "CONFIRMATION" : "CLEAR",
      badgeClass:
        pendingConfirmation > 0
          ? "bg-orange-50 text-orange-700 border-orange-200"
          : "bg-slate-100 text-slate-600 border-slate-200",
      description:
        "Delivered support services and assistive devices pending beneficiary receipt sign-off and caseworker verification",
      link: "/social-affairs/elderly-and-disabled/services?tab=services",
      actionText: "Confirm delivery records",
      accentBorder: "border-l-orange-500",
    },
    {
      title: "New Service Requests",
      count: requestedServices,
      unit: "intake requests",
      badge: requestedServices > 0 ? "INTAKE QUEUE" : "NORMAL",
      badgeClass:
        requestedServices > 0
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-slate-100 text-slate-600 border-slate-200",
      description:
        "Direct requests for physical assistance, wheelchairs, prosthetics, emergency rations, and home care services",
      link: "/social-affairs/elderly-and-disabled/services?tab=services",
      actionText: "Process intake requests",
      accentBorder: "border-l-rose-500",
    },
    {
      title: "Vocational Skills Cohorts",
      count: totalTrainings,
      unit: "enrolled trainees",
      badge: totalTrainings > 0 ? "ACTIVE COHORTS" : "OPEN",
      badgeClass: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
      description:
        "Beneficiaries receiving specialized technical, artisanal, and small-business training tailored for accessibility",
      link: "/social-affairs/elderly-and-disabled/services?tab=training",
      actionText: "Track skills roster",
      accentBorder: "border-l-[#1769AA]",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          CASES REQUIRING BUREAU ATTENTION
        </h2>
        <span className="text-[11px] text-slate-400 font-mono">
          Priority triage docket — 4 critical social protection streams
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
