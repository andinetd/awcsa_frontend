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
    <div className="h-full flex-1 flex-col space-y-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-1 border-b border-[#E3E7EB] pb-4">
        <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          <span>SUPER ADMIN</span>
          <span>/</span>
          <span className="text-[#1769AA] font-bold">{t("title")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A] font-mono uppercase">
              {t("title")}
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 rounded-xs border border-[#BCD5EA] bg-[#E8F2FA]/60 px-3.5 py-2 text-xs text-slate-700 shadow-2xs">
          <span className="font-semibold text-[#0B1F3A]">{t("filterBanner.label")}</span>
          {initialEntityType && (
            <span className="rounded-xs bg-white border border-[#BCD5EA] px-2 py-0.5 text-[11px] font-mono text-[#0B1F3A]">
              {t("filterBanner.entityType", { value: initialEntityType })}
            </span>
          )}
          {initialEntityId !== undefined && !Number.isNaN(initialEntityId) && (
            <span className="rounded-xs bg-white border border-[#BCD5EA] px-2 py-0.5 text-[11px] font-mono text-[#0B1F3A]">
              {t("filterBanner.entityId", { value: initialEntityId })}
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-7 px-2.5 text-xs rounded-xs border border-[#BCD5EA] text-[#1769AA] hover:bg-[#E8F2FA] gap-1"
            onClick={clearFilter}
          >
            <X className="h-3 w-3" />
            {t("filterBanner.clear")}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex h-[350px] items-center justify-center border border-[#E3E7EB] rounded-xs bg-white">
          <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
        </div>
      ) : (
        <AuditLogTable logs={logs} />
      )}
    </div>
  );
}
