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
    switch (action) {
      case "DELETE":
      case "GIVE_PERMISSIONS":
      case "REVOKE_PERMISSIONS":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "UPDATE":
      case "LOCK_USER":
      case "UNLOCK_USER":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CREATE":
      case "LOGIN":
      case "LOGOUT":
      default:
        return "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]";
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedLogId(id);
    setDetailsOpen(true);
  };

  const adminT = useTranslations("super-admin.auditLogs");

  return (
    <>
      <div className="bg-white rounded-xs shadow-2xs overflow-hidden border border-[#E3E7EB]">
        <div className="px-4 py-3 border-b border-[#E3E7EB] bg-slate-50/80 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1769AA]" />
              {adminT("title")}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {adminT("description")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono bg-white border border-[#E3E7EB] px-2.5 py-0.5 rounded-xs text-slate-700 font-medium shadow-2xs">
              {t("eventsLogged", { count: logs.length })}
            </span>
          </div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 uppercase text-[11px] font-mono font-semibold tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2.5 bg-slate-50">{t("time")}</th>
                <th className="px-4 py-2.5 bg-slate-50">{t("level")}</th>
                <th className="px-4 py-2.5 bg-slate-50">{t("actor")}</th>
                <th className="px-4 py-2.5 bg-slate-50">{t("action")}</th>
                <th className="px-4 py-2.5 bg-slate-50">{t("entity")}</th>
                <th className="px-4 py-2.5 bg-slate-50">{t("details")}</th>
                <th className="px-4 py-2.5 bg-slate-50 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7EB]">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500 text-xs"
                  >
                    {t("noLogs")}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-mono font-semibold tracking-wider uppercase border inline-block ${getLevelColor(
                          log.action,
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-[#0B1F3A]">
                            {log.user?.employee?.firstName}{" "}
                            {log.user?.employee?.lastName}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 font-normal">
                            {log.user?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium">
                      {log.entityType}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">
                      ID: {log.entityId}
                    </td>
                    <td
                      className="px-4 py-2.5 text-slate-600 max-w-xs text-xs truncate"
                      title={log.remark}
                    >
                      {log.remark}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log.id)}
                        className="h-7 w-7 p-0 rounded-xs border border-transparent hover:border-[#E3E7EB] hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
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
