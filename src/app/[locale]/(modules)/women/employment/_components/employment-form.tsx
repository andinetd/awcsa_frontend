"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import {
  womenEmploymentSchema,
  WomenEmploymentSchemaType,
} from "@/schemas/women-employment";
import {
  useRegisterWomenEmploymentMutation,
  useUpdateEmploymentMutation,
  useGetWomenProfilesQuery,
  useGetWomenAssociationsQuery,
} from "@/hooks/womens";
import { WomenEmploymentRecord } from "@/api/womens/employment";
import { WomenAssociationRecord } from "@/api/womens/associations";
import WomanSelect from "@/app/[locale]/(modules)/women/services/_components/woman-select";
import AssociationSelect from "@/app/[locale]/(modules)/women/services/_components/association-select";
import { WomenProfile } from "@/api/womens/women-profile";

const sectors = [
  "AGRICULTURE", "TEXTILE", "TRADE", "SERVICES", "MANUFACTURING",
  "CONSTRUCTION", "TRANSPORT", "EDUCATION", "HEALTHCARE", "OTHER",
];

function parseFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "—";
  return { firstName, lastName };
}

interface WomenEmploymentFormProps {
  record?: WomenEmploymentRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function WomenEmploymentForm({
  record,
  open: controlledOpen,
  onOpenChange,
}: WomenEmploymentFormProps) {
  const t = useTranslations("women.employment.form");
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!record;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const { data: profiles } = useGetWomenProfilesQuery();
  const { data: associationsData } = useGetWomenAssociationsQuery();
  const associations = useMemo(
    () => associationsData?.data || (Array.isArray(associationsData) ? associationsData : []),
    [associationsData]
  );
  const registerMutation = useRegisterWomenEmploymentMutation();
  const updateMutation = useUpdateEmploymentMutation();

  const form = useForm<WomenEmploymentSchemaType>({
    resolver: zodResolver(womenEmploymentSchema) as any,
    defaultValues: {
      womanId: undefined,
      womenAssociationId: undefined,
      fullName: "",
      faydaId: "",
      employmentType: "INDIVIDUAL",
      sector: "",
      year: new Date().getFullYear().toString(),
      remark: "",
    },
  });

  const handleWomanSelect = (selectedId: string) => {
    if (!selectedId) {
      form.setValue("womanId", undefined);
      return;
    }
    const profile = (profiles || []).find(
      (p: WomenProfile) =>
        p.clientId.toString() === selectedId || p.id.toString() === selectedId
    );
    if (profile) {
      form.setValue("womanId", profile.id);
      const name = `${profile.client.firstName || ""} ${profile.client.lastName || ""}`.trim();
      form.setValue("fullName", name);
      form.setValue("faydaId", profile.client.faydaId || profile.client.cityIdNumber || "");
    }
  };

  const handleAssociationSelect = (selectedId: string) => {
    if (!selectedId) {
      form.setValue("womenAssociationId", undefined);
      return;
    }
    const idNum = parseInt(selectedId);
    form.setValue("womenAssociationId", idNum);
    form.setValue("employmentType", "GROUP");
    const assoc = associations.find((a: WomenAssociationRecord) => a.id === idNum);
    if (assoc) {
      if (!form.getValues("fullName")) {
        form.setValue("fullName", assoc.name);
      }
    }
  };

  useEffect(() => {
    if (record && open) {
      const initialFullName = record.womenProfile?.client
        ? `${record.womenProfile.client.firstName || ""} ${record.womenProfile.client.lastName || ""}`.trim()
        : record.womenAssociation?.name
        ? record.womenAssociation.name
        : `${record.firstName || ""} ${record.lastName || ""}`.trim();

      form.reset({
        womanId: record.womenProfileId || undefined,
        womenAssociationId: record.womenAssociationId || undefined,
        fullName: initialFullName,
        faydaId: record.womenProfile?.client?.cityIdNumber || "",
        employmentType: record.employmentType,
        sector: record.sector,
        year: record.year,
        remark: record.remark || "",
      });
    } else if (!open) {
      form.reset({
        womanId: undefined,
        womenAssociationId: undefined,
        fullName: "",
        faydaId: "",
        employmentType: "INDIVIDUAL",
        sector: "",
        year: new Date().getFullYear().toString(),
        remark: "",
      });
    }
  }, [record, open, form]);

  const onSubmit = (values: WomenEmploymentSchemaType) => {
    const { firstName, lastName } = parseFullName(values.fullName);

    if (isEditing && record) {
      updateMutation.mutate(
        {
          id: record.id,
          data: {
            employmentType: values.employmentType,
            sector: values.sector,
            year: values.year,
            remark: values.remark,
          },
        },
        {
          onSuccess: () => {
            toast.success(t("messages.success"));
            setOpen(false);
          },
          onError: (error: any) =>
            toast.error(error?.message || t("messages.error")),
        },
      );
    } else {
      registerMutation.mutate(
        {
          womanId: values.womanId,
          womenAssociationId: values.womenAssociationId,
          firstName,
          lastName,
          employmentType: values.employmentType,
          sector: values.sector,
          year: values.year,
          remark: values.faydaId
            ? `[ID: ${values.faydaId}] ${values.remark || ""}`.trim()
            : values.remark,
        },
        {
          onSuccess: () => {
            toast.success(t("messages.success"));
            form.reset();
            setOpen(false);
          },
          onError: (error: any) =>
            toast.error(error?.message || t("messages.error")),
        },
      );
    }
  };

  const isPending = registerMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            {t("addButton")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#1769AA]" />
            {isEditing ? "Edit Employment" : t("title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3">
            {/* Beneficiary Linking (Woman or Association) */}
            {!isEditing && (
              <div className="space-y-2 p-3 rounded-xs bg-slate-50/70 border border-[#E3E7EB]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="womanId"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          {t("fields.linkBeneficiary")}
                        </FormLabel>
                        <FormControl>
                          <WomanSelect
                            value={field.value?.toString()}
                            onValueChange={handleWomanSelect}
                            placeholder={t("placeholders.selectWoman")}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="womenAssociationId"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          {t("fields.linkAssociation")}
                        </FormLabel>
                        <FormControl>
                          <AssociationSelect
                            value={field.value?.toString()}
                            onValueChange={handleAssociationSelect}
                            placeholder={t("placeholders.selectAssociation")}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Full Name & Fayda ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.fullName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                        placeholder={t("placeholders.fullName")}
                        {...field}
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="faydaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.faydaId")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                        placeholder={t("placeholders.faydaId")}
                        {...field}
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Employment Type & Sector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.employmentType")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md text-xs">
                        <SelectItem value="INDIVIDUAL" className="text-xs">
                          {t("employmentTypes.INDIVIDUAL")}
                        </SelectItem>
                        <SelectItem value="GROUP" className="text-xs">
                          {t("employmentTypes.GROUP")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">
                      {t("fields.sector")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                          <SelectValue placeholder={t("placeholders.selectSector")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md text-xs">
                        {sectors.map((sec) => (
                          <SelectItem key={sec} value={sec} className="text-xs">
                            {t(`sectors.${sec}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("fields.year")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      placeholder="e.g. 2026"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Remark */}
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">
                    {t("fields.remark")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white resize-none"
                      rows={2}
                      placeholder={t("placeholders.remark")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                onClick={() => setOpen(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs"
              >
                {isPending ? t("buttons.saving") : t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}