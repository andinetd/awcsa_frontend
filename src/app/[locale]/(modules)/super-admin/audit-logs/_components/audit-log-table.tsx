"use client";

import { AuditLog } from "@/types/super-admin";
import { Eye, Lock, Shield, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuditLogDetailsDialog } from "./audit-log-details-dialog";
import { useTranslations } from "next-intl";

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const t = useTranslations("super-admin.auditLogs.table");
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getLevelColor = (action: string) => {
    // Map actions to levels/colors
    switch (action) {
      case "DELETE":
      case "GIVE_PERMISSIONS":
      case "REVOKE_PERMISSIONS":
        // Critical / Red
        return "bg-red-100 text-red-700";
      case "UPDATE":
      case "LOCK_USER":
      case "UNLOCK_USER":
        // Warning / Orange
        return "bg-orange-100 text-orange-700";
      case "CREATE":
      case "LOGIN":
      case "LOGOUT":
      default:
        // Info / Emerald/Blue
        return "bg-emerald-50 text-emerald-700";
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedLogId(id);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              {useTranslations("super-admin.auditLogs")("title")}
            </h3>
            <p className="text-xs text-gray-500">
              {useTranslations("super-admin.auditLogs")("description")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-white border px-3 py-1 rounded-full text-slate-600 font-medium">
              {t("eventsLogged", { count: logs.length })}
            </span>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 bg-gray-100">{t("time")}</th>
                <th className="px-6 py-3 bg-gray-100">{t("level")}</th>
                <th className="px-6 py-3 bg-gray-100">{t("actor")}</th>
                <th className="px-6 py-3 bg-gray-100">{t("action")}</th>
                <th className="px-6 py-3 bg-gray-100">{t("entity")}</th>
                <th className="px-6 py-3 bg-gray-100">{t("details")}</th>
                <th className="px-6 py-3 bg-gray-100">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {t("noLogs")}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getLevelColor(
                          log.action,
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <div className="flex flex-col">
                          <span>
                            {log.user?.employee?.firstName}{" "}
                            {log.user?.employee?.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground font-normal">
                            {log.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-medium">
                      {log.entityType}
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs font-mono">
                      ID: {log.entityId}
                    </td>
                    <td
                      className="px-6 py-3 text-gray-500 max-w-xs text-xs truncate"
                      title={log.remark}
                    >
                      {log.remark}
                    </td>
                    <td className="px-6 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4 text-slate-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AuditLogDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        auditLogId={selectedLogId || undefined}
      />
    </>
  );
}
