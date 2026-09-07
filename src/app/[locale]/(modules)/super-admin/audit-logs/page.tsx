"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAuditLogs } from "@/hooks/super-admin";
import { Loader2, X } from "lucide-react";
import { AuditLogTable } from "./_components/audit-log-table";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function AuditLogsPage() {
  const t = useTranslations("super-admin.auditLogs");
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEntityType = searchParams.get("entityType") ?? undefined;
  const rawEntityId = searchParams.get("entityId");
  const initialEntityId = rawEntityId ? Number(rawEntityId) : undefined;
  const initialFilter = useMemo(
    () => ({
      page: 1,
      limit: 100,
      ...(initialEntityType ? { entityType: initialEntityType } : {}),
      ...(initialEntityId && !Number.isNaN(initialEntityId)
        ? { entityId: initialEntityId }
        : {}),
    }),
    [initialEntityType, initialEntityId]
  );

  const [filter, setFilter] = useState(initialFilter);
  const { data: auditLogsData, isLoading: loading } = useGetAuditLogs(filter);

  // Keep state in sync if the user navigates with new query params.
  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const logs = auditLogsData?.data || [];
  const isFiltered = !!initialEntityType || !!initialEntityId;

  const clearFilter = () => {
    setFilter({ page: 1, limit: 100 });
    router.replace("/super-admin/audit-logs");
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-slate-700">
          <span className="font-medium">{t("filterBanner.label")}</span>
          {initialEntityType && (
            <span className="rounded-full bg-white border px-2.5 py-0.5 text-xs font-mono">
              {t("filterBanner.entityType", { value: initialEntityType })}
            </span>
          )}
          {initialEntityId !== undefined && !Number.isNaN(initialEntityId) && (
            <span className="rounded-full bg-white border px-2.5 py-0.5 text-xs font-mono">
              {t("filterBanner.entityId", { value: initialEntityId })}
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto gap-1"
            onClick={clearFilter}
          >
            <X className="h-3.5 w-3.5" />
            {t("filterBanner.clear")}
          </Button>
        </div>
      )}

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
