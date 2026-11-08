"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useUpdateWomenProfileMutation } from "@/hooks/womens";
import {
  womenProfileSchema,
  WomenProfileSchemaType,
  parseFullName,
} from "@/schemas/women-profile";
import { toast } from "sonner";
import { WomenProfile } from "@/api/womens/women-profile";
import { useTranslations } from "next-intl";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import {
  PersonalDemographicsSection,
  LocationAddressSection,
} from "@/components/women/forms";

interface EditWomenProfileFormProps {
  profile: WomenProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditWomenProfileForm({
  profile,
  open,
  onOpenChange,
}: EditWomenProfileFormProps) {
  const updateMutation = useUpdateWomenProfileMutation();
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
      phoneNumber: "",
      age: "" as any,
      subCity: userSubCity || "",
      woreda: userWoreda || "",
      address: "",
      educationLevel: "",
      careerStatus: "",
      photoUrl: "",
    },
  });

  useEffect(() => {
    if (profile) {
      let calculatedAge = profile.client.age;
      if (!calculatedAge && profile.client.dateOfBirth) {
        const diff =
          Date.now() - new Date(profile.client.dateOfBirth).getTime();
        calculatedAge = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      }

      form.reset({
        faydaId: profile.client.faydaId || profile.client.cityIdNumber || "",
        cityIdNumber: profile.client.cityIdNumber || "",
        fullName: [profile.client.firstName, profile.client.lastName]
          .filter(Boolean)
          .join(" "),
        firstName: profile.client.firstName,
        lastName: profile.client.lastName,
        phoneNumber: profile.client.phoneNumber,
        age: calculatedAge ?? ("" as any),
        address: profile.client.address,
        subCity: profile.client.subCity || "",
        woreda: profile.client.woreda || "",
        educationLevel: profile.educationLevel || "",
        careerStatus: profile.careerStatus || profile.occupation || "",
        disabilityType: (profile as any).disabilities?.[0] || "NONE",
        photoUrl: profile.photoUrl || "",
      });
    }
  }, [profile, form]);

  function onSubmit(values: WomenProfileSchemaType) {
    if (!profile?.id) return;

    const { firstName, lastName, grandfatherName } = parseFullName(
      values.fullName,
    );
    const resolvedDisabilities =
      values.disabilityType && values.disabilityType !== "NONE"
        ? [values.disabilityType]
        : values.disabilities || [];

    const payload = {
      ...values,
      firstName: firstName || values.firstName,
      lastName: lastName || values.lastName,
      grandfatherName: grandfatherName || values.grandfatherName,
      disabilities: resolvedDisabilities,
      occupation: values.careerStatus,
    };

    updateMutation.mutate(
      { id: profile.id, data: payload as any },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success(t("form.messages.successUpdate"));
        },
        onError: (error: any) => {
          toast.error(error?.message || t("form.messages.errorUpdate"));
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white shadow-lg p-6">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
            {t("form.editTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("form.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-2"
          >
            <PersonalDemographicsSection
              form={form}
              sectionNumber="1."
              columns={2}
              includeCityId={false}
              includeCareerStatus={true}
            />

            <LocationAddressSection
              form={form}
              sectionNumber="2."
              columns={2}
              includeZoneBlock={false}
              includeAddress={true}
              extraSubCityOptions={
                profile?.client?.subCity ? [profile.client.subCity] : []
              }
            />

            {/* ── FOOTER ACTIONS ── */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] cursor-pointer"
              >
                {t("form.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs cursor-pointer"
              >
                {updateMutation.isPending
                  ? t("form.buttons.saving")
                  : t("form.buttons.saveChanges")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}