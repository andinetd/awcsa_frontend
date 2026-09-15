"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetAuditLogDetails } from "@/hooks/super-admin";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface AuditLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditLogId?: number;
}

export function AuditLogDetailsDialog({
  open,
  onOpenChange,
  auditLogId,
}: AuditLogDetailsDialogProps) {
  const t = useTranslations("super-admin.auditLogs.detailsDialog");
  const { data: log, isLoading } = useGetAuditLogDetails(
    open ? auditLogId : undefined,
  );

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
          <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">{t("title")}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">{t("description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
          </div>
        ) : log ? (
          <div className="space-y-4">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-[#E3E7EB] rounded-xs text-xs">
              <div>
                <span className="font-semibold text-slate-500 text-[11px] uppercase font-mono block">
                  {t("id")}
                </span>
                <span className="font-mono text-slate-700">{log.id}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 text-[11px] uppercase font-mono block">
                  {t("time")}
                </span>
                <span className="font-mono text-slate-700">
                  {format(
                    new Date(log.createdAt),
                    t("formats.dateTime") || "MMM d, yyyy HH:mm:ss",
                  )}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 text-[11px] uppercase font-mono block">
                  {t("action")}
                </span>
                <span className="font-mono font-semibold text-[#1769AA]">{log.action}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 text-[11px] uppercase font-mono block">
                  {t("entity")}
                </span>
                <span className="text-[#0B1F3A] font-medium">
                  {log.entityType}{" "}
                  {t.rich("entityId", {
                    id: log.entityId,
                  })}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-500 text-[11px] uppercase font-mono block">
                  {t("actor")}
                </span>
                <span className="text-[#0B1F3A] font-medium">
                  {log.user?.employee?.firstName} {log.user?.employee?.lastName}
                  {" "}
                  <span className="text-slate-500 font-mono text-[11px] font-normal">
                    ({log.user?.email})
                  </span>
                </span>
              </div>
            </div>

            {/* Remark */}
            <div className="bg-slate-50/70 p-3 rounded-xs border border-[#E3E7EB] text-xs">
              <span className="font-semibold text-xs font-mono uppercase text-[#0B1F3A] block mb-1">
                {t("remark")}
              </span>
              <p className="text-slate-600 font-mono text-xs">{log.remark || t("nullValue")}</p>
            </div>

            {/* Changes (Old vs New) */}
            {(log.oldValue || log.newValue) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-xs font-mono uppercase text-rose-700">
                    {t("oldValue")}
                  </h4>
                  <pre className="bg-rose-50/60 text-rose-950 p-3 rounded-xs text-xs font-mono overflow-x-auto border border-rose-200 min-h-[100px]">
                    {log.oldValue
                      ? JSON.stringify(log.oldValue, null, 2)
                      : t("nullValue")}
                  </pre>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-xs font-mono uppercase text-emerald-700">
                    {t("newValue")}
                  </h4>
                  <pre className="bg-emerald-50/60 text-emerald-950 p-3 rounded-xs text-xs font-mono overflow-x-auto border border-emerald-200 min-h-[100px]">
                    {log.newValue
                      ? JSON.stringify(log.newValue, null, 2)
                      : t("nullValue")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-rose-600 text-xs font-mono">{t("error")}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
