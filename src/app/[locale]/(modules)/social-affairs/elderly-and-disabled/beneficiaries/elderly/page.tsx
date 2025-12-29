"use client";

import React, { useState } from "react";
import { useGetBeneficiariesQuery } from "@/hooks/beneficiaries";
import BeneficiaryTable from "../../_components/beneficiary-table";
import RegistrationForm from "../../_components/registration-form";
import BeneficiaryReportDialog from "../../_components/report-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, FileDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";

import { Beneficiary } from "@/api/beneficiaries/types";

export default function ElderlyBeneficiariesPage() {
  const { data: beneficiaries, isLoading } =
    useGetBeneficiariesQuery("ELDERLY");
  const [search, setSearch] = useState("");

  const filteredData =
    beneficiaries?.filter(
      (item: Beneficiary) =>
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.cityIdNumber.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            Elderly Persons
          </h1>
          <p className="text-slate-500 mt-1">
            Manage registration and support for elderly beneficiaries.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <RegistrationForm type="ELDERLY" />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Registered Beneficiaries</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search beneficiaries..."
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
          <BeneficiaryTable
            data={filteredData}
            isLoading={isLoading}
            type="ELDERLY"
          />
        </CardContent>
      </Card>
    </div>
  );
}
