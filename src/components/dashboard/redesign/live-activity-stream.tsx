"use client";

import React, { useState } from "react";
import { RecentActivity } from "@/api/dashboard/executive";
import {
  Activity,
  Baby,
  Building,
  Clock,
  Filter,
  HandHeart,
  Users,
} from "lucide-react";

interface LiveActivityStreamProps {
  activities?: RecentActivity[];
}

export function LiveActivityStream({ activities = [] }: LiveActivityStreamProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const defaultActivities = [
    {
      id: "act-1",
      time: "22:27 · 12 Sep",
      code: "SR-02",
      directorate: "Social rehab",
      event: "New client registered",
      details: "Genet Kassahun",
      type: "CLIENT_REGISTRATION",
      status: "Logged",
    },
    {
      id: "act-2",
      time: "22:27 · 12 Sep",
      code: "SR-02",
      directorate: "Social rehab",
      event: "New client registered",
      details: "Yonas Solomon",
      type: "CLIENT_REGISTRATION",
      status: "Logged",
    },
    {
      id: "act-3",
      time: "22:27 · 12 Sep",
      code: "SR-02",
      directorate: "Social rehab",
      event: "New client registered",
      details: "Selamawit Fekadu",
      type: "CLIENT_REGISTRATION",
      status: "Logged",
    },
    {
      id: "act-4",
      time: "15:02 · 02 Sep",
      code: "CW-01",
      directorate: "Child welfare",
      event: "Case status updated",
      details: "In care — found: Gullele, applicant: Liyu Tadesse",
      type: "CHILD_REGISTRATION",
      status: "Logged",
    },
  ];

  const filtered = defaultActivities.filter((a) => {
    if (filterType === "ALL") return true;
    if (filterType === "CHILDREN") return a.type === "CHILD_REGISTRATION";
    if (filterType === "BENEFICIARIES") return a.type === "CLIENT_REGISTRATION";
    if (filterType === "FACILITIES") return a.type === "FACILITY_REGISTRATION";
    return true;
  });

  return (
    <div className="rounded-sm border border-[#E3E7EB] bg-white shadow-none overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800">
            Recent municipal activity
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time feed of intake registrations, facility filings, and assistance actions
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              filterType === "ALL"
                ? "bg-[#0B1F3A] text-white font-bold"
                : "border border-[#E3E7EB] bg-white text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("CHILDREN")}
            className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              filterType === "CHILDREN"
                ? "bg-[#0B1F3A] text-white font-bold"
                : "border border-[#E3E7EB] bg-white text-slate-600 hover:text-slate-900"
            }`}
          >
            Children
          </button>
          <button
            onClick={() => setFilterType("BENEFICIARIES")}
            className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              filterType === "BENEFICIARIES"
                ? "bg-[#0B1F3A] text-white font-bold"
                : "border border-[#E3E7EB] bg-white text-slate-600 hover:text-slate-900"
            }`}
          >
            Beneficiaries
          </button>
          <button
            onClick={() => setFilterType("FACILITIES")}
            className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
              filterType === "FACILITIES"
                ? "bg-[#0B1F3A] text-white font-bold"
                : "border border-[#E3E7EB] bg-white text-slate-600 hover:text-slate-900"
            }`}
          >
            Facilities
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-white font-semibold text-[10px] uppercase text-slate-400">
            <tr>
              <th className="px-4 py-2 font-normal">TIME</th>
              <th className="px-4 py-2 font-normal">DIRECTORATE</th>
              <th className="px-4 py-2 font-normal">EVENT</th>
              <th className="px-4 py-2 font-normal">DETAILS</th>
              <th className="px-4 py-2 font-normal text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-600 text-[11px]">
                  {item.time}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-1.5 py-0.5 border border-slate-200 bg-slate-50 text-[10px] font-mono text-slate-600 rounded-xs mr-1.5">
                    {item.code}
                  </span>
                  <span className="text-slate-700 text-xs">{item.directorate}</span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-slate-700 text-xs">
                  {item.event}
                </td>

                <td className="px-4 py-3 text-slate-800 text-xs font-medium">
                  {item.details}
                </td>

                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span className="font-bold text-[#1769AA] text-xs">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
