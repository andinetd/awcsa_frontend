"use client";

import React, { useState } from "react";
import { useGetTrainingsQuery } from "@/hooks/beneficiaries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, GraduationCap, FileDown } from "lucide-react";
import BeneficiaryReportDialog from "../_components/report-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TrainingForm from "../_components/training-form";

import { useTranslations } from "next-intl";

export default function TrainingPage() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.training");
  const { data: trainings, isLoading } = useGetTrainingsQuery();
  const [search, setSearch] = useState("");

  const filteredData =
    trainings?.filter(
      (item: any) =>
        item.trainingType.toLowerCase().includes(search.toLowerCase()) ||
        item.provider.toLowerCase().includes(search.toLowerCase()) ||
        `${item.client?.firstName} ${item.client?.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            {t("title")}
          </h1>
          <p className="text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <TrainingForm />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {t("cardTitle")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="pl-8 bg-slate-50/50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="text-slate-500">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold">
                    {t("table.beneficiary")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("table.type")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("table.provider")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("table.dates")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("table.coc")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      {t("table.loading")}
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((tr: any) => (
                    <TableRow
                      key={tr.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {tr.client?.firstName} {tr.client?.lastName}
                        <p className="text-xs text-slate-400">
                          {tr.client?.cityIdNumber}
                        </p>
                      </TableCell>
                      <TableCell>{tr.trainingType}</TableCell>
                      <TableCell>{tr.provider}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(tr.startDate).toLocaleDateString()}
                        {tr.completionDate &&
                          ` - ${new Date(
                            tr.completionDate,
                          ).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={tr.hasCOC ? "default" : "secondary"}
                          className="rounded-full"
                        >
                          {tr.hasCOC ? t("coc.yes") : t("coc.no")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-slate-400"
                    >
                      {t("table.noRecords")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
