"use client";

import { useGetAuditLogs } from "@/hooks/super-admin";
import { Loader2 } from "lucide-react";
import { AuditLogTable } from "./_components/audit-log-table";
import { useTranslations } from "next-intl";

export default function AuditLogsPage() {
  const t = useTranslations("super-admin.auditLogs");
  const { data: auditLogsData, isLoading: loading } = useGetAuditLogs({
    page: 1,
    limit: 100,
  });

  const logs = auditLogsData?.data || [];

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {/* <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div> */}

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <AuditLogTable logs={logs} />
      )}
    </div>
  );
}
