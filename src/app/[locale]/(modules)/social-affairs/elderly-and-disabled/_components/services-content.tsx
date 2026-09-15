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
          {currentTab === "services" && <ServiceForm />}
          {currentTab === "training" && (
            <div className="flex gap-2">
              <TrainingForm />
              <BeneficiaryReportDialog />
            </div>
          )}
          {currentTab === "jobs" && (
            <div className="flex gap-2">
              <JobForm />
              <BeneficiaryReportDialog />
            </div>
          )}
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-auto flex flex-wrap sm:inline-flex w-full sm:w-auto">
          <TabsTrigger value="services" className="gap-2 px-4 py-2 text-sm">
            <HeartHandshake className="w-4 h-4 text-primary" />
            <span>{t("title")}</span>
            {services && (
              <Badge variant="secondary" className="ml-1 text-[11px] py-0 px-1.5 font-normal">
                {services.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="training" className="gap-2 px-4 py-2 text-sm">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>{tTraining("title")}</span>
            {trainings && (
              <Badge variant="secondary" className="ml-1 text-[11px] py-0 px-1.5 font-normal">
                {trainings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2 px-4 py-2 text-sm">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>{tJobs("title")}</span>
            {jobs && (
              <Badge variant="secondary" className="ml-1 text-[11px] py-0 px-1.5 font-normal">
                {jobs.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SUPPORT SERVICES */}
        <TabsContent value="services" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-primary" />
                {t("cardTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={t("searchPlaceholder")}
                    className="pl-8 bg-slate-50/50 border-slate-200"
                    value={searchServices}
                    onChange={(e) => setSearchServices(e.target.value)}
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
                        {t("table.service")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("table.category")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("table.frequency")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {t("table.date")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingServices ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                          {t("table.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredServices.length > 0 ? (
                      filteredServices.map((s: any) => (
                        <TableRow
                          key={s.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <PersonHistoryDialog
                              clientId={s.client?.id}
                              personName={`${s.client?.firstName} ${s.client?.lastName}`}
                              cityIdNumber={s.client?.cityIdNumber}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left font-medium text-slate-900 hover:text-primary hover:underline cursor-pointer"
                                  title="Click to view cross-department support history"
                                >
                                  {s.client?.firstName} {s.client?.lastName}
                                </button>
                              }
                            />
                            <p className="text-xs text-slate-400">
                              {s.client?.cityIdNumber}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-800">
                              {t.has(`types.${s.serviceTypeId}`)
                                ? t(`types.${s.serviceTypeId}`)
                                : s.serviceType?.name || s.serviceName || `Service #${s.serviceTypeId}`}
                            </p>
                            <p className="text-xs text-slate-400">{s.provider}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {s.category && t.has(`categories.${s.category}`)
                                ? t(`categories.${s.category}`)
                                : s.category || "General"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-slate-600">
                            {s.frequency ? String(s.frequency).replace(/_/g, " ") : "As Needed"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(s.dateProvided).toLocaleDateString()}
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
        </TabsContent>

        {/* TAB 2: TRAINING SESSIONS */}
        <TabsContent value="training" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                {tTraining("cardTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={tTraining("searchPlaceholder")}
                    className="pl-8 bg-slate-50/50 border-slate-200"
                    value={searchTraining}
                    onChange={(e) => setSearchTraining(e.target.value)}
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
                        {tTraining("table.beneficiary")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tTraining("table.type")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tTraining("table.provider")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tTraining("table.dates")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tTraining("table.coc")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingTrainings ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                          {tTraining("table.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredTrainings.length > 0 ? (
                      filteredTrainings.map((tr: any) => (
                        <TableRow
                          key={tr.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <PersonHistoryDialog
                              clientId={tr.client?.id}
                              personName={`${tr.client?.firstName} ${tr.client?.lastName}`}
                              cityIdNumber={tr.client?.cityIdNumber}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left font-medium text-slate-900 hover:text-primary hover:underline cursor-pointer"
                                  title="Click to view cross-department support history"
                                >
                                  {tr.client?.firstName} {tr.client?.lastName}
                                </button>
                              }
                            />
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
                              {tr.hasCOC ? tTraining("coc.yes") : tTraining("coc.no")}
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                {tJobs("cardTitle")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={tJobs("searchPlaceholder")}
                    className="pl-8 bg-slate-50/50 border-slate-200"
                    value={searchJobs}
                    onChange={(e) => setSearchJobs(e.target.value)}
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
                        {tJobs("table.beneficiary")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tJobs("table.companyId")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tJobs("table.position")}
                      </TableHead>
                      <TableHead className="font-semibold">
                        {tJobs("table.startDate")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingJobs ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                          {tJobs("table.loading")}
                        </TableCell>
                      </TableRow>
                    ) : filteredJobs.length > 0 ? (
                      filteredJobs.map((j: any) => (
                        <TableRow
                          key={j.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <PersonHistoryDialog
                              clientId={j.client?.id}
                              personName={`${j.client?.firstName} ${j.client?.lastName}`}
                              cityIdNumber={j.client?.cityIdNumber}
                              trigger={
                                <button
                                  type="button"
                                  className="text-left font-medium text-slate-900 hover:text-primary hover:underline cursor-pointer"
                                  title="Click to view cross-department support history"
                                >
                                  {j.client?.firstName} {j.client?.lastName}
                                </button>
                              }
                            />
                            <p className="text-xs text-slate-400">
                              {j.client?.cityIdNumber}
                            </p>
                          </TableCell>
                          <TableCell>{j.companyIdNumber}</TableCell>
                          <TableCell>{j.jobTitle}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(j.startDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-10 text-slate-400"
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
