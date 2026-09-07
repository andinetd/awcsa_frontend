"use client";

import React from "react";
import BeneficiaryReportDialog from "../_components/report-dialog";
import { useTranslations } from "next-intl";
import { useBeneficiaryDashboard } from "@/hooks/beneficiaries/srs-hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Users, Clock, CheckCircle2, Activity, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ElderlyAndDisabled = () => {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard");
  const { data, isLoading } = useBeneficiaryDashboard();

  const cards = [
    {
      title: "Total Beneficiaries",
      value: data?.beneficiariesTotal ?? 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Elderly",
      value: data?.elderlyTotal ?? 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Disabled",
      value: data?.disabledTotal ?? 0,
      icon: Users,
      color: "text-amber-600",
    },
    {
      title: "Pending Eligibility",
      value: data?.pendingEligibility ?? 0,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Awaiting Service Confirmation",
      value: data?.pendingConfirmation ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      title: "New Service Requests",
      value: data?.requestedServices ?? 0,
      icon: Activity,
      color: "text-rose-600",
    },
  ];

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
          <Link href="/search">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" /> Search Beneficiaries
            </Button>
          </Link>
          <BeneficiaryReportDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {c.title}
              </CardTitle>
              <c.icon className={`h-4 w-4 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "—" : c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ElderlyAndDisabled;
