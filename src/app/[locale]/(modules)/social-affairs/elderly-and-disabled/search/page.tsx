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
import { Search, Loader2 } from "lucide-react";
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-lexend">
          Beneficiary Search
        </h1>
        <p className="text-slate-500 mt-1">
          Search by Fayda ID (preferred), name, phone, or city ID
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
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
                className="pl-8"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Select value={by} onValueChange={(v: any) => setBy(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fayda">{t("searchByFayda")}</SelectItem>
                <SelectItem value="name">{t("searchByName")}</SelectItem>
                <SelectItem value="phone">{t("searchByPhone")}</SelectItem>
                <SelectItem value="cityId">{t("searchByCityId")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ELDERLY">Elderly</SelectItem>
                <SelectItem value="DISABLED">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setPage(1)}>{t("search")}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results ({data?.total ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6 text-slate-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
            </div>
          ) : !data?.items?.length ? (
            <div className="text-center p-6 text-slate-500">
              {t("noResults")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fayda ID</TableHead>
                  <TableHead>City ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-city / Woreda</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">
                      {b.faydaId ?? "—"}
                    </TableCell>
                    <TableCell>{b.cityIdNumber ?? "—"}</TableCell>
                    <TableCell>
                      {b.firstName} {b.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{b.clientCategory}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {b.subCity} / {b.woreda}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/${b.clientCategory === "ELDERLY" ? "elderly" : "disabled"}-and-disabled/beneficiaries/profile/${b.id}`,
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
