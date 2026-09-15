"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useBeneficiarySearch,
} from "@/hooks/beneficiaries/srs-hooks";
import { useBeneficiaryRegisterStore } from "@/stores/beneficiary-register-store";
import BeneficiaryTable from "../_components/beneficiary-table";
import BeneficiaryReportDialog from "../_components/report-dialog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Home } from "lucide-react";

type BeneficiaryCategory = "ELDERLY" | "DISABLED";

export default function BeneficiariesPage() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.beneficiaries");
  const tSrs = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const openDialog = useBeneficiaryRegisterStore((s) => s.openDialog);
  const [q, setQ] = useState("");
  const [by, setBy] = useState<"fayda" | "name" | "phone" | "cityId">("fayda");
  const [category, setCategory] = useState<BeneficiaryCategory>("DISABLED");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data, isLoading, isFetching } = useBeneficiarySearch({
    q: q || undefined,
    by,
    category,
    page,
    pageSize,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/social-affairs/elderly-and-disabled/dashboard" className="hover:text-[#1769AA] transition-colors">
          Disability & Elderly
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">
          {category === "DISABLED" ? t("disabled") : t("elderly")} Beneficiaries
        </span>
      </div>

      {/* Header & Main Actions */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {category === "DISABLED" ? t("disabledTitle") : t("elderlyTitle")}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            {category === "DISABLED"
              ? t("disabledSubtitle")
              : t("elderlySubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Toggle Tabs */}
          <div className="flex items-center p-0.5 rounded-xs bg-slate-100 border border-[#E3E7EB]">
            <button
              type="button"
              onClick={() => {
                setCategory("DISABLED");
                setPage(1);
              }}
              className={`h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors ${
                category === "DISABLED"
                  ? "bg-[#1769AA] text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t("disabled")}
            </button>
            <button
              type="button"
              onClick={() => {
                setCategory("ELDERLY");
                setPage(1);
              }}
              className={`h-7 px-3 text-xs font-mono uppercase tracking-wider rounded-xs transition-colors ${
                category === "ELDERLY"
                  ? "bg-[#1769AA] text-white shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t("elderly")}
            </button>
          </div>

          <Button
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5"
            onClick={() => openDialog(category)}
          >
            <Plus className="w-3.5 h-3.5" />
            {t("registerNew")}
          </Button>
        </div>
      </div>

      {/* Directory Table Card */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#E3E7EB] bg-slate-50/50 py-3 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("registeredCard")}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="h-8 pl-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select
              className="h-8 rounded-xs border border-[#E3E7EB] bg-white px-2 text-xs font-mono text-slate-700"
              value={by}
              onChange={(e) => {
                setBy(e.target.value as any);
                setPage(1);
              }}
            >
              <option value="fayda">{tSrs("searchByFayda")}</option>
              <option value="name">{tSrs("searchByName")}</option>
              <option value="phone">{tSrs("searchByPhone")}</option>
              <option value="cityId">{tSrs("searchByCityId")}</option>
            </select>
            <BeneficiaryReportDialog />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isFetching && !isLoading && (
            <div className="px-5 py-2 text-[11px] font-mono text-slate-500 flex items-center gap-2 bg-slate-50/50 border-b border-[#E3E7EB]">
              <Loader2 className="w-3 h-3 animate-spin text-[#1769AA]" /> Refreshing records...
            </div>
          )}
          <BeneficiaryTable
            data={data?.items ?? []}
            isLoading={isLoading}
            type={category}
            profileHref="/social-affairs/elderly-and-disabled/beneficiaries"
          />
          {data && data.total > pageSize && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E3E7EB]">
              <div className="text-xs font-mono text-slate-500">
                Page {data.page} of {Math.ceil(data.total / pageSize)} ({data.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] hover:bg-slate-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] hover:bg-slate-50"
                  disabled={page * pageSize >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
