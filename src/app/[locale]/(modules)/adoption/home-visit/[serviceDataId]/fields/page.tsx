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
import { ArrowLeft, FileCheck } from "lucide-react";
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
  const t = useTranslations("adoption");

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);

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
        // API returns { message, data: { id, formData, ... } } - extract formData when present
        const raw = res.data;
        const form = raw?.data?.formData ?? raw?.formData ?? raw;
        setFormData(form ?? null);
        setMeta(raw?.data ?? raw ?? null);
      } catch (err) {
        console.error("Error fetching home visit data:", err);
        toast.error(t("homeVisit.errors.loadFailed"));
        setFormData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (serviceDataId) fetchData();
    else setLoading(false);

    return () => {
      mounted = false;
    };
  }, [serviceDataId, token]);

  // A simple fallback/shape so we can render fields even when no backend data exists.
  const fallback = {
    generalInfo: {
      socialWorkerName: "",
      placeOfVisit: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      address: {
        region: "",
        subCity: "",
        woreda: "",
        kebele: "",
        houseNumber: "",
        neighborhoodName: "",
      },
    },
    applicantFather: {},
    applicantMother: {},
    witnesses: [],
    socialWorkerEvaluation: {},
  };

  const payload = formData ?? fallback;
  const metaInfo = meta ?? {};

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
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
        <div className="text-center py-8">{t("homeVisit.loading")}</div>
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
                    value={formData.generalInfo.socialWorkerName}
                  />
                  <Field
                    label={t("homeVisit.fields.placeOfVisit")}
                    value={formData.generalInfo.placeOfVisit}
                  />
                  <Field
                    label={t("homeVisit.fields.date")}
                    value={t("homeVisit.fields.dateRange", {
                      start: formData.generalInfo.startDate,
                      end: formData.generalInfo.endDate,
                    })}
                  />
                  <Field
                    label={t("homeVisit.fields.time")}
                    value={t("homeVisit.fields.timeRange", {
                      start: formData.generalInfo.startTime,
                      end: formData.generalInfo.endTime,
                    })}
                  />
                  <Field
                    label={t("homeVisit.fields.kebele")}
                    value={formData.generalInfo.address.kebele}
                  />
                  <Field
                    label={t("homeVisit.fields.woreda")}
                    value={formData.generalInfo.address.woreda}
                  />
                  <Field
                    label={t("homeVisit.fields.subCity")}
                    value={formData.generalInfo.address.subCity}
                  />
                  <Field
                    label={t("homeVisit.fields.houseNo")}
                    value={formData.generalInfo.address.houseNumber}
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
                      {formData.adoptionInterest.preferredChild.quantity}{" "}
                      {t("homeVisit.fields.child", {
                        count:
                          formData.adoptionInterest.preferredChild.quantity,
                      })}{" "}
                      ({formData.adoptionInterest.preferredChild.sex})
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Field
                      label={t("homeVisit.fields.ageRange")}
                      value={`${formData.adoptionInterest.preferredChild.ageRange} ${t("homeVisit.fields.years")}`}
                    />
                    <Field
                      label={t("homeVisit.fields.reason")}
                      value={formData.adoptionInterest.reasonForAdoption}
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
                  data={formData.applicantFather}
                />
                <ApplicantCard
                  title={t("homeVisit.fields.mother")}
                  data={formData.applicantMother}
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
                      value={formData.marriageInfo.marriageDuration}
                    />
                    <Field
                      label={t("homeVisit.fields.datePlace")}
                      value={formData.marriageInfo.marriageDateAndPlace}
                    />
                  </div>
                  <div className="space-y-4">
                    <Field
                      label={t("homeVisit.fields.description")}
                      value={formData.marriageInfo.relationshipDescription}
                    />
                    <Field
                      label={t("homeVisit.fields.conflictResolution")}
                      value={formData.marriageInfo.conflictResolution}
                    />
                    <Field
                      label={t("homeVisit.fields.financialManagement")}
                      value={formData.marriageInfo.financialManagement}
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
                      value={formData.homeAndEnvironment.houseType}
                    />
                    <Field
                      label={t("homeVisit.fields.ownership")}
                      value={formData.homeAndEnvironment.ownershipStatus}
                    />
                    <Field
                      label={t("homeVisit.fields.size")}
                      value={formData.homeAndEnvironment.roomsAndSize}
                    />
                    <Field
                      label={t("homeVisit.fields.livingDuration")}
                      value={formData.homeAndEnvironment.livingDuration}
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <Field
                      label={t("homeVisit.fields.compoundCondition")}
                      value={formData.homeAndEnvironment.compoundCondition}
                    />
                    <Field
                      label={t("homeVisit.fields.childSuitability")}
                      value={formData.homeAndEnvironment.suitabilityForChild}
                    />
                    <Field
                      label={t("homeVisit.fields.neighborhood")}
                      value={formData.homeAndEnvironment.neighborhoodCondition}
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
                {formData.existingChildren.length > 0 && (
                  <div>
                    <SectionHeading
                      title={t("homeVisit.sections.existingChildren")}
                    />
                    <PersonTable
                      data={formData.existingChildren}
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

                {formData.householdMembers.length > 0 && (
                  <div>
                    <SectionHeading
                      title={t("homeVisit.sections.otherHouseholdMembers")}
                    />
                    <PersonTable
                      data={formData.householdMembers}
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

                {formData.witnesses.length > 0 && (
                  <div>
                    <SectionHeading title={t("homeVisit.sections.witnesses")} />
                    <PersonTable
                      data={formData.witnesses}
                      columns={[
                        "fullName",
                        "phoneNumber",
                        "relationToApplicants",
                      ]}
                    />
                  </div>
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
                    value={formData.familyBackground.fatherSide.parentsNames}
                  />
                  <Field
                    label={t("homeVisit.fields.siblings")}
                    value={formData.familyBackground.fatherSide.siblingsCount}
                  />
                  <Field
                    label={t("homeVisit.fields.upbringing")}
                    value={
                      formData.familyBackground.fatherSide.childhoodExperience
                    }
                  />
                  <Field
                    label={t("homeVisit.fields.workHistory")}
                    value={formData.familyBackground.fatherSide.workExperience}
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
                    value={formData.familyBackground.motherSide.parentsNames}
                  />
                  <Field
                    label={t("homeVisit.fields.siblings")}
                    value={formData.familyBackground.motherSide.siblingsCount}
                  />
                  <Field
                    label={t("homeVisit.fields.upbringing")}
                    value={
                      formData.familyBackground.motherSide.childhoodExperience
                    }
                  />
                  <Field
                    label={t("homeVisit.fields.workHistory")}
                    value={formData.familyBackground.motherSide.workExperience}
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
                  "{formData.socialWorkerEvaluation.comment}"
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex-1 min-w-[200px]">
                    <dt className="text-xs text-slate-500 mb-1">
                      {t("homeVisit.fields.preparedBy")}
                    </dt>
                    <dd className="font-semibold">
                      {formData.socialWorkerEvaluation.preparedBy}
                    </dd>
                    <dd className="text-xs text-slate-400">
                      {formData.socialWorkerEvaluation.preparedDate}
                    </dd>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <dt className="text-xs text-slate-500 mb-1">
                      {t("homeVisit.fields.approvedBy")}
                    </dt>
                    <dd className="font-semibold">
                      {formData.socialWorkerEvaluation.approvedBy}
                    </dd>
                    <dd className="text-xs text-slate-400">
                      {formData.socialWorkerEvaluation.approvedDate}
                    </dd>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <dt className="text-xs text-slate-500 mb-1">
                      {t("homeVisit.fields.digitalSignature")}
                    </dt>
                    <dd className="font-mono text-xs bg-slate-100 px-2 py-1 rounded inline-block">
                      {formData.socialWorkerEvaluation.signature.path}
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
