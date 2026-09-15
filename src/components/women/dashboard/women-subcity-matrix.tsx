"use client";

import React from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Users, ListChecks, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubCityRow {
  subCity: string;
  total: number;
  approved: number;
  members: number;
}

interface WomenSubCityMatrixProps {
  rows?: SubCityRow[];
  loading?: boolean;
  declaredMembers?: number;
  totalMembers?: number;
  totalGroups?: number;
  approvedCount?: number;
  incompleteCount?: number;
}

export function WomenSubCityMatrix({
  rows = [],
  loading = false,
  declaredMembers = 0,
  totalMembers = 0,
  totalGroups = 0,
  approvedCount = 0,
  incompleteCount = 0,
}: WomenSubCityMatrixProps) {
  const router = useRouter();

  const handleRowClick = (subCity: string) => {
    router.push(`/women/associations?subCity=${encodeURIComponent(subCity)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* SubCity Table (8 cols) */}
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs lg:col-span-8">
        <CardHeader className="py-3 px-4 border-b border-[#E3E7EB] flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <Users className="w-4 h-4 text-[#1769AA]" />
            Sub-City Association Distribution &amp; Coverage
          </CardTitle>
          <span className="text-[11px] text-slate-400 font-mono">
            Click row to filter associations
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
                <TableRow>
                  <TableHead className="font-semibold text-xs text-slate-700 py-2.5 pl-4">Sub-City</TableHead>
                  <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5">Total Associations</TableHead>
                  <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5">Approved</TableHead>
                  <TableHead className="font-semibold text-xs text-slate-700 text-right py-2.5 pr-4">Active Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500 text-xs">
                      Loading sub-city data...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400 text-xs">
                      No sub-city association data available
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.subCity}
                      className="hover:bg-[#F7F8FA] cursor-pointer transition-colors border-b border-[#E3E7EB] last:border-0"
                      onClick={() => handleRowClick(row.subCity)}
                    >
                      <TableCell className="font-medium text-xs text-[#0B1F3A] py-2.5 pl-4">{row.subCity}</TableCell>
                      <TableCell className="text-right text-xs font-mono py-2.5">{row.total}</TableCell>
                      <TableCell className="text-right text-xs font-mono text-[#1769AA] font-semibold py-2.5">{row.approved}</TableCell>
                      <TableCell className="text-right text-xs font-mono py-2.5 pr-4">{row.members}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Totals & Roster Summary (4 cols) */}
      <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs lg:col-span-4 flex flex-col justify-between">
        <CardHeader className="py-3 px-4 border-b border-[#E3E7EB]">
          <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            <ListChecks className="w-4 h-4 text-[#1769AA]" />
            Federation Capacity Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <dl className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">Declared Capacity Target</dt>
              <dd className="text-sm font-bold font-mono text-[#0B1F3A]">{declaredMembers}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">Verified Active Members</dt>
              <dd className="text-sm font-bold font-mono text-[#1769AA]">{totalMembers}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">Organized Self-Help Groups</dt>
              <dd className="text-sm font-bold font-mono text-[#0B1F3A]">{totalGroups}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">Approved Associations</dt>
              <dd className="text-sm font-bold font-mono text-emerald-700">{approvedCount}</dd>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <dt className="text-slate-600 font-medium">Pending / Incomplete</dt>
              <dd className="text-sm font-bold font-mono text-amber-600">{incompleteCount}</dd>
            </div>
          </dl>

          <div className="pt-2">
            <Link
              href="/women/associations"
              className="text-xs text-[#1769AA] font-semibold hover:underline inline-flex items-center gap-1 group"
            >
              <span>View all associations roster</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
