"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/base-url";
import { useAuthStore } from "@/stores/auth-store";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import {
  ArrowLeft,
  FileCheck,
  FileQuestion,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { PersonTable } from "../../_components/person-table";
import { ApplicantCard, Field } from "../../_components/applicant-card";

const SectionHeading: React.FC<{ title: string; icon?: React.ElementType }> = ({
  title,
  icon: Icon,
}) => (
  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
    {Icon && <Icon className="w-4 h-4 text-blue-600" />}
    {title}
  </h4>
);

export default function HomeVisitFieldsPage() {
  const router = useRouter();
  const params = useParams();
  const serviceDataId = (params as any)?.serviceDataId ?? "";
  const token = useAuthStore((s) => s.token);
  const setServiceDataId = useHomeVisitFormStore((s) => s.setServiceDataId);
  const t = useTranslations("adoption");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/adoption/home-visit/${serviceDataId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!mounted) return;
        const raw = res.data;
        const form = raw?.data?.formData ?? raw?.formData ?? raw?.data ?? raw;
        setFormData(form ?? null);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.response?.status === 404) {
          // No home visit form found for this application
          setFormData(null);
        } else {
          console.error("Error fetching home visit data:", err);
          toast.error(t("homeVisit.errors.loadFailed"));
          setFormData(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (serviceDataId) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [serviceDataId, token, t]);

  const general = formData?.generalInfo || {};
  const address = general?.address || {};
  const interest = formData?.adoptionInterest || {};
  const preferredChild = interest?.preferredChild || {};
  const applicantFather = formData?.applicantFather || {};
  const applicantMother = formData?.applicantMother || {};
  const marriageInfo = formData?.marriageInfo || {};
  const homeEnv = formData?.homeAndEnvironment || {};
  const existingChildren = Array.isArray(formData?.existingChildren)
    ? formData.existingChildren
    : [];
  const householdMembers = Array.isArray(formData?.householdMembers)
    ? formData.householdMembers
    : [];
  const witnesses = Array.isArray(formData?.witnesses)
    ? formData.witnesses
    : [];
  const familyBg = formData?.familyBackground || {};
  const fatherSide = familyBg?.fatherSide || {};
  const motherSide = familyBg?.motherSide || {};
  const evaluation = formData?.socialWorkerEvaluation || {};

  const dateValue =
    general?.startDate && general?.endDate
      ? t("homeVisit.fields.dateRange", {
          start: general.startDate,
          end: general.endDate,
        })
      : general?.startDate || general?.endDate || "—";

  const timeValue =
    general?.startTime && general?.endTime
      ? t("homeVisit.fields.timeRange", {
          start: general.startTime,
          end: general.endTime,
        })
      : general?.startTime || general?.endTime || "—";

  const signatureDisplay =
    evaluation?.signature && typeof evaluation.signature === "object"
      ? evaluation.signature.path || evaluation.signature.name || "Attached"
      : evaluation?.signature || "Signed electronically";

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/adoption/adoption-requests/${serviceDataId}`)
            }
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{t("homeVisit.title")}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">{t("homeVisit.loading")}</p>
        </div>
      ) : !formData ? (
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <FileQuestion className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("homeVisit.noDataTitle")}
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  {t("homeVisit.noDataDescription", { id: serviceDataId })}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/adoption/adoption-requests/${serviceDataId}`)
                  }
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("homeVisit.backToApplication")}
                </Button>
                <Button
                  onClick={() => {
                    setServiceDataId(String(serviceDataId));
                    router.push("/adoption/home-visit/Registration/step1");
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t("homeVisit.submitHomeVisit")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Top Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    {t("homeVisit.sections.visitInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Field
                    label={t("homeVisit.fields.socialWorker")}
                    value={general?.socialWorkerName}
                  />
                  <Field
                    label={t("homeVisit.fields.placeOfVisit")}
                    value={general?.placeOfVisit}
                  />
                  <Field
                    label={t("homeVisit.fields.date")}
                    value={dateValue}
                  />
                  <Field
                    label={t("homeVisit.fields.time")}
                    value={timeValue}
                  />
                  <Field
                    label={t("homeVisit.fields.kebele")}
                    value={address?.kebele}
                  />
                  <Field
                    label={t("homeVisit.fields.woreda")}
                    value={address?.woreda}
                  />
                  <Field
                    label={t("homeVisit.fields.subCity")}
                    value={address?.subCity}
                  />
                  <Field
                    label={t("homeVisit.fields.houseNo")}
                    value={address?.houseNumber}
                  />
                </CardContent>
              </Card>

              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    {t("homeVisit.sections.adoptionInterest")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <span className="text-sm text-slate-500">
                      {t("homeVisit.fields.preference")}
                    </span>
                    <span className="text-sm font-bold text-blue-700">
                      {preferredChild?.quantity ? (
                        <>
                          {preferredChild.quantity}{" "}
                          {t("homeVisit.fields.child", {
                            count: preferredChild.quantity,
                          })}{" "}
                          {preferredChild.sex ? `(${preferredChild.sex})` : ""}
                        </>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Field
                      label={t("homeVisit.fields.ageRange")}
                      value={
                        preferredChild?.ageRange
                          ? `${preferredChild.ageRange} ${t("homeVisit.fields.years")}`
                          : "—"
                      }
                    />
                    <Field
                      label={t("homeVisit.fields.reason")}
                      value={interest?.reasonForAdoption}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applicants Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                {t("homeVisit.sections.applicantProfiles")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ApplicantCard
                  title={t("homeVisit.fields.father")}
                  data={applicantFather}
                />
                <ApplicantCard
                  title={t("homeVisit.fields.mother")}
                  data={applicantMother}
                />
              </div>
            </div>

            {/* Marriage & Home */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("homeVisit.sections.marriageAssessment")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label={t("homeVisit.fields.duration")}
                      value={marriageInfo?.marriageDuration}
                    />
                    <Field
                      label={t("homeVisit.fields.datePlace")}
                      value={marriageInfo?.marriageDateAndPlace}
                    />
                  </div>
                  <div className="space-y-4">
                    <Field
                      label={t("homeVisit.fields.description")}
                      value={marriageInfo?.relationshipDescription}
                    />
                    <Field
                      label={t("homeVisit.fields.conflictResolution")}
                      value={marriageInfo?.conflictResolution}
                    />
                    <Field
                      label={t("homeVisit.fields.financialManagement")}
                      value={marriageInfo?.financialManagement}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("homeVisit.sections.homeEnvironment")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label={t("homeVisit.fields.houseType")}
                      value={homeEnv?.houseType}
                    />
                    <Field
                      label={t("homeVisit.fields.ownership")}
                      value={homeEnv?.ownershipStatus}
                    />
                    <Field
                      label={t("homeVisit.fields.size")}
                      value={homeEnv?.roomsAndSize}
                    />
                    <Field
                      label={t("homeVisit.fields.livingDuration")}
                      value={homeEnv?.livingDuration}
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <Field
                      label={t("homeVisit.fields.compoundCondition")}
                      value={homeEnv?.compoundCondition}
                    />
                    <Field
                      label={t("homeVisit.fields.childSuitability")}
                      value={homeEnv?.suitabilityForChild}
                    />
                    <Field
                      label={t("homeVisit.fields.neighborhood")}
                      value={homeEnv?.neighborhoodCondition}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Household & Family Tables */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("homeVisit.sections.householdComposition")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {existingChildren.length > 0 && (
                  <div>
                    <SectionHeading
                      title={t("homeVisit.sections.existingChildren")}
                    />
                    <PersonTable
                      data={existingChildren}
                      columns={[
                        "fullName",
                        "age",
                        "sex",
                        "educationOccupation",
                        "relation",
                      ]}
                    />
                  </div>
                )}

                {householdMembers.length > 0 && (
                  <div>
                    <SectionHeading
                      title={t("homeVisit.sections.otherHouseholdMembers")}
                    />
                    <PersonTable
                      data={householdMembers}
                      columns={[
                        "fullName",
                        "age",
                        "sex",
                        "educationAndOccupation",
                        "relation",
                      ]}
                    />
                  </div>
                )}

                {witnesses.length > 0 && (
                  <div>
                    <SectionHeading title={t("homeVisit.sections.witnesses")} />
                    <PersonTable
                      data={witnesses}
                      columns={[
                        "fullName",
                        "phoneNumber",
                        "relationToApplicants",
                      ]}
                    />
                  </div>
                )}

                {existingChildren.length === 0 &&
                  householdMembers.length === 0 &&
                  witnesses.length === 0 && (
                    <p className="text-sm text-slate-500 italic">
                      No additional household members or witnesses recorded.
                    </p>
                  )}
              </CardContent>
            </Card>

            {/* Family Background */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("homeVisit.sections.fatherBackground")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field
                    label={t("homeVisit.fields.parents")}
                    value={fatherSide?.parentsNames}
                  />
                  <Field
                    label={t("homeVisit.fields.siblings")}
                    value={fatherSide?.siblingsCount}
                  />
                  <Field
                    label={t("homeVisit.fields.upbringing")}
                    value={fatherSide?.childhoodExperience}
                  />
                  <Field
                    label={t("homeVisit.fields.workHistory")}
                    value={fatherSide?.workExperience}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("homeVisit.sections.motherBackground")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field
                    label={t("homeVisit.fields.parents")}
                    value={motherSide?.parentsNames}
                  />
                  <Field
                    label={t("homeVisit.fields.siblings")}
                    value={motherSide?.siblingsCount}
                  />
                  <Field
                    label={t("homeVisit.fields.upbringing")}
                    value={motherSide?.childhoodExperience}
                  />
                  <Field
                    label={t("homeVisit.fields.workHistory")}
                    value={motherSide?.workExperience}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Final Evaluation */}
            <Card className="border-blue-200 shadow-md">
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FileCheck className="mr-2 h-5 w-5" />{" "}
                  {t("homeVisit.sections.evaluation")}
                </h3>
              </div>
              <CardContent className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 italic text-slate-700 leading-relaxed">
                  "{evaluation?.comment || "No comment provided."}"
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex-1 min-w-[200px]">
                    <dt className="text-xs text-slate-500 mb-1">
                      {t("homeVisit.fields.preparedBy")}
                    </dt>
                    <dd className="font-semibold">
                      {evaluation?.preparedBy || "—"}
                    </dd>
                    <dd className="text-xs text-slate-400">
                      {evaluation?.preparedDate || ""}
                    </dd>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <dt className="text-xs text-slate-500 mb-1">
                      {t("homeVisit.fields.approvedBy")}
                    </dt>
                    <dd className="font-semibold">
                      {evaluation?.approvedBy || "—"}
                    </dd>
                    <dd className="text-xs text-slate-400">
                      {evaluation?.approvedDate || ""}
                    </dd>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <dt className="text-xs text-slate-500 mb-1">
                      {t("homeVisit.fields.digitalSignature")}
                    </dt>
                    <dd className="font-mono text-xs bg-slate-100 px-2 py-1 rounded inline-block">
                      {signatureDisplay}
                    </dd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
