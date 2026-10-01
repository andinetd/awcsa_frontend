"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";

const statusStyles: Record<EdirStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
};

interface EdirRecentRegistrationsProps {
  recentList: Edir[];
}

export function EdirRecentRegistrations({ recentList }: EdirRecentRegistrationsProps) {
  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-[#E3E7EB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-[#1769AA]" />
          <div>
            <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
              Recent Edir Associations &amp; Accreditations
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Latest municipal registrations, legal license renewals, and status updates
            </p>
          </div>
        </div>
        <Link
          href="/social-affairs/edir/list"
          className="text-xs font-mono font-semibold text-[#1769AA] hover:text-[#12568E] flex items-center gap-1 transition-colors"
        >
          <span>View All Edirs</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        {recentList.length === 0 ? (
          <p className="text-slate-500 text-xs font-mono py-10 text-center">
            No recent Edir records found
          </p>
        ) : (
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-2.5">Association Name</th>
                <th className="px-4 py-2.5">Registration &amp; Number</th>
                <th className="px-4 py-2.5">Sub-City / Woreda</th>
                <th className="px-4 py-2.5">Establishment Year</th>
                <th className="px-4 py-2.5 text-center">Accreditation Status</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7EB]">
              {recentList.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-slate-900">
                    <Link
                      href={`/social-affairs/edir/${e.id}`}
                      className="hover:text-[#1769AA] hover:underline"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {e.registrationNumber ? (
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded-xs border border-[#E3E7EB] text-[11px]">
                        {e.registrationNumber}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {e.subCity}, Woreda {e.woreda}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {e.establishmentDate
                      ? new Date(e.establishmentDate).getFullYear()
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {e.status && (
                      <Badge
                        variant="outline"
                        className={`rounded-xs text-[10px] font-bold tracking-wider uppercase border ${
                          statusStyles[e.status] ||
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {e.status}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      href={`/social-affairs/edir/${e.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1769AA] hover:text-[#12568E] hover:underline"
                    >
                      <span>Dossier</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
