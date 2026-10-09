"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MonthlyReport } from "@/api/adoption/care-center/reports";
import { format } from "date-fns";
import { Calendar, Users, FileText, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface ReportDetailsDialogProps {
  report: MonthlyReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
}: ReportDetailsDialogProps) {
  if (!report) return null;

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return format(date, "MMMM");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1 text-white">
            <CheckCircle2 className="size-3" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="size-3" />
            Rejected
          </Badge>
        );
      case "SUBMITTED":
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 gap-1">
            <Clock className="size-3" />
            Under Review
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  let parsedFormData: Record<string, any> | null = null;
  if (report.formData) {
    try {
      parsedFormData = JSON.parse(report.formData);
    } catch {
      // not valid json, treat as plain text
      parsedFormData = null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Monthly Report: {getMonthName(report.month)} {report.year}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Report ID #{report.id} • Facility #{report.facilityId}
              </DialogDescription>
            </div>
            <div>{getStatusBadge(report.status)}</div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Key Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-muted/40 rounded-lg border text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                <Users className="size-3.5" />
                <span>Total Children</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{report.totalChildren}</p>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-emerald-700 mb-1">
                <ArrowUpRight className="size-3.5" />
                <span>New Admissions</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{report.newAdmissions}</p>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-blue-700 mb-1">
                <ArrowDownLeft className="size-3.5" />
                <span>Discharges</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{report.discharges}</p>
            </div>
          </div>

          {/* Submission Timeline */}
          <div className="bg-slate-50 border rounded-lg p-3 grid grid-cols-2 text-xs gap-2">
            <div>
              <span className="text-muted-foreground">Submitted At:</span>
              <p className="font-medium text-foreground">
                {report.submittedAt
                  ? format(new Date(report.submittedAt), "PPP p")
                  : "Not recorded"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Reviewed / Approved At:</span>
              <p className="font-medium text-foreground">
                {report.approvedAt
                  ? format(new Date(report.approvedAt), "PPP p")
                  : "Pending review"}
              </p>
            </div>
          </div>

          {/* Qualitative Notes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <FileText className="size-3.5" />
              Notes & Qualitative Observations
            </h4>
            <div className="p-4 rounded-lg bg-card border text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[80px]">
              {report.notes ? report.notes : <span className="text-muted-foreground italic">No additional notes provided.</span>}
            </div>
          </div>

          {/* Additional Form Data */}
          {report.formData && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Additional Encoded Form Data
              </h4>
              {parsedFormData ? (
                <div className="grid grid-cols-2 gap-2 bg-slate-50 border rounded-lg p-3 text-xs">
                  {Object.entries(parsedFormData).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}: </span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="p-3 rounded-lg bg-muted border text-xs overflow-x-auto text-muted-foreground">
                  {report.formData}
                </pre>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
