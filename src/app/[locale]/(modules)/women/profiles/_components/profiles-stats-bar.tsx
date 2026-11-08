"use client";

import React from "react";
import { useTranslations } from "next-intl";

export type PresetTab =
  | "ALL"
  | "UNEMPLOYED"
  | "EMPLOYED"
  | "PENDING"
  | "ACTIVE"
  | "SUPPORTED"
  | "TRAINED";

export interface TabCounts {
  all: number;
  supported: number;
  trained: number;
  unemployed: number;
  employed: number;
  pending: number;
  active: number;
}

interface ProfilesStatsBarProps {
  presetTab: PresetTab;
  onTabChange: (tab: PresetTab) => void;
  tabCounts: TabCounts;
}

export function ProfilesStatsBar({
  presetTab,
  onTabChange,
  tabCounts,
}: ProfilesStatsBarProps) {
  const t = useTranslations("women");

  const tabs = [
    { id: "ALL" as const, label: t("womenList.tabs.all"), count: tabCounts.all },
    {
      id: "SUPPORTED" as const,
      label: t("womenList.tabs.supported"),
      count: tabCounts.supported,
      color: "text-teal-700 bg-teal-50",
    },
    {
      id: "TRAINED" as const,
      label: t("womenList.tabs.trained"),
      count: tabCounts.trained,
      color: "text-purple-700 bg-purple-50",
    },
    {
      id: "UNEMPLOYED" as const,
      label: t("womenList.tabs.unemployed"),
      count: tabCounts.unemployed,
      color: "text-amber-700 bg-amber-50",
    },
    {
      id: "EMPLOYED" as const,
      label: t("womenList.tabs.employed"),
      count: tabCounts.employed,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      id: "PENDING" as const,
      label: t("womenList.tabs.pending"),
      count: tabCounts.pending,
      color: "text-indigo-700 bg-indigo-50",
    },
    {
      id: "ACTIVE" as const,
      label: t("womenList.tabs.active"),
      count: tabCounts.active,
      color: "text-blue-700 bg-blue-50",
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E3E7EB]">
      {tabs.map((tab) => {
        const isActive = presetTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-[#0B1F3A] text-white shadow-2xs font-bold"
                : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-[#E3E7EB]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                isActive
                  ? "bg-white/20 text-white"
                  : tab.color || "bg-slate-200 text-slate-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
