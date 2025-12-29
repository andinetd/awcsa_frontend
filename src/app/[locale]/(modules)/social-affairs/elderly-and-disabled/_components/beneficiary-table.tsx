"use client";

import React from "react";
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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-xl bg-slate-50/50">
        <div className="animate-pulse text-slate-400 font-medium">
          Loading beneficiaries...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-xl bg-slate-50/50 space-y-2">
        <p className="text-slate-500 font-medium">No beneficiaries found</p>
        <p className="text-sm text-slate-400">
          Try adjusting your search or add a new record.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold">Full Name</TableHead>
            <TableHead className="font-semibold">City ID</TableHead>
            <TableHead className="font-semibold">Phone Number</TableHead>
            <TableHead className="font-semibold">
              {type === "DISABLED" ? "Disability Type" : "Living Condition"}
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
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
                  ? item.DisabilityProfile?.disabilityType || "N/A"
                  : "Elderly"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.activeStatus ? "outline" : "secondary"}
                  className={cn(
                    "rounded-full",
                    item.activeStatus &&
                      "bg-green-50 text-green-700 border-green-200"
                  )}
                >
                  {item.activeStatus ? "Active" : "Inactive"}
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
                  {/* <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
