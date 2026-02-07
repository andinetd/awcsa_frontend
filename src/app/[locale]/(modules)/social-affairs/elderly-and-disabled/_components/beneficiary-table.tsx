"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BeneficiaryTableProps {
  data: any[];
  isLoading: boolean;
  type: "DISABLED" | "ELDERLY";
}

export default function BeneficiaryTable({
  data,
  isLoading,
  type,
}: BeneficiaryTableProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.beneficiaries");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-xl bg-slate-50/50">
        <div className="animate-pulse text-slate-400 font-medium">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-xl bg-slate-50/50 space-y-2">
        <p className="text-slate-500 font-medium">{t("noRecords")}</p>
        <p className="text-sm text-slate-400">{t("noRecordsSubtitle")}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold">
              {t("table.fullName")}
            </TableHead>
            <TableHead className="font-semibold">{t("table.cityId")}</TableHead>
            <TableHead className="font-semibold">{t("table.phone")}</TableHead>
            <TableHead className="font-semibold">
              {type === "DISABLED"
                ? t("table.disabilityType")
                : t("table.livingCondition")}
            </TableHead>
            <TableHead className="font-semibold">{t("table.status")}</TableHead>
            <TableHead className="text-right font-semibold">
              {t("table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-medium">
                {item.firstName} {item.lastName}
              </TableCell>
              <TableCell>{item.cityIdNumber}</TableCell>
              <TableCell>{item.phoneNumber}</TableCell>
              <TableCell>
                {type === "DISABLED"
                  ? item.DisabilityProfile?.disabilityType || t("table.na")
                  : "Elderly"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.activeStatus ? "outline" : "secondary"}
                  className={cn(
                    "rounded-full",
                    item.activeStatus &&
                      "bg-green-50 text-green-700 border-green-200",
                  )}
                >
                  {item.activeStatus ? t("table.active") : t("table.inactive")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/social-affairs/elderly-and-disabled/beneficiaries/profile/${item.id}`}
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
