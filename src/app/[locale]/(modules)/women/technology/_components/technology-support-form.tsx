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
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            {t("addButton")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            {isEditing ? t("editTitle") : t("title")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.firstName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.firstName")} {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.lastName")} {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="technologyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.technologyType")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectTechnology")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technologyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{t(`technologyTypes.${type}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="associationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.associationName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholders.associationName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3 rounded-md border p-4">
              <FormLabel className="text-base">{t("fields.statusSection")}</FormLabel>
              <FormField
                control={form.control}
                name="isPoor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">{t("fields.isPoor")}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSexWorker"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">{t("fields.isSexWorker")}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3 rounded-md border p-4">
              <FormLabel className="text-base">{t("fields.disabilities")}</FormLabel>
              {disabilityOptions.map((d) => (
                <FormField
                  key={d}
                  control={form.control}
                  name="disabilities"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
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
                      <FormLabel className="font-normal">{t(`disabilityOptions.${d}`)}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="space-y-3 rounded-md border p-4">
              <FormLabel className="text-base">{t("fields.healthConditions")}</FormLabel>
              {healthOptions.map((h) => (
                <FormField
                  key={h}
                  control={form.control}
                  name="healthConditions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
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
                      <FormLabel className="font-normal">{t(`healthOptions.${h}`)}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? t("buttons.save") : t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}