"use client";

import { Backup } from "@/types/super-admin";
import { useGetBackups } from "@/hooks/super-admin";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./components/columns";
import { useTranslations } from "next-intl";
import { Loader2, DatabaseBackup } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function BackupsPage() {
  const t = useTranslations("super-admin.backups");
  const { data: backups = [], isLoading: loading } = useGetBackups();

  const fetchBackups = () => {};

  const columns = getColumns({ t: (key: string) => t(`table.${key}`) });

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
          <div className="flex items-center space-x-2">
            <Button
              onClick={fetchBackups}
              variant="outline"
              className="h-8 rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs gap-1.5 px-3"
            >
              <DatabaseBackup className="h-3.5 w-3.5 text-slate-500" /> {t("refreshList")}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[350px] items-center justify-center border border-[#E3E7EB] rounded-xs bg-white">
          <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
        </div>
      ) : (
        <div className="border border-[#E3E7EB] rounded-xs bg-white shadow-2xs overflow-hidden">
          <DataTable data={backups} columns={columns} />
        </div>
      )}
    </div>
  );
}
