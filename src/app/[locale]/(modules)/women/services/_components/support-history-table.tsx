"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { SupportService } from "@/api/support/support-service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface SupportHistoryTableProps {
  data: SupportService[];
}

export default function SupportHistoryTable({
  data,
}: SupportHistoryTableProps) {
  const router = useRouter();
  const t = useTranslations("women");

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          {t("support.history.table.noHistory")}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#E3E7EB] rounded-xs bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
          <TableRow>
            <TableHead className="text-xs font-semibold text-slate-700 py-2.5 pl-4">
              {t("support.history.table.beneficiary") || "Beneficiary"}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-700 py-2.5">
              {t("support.history.table.serviceType")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-700 py-2.5">
              {t("support.history.table.provider")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-700 py-2.5">
              {t("support.history.table.amount")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-700 py-2.5">
              {t("support.history.table.date")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-slate-700 py-2.5">
              {t("support.history.table.location")}
            </TableHead>
            <TableHead className="text-right text-xs font-semibold text-slate-700 py-2.5 pr-4">
              {t("support.history.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((service) => {
            const clientName = service.client
              ? `${service.client.firstName || ""} ${service.client.lastName || ""}`.trim()
              : service.womenAssociation?.name || "—";
            const clientIdStr = service.client?.faydaId || service.client?.cityIdNumber || (service.client?.id ? `#${service.client.id}` : "");

            return (
              <TableRow key={service.id} className="hover:bg-slate-50/70 border-b border-[#E3E7EB] last:border-0 transition-colors">
                <TableCell className="py-2.5 pl-4">
                  <div className="font-semibold text-xs text-[#0B1F3A]">{clientName}</div>
                  {clientIdStr && (
                    <span className="font-mono text-[11px] text-slate-500">{clientIdStr}</span>
                  )}
                  {service.womenAssociation && !service.client && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-xs bg-[#E8F2FA] text-[#1769AA] font-semibold border border-[#BCD5EA]">
                      Association
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-800 py-2.5">
                  {service.serviceType?.name
                    ? t.has(`serviceTypes.${service.serviceType.name}`)
                      ? t(`serviceTypes.${service.serviceType.name}`)
                      : service.serviceType.name
                    : "N/A"}
                </TableCell>
                <TableCell className="text-xs text-slate-600 py-2.5">{service.provider}</TableCell>
                <TableCell className="text-xs font-mono font-medium text-slate-700 py-2.5">{service.amountOrQuantity}</TableCell>
                <TableCell className="text-xs font-mono text-slate-600 py-2.5">
                  {service.dateProvided
                    ? format(new Date(service.dateProvided), "PPP")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-xs text-slate-600 py-2.5">
                  {service.subCity ? `${service.subCity}${service.woreda ? `, ${service.woreda}` : ""}` : "—"}
                </TableCell>
                <TableCell className="text-right py-2.5 pr-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-xs text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] cursor-pointer"
                      onClick={() =>
                        router.push(`/women/services/${service.id}`)
                      }
                      title={t("womenList.card.viewDetails")}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}