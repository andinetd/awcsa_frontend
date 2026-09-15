"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  technologySupportSchema,
  TechnologySupportSchemaType,
} from "@/schemas/women-technology";
import {
  useRegisterTechnologySupportMutation,
  useUpdateTechnologySupportMutation,
} from "@/hooks/womens";
import { TechnologySupportRecord } from "@/api/womens/technologySupport";

const technologyTypes = [
  "SOLAR", "WATER_PUMP", "IMPROVED_STOVE", "BIODIGESTER", "ELECTRIC_MILL", "OTHER",
];

const disabilityOptions = ["PHYSICAL_LEG", "PHYSICAL_HAND", "BLIND", "DEAF"];
const healthOptions = ["BREAST_CANCER", "CERVICAL_CANCER", "HIV_AIDS"];

interface TechnologySupportFormProps {
  record?: TechnologySupportRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TechnologySupportForm({ record, open: controlledOpen, onOpenChange }: TechnologySupportFormProps) {
  const t = useTranslations("women.technologySupport.form");
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!record;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const registerMutation = useRegisterTechnologySupportMutation();
  const updateMutation = useUpdateTechnologySupportMutation();

  const form = useForm<TechnologySupportSchemaType>({
    resolver: zodResolver(technologySupportSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      technologyType: "",
      associationName: "",
      isPoor: false,
      isSexWorker: false,
      disabilities: [],
      healthConditions: [],
    },
  });

  useEffect(() => {
    if (record && open) {
      form.reset({
        firstName:
          record.womenProfile?.client?.firstName || record.firstName || "",
        lastName:
          record.womenProfile?.client?.lastName || record.lastName || "",
        technologyType: record.technologyType,
        associationName: record.associationName || "",
        isPoor: record.isPoor,
        isSexWorker: record.isSexWorker,
        disabilities: record.disabilities || [],
        healthConditions: record.healthConditions || [],
      });
    } else if (!open) {
      form.reset({
        firstName: "",
        lastName: "",
        technologyType: "",
        associationName: "",
        isPoor: false,
        isSexWorker: false,
        disabilities: [],
        healthConditions: [],
      });
    }
  }, [record, open, form]);

  const onSubmit = (values: TechnologySupportSchemaType) => {
    if (isEditing && record) {
      const { firstName: _f, lastName: _l, ...rest } = values;
      updateMutation.mutate(
        { id: record.id, data: rest as any },
        {
          onSuccess: () => {
            toast.success(t("messages.success"));
            setOpen(false);
          },
          onError: (error: any) => toast.error(error?.message || t("messages.error")),
        },
      );
    } else {
      registerMutation.mutate(values as any, {
        onSuccess: () => {
          toast.success(t("messages.success"));
          form.reset();
          setOpen(false);
        },
        onError: (error: any) => toast.error(error?.message || t("messages.error")),
      });
    }
  };

  const isPending = registerMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {t("addButton")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1769AA]" />
            {isEditing ? t("editTitle") : t("title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("placeholders.firstName")} {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.lastName")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("placeholders.lastName")} {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="technologyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.technologyType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                        <SelectValue placeholder={t("placeholders.selectTechnology")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md text-xs">
                      {technologyTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">{t(`technologyTypes.${type}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="associationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.associationName")}</FormLabel>
                  <FormControl>
                    <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("placeholders.associationName")} {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="space-y-2.5 rounded-xs border border-[#E3E7EB] bg-[#F7F8FA] p-3">
              <FormLabel className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("fields.statusSection")}</FormLabel>
              <FormField
                control={form.control}
                name="isPoor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl><Checkbox className="rounded-2xs border-[#BCD5EA] data-[state=checked]:bg-[#1769AA]" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-xs font-normal text-slate-700">{t("fields.isPoor")}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSexWorker"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl><Checkbox className="rounded-2xs border-[#BCD5EA] data-[state=checked]:bg-[#1769AA]" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="text-xs font-normal text-slate-700">{t("fields.isSexWorker")}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2.5 rounded-xs border border-[#E3E7EB] bg-[#F7F8FA] p-3">
              <FormLabel className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("fields.disabilities")}</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {disabilityOptions.map((d) => (
                  <FormField
                    key={d}
                    control={form.control}
                    name="disabilities"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="rounded-2xs border-[#BCD5EA] data-[state=checked]:bg-[#1769AA]"
                            checked={field.value?.includes(d)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked
                                  ? [...(field.value || []), d]
                                  : (field.value || []).filter((v) => v !== d),
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-normal text-slate-700">{t(`disabilityOptions.${d}`)}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2.5 rounded-xs border border-[#E3E7EB] bg-[#F7F8FA] p-3">
              <FormLabel className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">{t("fields.healthConditions")}</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {healthOptions.map((h) => (
                  <FormField
                    key={h}
                    control={form.control}
                    name="healthConditions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="rounded-2xs border-[#BCD5EA] data-[state=checked]:bg-[#1769AA]"
                            checked={field.value?.includes(h)}
                            onCheckedChange={(checked) => {
                              field.onChange(
                                checked
                                  ? [...(field.value || []), h]
                                  : (field.value || []).filter((v) => v !== h),
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-xs font-normal text-slate-700">{t(`healthOptions.${h}`)}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
              <Button type="button" variant="outline" className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]" onClick={() => setOpen(false)}>
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending} className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs">
                {isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                {t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}