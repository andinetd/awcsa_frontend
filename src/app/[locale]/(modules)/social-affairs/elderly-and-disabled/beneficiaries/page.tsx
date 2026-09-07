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
} from "@/components/custom/custom-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            {category === "DISABLED" ? t("disabledTitle") : t("elderlyTitle")}
          </h1>
          <p className="text-slate-500 mt-1">
            {category === "DISABLED"
              ? t("disabledSubtitle")
              : t("elderlySubtitle")}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v as BeneficiaryCategory);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DISABLED">{t("disabled")}</SelectItem>
              <SelectItem value="ELDERLY">{t("elderly")}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => openDialog(category)}
          >
            <Plus className="w-4 h-4" />
            {t("registerNew")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-wrap gap-2">
          <CardTitle>{t("registeredCard")}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 bg-slate-50/50 border-slate-200"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <select
              className="h-9 rounded-md border border-slate-200 bg-slate-50/50 px-2 text-sm"
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
        <CardContent>
          {isFetching && !isLoading && (
            <div className="text-xs text-slate-400 flex items-center gap-2 mb-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Refreshing...
            </div>
          )}
          <BeneficiaryTable
            data={data?.items ?? []}
            isLoading={isLoading}
            type={category}
            profileHref="/social-affairs/elderly-and-disabled/beneficiaries"
          />
          {data && data.total > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500">
                Page {data.page} of {Math.ceil(data.total / pageSize)} (
                {data.total} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * pageSize >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
