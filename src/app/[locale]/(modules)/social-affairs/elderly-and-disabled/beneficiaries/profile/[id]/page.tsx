"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useGetBeneficiaryProfileQuery,
  useGetTrainingsQuery,
  useGetJobsQuery,
  useGetSupportServicesQuery,
} from "@/hooks/beneficiaries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  User,
  Phone,
  MapPin,
  CalendarDays,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Activity,
  History,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisabilityInfo } from "@/api/beneficiaries/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TrainingForm from "../../../_components/training-form";
import JobForm from "../../../_components/job-form";
import ServiceForm from "../../../_components/service-form";

export default function BeneficiaryProfilePage() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.profile");
  const tServices = useTranslations(
    "social-affairs.elderlyAndDisabled.services",
  );
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: profile, isLoading: isLoadingProfile } =
    useGetBeneficiaryProfileQuery(id);
  const cityId = profile?.cityIdNumber;
  const { data: trainings, isLoading: isLoadingTrainings } =
    useGetTrainingsQuery(cityId);
  const { data: jobs, isLoading: isLoadingJobs } = useGetJobsQuery(cityId);
  const { data: services, isLoading: isLoadingServices } =
    useGetSupportServicesQuery(cityId);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400">{t("loading")}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-slate-500">{t("notFound")}</p>
        <Button onClick={() => router.back()}>{t("goBack")}</Button>
      </div>
    );
  }

  const isDisabled = profile.clientCategory === "DISABLED";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            {profile.firstName} {profile.lastName}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-slate-50">
              {t("badges.id")}: {profile.cityIdNumber}
            </Badge>
            <Badge
              className={
                profile.activeStatus
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-slate-50 text-slate-500"
              }
            >
              {profile.activeStatus ? t("badges.active") : t("badges.inactive")}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200 uppercase"
            >
              {isDisabled ? t("badges.disabled") : t("badges.elderly")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                {t("personalInfo.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {t("personalInfo.phone")}
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {t("personalInfo.address")}
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.address || t("personalInfo.na")}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {t("personalInfo.dob")}
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.dateOfBirth
                    ? new Date(profile.dateOfBirth).toLocaleDateString()
                    : t("personalInfo.na")}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {t("personalInfo.education")}
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.educationLevel || t("personalInfo.na")}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {t("personalInfo.familyMembers")}
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.familyMembersCount || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {isDisabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4" />
                  {t("disabilityDetails.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      {t("disabilityDetails.type")}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {profile.DisabilityProfile?.disabilityType ||
                        t("personalInfo.na")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      {t("disabilityDetails.cause")}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {profile.DisabilityProfile?.cause ||
                        t("disabilityDetails.unknown")}
                    </p>
                  </div>
                </>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Training & Jobs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-12 p-0 gap-8">
              <TabsTrigger
                value="training"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
              >
                {t("tabs.trainingHistory")}
              </TabsTrigger>
              <TabsTrigger
                value="jobs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
              >
                {t("tabs.jobPlacements")}
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
              >
                {t("tabs.supportServices")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="training" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {t("trainingSection.title")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <TrainingForm
                      cityIdNumber={profile.cityIdNumber}
                      trigger={
                        <Button size="sm" variant="outline">
                          {t("trainingSection.addButton")}
                        </Button>
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("trainingSection.table.trainingType")}
                        </TableHead>
                        <TableHead>
                          {t("trainingSection.table.provider")}
                        </TableHead>
                        <TableHead>
                          {t("trainingSection.table.dates")}
                        </TableHead>
                        <TableHead>{t("trainingSection.table.coc")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trainings && trainings.length > 0 ? (
                        trainings.map((training: any) => (
                          <TableRow key={training.id}>
                            <TableCell className="font-medium">
                              {training.trainingType}
                            </TableCell>
                            <TableCell>{training.provider}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(
                                training.startDate,
                              ).toLocaleDateString()}
                              {training.completionDate &&
                                ` - ${new Date(
                                  training.completionDate,
                                ).toLocaleDateString()}`}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  training.hasCOC ? "default" : "secondary"
                                }
                              >
                                {training.hasCOC
                                  ? t("trainingSection.table.yes")
                                  : t("trainingSection.table.no")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-10 text-slate-400"
                          >
                            {t("trainingSection.table.noRecords")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {t("jobsSection.title")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <JobForm
                      cityIdNumber={profile.cityIdNumber}
                      trigger={
                        <Button size="sm" variant="outline">
                          {t("jobsSection.addButton")}
                        </Button>
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("jobsSection.table.companyId")}
                        </TableHead>
                        <TableHead>{t("jobsSection.table.position")}</TableHead>
                        <TableHead>
                          {t("jobsSection.table.startDate")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs && jobs.length > 0 ? (
                        jobs.map((j: any) => (
                          <TableRow key={j.id}>
                            <TableCell className="font-medium">
                              {j.companyIdNumber}
                            </TableCell>
                            <TableCell>{j.jobTitle}</TableCell>
                            <TableCell>
                              {new Date(j.startDate).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-10 text-slate-400"
                          >
                            {t("jobsSection.table.noRecords")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {t("servicesSection.title")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <ServiceForm />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {t("servicesSection.table.service")}
                        </TableHead>
                        <TableHead>
                          {t("servicesSection.table.category")}
                        </TableHead>
                        <TableHead>
                          {t("servicesSection.table.provider")}
                        </TableHead>
                        <TableHead>{t("servicesSection.table.date")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services && services.length > 0 ? (
                        services.map((service: any) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              {tServices(`types.${service.serviceTypeId}`)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {tServices(`categories.${service.category}`)}
                              </Badge>
                            </TableCell>
                            <TableCell>{service.provider}</TableCell>
                            <TableCell className="text-sm">
                              {new Date(
                                service.dateProvided,
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-10 text-slate-400"
                          >
                            {t("servicesSection.table.noRecords")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
