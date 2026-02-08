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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : log ? (
          <div className="space-y-6">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-500 block">
                  {t("id")}
                </span>
                <span>{log.id}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  {t("time")}
                </span>
                <span className="font-mono">
                  {format(
                    new Date(log.createdAt),
                    t("formats.dateTime") || "MMM d, yyyy HH:mm:ss",
                  )}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  {t("action")}
                </span>
                <span className="font-mono">{log.action}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  {t("entity")}
                </span>
                <span>
                  {log.entityType}{" "}
                  {t.rich("entityId", {
                    id: log.entityId,
                  })}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-500 block">
                  {t("actor")}
                </span>
                <span>
                  {log.user?.employee?.firstName} {log.user?.employee?.lastName}
                  <br />
                  <span className="text-muted-foreground text-xs">
                    {log.user?.email}
                  </span>
                </span>
              </div>
            </div>

            {/* Remark */}
            <div className="bg-gray-50 p-3 rounded-md border text-sm">
              <span className="font-semibold text-gray-700 block mb-1">
                {t("remark")}
              </span>
              <p className="text-gray-600">{log.remark || t("nullValue")}</p>
            </div>

            {/* Changes (Old vs New) */}
            {(log.oldValue || log.newValue) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-red-600">
                    {t("oldValue")}
                  </h4>
                  <pre className="bg-red-50 text-red-900 p-3 rounded-md text-xs overflow-x-auto border border-red-100 min-h-[100px]">
                    {log.oldValue
                      ? JSON.stringify(log.oldValue, null, 2)
                      : t("nullValue")}
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-emerald-600">
                    {t("newValue")}
                  </h4>
                  <pre className="bg-emerald-50 text-emerald-900 p-3 rounded-md text-xs overflow-x-auto border border-emerald-100 min-h-[100px]">
                    {log.newValue
                      ? JSON.stringify(log.newValue, null, 2)
                      : t("nullValue")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-red-500">{t("error")}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
