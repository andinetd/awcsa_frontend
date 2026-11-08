"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

export default function NewWomenProfileForm() {
  const [open, setOpen] = useState(false);
  const [conflictClient, setConflictClient] =
    useState<CrossModuleClientData | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<WomenProfileSchemaType | null>(null);

  // Dynamic section display triggers
  const [includeTraining, setIncludeTraining] = useState(false);
  const [includeSupport, setIncludeSupport] = useState(false);

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

  useEffect(() => {
    if (open) {
      if (userSubCity && !form.getValues("subCity")) {
        form.setValue("subCity", userSubCity);
      }
      if (userWoreda && !form.getValues("woreda")) {
        form.setValue("woreda", userWoreda);
      }
    }
  }, [open, userSubCity, userWoreda, form]);

  function submitPayload(values: WomenProfileSchemaType, confirmLink = false) {
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
        setOpen(false);
        setConflictOpen(false);
        setConflictClient(null);
        setPendingValues(null);
        setIncludeTraining(false);
        setIncludeSupport(false);
        form.reset();
        toast.success(t("form.messages.successRegister"));
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
        let message = t("form.messages.errorRegister");

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

  function onSubmit(values: WomenProfileSchemaType) {
    submitPayload(values, false);
  }

  function handleConfirmLink() {
    if (pendingValues) {
      submitPayload(pendingValues, true);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold rounded-xs text-xs h-8 px-3 shadow-2xs gap-1.5 cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          {t("womenList.registerButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[840px] max-h-[92vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white shadow-xl p-6">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
            {t("form.registerTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {t("form.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-3"
          >
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

            {/* ── FOOTER ACTIONS ── */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] cursor-pointer"
              >
                {t("form.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs cursor-pointer"
              >
                {registerMutation.isPending
                  ? t("form.buttons.registering")
                  : t("form.buttons.register")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      <CrossModuleConflictDialog
        open={conflictOpen}
        onOpenChange={setConflictOpen}
        client={conflictClient}
        targetModuleName="Women Affairs"
        onConfirmLink={handleConfirmLink}
        isLinking={registerMutation.isPending}
      />
    </Dialog>
  );
}