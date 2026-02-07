"use client";

import { useMyComplaintsQuery } from "@/hooks/complaints";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ComplaintStatus } from "@/types/complaints";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

const statusColorMap: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [ComplaintStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [ComplaintStatus.RESOLVED]: "bg-green-100 text-green-800",
  [ComplaintStatus.REJECTED]: "bg-red-100 text-red-800",
};

export function ComplaintList() {
  const t = useTranslations("applicants-portal.complaints");
  const tCommon = useTranslations("complaints"); // Using common status translations
  const { data: complaints, isLoading } = useMyComplaintsQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const getStatusLabel = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.PENDING:
        return tCommon("statuses.pending");
      case ComplaintStatus.IN_PROGRESS:
        return tCommon("statuses.inProgress");
      case ComplaintStatus.RESOLVED:
        return tCommon("statuses.resolved");
      case ComplaintStatus.REJECTED:
        return tCommon("statuses.rejected");
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    return t(`categories.${category.toLowerCase()}`);
  };

  if (!complaints || complaints.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-3">
        <MessageSquare className="h-8 w-8 text-gray-300" />
        <p className="text-gray-500 font-medium">{t("list.noComplaints")}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[140px]">{t("list.table.date")}</TableHead>
            <TableHead>{t("list.table.subject")}</TableHead>
            <TableHead>{t("list.table.category")}</TableHead>
            <TableHead>{t("list.table.status")}</TableHead>
            <TableHead className="text-right">
              {t("list.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow
              key={complaint.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="whitespace-nowrap tabular-nums text-gray-600">
                {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="font-semibold text-gray-900">
                {complaint.subject}
              </TableCell>
              <TableCell className="text-gray-600 capitalize">
                {getCategoryLabel(complaint.category)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`${statusColorMap[complaint.status]} border-none font-medium`}
                >
                  {getStatusLabel(complaint.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/5 hover:text-primary hover:cursor-pointer"
                    >
                      {t("list.table.viewDetails")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl hover:cursor-default">
                    <DialogHeader>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className={`${statusColorMap[complaint.status]} border-none`}
                        >
                          {getStatusLabel(complaint.status)}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {t("list.dialog.lastUpdated")}:{" "}
                          {format(new Date(complaint.updatedAt), "PPP")}
                        </span>
                      </div>
                      <DialogTitle className="text-xl font-bold">
                        {complaint.subject}
                      </DialogTitle>
                      <DialogDescription className="capitalize">
                        {t("list.dialog.categoryLabel")}:{" "}
                        {getCategoryLabel(complaint.category)}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto mt-4 pr-4 custom-scrollbar">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            {t("list.dialog.yourMessage")}
                          </h4>
                          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-100">
                            {complaint.description}
                          </div>
                        </div>

                        {complaint.resolution ? (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="h-4 w-4" />
                              {t("list.dialog.response")}
                            </h4>
                            <div className="bg-green-50/50 p-4 rounded-lg text-sm text-gray-800 leading-relaxed border border-green-100">
                              {complaint.resolution}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
                            <p className="text-sm text-blue-700 font-medium">
                              {t("list.dialog.reviewingMsg")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
