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

export default function TrainingPage() {
  const { data: trainings, isLoading } = useGetTrainingsQuery();
  const [search, setSearch] = useState("");

  const filteredData =
    trainings?.filter(
      (item: any) =>
        item.trainingType.toLowerCase().includes(search.toLowerCase()) ||
        item.provider.toLowerCase().includes(search.toLowerCase()) ||
        `${item.client?.firstName} ${item.client?.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
    ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            Training Sessions
          </h1>
          <p className="text-slate-500 mt-1">
            Track skills development and training for all beneficiaries.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <TrainingForm />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Global Training Records
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search training or name..."
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
                  <TableHead className="font-semibold">Beneficiary</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Provider</TableHead>
                  <TableHead className="font-semibold">Dates</TableHead>
                  <TableHead className="font-semibold">COC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Loading trainings...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((t: any) => (
                    <TableRow
                      key={t.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {t.client?.firstName} {t.client?.lastName}
                        <p className="text-xs text-slate-400">
                          {t.client?.cityIdNumber}
                        </p>
                      </TableCell>
                      <TableCell>{t.trainingType}</TableCell>
                      <TableCell>{t.provider}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(t.startDate).toLocaleDateString()}
                        {t.completionDate &&
                          ` - ${new Date(
                            t.completionDate
                          ).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={t.hasCOC ? "default" : "secondary"}
                          className="rounded-full"
                        >
                          {t.hasCOC ? "Yes" : "No"}
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
                      No training records found
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
