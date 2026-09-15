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
} from "@/components/ui/card";
import { Users, Clock, CheckCircle2, Activity, Search, Home, ChevronRight } from "lucide-react";
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
      badgeColor: "bg-[#E8F2FA] text-[#1769AA] border-[#BCD5EA]",
    },
    {
      title: "Elderly",
      value: data?.elderlyTotal ?? 0,
      icon: Users,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "Disabled",
      value: data?.disabledTotal ?? 0,
      icon: Users,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Pending Eligibility",
      value: data?.pendingEligibility ?? 0,
      icon: Clock,
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      title: "Awaiting Service Confirmation",
      value: data?.pendingConfirmation ?? 0,
      icon: CheckCircle2,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "New Service Requests",
      value: data?.requestedServices ?? 0,
      icon: Activity,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">Social Affairs</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">Disability & Elderly</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1769AA]" />
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("title")}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Link href="/social-affairs/elderly-and-disabled/search">
            <Button
              variant="outline"
              className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 shadow-2xs gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search Beneficiaries
            </Button>
          </Link>
          <BeneficiaryReportDialog />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card
            key={c.title}
            className="rounded-xs border-[#E3E7EB] bg-white p-5 shadow-2xs hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-3">
              <CardTitle className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                {c.title}
              </CardTitle>
              <div className={`p-1.5 rounded-xs border ${c.badgeColor}`}>
                <c.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-bold font-mono text-[#0B1F3A]">
                {isLoading ? (
                  <span className="animate-pulse text-slate-300">...</span>
                ) : (
                  c.value.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ElderlyAndDisabled;
