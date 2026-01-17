"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ClipboardList } from "lucide-react";
import { SupportService } from "@/api/support/support-service";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import MonitoringForm from "./monitoring-form";

interface SupportHistoryTableProps {
  data: SupportService[];
}

export default function SupportHistoryTable({
  data,
}: SupportHistoryTableProps) {
  const router = useRouter();
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No support history found.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Amount/Quantity</TableHead>
            <TableHead>Date Provided</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">
                {service.serviceType?.name || "N/A"}
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
                  {/* <MonitoringForm supportServiceId={service.id} /> */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      router.push(`/womens/support-service/${service.id}`)
                    }
                    title="View Details"
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
