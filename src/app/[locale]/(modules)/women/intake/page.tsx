"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  FileSpreadsheet,
  Trash2,
  Send,
  RotateCcw,
} from "lucide-react";
import {
  useRegisterWomenProfileMutation,
  useGetWomenAssociationsQuery,
} from "@/hooks/womens";
import {
  womenProfileSchema,
  WomenProfileSchemaType,
  parseFullName,
} from "@/schemas/women-profile";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import {
  CrossModuleConflictDialog,
  CrossModuleClientData,
} from "@/components/shared/cross-module-conflict-dialog";
import {
  PersonalDemographicsSection,
  LocationAddressSection,
  SocioEconomicSection,
  HealthAssessmentSection,
  TrainingNeedsSection,
  SupportNeedsSection,
} from "@/components/women/forms";

export default function WomenIntakeFormPage() {
  const [conflictClient, setConflictClient] =
    useState<CrossModuleClientData | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<WomenProfileSchemaType | null>(null);

  // Checkbox section toggles matching Disability & Elderly registration
  const [includeTraining, setIncludeTraining] = useState(false);
  const [includeSupport, setIncludeSupport] = useState(false);

  // Local table state for offline batch collection
  const [savedRecords, setSavedRecords] = useState<WomenProfileSchemaType[]>([]);
  const [csvText, setCsvText] = useState("");
  const [showCsvBox, setShowCsvBox] = useState(false);

  const registerMutation = useRegisterWomenProfileMutation();
  const { data: associationsResponse } = useGetWomenAssociationsQuery();
  const associations = associationsResponse?.data || [];
  const t = useTranslations("women");
  const { userSubCity, userWoreda } = useJurisdictionScope();

  const form = useForm<WomenProfileSchemaType>({
    resolver: zodResolver(womenProfileSchema) as any,
    defaultValues: {
      faydaId: "",
      cityIdNumber: "",
      fullName: "",
      firstName: "",
      lastName: "",
      grandfatherName: "",
      phoneNumber: "",
      age: "" as any,
      subCity: userSubCity || "",
      woreda: userWoreda || "",
      zone: "",
      block: "",
      address: "",
      educationLevel: "",
      careerStatus: "UNEMPLOYED",
      photoUrl: "",

      // ── Training Intake ──
      wantsTraining: false,
      requestedTrainingTopic: "",
      postTrainingParticipation: "",
      desiredSector: "",
      traineeCategory: "NONE",
      traineeStatus: [],

      // ── Support / Referral Intake ──
      wantsSupport: false,
      associationId: null,
      cooperativeName: "",
      requestedTechnologyType: "",
      supportStatus: "",
      supportMode: "",
      disabilityType: "NONE",
      disabilities: [],

      // ── Health ──
      healthStatus: "NONE",
      healthConsent: true,
      healthConditions: [],

      // ── Family & Income ──
      familyStatus: "",
      incomeStatus: "",
      monthlyIncome: "" as any,
    },
  });

  function submitToBackend(
    values: WomenProfileSchemaType,
    confirmLink = false,
  ) {
    const { firstName, lastName, grandfatherName } = parseFullName(
      values.fullName,
    );
    const resolvedDisabilities =
      values.disabilityType && values.disabilityType !== "NONE"
        ? [values.disabilityType]
        : values.disabilities || [];

    const resolvedTraineeStatus =
      values.traineeCategory && values.traineeCategory !== "NONE"
        ? [values.traineeCategory]
        : values.traineeStatus || [];

    const resolvedHealthConditions =
      values.healthStatus && values.healthStatus !== "NONE"
        ? [values.healthStatus]
        : values.healthConditions || [];

    const cleanFaydaId = values.faydaId
      ? values.faydaId.replace(/[\s-]/g, "").trim()
      : "";
    const cleanCityId = values.cityIdNumber?.trim() || undefined;

    const { cityIdNumber, ...restValues } = values;

    const payload = {
      ...restValues,
      faydaId: cleanFaydaId,
      cityIdNumber: cleanCityId,
      firstName: firstName || values.firstName,
      lastName: lastName || values.lastName,
      grandfatherName: grandfatherName || values.grandfatherName,
      disabilities: resolvedDisabilities,
      traineeStatus: resolvedTraineeStatus,
      wantsTraining: includeTraining,
      wantsSupport: includeSupport,
      healthConsent: resolvedHealthConditions.length > 0,
      healthConditions: resolvedHealthConditions,
      occupation: values.careerStatus,
      confirmLink,
    };
    registerMutation.mutate(payload as any, {
      onSuccess: () => {
        setConflictOpen(false);
        setConflictClient(null);
        setPendingValues(null);
        setIncludeTraining(false);
        setIncludeSupport(false);
        toast.success(
          t("form.messages.successRegister") ||
            "Woman profile registered successfully!",
        );
        // Add to local records history
        setSavedRecords((prev) => [payload as any, ...prev]);
        form.reset();
      },
      onError: (error: any) => {
        const errResponse = error?.response?.data;
        if (
          errResponse?.error === "CrossModuleConflict" &&
          errResponse?.existingClient
        ) {
          setConflictClient(errResponse.existingClient);
          setPendingValues(values);
          setConflictOpen(true);
          return;
        }
        let message =
          t("form.messages.errorRegister") || "Failed to register profile";

        if (Array.isArray(errResponse?.errors) && errResponse.errors.length > 0) {
          const detailedMessages = errResponse.errors.map((err: any) => {
            const field = err.path?.join(".") || "";
            return field ? `${field}: ${err.message}` : err.message;
          });
          message = detailedMessages.join("; ");

          errResponse.errors.forEach((err: any) => {
            const field = err.path?.[0];
            if (field) {
              if (
                field === "firstName" ||
                field === "lastName" ||
                field === "grandfatherName"
              ) {
                form.setError("fullName", { message: err.message });
              } else {
                form.setError(field as any, { message: err.message });
              }
            }
          });
        } else if (typeof errResponse?.message === "string") {
          message = errResponse.message;
        } else if (Array.isArray(errResponse?.message)) {
          message = errResponse.message.join(", ");
        } else if (error?.message) {
          message = error.message;
        }

        const lower = message.toLowerCase();
        if (
          lower.includes("fayda") ||
          lower.includes("already exists") ||
          lower.includes("profile already exists")
        ) {
          form.setError("faydaId", { message });
        }
        toast.error(message);
      },
    });
  }

  function handleSaveLocalOnly() {
    const rawValues = form.getValues();
    if (!rawValues.faydaId || !rawValues.fullName) {
      toast.error("Please fill Fayda ID and Full Name before saving locally.");
      return;
    }
    const { firstName, lastName, grandfatherName } = parseFullName(
      rawValues.fullName,
    );
    const resolvedHealthConditions =
      rawValues.healthStatus && rawValues.healthStatus !== "NONE"
        ? [rawValues.healthStatus]
        : rawValues.healthConditions || [];
    const values: WomenProfileSchemaType = {
      ...rawValues,
      firstName: firstName || rawValues.firstName,
      lastName: lastName || rawValues.lastName,
      grandfatherName: grandfatherName || rawValues.grandfatherName,
      wantsTraining: includeTraining,
      wantsSupport: includeSupport,
      healthConsent: resolvedHealthConditions.length > 0,
      healthConditions: resolvedHealthConditions,
    };
    setSavedRecords((prev) => [values, ...prev]);
    toast.success("Saved to local offline session table.");
  }

  function handleGenerateCsv() {
    if (!savedRecords.length) {
      toast.error("Save or submit at least one record first to generate CSV.");
      return;
    }

    const headers = [
      "No.",
      "Fayda ID",
      "Full Name",
      "First Name",
      "Last Name",
      "Grandfather Name",
      "Age",
      "Phone",
      "Education Level",
      "SubCity",
      "Woreda",
      "Zone",
      "Block",
      "Training Topic",
      "Post-Training Participation",
      "Desired Sector",
      "Association Name",
      "Requested Tech",
      "Support Mode",
      "Health Assessment",
      "Family Status",
      "Income Status",
    ];

    const rows = savedRecords.map((r, i) => [
      i + 1,
      `"${r.faydaId || ""}"`,
      `"${r.fullName || `${r.firstName || ""} ${r.lastName || ""}`.trim()}"`,
      `"${r.firstName || ""}"`,
      `"${r.lastName || ""}"`,
      `"${r.grandfatherName || ""}"`,
      r.age || "",
      `"${r.phoneNumber || ""}"`,
      `"${r.educationLevel || ""}"`,
      `"${r.subCity || ""}"`,
      `"${r.woreda || ""}"`,
      `"${r.zone || ""}"`,
      `"${r.block || ""}"`,
      `"${r.requestedTrainingTopic || ""}"`,
      `"${r.postTrainingParticipation || ""}"`,
      `"${r.desiredSector || ""}"`,
      `"${r.cooperativeName || ""}"`,
      `"${r.requestedTechnologyType || ""}"`,
      `"${r.supportMode || ""}"`,
      `"${
        r.healthStatus && r.healthStatus !== "NONE"
          ? r.healthStatus
          : r.healthConditions?.join("; ") || "None"
      }"`,
      `"${r.familyStatus || ""}"`,
      `"${r.incomeStatus || ""}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    setCsvText(csvContent);
    setShowCsvBox(true);
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E3E7EB] rounded-xs p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-mono uppercase tracking-wider text-[#0B1F3A]">
              {t("form.registerTitle")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("form.description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateCsv}
              className="text-xs h-8 border-[#E3E7EB] gap-1.5 cursor-pointer font-mono"
            >
              <FileSpreadsheet className="size-3.5 text-emerald-600" />
              Show CSV ({savedRecords.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Main Intake Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => submitToBackend(v, false))}
          className="space-y-6"
        >
          <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-xs">
            <CardContent className="p-6 space-y-6">
              <PersonalDemographicsSection
                form={form}
                sectionNumber="1."
                columns={4}
                includeCityId={false}
              />

              <LocationAddressSection
                form={form}
                sectionNumber="2."
                columns={4}
                includeZoneBlock={true}
                includeAddress={false}
              />

              <SocioEconomicSection
                form={form}
                sectionNumber="3."
                columns={3}
              />

              <HealthAssessmentSection
                form={form}
                sectionNumber="4."
              />

              <TrainingNeedsSection
                form={form}
                includeTraining={includeTraining}
                onIncludeTrainingChange={setIncludeTraining}
                sectionNumber="5."
              />

              <SupportNeedsSection
                form={form}
                includeSupport={includeSupport}
                onIncludeSupportChange={setIncludeSupport}
                associations={associations}
                sectionNumber="6."
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="bg-white border border-[#E3E7EB] rounded-xs p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold text-xs h-9 px-4 rounded-xs shadow-2xs gap-1.5 cursor-pointer"
              >
                <Send className="size-3.5" />
                {registerMutation.isPending
                  ? t("form.buttons.registering")
                  : t("form.buttons.register")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveLocalOnly}
                className="text-xs h-9 border-[#E3E7EB] text-slate-700 hover:bg-slate-50 rounded-xs cursor-pointer"
              >
                Save to Local Table Only
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              className="text-xs h-9 text-slate-500 hover:text-slate-700 gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Clear Form
            </Button>
          </div>
        </form>
      </Form>

      {/* CSV Export Box */}
      {showCsvBox && (
        <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-xs">
          <CardHeader className="py-3 px-5 border-b border-[#E3E7EB] flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-[#0B1F3A]">
              Exported CSV Data ({savedRecords.length} records)
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(csvText);
                toast.success("CSV copied to clipboard!");
              }}
              className="text-xs h-7 border-[#E3E7EB]"
            >
              Copy to Clipboard
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <textarea
              readOnly
              value={csvText}
              className="w-full h-36 font-mono text-xs p-3 border border-[#E3E7EB] rounded-xs bg-slate-50 focus:outline-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Saved Records Table */}
      {savedRecords.length > 0 && (
        <Card className="rounded-xs border-[#E3E7EB] bg-white shadow-xs">
          <CardHeader className="py-3 px-5 border-b border-[#E3E7EB] flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-[#0B1F3A]">
              Registered in This Session ({savedRecords.length})
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSavedRecords([])}
              className="text-xs h-7 text-red-600 hover:text-red-700"
            >
              <Trash2 className="size-3.5 mr-1" />
              Clear Session
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-[#E3E7EB] text-slate-600 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Fayda ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Sub-city / Woreda</th>
                  <th className="py-2.5 px-3">Training Topic</th>
                  <th className="py-2.5 px-3">Tech Chosen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E7EB]">
                {savedRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono">{i + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-[#1769AA] font-semibold">
                      {r.faydaId}
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      {r.fullName ||
                        `${r.firstName || ""} ${r.lastName || ""}`.trim()}
                    </td>
                    <td className="py-2.5 px-3">{r.age || "—"}</td>
                    <td className="py-2.5 px-3">
                      {r.subCity || "—"} {r.woreda ? `(${r.woreda})` : ""}
                    </td>
                    <td className="py-2.5 px-3">
                      {r.requestedTrainingTopic || "None"}
                    </td>
                    <td className="py-2.5 px-3">
                      {r.requestedTechnologyType || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Cross-Module Conflict Dialog */}
      <CrossModuleConflictDialog
        open={conflictOpen}
        onOpenChange={setConflictOpen}
        client={conflictClient}
        targetModuleName="Women Affairs"
        onConfirmLink={() => {
          if (pendingValues) {
            submitToBackend(pendingValues, true);
          }
        }}
        isLinking={registerMutation.isPending}
      />
    </div>
  );
}
