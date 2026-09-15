"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetTrainingsQuery, useGetJobsQuery } from "@/hooks/beneficiaries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  HeartHandshake,
  GraduationCap,
  Briefcase,
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import ServiceForm from "./service-form";
import TrainingForm from "./training-form";
import JobForm from "./job-form";
import BeneficiaryReportDialog from "./report-dialog";
import { getSupportServices } from "@/api/beneficiaries/services";
import PersonHistoryDialog from "@/components/shared/person-history-dialog";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export interface ServicesContentProps {
  initialTab?: "services" | "training" | "jobs";
}

export default function ServicesContent({ initialTab }: ServicesContentProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.services");
  const tTraining = useTranslations(
    "social-affairs.elderlyAndDisabled.training",
  );
  const tJobs = useTranslations("social-affairs.elderlyAndDisabled.jobs");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlTab = searchParams.get("tab") as "services" | "training" | "jobs" | null;
  const activeTab = urlTab || initialTab || "services";

  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [searchServices, setSearchServices] = useState("");
  const [searchTraining, setSearchTraining] = useState("");
  const [searchJobs, setSearchJobs] = useState("");

  useEffect(() => {
    if (urlTab && ["services", "training", "jobs"].includes(urlTab)) {
      setCurrentTab(urlTab);
    } else if (initialTab) {
      setCurrentTab(initialTab);
    }
  }, [initialTab, urlTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 1. Support Services Data
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["support-services"],
    queryFn: () => getSupportServices(),
  });

  const filteredServices =
    services?.filter(
      (item: any) =>
        item.serviceName?.toLowerCase().includes(searchServices.toLowerCase()) ||
        item.provider?.toLowerCase().includes(searchServices.toLowerCase()) ||
        `${item.client?.firstName} ${item.client?.lastName}`
          .toLowerCase()
          .includes(searchServices.toLowerCase()),
    ) || [];

  // 2. Training Sessions Data
  const { data: trainings, isLoading: isLoadingTrainings } =
    useGetTrainingsQuery();

  const filteredTrainings =
    trainings?.filter(
      (item: any) =>
        item.trainingType?.toLowerCase().includes(searchTraining.toLowerCase()) ||
        item.provider?.toLowerCase().includes(searchTraining.toLowerCase()) ||
        `${item.client?.firstName} ${item.client?.lastName}`
          .toLowerCase()
          .includes(searchTraining.toLowerCase()),
    ) || [];

  // 3. Job Placements Data
  const { data: jobs, isLoading: isLoadingJobs } = useGetJobsQuery();

  const filteredJobs =
    jobs?.filter(
      (item: any) =>
        item.jobTitle?.toLowerCase().includes(searchJobs.toLowerCase()) ||
        item.companyIdNumber
          ?.toLowerCase()
          .includes(searchJobs.toLowerCase()) ||
        `${item.client?.firstName} ${item.client?.lastName}`
          .toLowerCase()
          .includes(searchJobs.toLowerCase()),
    ) || [];

  const tabTitle =
    currentTab === "services"
      ? t("title")
      : currentTab === "training"
        ? tTraining("title")
        : tJobs("title");

  const tabSubtitle =
    currentTab === "services"
      ? t("subtitle")
      : currentTab === "training"
        ? tTraining("subtitle")
        : tJobs("subtitle");

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
        <span className="text-[#0B1F3A] font-bold">{tabTitle}</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            {currentTab === "services" && <HeartHandshake className="w-5 h-5 text-[#1769AA]" />}
            {currentTab === "training" && <GraduationCap className="w-5 h-5 text-[#1769AA]" />}
            {currentTab === "jobs" && <Briefcase className="w-5 h-5 text-[#1769AA]" />}
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {tabTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">{tabSubtitle}</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {currentTab === "services" && <ServiceForm />}
          {currentTab === "training" && (
            <div className="flex items-center gap-2">
              <TrainingForm />
              <BeneficiaryReportDialog />
            </div>
          )}
          {currentTab === "jobs" && (
            <div className="flex items-center gap-2">
              <JobForm />
              <BeneficiaryReportDialog />
            </div>
          )}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full space-y-4">
        <TabsList className="h-9 p-0.5 rounded-xs bg-slate-100 border border-[#E3E7EB] flex-wrap sm:inline-flex w-full sm:w-auto">
          <TabsTrigger
            value="services"
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold gap-1.5"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{t("title")}</span>
            {services && (
              <span className="ml-1 text-[10px] font-mono px-1 py-0.2 rounded-xs bg-slate-200/80 data-[state=active]:bg-white/20">
                {services.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{tTraining("title")}</span>
            {trainings && (
              <span className="ml-1 text-[10px] font-mono px-1 py-0.2 rounded-xs bg-slate-200/80 data-[state=active]:bg-white/20">
                {trainings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="jobs"
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs data-[state=active]:bg-[#1769AA] data-[state=active]:text-white data-[state=active]:shadow-2xs font-bold gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{tJobs("title")}</span>
            {jobs && (
              <span className="ml-1 text-[10px] font-mono px-1 py-0.2 rounded-xs bg-slate-200/80 data-[state=active]:bg-white/20">
                {jobs.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SUPPORT SERVICES */}
        <TabsContent value="services" className="mt-0">
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-[#E3E7EB]">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <HeartHandshake className="w-4 h-4 text-[#1769AA]" />
                {t("cardTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={t("searchPlaceholder")}
                    className="h-8 pl-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                    value={searchServices}
                    onChange={(e) => setSearchServices(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-500 hover:bg-slate-50">
                  <Filter className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border border-[#E3E7EB] rounded-xs bg-white overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
                    <TableRow>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {t("table.beneficiary")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {t("table.service")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {t("table.category")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {t("table.frequency")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {t("table.date")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingServices ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-xs font-mono text-slate-400">
                          {t("table.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredServices.length > 0 ? (
                      filteredServices.map((s: any) => (
                        <TableRow
                          key={s.id}
                          className="border-b border-[#E3E7EB] hover:bg-slate-50/70 transition-colors"
                        >
                          <TableCell className="py-2.5 px-3 font-medium">
                            <PersonHistoryDialog
                              clientId={s.client?.id}
                              personName={`${s.client?.firstName} ${s.client?.lastName}`}
                              cityIdNumber={s.client?.cityIdNumber}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left font-semibold text-slate-900 hover:text-[#1769AA] hover:underline cursor-pointer transition-colors"
                                  title="Click to view cross-department support history"
                                >
                                  {s.client?.firstName} {s.client?.lastName}
                                </button>
                              }
                            />
                            <p className="text-[11px] font-mono text-slate-500">
                              {s.client?.cityIdNumber}
                            </p>
                          </TableCell>
                          <TableCell className="py-2.5 px-3">
                            <p className="font-medium text-slate-800">
                              {t.has(`types.${s.serviceTypeId}`)
                                ? t(`types.${s.serviceTypeId}`)
                                : s.serviceType?.name || s.serviceName || `Service #${s.serviceTypeId}`}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400">{s.provider}</p>
                          </TableCell>
                          <TableCell className="py-2.5 px-3">
                            <Badge variant="outline" className="rounded-xs font-mono text-[10px] uppercase tracking-wider font-semibold border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA]">
                              {s.category && t.has(`categories.${s.category}`)
                                ? t(`categories.${s.category}`)
                                : s.category || "General"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5 px-3 text-xs font-mono text-slate-600">
                            {s.frequency ? String(s.frequency).replace(/_/g, " ") : "As Needed"}
                          </TableCell>
                          <TableCell className="py-2.5 px-3 text-xs font-mono text-slate-600">
                            {new Date(s.dateProvided).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-xs font-mono text-slate-400"
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
        </TabsContent>

        {/* TAB 2: TRAINING SESSIONS */}
        <TabsContent value="training" className="mt-0">
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-[#E3E7EB]">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                {tTraining("cardTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={tTraining("searchPlaceholder")}
                    className="h-8 pl-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                    value={searchTraining}
                    onChange={(e) => setSearchTraining(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-500 hover:bg-slate-50">
                  <Filter className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border border-[#E3E7EB] rounded-xs bg-white overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
                    <TableRow>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tTraining("table.beneficiary")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tTraining("table.type")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tTraining("table.provider")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tTraining("table.dates")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tTraining("table.coc")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingTrainings ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-xs font-mono text-slate-400">
                          {tTraining("table.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredTrainings.length > 0 ? (
                      filteredTrainings.map((tr: any) => (
                        <TableRow
                          key={tr.id}
                          className="border-b border-[#E3E7EB] hover:bg-slate-50/70 transition-colors"
                        >
                          <TableCell className="py-2.5 px-3 font-medium">
                            <PersonHistoryDialog
                              clientId={tr.client?.id}
                              personName={`${tr.client?.firstName} ${tr.client?.lastName}`}
                              cityIdNumber={tr.client?.cityIdNumber}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left font-semibold text-slate-900 hover:text-[#1769AA] hover:underline cursor-pointer transition-colors"
                                  title="Click to view cross-department support history"
                                >
                                  {tr.client?.firstName} {tr.client?.lastName}
                                </button>
                              }
                            />
                            <p className="text-[11px] font-mono text-slate-500">
                              {tr.client?.cityIdNumber}
                            </p>
                          </TableCell>
                          <TableCell className="py-2.5 px-3 font-medium text-slate-800">{tr.trainingType}</TableCell>
                          <TableCell className="py-2.5 px-3 text-slate-600">{tr.provider}</TableCell>
                          <TableCell className="py-2.5 px-3 text-xs font-mono text-slate-600">
                            {new Date(tr.startDate).toLocaleDateString()}
                            {tr.completionDate &&
                              ` - ${new Date(
                                tr.completionDate,
                              ).toLocaleDateString()}`}
                          </TableCell>
                          <TableCell className="py-2.5 px-3">
                            <Badge
                              variant="outline"
                              className={`rounded-xs font-mono text-[10px] uppercase tracking-wider font-semibold border ${
                                tr.hasCOC
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border-[#E3E7EB]"
                              }`}
                            >
                              {tr.hasCOC ? tTraining("coc.yes") : tTraining("coc.no")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-xs font-mono text-slate-400"
                        >
                          {tTraining("table.noRecords")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: JOB PLACEMENTS */}
        <TabsContent value="jobs" className="mt-0">
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b border-[#E3E7EB]">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                <Briefcase className="w-4 h-4 text-blue-600" />
                {tJobs("cardTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={tJobs("searchPlaceholder")}
                    className="h-8 pl-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                    value={searchJobs}
                    onChange={(e) => setSearchJobs(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xs border-[#E3E7EB] text-slate-500 hover:bg-slate-50">
                  <Filter className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border border-[#E3E7EB] rounded-xs bg-white overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
                    <TableRow>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tJobs("table.beneficiary")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tJobs("table.companyId")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tJobs("table.position")}
                      </TableHead>
                      <TableHead className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 h-9 py-2 px-3">
                        {tJobs("table.startDate")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingJobs ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-xs font-mono text-slate-400">
                          {tJobs("table.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredJobs.length > 0 ? (
                      filteredJobs.map((j: any) => (
                        <TableRow
                          key={j.id}
                          className="border-b border-[#E3E7EB] hover:bg-slate-50/70 transition-colors"
                        >
                          <TableCell className="py-2.5 px-3 font-medium">
                            <PersonHistoryDialog
                              clientId={j.client?.id}
                              personName={`${j.client?.firstName} ${j.client?.lastName}`}
                              cityIdNumber={j.client?.cityIdNumber}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left font-semibold text-slate-900 hover:text-[#1769AA] hover:underline cursor-pointer transition-colors"
                                  title="Click to view cross-department support history"
                                >
                                  {j.client?.firstName} {j.client?.lastName}
                                </button>
                              }
                            />
                            <p className="text-[11px] font-mono text-slate-500">
                              {j.client?.cityIdNumber}
                            </p>
                          </TableCell>
                          <TableCell className="py-2.5 px-3 font-mono text-slate-700">{j.companyIdNumber}</TableCell>
                          <TableCell className="py-2.5 px-3 font-medium text-slate-800">{j.jobTitle}</TableCell>
                          <TableCell className="py-2.5 px-3 text-xs font-mono text-slate-600">
                            {new Date(j.startDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-10 text-xs font-mono text-slate-400"
                        >
                          {tJobs("table.noRecords")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
