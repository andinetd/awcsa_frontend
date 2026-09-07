"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useGenerateAssociationReportMutation } from "@/hooks/womens";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AssociationReportMenuProps {
  associationId: number;
}

export default function AssociationReportMenu({
  associationId,
}: AssociationReportMenuProps) {
  const t = useTranslations("women.associations.report");
  const mutation = useGenerateAssociationReportMutation();

  const handleSelect = (format: "EXCEL" | "PDF") => {
    mutation.mutate(
      { associationId, format },
      {
        onSuccess: () => {
          toast.success(t(`messages.${format.toLowerCase()}` as any));
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              t("messages.error")
          );
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {t("button")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("menuLabel")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleSelect("PDF");
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          {t("pdf")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleSelect("EXCEL");
          }}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {t("excel")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
