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
  const t = useTranslations("womens");

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
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("support.history.table.serviceType")}</TableHead>
            <TableHead>{t("support.history.table.provider")}</TableHead>
            <TableHead>{t("support.history.table.amount")}</TableHead>
            <TableHead>{t("support.history.table.date")}</TableHead>
            <TableHead>{t("support.history.table.location")}</TableHead>
            <TableHead className="text-right">
              {t("support.history.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                {service.serviceType?.name
                  ? t(`serviceTypes.${service.serviceType.name}`)
                  : "N/A"}
              </TableCell>
              <TableCell>{service.provider}</TableCell>
              <TableCell>{service.amountOrQuantity}</TableCell>
              <TableCell>
                {service.dateProvided
                  ? format(new Date(service.dateProvided), "PPP")
                  : "N/A"}
              </TableCell>
              <TableCell>
                {service.subCity}, {service.woreda}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      router.push(`/womens/support-service/${service.id}`)
                    }
                    title={t("womenList.card.viewDetails")}
                  >
                    <Eye className="w-4 h-4" />
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
