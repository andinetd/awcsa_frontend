"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Building, DollarSign } from "lucide-react";

export interface DoubleSupportErrorPayload {
  category: string;
  receivedServiceName: string;
  sourceDepartment: string;
  office: string;
  exactBenefit: string;
  dateProvided: string;
  periodCovered?: string | null;
  daysAgo: number;
}

interface DoubleSupportWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingSupport: DoubleSupportErrorPayload | null;
  attemptedServiceName?: string;
}

export function DoubleSupportWarningDialog({
  open,
  onOpenChange,
  existingSupport,
  attemptedServiceName,
}: DoubleSupportWarningDialogProps) {
  if (!existingSupport) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] rounded-xs border border-red-300 bg-white p-6 shadow-xl">
        <DialogHeader className="border-b border-red-100 pb-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <DialogTitle className="text-base font-bold font-mono tracking-wide uppercase text-red-900">
              Double Support Detected
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-600 font-sans mt-1">
            This beneficiary has already received equivalent public assistance within the active benefit period.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div className="p-3.5 rounded-xs bg-red-50/60 border border-red-200 text-xs font-mono space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-red-200 text-red-900">
              <span className="font-semibold uppercase">Category</span>
              <span className="px-2 py-0.5 rounded bg-red-100 border border-red-300 font-bold">
                {existingSupport.category}
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-800">
              <DollarSign className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-500 text-[11px] uppercase">Service Disbursed</div>
                <div className="font-bold text-sm text-slate-900">{existingSupport.receivedServiceName}</div>
                <div className="text-xs text-slate-700 font-semibold">{existingSupport.exactBenefit}</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-800">
              <Building className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-500 text-[11px] uppercase">Disbursed By</div>
                <div>{existingSupport.sourceDepartment}</div>
                <div className="text-[11px] text-slate-500">{existingSupport.office}</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-800">
              <Calendar className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-500 text-[11px] uppercase">Date & Period</div>
                <div>{existingSupport.dateProvided} ({existingSupport.daysAgo} days ago)</div>
                {existingSupport.periodCovered && (
                  <div className="text-[11px] text-slate-500">Period: {existingSupport.periodCovered}</div>
                )}
              </div>
            </div>
          </div>

          {attemptedServiceName && (
            <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold">Attempted action:</span> Registration of{" "}
              <strong>&ldquo;{attemptedServiceName}&rdquo;</strong> was stopped by policy rules.
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t border-slate-100">
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
          >
            Acknowledge & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
