"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Users, Search, Eye, Accessibility, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface ElderlyDisabledRecentBeneficiariesProps {
  recentList: any[];
}

export function ElderlyDisabledRecentBeneficiaries({
  recentList = [],
}: ElderlyDisabledRecentBeneficiariesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "ELDERLY" | "DISABLED">("ALL");

  const filtered = useMemo(() => {
    return recentList.filter((b) => {
      const fullName = `${b.firstName || ""} ${b.lastName || ""} ${b.grandfatherName || ""}`.toLowerCase();
      const idMatch =
        (b.cityIdNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.faydaId || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = fullName.includes(searchTerm.toLowerCase());
      const matchesSearch = !searchTerm || nameMatch || idMatch;

      const matchesCat =
        categoryFilter === "ALL" || b.clientCategory === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [recentList, searchTerm, categoryFilter]);

  return (
    <div className="rounded-xs border border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-[#E3E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xs bg-[#1769AA]/10 text-[#1769AA]">
            <Users className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wide font-mono">
              Recent Registered Beneficiaries &amp; Intakes
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Latest municipal intake registrations across elderly support and disability inclusion programs
            </p>
          </div>
        </div>

        <Link
          href="/social-affairs/elderly-and-disabled/beneficiaries"
          className="text-xs font-mono font-semibold text-[#1769AA] hover:text-[#12568E] flex items-center gap-1 transition-colors self-start sm:self-center"
        >
          <span>View All Beneficiaries</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-[#E3E7EB] flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by name or ID number..."
            className="h-8 pl-8 text-xs bg-white border-[#E3E7EB] rounded-xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={categoryFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("ALL")}
            className={`h-7 px-2.5 text-[11px] rounded-xs ${
              categoryFilter === "ALL"
                ? "bg-[#0B1F3A] hover:bg-[#122D52] text-white"
                : "bg-white text-slate-600 border-[#E3E7EB]"
            }`}
          >
            All ({recentList.length})
          </Button>
          <Button
            variant={categoryFilter === "DISABLED" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("DISABLED")}
            className={`h-7 px-2.5 text-[11px] rounded-xs ${
              categoryFilter === "DISABLED"
                ? "bg-[#1769AA] hover:bg-[#12568E] text-white"
                : "bg-white text-slate-600 border-[#E3E7EB]"
            }`}
          >
            Persons with Disability
          </Button>
          <Button
            variant={categoryFilter === "ELDERLY" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("ELDERLY")}
            className={`h-7 px-2.5 text-[11px] rounded-xs ${
              categoryFilter === "ELDERLY"
                ? "bg-purple-700 hover:bg-purple-800 text-white"
                : "bg-white text-slate-600 border-[#E3E7EB]"
            }`}
          >
            Vulnerable Elderly
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500">
            <Users className="size-8 mx-auto text-slate-300 mb-2" />
            <p>No beneficiaries match the current filter</p>
          </div>
        ) : (
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-2.5">Beneficiary Name</th>
                <th className="px-4 py-2.5">ID Number</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Sub-City / Woreda</th>
                <th className="px-4 py-2.5">Special Needs / Impairment</th>
                <th className="px-4 py-2.5">Registered Date</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7EB]">
              {filtered.map((b) => {
                const fullName =
                  `${b.firstName || ""} ${b.lastName || ""}`.trim() ||
                  "Beneficiary";
                const isElderly = b.clientCategory === "ELDERLY";
                const disabilityInfo =
                  b.DisabilityProfile?.disabilityType ||
                  b.DisabilityProfile?.disabilitySeverity;

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-2.5 font-semibold text-slate-900">
                      <Link
                        href={`/social-affairs/elderly-and-disabled/beneficiaries/${b.id}`}
                        className="hover:text-[#1769AA] hover:underline flex items-center gap-1.5"
                      >
                        {isElderly ? (
                          <UserCheck className="size-3.5 text-purple-600 shrink-0" />
                        ) : (
                          <Accessibility className="size-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>{fullName}</span>
                      </Link>
                    </td>

                    {/* ID */}
                    <td className="px-4 py-2.5 text-slate-600">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded-xs border border-[#E3E7EB] text-[11px]">
                        {b.cityIdNumber || b.faydaId || `BEN-${b.id}`}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-2.5">
                      {isElderly ? (
                        <Badge
                          variant="outline"
                          className="rounded-xs text-[10px] font-bold tracking-wider uppercase border bg-purple-50 text-purple-700 border-purple-200"
                        >
                          Elderly
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="rounded-xs text-[10px] font-bold tracking-wider uppercase border bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Disability
                        </Badge>
                      )}
                    </td>

                    {/* Sub-City / Woreda */}
                    <td className="px-4 py-2.5 text-slate-600">
                      {b.subCity ? (
                        <span>
                          {b.subCity}
                          {b.woreda ? `, W. ${b.woreda}` : ""}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Special Needs / Impairment */}
                    <td className="px-4 py-2.5 text-slate-600">
                      {isElderly ? (
                        <span>
                          {b.age ? `Age ${b.age} • ` : ""}
                          {b.ElderlyProfile?.requiredSupportType ||
                            "Geriatric Support"}
                        </span>
                      ) : (
                        <span>
                          {disabilityInfo || "Physical / Mobility Support"}
                        </span>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="px-4 py-2.5 text-slate-600">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/social-affairs/elderly-and-disabled/beneficiaries/${b.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[11px] font-mono border-[#E3E7EB] text-slate-700 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                        >
                          <Eye className="size-3 mr-1" />
                          Dossier
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
