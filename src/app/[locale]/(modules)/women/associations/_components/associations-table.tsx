"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { WomenAssociationRecord } from "@/api/womens/associations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import RowReportButton from "./row-report-button";
import { uiTokens } from "@/styles/design-system";

const STATUS_TAGS: Record<string, string> = {
  DRAFT: uiTokens.statusTag.neutral,
  SUBMITTED: uiTokens.statusTag.warning,
  APPROVED: uiTokens.statusTag.primary,
  REJECTED: uiTokens.statusTag.danger,
};

interface AssociationsTableProps {
  currentData: WomenAssociationRecord[];
  isLoading: boolean;
  totalItems: number;
  startIndex: number;
  limit: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onDeleteRequest: (id: number) => void;
}

export function AssociationsTable({
  currentData,
  isLoading,
  totalItems,
  startIndex,
  limit,
  page,
  totalPages,
  onPageChange,
  onDeleteRequest,
}: AssociationsTableProps) {
  const t = useTranslations("women.associations");
  const router = useRouter();

  return (
    <Card className="border-[#E3E7EB] bg-white rounded-xs shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-5 border-b border-[#E3E7EB]">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
          <Users className="w-4 h-4 text-[#1769AA]" />
          {t("cardTitle")}
        </CardTitle>
        <span className="text-xs font-mono text-slate-500">
          {t("showing", {
            from: totalItems === 0 ? 0 : startIndex + 1,
            to: Math.min(startIndex + limit, totalItems),
            total: totalItems,
          })}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-[#E3E7EB]">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-700 py-3 pl-5">
                  {t("table.name")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("table.type")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("table.location")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("table.leader")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("table.totalMembers")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 py-3">
                  {t("table.status")}
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-700 text-right py-3 pr-5">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-xs text-slate-500"
                  >
                    {t("table.loading")}
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                currentData.map((rec) => (
                  <TableRow
                    key={rec.id}
                    className="hover:bg-[#F7F8FA] cursor-pointer transition-colors border-b border-[#E3E7EB] last:border-0"
                    onClick={() => router.push(`/women/associations/${rec.id}`)}
                  >
                    <TableCell className="font-semibold text-xs text-[#0B1F3A] py-3 pl-5">
                      {rec.name}
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-medium border border-[#E3E7EB] bg-slate-50 text-slate-700">
                        {t(`types.${rec.type}`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 py-3">
                      {rec.subCity} / {rec.woreda}
                      {rec.block ? `, ${t("table.block")} ${rec.block}` : ""}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 py-3">
                      <span className="font-medium text-slate-800">
                        {rec.leaderName}
                      </span>
                      <p className="font-mono text-[11px] text-slate-500">
                        {rec.leaderPhoneNumber}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-xs py-3">
                      {rec.totalMembers ?? "—"}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold border ${
                          STATUS_TAGS[rec.approvalStatus] ||
                          uiTokens.statusTag.neutral
                        }`}
                      >
                        {t(`status.${rec.approvalStatus}`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3 pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/women/associations/${rec.id}`)
                          }
                          className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/women/associations/${rec.id}?edit=1`)
                          }
                          className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <RowReportButton associationId={rec.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xs cursor-pointer"
                          onClick={() => onDeleteRequest(rec.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-xs text-slate-500"
                  >
                    {t("table.noRecords")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E3E7EB]">
            <p className="text-xs font-mono text-slate-500">
              {t("showing", {
                from: totalItems === 0 ? 0 : startIndex + 1,
                to: Math.min(startIndex + limit, totalItems),
                total: totalItems,
              })}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-mono px-2 text-slate-600">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-7 w-7 rounded-xs border-[#E3E7EB] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
