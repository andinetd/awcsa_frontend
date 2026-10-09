"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";

interface AdoptionPipelineFunnelProps {
  pipelineData?: Array<{
    stage: number;
    title: string;
    description: string;
    count: number;
    unit: string;
    percentage: number;
    color: string;
    tabKey?: string;
  }>;
  facilities?: Array<{
    id: number;
    name: string;
    type: string;
    capacity: number;
    occupancy: number;
    status: string;
  }>;
}

export function AdoptionPipelineFunnel({
  pipelineData = [],
  facilities = [],
}: AdoptionPipelineFunnelProps) {
  const t = useTranslations("adoption");
  const totalApplicants = pipelineData[0]?.count ?? 0;
  const totalCapacity = facilities.reduce((acc, f) => acc + (f.capacity || 0), 0);
  const totalOccupancy = facilities.reduce((acc, f) => acc + (f.occupancy || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 1. Adoption Screening Pipeline (7 Columns) */}
      <div className="lg:col-span-7 rounded-sm border border-[#E3E7EB] bg-white p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t("dashboard.pipeline.title")}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t("dashboard.pipeline.subtitle", { count: totalApplicants })}
              </p>
            </div>
            <Link
              href="/adoption/adoption-requests"
              className="text-xs font-medium text-[#1769AA] hover:underline flex items-center gap-1"
            >
              {t("dashboard.pipeline.viewAll")}
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {pipelineData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {t("dashboard.pipeline.empty")}
            </div>
          ) : (
            <div className="space-y-3.5 mt-3">
              {pipelineData.map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex size-4 items-center justify-center rounded-full bg-[#0B1F3A] text-[9.5px] font-bold text-white">
                        {item.stage}
                      </span>
                      <span className="font-semibold text-slate-800">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">
                        {item.count} <span className="text-[11px] font-normal text-slate-500 font-sans">{item.unit}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                    <span className="truncate">{item.description}</span>
                    {item.tabKey && (
                      <Link
                        href={`/adoption/adoption-requests?tab=${item.tabKey}`}
                        className="text-[#1769AA] hover:underline shrink-0 ml-2"
                      >
                        Inspect stage →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <ShieldCheck className="size-3.5 text-[#15803D]" />
            Strict adherence to Ethiopian Federal Family Code &amp; Hague Standards
          </span>
          <span className="font-mono font-semibold text-[#1769AA]">100% Audited</span>
        </div>
      </div>

      {/* 2. Care Facilities Capacity Matrix (5 Columns) */}
      <div className="lg:col-span-5 rounded-sm border border-[#E3E7EB] bg-white p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t("dashboard.pipeline.facilities.title")}
              </h3>
              <p className="text-[11px] text-slate-500">
                {t("dashboard.pipeline.facilities.subtitle", { count: facilities.length })}
              </p>
            </div>
            <Link
              href="/adoption/care-centers"
              className="text-xs font-medium text-[#1769AA] hover:underline flex items-center gap-1"
            >
              Directory
              <ChevronRight className="size-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {facilities.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No care facilities registered yet.
              </div>
            ) : (
              facilities.map((facility) => {
                const occPercent = facility.capacity > 0 
                  ? Math.round((facility.occupancy / facility.capacity) * 100)
                  : 0;

                return (
                  <div key={facility.id} className="py-2.5 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {facility.name}
                        </div>
                        <div className="text-[10.5px] text-slate-500">
                          {facility.type}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {facility.occupancy} / {facility.capacity}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {occPercent}% full
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occPercent > 80
                            ? "bg-rose-600"
                            : occPercent > 50
                            ? "bg-amber-500"
                            : "bg-[#1769AA]"
                        }`}
                        style={{ width: `${Math.max(occPercent, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Total Municipal Bed Capacity:</span>
          <span className="font-mono font-bold text-slate-900">
            {totalCapacity} beds ({totalOccupancy} occupied)
          </span>
        </div>
      </div>
    </div>
  );
}
