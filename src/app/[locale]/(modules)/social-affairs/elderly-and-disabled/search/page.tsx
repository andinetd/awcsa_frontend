"use client";

import { useTranslations } from "next-intl";
import { useBeneficiarySearch } from "@/hooks/beneficiaries/srs-hooks";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Home, ChevronRight, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom/custom-card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BeneficiarySearchPage() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const router = useRouter();
  const [q, setQ] = useState("");
  const [by, setBy] = useState<"fayda" | "name" | "phone" | "cityId">("fayda");
  const [category, setCategory] = useState<"" | "ELDERLY" | "DISABLED">("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBeneficiarySearch({
    q: q || undefined,
    by,
    category: category || undefined,
    page,
    pageSize: 25,
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
        <span className="text-[#0B1F3A] font-bold">Beneficiary Search</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#1769AA]" />
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              Beneficiary Search
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Search by Fayda ID (preferred), name, phone, or city ID across municipal registries
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs">
        <CardHeader className="border-b border-[#E3E7EB] p-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex-1 min-w-[220px] relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={
                  by === "fayda"
                    ? t("searchByFayda")
                    : by === "name"
                      ? t("searchByName")
                      : by === "phone"
                        ? t("searchByPhone")
                        : t("searchByCityId")
                }
                className="h-8 pl-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setPage(1)}
              />
            </div>
            <Select value={by} onValueChange={(v: any) => setBy(v)}>
              <SelectTrigger className="w-[160px] h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fayda" className="text-xs font-mono">{t("searchByFayda")}</SelectItem>
                <SelectItem value="name" className="text-xs font-mono">{t("searchByName")}</SelectItem>
                <SelectItem value="phone" className="text-xs font-mono">{t("searchByPhone")}</SelectItem>
                <SelectItem value="cityId" className="text-xs font-mono">{t("searchByCityId")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger className="w-[150px] h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs font-mono">All Categories</SelectItem>
                <SelectItem value="ELDERLY" className="text-xs font-mono">Elderly</SelectItem>
                <SelectItem value="DISABLED" className="text-xs font-mono">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setPage(1)}
              className="h-8 px-4 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold"
            >
              {t("search")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs">
        <CardHeader className="border-b border-[#E3E7EB] p-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            Results ({data?.total ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-xs font-mono text-slate-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#1769AA]" /> Loading records...
            </div>
          ) : !data?.items?.length ? (
            <div className="text-center py-12 text-xs font-mono text-slate-500">
              {t("noResults")}
            </div>
          ) : (
            <div className="border border-[#E3E7EB] rounded-xs bg-white overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
                  <TableRow>
                    <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">Fayda ID</TableHead>
                    <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">City ID</TableHead>
                    <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">Name</TableHead>
                    <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">Category</TableHead>
                    <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">Sub-city / Woreda</TableHead>
                    <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((b) => (
                    <TableRow key={b.id} className="border-b border-[#E3E7EB] hover:bg-slate-50/70 transition-colors">
                      <TableCell className="py-2.5 px-3 font-mono text-xs text-slate-700">
                        {b.faydaId ?? "—"}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 font-mono text-xs text-slate-700">
                        {b.cityIdNumber ?? "—"}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 font-semibold text-slate-900">
                        {b.firstName} {b.lastName}
                      </TableCell>
                      <TableCell className="py-2.5 px-3">
                        <Badge
                          variant="outline"
                          className="rounded-xs font-mono text-[10px] uppercase tracking-wider font-semibold border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA]"
                        >
                          {b.clientCategory}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-xs font-mono text-slate-600">
                        {b.subCity} / {b.woreda}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] text-[#1769AA] hover:bg-[#E8F2FA] transition-colors"
                          onClick={() =>
                            router.push(
                              `/social-affairs/elderly-and-disabled/beneficiaries/${b.id}`,
                            )
                          }
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
